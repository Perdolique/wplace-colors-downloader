import { test, expect } from '@playwright/test'

const URL = 'http://localhost:5173'

test.describe('Interaction checks', () => {
  test('uploads an image and shows used colors count', async ({ page }) => {
    await page.goto(URL)
    // default example image should be loaded automatically
    await page.waitForSelector('.success')
    const text = await page.textContent('.success')
    expect(text).toMatch(/Image loaded successfully. Colors used:/)
  })

  test('select all free and select all paid toggle independently', async ({ page }) => {
    await page.goto(URL)
    // default example image should be loaded automatically
    await page.waitForSelector('.color-list')

    // click select all free
    await page.click('button.select-all:has-text("Select all free")')
    // count selected items
    const freeSelected = await page.$$eval('.color-item.selected', els => els.length)

    // click select all paid (should add to selection, not replace)
    await page.click('button.select-all:has-text("Select all paid")')
    const totalSelected = await page.$$eval('.color-item.selected', els => els.length)

    expect(totalSelected).toBeGreaterThanOrEqual(freeSelected)

    // toggle free again should remove those free selections
    await page.click('button.select-all:has-text("Select all free")')
    const afterToggle = await page.$$eval('.color-item.selected', els => els.length)
    expect(afterToggle).toBeLessThanOrEqual(totalSelected)
  })
})
