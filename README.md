# SY Creative Archive

Mobile-first portfolio PWA for brand design, motion graphics, generative AI visuals, and music projects.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On macOS, the bundled launcher can also start the local server:

```bash
zsh start-portfolio.command
```

For Codex sessions, use the same launcher whenever a browser preview is needed.
It runs the automatic-refresh preview at `http://localhost:3000`.
After the launcher starts once, saved design and content changes appear in the
browser without rebuilding or restarting the server.

To open the automatic-refresh preview after macOS login, run this once:

```bash
zsh install-autostart.command
```

To remove the automatic login service:

```bash
zsh uninstall-autostart.command
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
