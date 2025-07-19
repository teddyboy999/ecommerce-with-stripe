import { test, expect } from '@playwright/test';

test('Quantity change affects total price correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  const pricePerItem = 120; // Onigiri
  await page.getByRole('article').filter({ hasText: '🍙Onigiri' }).getByRole('button').nth(1).click(); // +
  await page.getByRole('article').filter({ hasText: '🍙Onigiri' }).getByRole('button').nth(1).click(); // +

  await page.getByRole('button', { name: 'Proceed to checkout' }).click();

  // 💰 Assert total price = 3 * 120 = 360
  const total = await page.locator('[data-testid="cart-total"]').innerText(); // replace with actual selector
  expect(parseInt(total.replace(/\D/g, ''))).toBe(360);
});
