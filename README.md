# Web Technologies Final Project (Frontend)

This repository is the official Angular frontend template for the final project.
Focus on building your application features. The project already includes automated checks for structure, linting, tests, and build.

## Install dependencies

```bash
npm install
```

## Run the project locally

```bash
npm start
```

Open `http://localhost:4200/` in your browser.

## Quality checks (local)

Run all checks:

```bash
npm run quality
```

Teacher grading (score + report):

```bash
npm run grade
```

Run individual checks:

```bash
npm run validate
npm run lint
npm run test:ci
npm run build
```

What each check does:

- `validate`: ensures the minimum required project structure exists.
- `lint`: runs Angular ESLint to enforce basic code quality.
- `test:ci`: runs unit tests once in a headless browser (CI friendly).
- `build`: builds the Angular app to verify it compiles.

## Files and folders students should not edit

Do not edit:

- .github/workflows/\*\*
- scripts/\*\*
- angular.json
- package.json
- package-lock.json
- eslint.config.\*
- tsconfig\*.json

You can edit:

- src/app/features/\*\*
- src/app/shared/\*\*
- src/app/core/services/\*\*
- src/app/core/models/\*\*
- PROJECT_INFO.md
- README.md (only the project-specific sections)

## Project-specific sections to complete

- Fill in [PROJECT_INFO.md](PROJECT_INFO.md) with your group and project details.
- Add any project notes in this README below.

### Project Notes

Add your project-specific notes here.
