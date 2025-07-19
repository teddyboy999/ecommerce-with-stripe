import { test, expect } from '@playwright/test';

test('Add then remove item resets cart', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('article').filter({ hasText: '🥐Croissant' }).getByRole('button').nth(1).click(); // Add
  await page.getByRole('button', { name: 'Cart' }).click();
  await page.getByRole('button', { name: 'Remove' }).click(); // Replace with actual selector

  const total = await page.locator('[data-testid="cart-total"]').innerText();
  expect(parseInt(total.replace(/\D/g, ''))).toBe(0);

  // ✅ Optional: check cart shows empty message
  const cartMessage = await page.locator('[data-testid="empty-cart"]').innerText();
  expect(cartMessage.toLowerCase()).toContain('empty');
});
