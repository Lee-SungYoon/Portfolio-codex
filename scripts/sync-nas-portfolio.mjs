#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "config", "nas-portfolio.config.json");

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const sourceRoot = path.join(config.mountPath, config.projectsDir);
const outputDataPath = path.join(root, config.outputDataFile);
const outputReportPath = path.join(root, config.outputReportFile);
const outputMediaRoot = path.join(root, config.outputMediaDir);

const listKeys = new Set(["tags", "gallery", "fullMedia", "splitMedia", "videos", "role", "tools"]);
const scalarDefaults = {
  title: "",
  slug: "",
  status: "draft",
  category: "Brand",
  filterGroup: "Brand",
  date: "",
  year: "",
  location: "Seoul, KR",
  summary: "",
  description: "",
  thumbnail: "",
  heroImage: "",
  coverImage: "",
  quote: "",
  quoteName: "Lee Sung Yoon",
  quoteRole: "Creative Director"
};

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function cleanDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  ensureDir(dirPath);
}

function parseDate(value) {
  if (!value) {
    return "";
  }

  const isoMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return `${isoMatch[1].slice(2)}.${isoMatch[2]}.${isoMatch[3]}`;
  }

  const dotMatch = String(value).match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
  if (dotMatch) {
    return `${dotMatch[1]}.${dotMatch[2]}.${dotMatch[3]}`;
  }

  return String(value);
}

function parseIsoDate(value) {
  if (!value) {
    return "";
  }

  const isoMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  const dotMatch = String(value).match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
  if (dotMatch) {
    return `20${dotMatch[1]}-${dotMatch[2]}-${dotMatch[3]}`;
  }

  return "";
}

function normalizeFilterGroup(value, category) {
  const raw = String(value || category || "Brand").trim();
  if (raw === "AI" || raw === "AI Visual") {
    return "AI Visual";
  }
  if (raw === "Motion") {
    return "Motion";
  }
  if (raw === "Music") {
    return "Music";
  }
  return "Brand";
}

function normalizeCategory(value, filterGroup) {
  const raw = String(value || filterGroup || "Brand").trim();
  if (raw === "AI Visual") {
    return "AI";
  }
  return raw;
}

function parseProjectTxt(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const data = {
    ...scalarDefaults,
    tags: [],
    gallery: [],
    fullMedia: [],
    splitMedia: [],
    videos: [],
    role: [],
    tools: []
  };

  let currentListKey = null;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    if (line.startsWith("- ") && currentListKey) {
      data[currentListKey].push(line.slice(2).trim());
      continue;
    }

    currentListKey = null;
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (listKeys.has(key)) {
      if (!rawValue) {
        currentListKey = key;
      } else if (key === "tags" && rawValue.includes(",")) {
        data[key] = rawValue.split(",").map((item) => item.trim()).filter(Boolean);
      } else {
        data[key] = [rawValue];
      }
      continue;
    }

    data[key] = rawValue;
  }

  return data;
}

function copyAsset(sourcePath, destinationPath) {
  ensureDir(path.dirname(destinationPath));
  fs.copyFileSync(sourcePath, destinationPath);
}

function projectAssetUrl(slug, fileName) {
  return `/nas-projects/${slug}/${fileName}`;
}

function mapAssetList(fileNames, slug, folderPath, warnings, type) {
  return fileNames
    .filter(Boolean)
    .map((fileName) => {
      const source = path.join(folderPath, fileName);
      if (!fs.existsSync(source)) {
        warnings.push(`${slug}: missing ${type} file ${fileName}`);
        return null;
      }

      const destination = path.join(outputMediaRoot, slug, fileName);
      copyAsset(source, destination);
      return projectAssetUrl(slug, fileName);
    })
    .filter(Boolean);
}

function buildProjectRecord(folderName) {
  const folderPath = path.join(sourceRoot, folderName);
  const metaPath = path.join(folderPath, config.requiredMetaFile);
  const warnings = [];

  if (!fs.existsSync(metaPath)) {
    warnings.push(`${folderName}: missing ${config.requiredMetaFile}`);
    return { project: null, warnings };
  }

  const parsed = parseProjectTxt(metaPath);
  const slug = slugify(parsed.slug || folderName);
  const title = parsed.title || folderName;
  const status = String(parsed.status || "draft").trim().toLowerCase();
  const filterGroup = normalizeFilterGroup(parsed.filterGroup, parsed.category);
  const category = normalizeCategory(parsed.category, filterGroup);
  const requiredImages = config.requiredImages || [];

  for (const fileName of requiredImages) {
    if (!fs.existsSync(path.join(folderPath, fileName))) {
      warnings.push(`${slug}: missing required file ${fileName}`);
    }
  }

  if (warnings.length > 0 && config.publishedStatuses.includes(status)) {
    return { project: null, warnings };
  }

  const thumbName = parsed.thumbnail || "thumb.png";
  const heroName = parsed.heroImage || "hero.png";
  const coverName = parsed.coverImage || thumbName;
  const assetTargets = [thumbName, heroName, coverName];

  cleanDir(path.join(outputMediaRoot, slug));

  for (const fileName of assetTargets) {
    const source = path.join(folderPath, fileName);
    if (fs.existsSync(source)) {
      copyAsset(source, path.join(outputMediaRoot, slug, fileName));
    }
  }

  const gallery = mapAssetList(parsed.gallery, slug, folderPath, warnings, "gallery");
  const fullMedia = mapAssetList(parsed.fullMedia, slug, folderPath, warnings, "fullMedia");
  const splitMedia = mapAssetList(parsed.splitMedia, slug, folderPath, warnings, "splitMedia");
  const videos = mapAssetList(parsed.videos, slug, folderPath, warnings, "video");

  const project = {
    title,
    slug,
    status,
    category,
    filterGroup,
    date: parseDate(parsed.date),
    publishedAt: parseIsoDate(parsed.date),
    year: parsed.year || (parseIsoDate(parsed.date) ? parseIsoDate(parsed.date).slice(0, 4) : "2026"),
    location: parsed.location || "Seoul, KR",
    summary: parsed.summary || parsed.description || "",
    description: parsed.description || parsed.summary || "",
    tags: parsed.tags,
    role: parsed.role,
    tools: parsed.tools,
    thumbnail: projectAssetUrl(slug, thumbName),
    heroImage: projectAssetUrl(slug, heroName),
    coverImage: projectAssetUrl(slug, coverName),
    gallery,
    fullMedia,
    splitMedia,
    videos,
    quote: parsed.quote || "",
    quoteName: parsed.quoteName || "Lee Sung Yoon",
    quoteRole: parsed.quoteRole || "Creative Director",
    sourceFolder: folderName,
    updatedAt: new Date().toISOString()
  };

  return { project, warnings };
}

function collectProjects() {
  ensureDir(path.dirname(outputDataPath));
  ensureDir(path.dirname(outputReportPath));
  ensureDir(outputMediaRoot);

  if (!fs.existsSync(sourceRoot)) {
    const report = {
      ok: false,
      sourceRoot,
      smbUrl: config.smbUrl,
      generatedAt: new Date().toISOString(),
      warnings: [`Source folder not found: ${sourceRoot}`],
      projects: []
    };
    fs.writeFileSync(outputDataPath, "[]\n");
    fs.writeFileSync(outputReportPath, `${JSON.stringify(report, null, 2)}\n`);
    return report;
  }

  const folders = fs
    .readdirSync(sourceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();

  const warnings = [];
  const projects = [];

  for (const folderName of folders) {
    const { project, warnings: projectWarnings } = buildProjectRecord(folderName);
    warnings.push(...projectWarnings);
    if (project && config.publishedStatuses.includes(project.status)) {
      projects.push(project);
    }
  }

  projects.sort((a, b) => {
    const aDate = a.publishedAt || "";
    const bDate = b.publishedAt || "";
    return bDate.localeCompare(aDate) || a.title.localeCompare(b.title);
  });

  const report = {
    ok: true,
    sourceRoot,
    smbUrl: config.smbUrl,
    generatedAt: new Date().toISOString(),
    count: projects.length,
    warnings,
    projects: projects.map((project) => ({
      slug: project.slug,
      title: project.title,
      status: project.status,
      publishedAt: project.publishedAt
    }))
  };

  fs.writeFileSync(outputDataPath, `${JSON.stringify(projects, null, 2)}\n`);
  fs.writeFileSync(outputReportPath, `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const watch = process.argv.includes("--watch");
  const report = collectProjects();
  console.log(`[nas-sync] ${report.ok ? "synced" : "blocked"} ${report.count || 0} project(s)`);
  if (report.warnings?.length) {
    for (const warning of report.warnings) {
      console.log(`[nas-sync] warning: ${warning}`);
    }
  }

  if (!watch) {
    return;
  }

  const intervalMinutes = Number(process.env.NAS_SYNC_INTERVAL_MINUTES || config.scanIntervalMinutes || 5);
  const intervalMs = Math.max(intervalMinutes, 1) * 60 * 1000;

  while (true) {
    await sleep(intervalMs);
    collectProjects();
    console.log(`[nas-sync] rescanned at ${new Date().toISOString()}`);
  }
}

main().catch((error) => {
  console.error("[nas-sync] failed", error);
  process.exitCode = 1;
});
