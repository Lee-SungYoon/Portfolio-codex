# NAS Portfolio Setup

## NAS source location

- SMB URL: `smb://192.168.55.15/work/02_Portfolio/Online/`
- Expected macOS mount path: `/Volumes/work/02_Portfolio/Online`

## Folder structure

```txt
/Volumes/work/02_Portfolio/Online/
  01_projects/
    weekly-signal/
      project.txt
      thumb.png
      hero.png
      cover.png
      gallery-01.png
      gallery-02.png
      full-01.png
      split-01.png
      detail-video-01.mp4
```

## Required rules

- One project per folder
- Folder name should match the slug style: lowercase + hyphen
- Required files for published projects:
  - `project.txt`
  - `thumb.png`
  - `hero.png`
- Optional files:
  - `cover.png`
  - `gallery-*.png`
  - `full-*.png`
  - `split-*.png`
  - `detail-video-*.mp4`

## Metadata file

Use `nas-template/project.txt` as the starting template.

The sync script reads:

- title
- slug
- status
- category
- filterGroup
- date
- year
- location
- summary
- description
- tags
- thumbnail
- heroImage
- coverImage
- gallery
- fullMedia
- splitMedia
- videos
- quote
- quoteName
- quoteRole

## Status behavior

- `published`: site includes the project
- `draft`: site ignores the project

## Generated files

Running the sync creates:

- `data/nas-projects.generated.json`
- `data/nas-sync-report.json`
- copied media under `public/nas-projects/<slug>/`

## Manual sync

```bash
npm run sync:nas
```

## Automatic sync

Install the macOS launch agent:

```bash
zsh install-nas-sync.command
```

Remove it:

```bash
zsh uninstall-nas-sync.command
```

The default interval is every 5 minutes.

## Quick mount helper

Open the NAS share in Finder:

```bash
zsh mount-portfolio-nas.command
```
