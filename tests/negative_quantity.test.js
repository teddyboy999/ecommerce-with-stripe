import { test, expect } from '@playwright/test';

test('Prevent quantity below zero and validate price doesn’t break', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  const minusButton = page.getByRole('article').filter({ hasText: '🍙Onigiri' }).getByRole('button').nth(0); // Assume 0 is the "-" button
  await minusButton.click(); // Decrease below 0
  await minusButton.click();

  // ❌ BUG CHECK: Confirm item quantity not negative
  const quantityText = await page.getByRole('article').filter({ hasText: '🍙Onigiri' }).locator('[data-testid="quantity"]').innerText();
  expect(parseInt(quantityText)).toBeGreaterThanOrEqual(0);

  // ❌ BUG CHECK: Total price should not go negative
  await page.getByRole('button', { name: 'Proceed to checkout' }).click();
  const total = await page.locator('[data-testid="cart-total"]').innerText();
  expect(parseInt(total.replace(/\D/g, ''))).toBeGreaterThanOrEqual(0);
});
