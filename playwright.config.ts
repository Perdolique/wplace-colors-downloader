import { defineConfig, devices } from '@playwright/test'

// read APP_URL in a way that doesn't rely on Node types being present in TS
const APP_URL = (globalThis as any).process?.env?.APP_URL || 'http://localhost:5173'

export default defineConfig({
  testDir: './tests/playwright',
  // cap each test to 5 seconds to avoid long-hanging tests
  timeout: 5_000,
  // also make Playwright expectations and actions short-lived
  expect: { timeout: 5_000 },
  use: {
    baseURL: APP_URL,
    headless: true,
    // limit individual actions (clicks/waits) to 5s as well
    actionTimeout: 5_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
