import { test, expect } from '@playwright/test'

const URL = process.env.APP_URL || 'http://localhost:5173'

test.describe('Visual layout checks', () => {
  test('desktop 1280x800', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(URL)
  const app = page.locator('.app')
  await app.waitFor()
  // hide floating preview to keep visual baseline stable in CI
  await page.evaluate(() => { const el = document.querySelector('.preview'); if (el) (el as HTMLElement).style.display = 'none' })
  // visual baseline check (creates/compares screenshot)
  await expect(app).toHaveScreenshot('desktop-1280x800.png')
  // simple check: page width shouldn't overflow horizontally
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(1280 + 10)
  })

  test('large 1920x1080', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(URL)
  const app = page.locator('.app')
  await app.waitFor()
  // hide floating preview to keep visual baseline stable in CI
  await page.evaluate(() => { const el = document.querySelector('.preview'); if (el) (el as HTMLElement).style.display = 'none' })
  await expect(app).toHaveScreenshot('desktop-1920x1080.png')
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(1920 + 10)
  })

  test('mobile 375x667', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(URL)
  const app = page.locator('.app')
  await app.waitFor()
  // hide floating preview to keep visual baseline stable in CI
  await page.evaluate(() => { const el = document.querySelector('.preview'); if (el) (el as HTMLElement).style.display = 'none' })
  await expect(app).toHaveScreenshot('mobile-375x667.png')
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(375 + 10)
  })

  test('mobile 390x844', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(URL)
  const app = page.locator('.app')
  await app.waitFor()
  // hide floating preview to keep visual baseline stable in CI
  await page.evaluate(() => { const el = document.querySelector('.preview'); if (el) (el as HTMLElement).style.display = 'none' })
  await expect(app).toHaveScreenshot('mobile-390x844.png')
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(390 + 10)
  })
})
