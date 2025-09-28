import { test, expect } from '@playwright/test'

const URL = 'http://localhost:5173'

test('preview toggle collapses and expands', async ({ page }) => {
  await page.goto(URL)
  const preview = page.locator('.preview')
  await preview.waitFor()
  // ensure it starts open
  expect(await preview.getAttribute('class')).not.toContain('collapsed')
  const toggle = page.locator('.preview-toggle')
  // prefer clicking the larger hit area when collapsed
  const hit = await page.$('.preview-hit')
  if (hit) {
    await hit.click()
  } else {
    await toggle.click()
  }
  // after click, should have collapsed class
  await expect(preview).toHaveClass(/collapsed/)
  // click again to expand (prefer the hit area if present)
  const hit2 = await page.$('.preview-hit')
  if (hit2) {
    await hit2.click()
  } else {
    await toggle.click()
  }
  await expect(preview).not.toHaveClass(/collapsed/)
})
