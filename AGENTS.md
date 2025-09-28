## AGENTS.md

This file helps automated coding agents work with this repository. It contains build/test
instructions, conventions, and useful commands.

### Quick start

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build: `npm run build`
- Preview production build: `npm run preview`

Recommended Node: >=16 (use .nvmrc or package.json "engines" if you need to pin a version)

### Tests

- Playwright visual checks: `npm run test:playwright`

Before running visual tests locally or in CI, install Playwright browsers (one-time):

```
npx playwright install --with-deps
```

### Playwright & MCP

- This project includes a small Playwright visual test suite in `tests/playwright`.
- The tests expect the app to be available at `http://localhost:5173` by default. If your
	environment (MCP server or CI) exposes the app at a different URL, set the `APP_URL`
	environment variable before running tests, for example:

```
APP_URL=http://127.0.0.1:5174 npm run test:playwright
```

- To run tests locally you can start the dev server (`npm run dev`) or serve a production
	build via `npm run preview` and point `APP_URL` at that server.

CI / single-command run: if you'd like a single command that starts the dev server, waits
for the URL to become available and then runs Playwright, use `start-server-and-test`.
Example (add as an npm script and install `start-server-and-test` as a devDependency):

```
npm install -D start-server-and-test
# add script in package.json: "test:playwright:ci": "start-server-and-test 'npm run dev' http://localhost:5173 'playwright test --project=chromium'"
npm run test:playwright:ci
```

Troubleshooting:
- If `page.goto` fails with `ERR_CONNECTION_REFUSED`, ensure the dev server is running and accessible at the URL used by the tests (check `APP_URL`).
- If `vue-tsc -b` fails during build, verify your local Node/TypeScript versions and installed dependencies.
- If Playwright tests fail due to missing browsers, run `npx playwright install --with-deps` and retry.

### Conventions

- Vue 3 + TypeScript + Vite
- Keep TypeScript strict checks passing (we use `vue-tsc -b` during build)
- Styling: component-scoped CSS in `.vue` files

### Agent tips

- If changing imports or moving files run `npm run build` to ensure type checks pass.
- The nearest `AGENTS.md` to the edited files takes precedence for agents.
