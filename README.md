# TimeZoneCentral

![TimeSync Logo](public/images/timesync-logo.svg)

TimeZoneCentral (a.k.a. TimeSync) is a fast, accessible web app for comparing, converting, and synchronizing times across multiple time zones. It's built for distributed teams and global users who need quick timezone visualization, sharing, and scheduling.

## Features

- Compare multiple time zones side-by-side with timezone cards
- Visualize time differences with interactive charts
- Add, edit, and share timezone-aware schedules in real time
- Keyboard-accessible and responsive UI
- Localization (English / Spanish) and OAuth-ready hooks

## Tech stack & versions

- React: ^19.2.0
- Vite: ^7.2.4
- TailwindCSS: ^3.4.19
- Day.js: ^1.11.19
- Framer Motion: ^12.29.0
- TanStack React Query: ^5.90.20
- Zod: ^4.3.6
- Type declarations: `@types/react` ^19.2.5

Dev tools:

- ESLint: ^9.39.1
- PostCSS: ^8.5.6
- Autoprefixer: ^10.4.23

Note: See `package.json` for the full list of dependencies and exact versions.

## Quick start

Install and run locally:

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Contributing

Thanks for considering contributing! Please follow these steps to make development smooth:

1. Fork the repository and create a feature branch: `git checkout -b feat/your-change`
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
4. Run linters/formatters before committing: `npm run lint` (and apply fixers if configured)
5. Push your branch and open a pull request with a clear description and screenshots (if relevant)

Guidelines:

- Keep changes focused and small; one logical change per PR
- Write clear commit messages and reference related issues
- Add tests for new behaviors when applicable
- Ensure UI changes are accessible and responsive

If you're unsure where to start, check the `src/lib` and `src/components` folders for smaller issues labeled `good first issue`.

## Logo

A placeholder SVG logo lives at `Logo.png`. Replace it with your final artwork (same path) to update the repository logo.

## License

This project does not include a license file in the repository. Add a `LICENSE` file if you want to specify terms for reuse.

---

If you'd like, I can:

- Add GitHub Action badges and Node engine requirements
- Expand the Contributing section into a `CONTRIBUTING.md`
- Add screenshots and usage examples to the README

Tell me which of those you'd like next.
