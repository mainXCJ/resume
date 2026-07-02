# Resume Web

Resume Web is a resume editor built with `Vue 3` and `Vite`.
It provides a split workspace with editing on the left and live preview on the right, and is designed for resume writing, layout tuning, and A4 print export.

## Environment

- Node.js `20.x` or later
- npm `10.x` or later
- Windows, macOS, or Linux
- A modern browser, preferably the latest Chrome or Edge

## Tech Stack

- `Vue 3`
- `Vite 8`
- Browser `localStorage` for draft persistence
- Local static font assets in `public/fonts/`

## Features

- Edit base profile data such as name, job intent, phone, email, degree, city, and GitHub/blog link
- Edit resume sections such as education, projects, skills, certificates, and self evaluation
- Show or hide sections
- Reorder sections with drag and drop
- Adjust global styles including theme color, font sizes, line height, section spacing, page margins, and avatar scale
- Write content with Markdown-like formatting including bold, italic, lists, tables, and links
- Import and export draft data as JSON
- Auto-save draft data in browser local storage
- Preview changes in real time
- Print the resume as A4 through the browser print dialog
- Paginate preview content to keep print output stable

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal. In most cases it is:

```text
http://localhost:5173
```

## Production Build

Build the project:

```bash
npm run build
```

The production files will be generated in `dist/`.

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
resume_web/
|- public/
|  \- fonts/
|- src/
|  |- components/
|  |- App.vue
|  |- main.js
|  |- store.js
|  \- style.css
|- .github/
|  \- workflows/
|- index.html
|- package.json
|- package-lock.json
|- vite.config.js
\- README.md
```

## Usage Notes

- Use the left panel to edit content and global settings.
- Use the right panel to inspect the paginated preview.
- Export the current draft as JSON when you want a backup.
- Import a JSON file to restore a saved draft.
- Use the top print action to export the resume as PDF through the browser.

## Deployment

This project already includes a GitHub Pages deployment workflow.
After pushing code to the `main` branch, GitHub Actions will build and publish the site automatically.
