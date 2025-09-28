import { test, expect } from '@playwright/test'

const URL = 'http://localhost:5173'

test('preview remains visible after scrolling', async ({ page }) => {
  await page.goto(URL)
  // default example image should be loaded automatically
  await page.waitForSelector('.success')

  // ensure page is tall enough to scroll
  await page.evaluate(() => {
    const filler = document.createElement('div')
    filler.style.height = '2000px'
    document.body.appendChild(filler)
  })

  // scroll down
  await page.evaluate(() => window.scrollTo(0, 1500))
  await page.waitForTimeout(200)

  const preview = await page.$('.preview')
  if (!preview) throw new Error('preview not found')
  const box = await preview.boundingBox()
  const viewport = page.viewportSize() || { width: 1280, height: 800 }
  expect(box).not.toBeNull()
  // check that preview's top is within viewport vertical range
  expect(box!.y).toBeGreaterThanOrEqual(0)
  expect(box!.y).toBeLessThanOrEqual(viewport.height)
})
