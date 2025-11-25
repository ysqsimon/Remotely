<div align="center">
<h1>Remotely — Remote Job Demo (React + Vite)</h1>
</div>

Remotely is a small demo frontend that showcases a remote job-seeking website UI. It uses React + Vite and includes example pages, components, and a small service for connecting to the Google GenAI (Gemini) API. This repository is intended as a demo / prototype you can run locally or deploy as a static site (for example using GitHub Pages).

**Quick summary**
- **Framework:** React + Vite + TypeScript
- **Purpose:** Demo UI for searching jobs, companies, and talents; includes components such as `JobCard`, `CompanyCard`, `TalentCard`, and a small `geminiService` for AI-powered features.

Repo structure (important files)
- `index.html`, `index.tsx`, `App.tsx`: app entry
- `vite.config.ts`: Vite configuration (dev server, env injection)
- `package.json`: scripts for `dev`, `build`, `preview`
- `components/`: UI components (cards, modal, markdown, typewriter, etc.)
- `pages/`: app pages (`JobsPage`, `CompaniesPage`, `TalentsPage`, `AISearchPage`, `LoginPage`)
- `services/geminiService.ts`: thin wrapper for the Gemini API usage
- `types.ts`, `constants.ts`, `ui.tsx`: shared types and UI helpers

Requirements
- Node.js 18+ (recommended)
- npm or yarn

Development (run locally)
1. Install dependencies:
    `npm install`
2. Provide your Gemini API key for any AI features (optional). You can use environment variables; Vite's `loadEnv` is used in `vite.config.ts`. Create a local env file (not committed):
    - Create `.env.local` at the project root and add:
       `GEMINI_API_KEY=your_api_key_here`
3. Start dev server:
    `npm run dev`

Build for production
- Build the app:
   `npm run build`
- Preview the production build locally:
   `npm run preview`

Publishing to GitHub Pages (serve from `main` branch)
There are two straightforward approaches to host this site on GitHub Pages from the `main` branch:

Option A — Use the `docs/` folder (recommended if you want GitHub Pages from `main` branch)
1. Build the app into a `docs` folder so GitHub Pages can serve it from the `main` branch:
    - Build with an explicit outDir (no code changes required):
       ```pwsh
       npm run build -- --outDir docs
       ```
    - Or set `build.outDir = 'docs'` in `vite.config.ts` (example below).
2. Commit the generated `docs/` folder to `main` and push.
3. In your repository settings (GitHub):
    - Pages → Source: `main` branch / `docs` folder
    - (Optional) Set the site `base` (see note below)

Option B — Use a `gh-pages` branch or GitHub Action (automated)
- If you prefer not to commit built files to `main`, use one of the many `gh-pages` deploy actions to publish `dist` to the `gh-pages` branch automatically. I can add an example workflow if you want.

Handling `base` for repo pages (URL path)
- If you will host the site at `https://<username>.github.io/Remotely/` (i.e., not a user/org root site), set the base path in Vite so assets load correctly. Two ways:
   1. Build-time flags (CLI):
       ```pwsh
       npm run build -- --outDir docs --base /Remotely/
       ```
   2. Vite config change (recommended for convenience): edit `vite.config.ts` and add `base` and `build.outDir` for production, eg:
       ```ts
       export default defineConfig(({ mode }) => {
          const env = loadEnv(mode, '.', '');
          return {
             base: mode === 'production' ? '/Remotely/' : '/',
             build: { outDir: 'docs' },
             // ...existing config
          }
       })
       ```

Environment notes
- `vite.config.ts` already injects `GEMINI_API_KEY` into `process.env.GEMINI_API_KEY` for use by the client. Keep keys secret; do not commit private keys into the repo. For production builds served publicly, ensure you are not exposing secrets that must remain private.

Helpful commands
- Install: `npm install`
- Dev server: `npm run dev`
- Build (default dist): `npm run build`
- Build to `docs` for GitHub Pages (main + docs):
   `npm run build -- --outDir docs`
- Build to `docs` and set repo base (example):
   `npm run build -- --outDir docs --base /Remotely/`

Need help automating deployment?
- I can: (a) update `vite.config.ts` to add `base` & `build.outDir`, (b) add a GitHub Action workflow that builds and pushes to `gh-pages`, or (c) create a sample `docs/.nojekyll` and helper scripts. Tell me which option you prefer and I’ll make the changes.

License & attribution
- This repo is a demo. Add a license file if you want to publish with terms.

Enjoy! If you want, I can update `vite.config.ts` now to set `base` + `build.outDir` and/or add a GitHub Action to automate publishing.

