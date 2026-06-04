# SY Creative Archive

Mobile-first portfolio PWA for brand design, motion graphics, generative AI visuals, and music projects.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:4317](http://localhost:4317).

On macOS, the bundled launcher can also start the local server:

```bash
zsh start-portfolio.command
```

For Codex sessions, use the Codex connector whenever a browser preview is needed.
It starts the server only when it is not already running:

```bash
zsh /Users/iseong-yun/Documents/Portfolio-codex/connect-codex-server.command
```

To open Codex together with the portfolio preview, use this launcher instead of
opening Codex directly:

```bash
zsh /Users/iseong-yun/Documents/Portfolio-codex/open-codex-with-server.command
```

The preview runs at `http://localhost:4317`.
After the launcher starts once, saved design and content changes appear in the
browser without rebuilding or restarting the server.

The old macOS login service is no longer recommended for Codex work. Remove it
once from Terminal if it is still installed:

```bash
zsh /Users/iseong-yun/Documents/Portfolio-codex/uninstall-autostart.command
```

If you intentionally want the preview to start when the Mac logs in, use:

```bash
zsh /Users/iseong-yun/Documents/Portfolio-codex/install-autostart.command
```

## Content

Projects are managed in `data/projects.json`. Replace the demo media paths with public NAS preview URLs when the final assets are ready.

## Build

```bash
npm run build
```

## Deploy

Import this repository into Vercel and deploy with the default Next.js settings.
The demo visuals use public preview URLs. Replace them with NAS media URLs in
`data/projects.json` when production assets are ready.
