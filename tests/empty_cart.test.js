import { test, expect } from '@playwright/test';

test('Prevent checkout with empty cart', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('button', { name: 'Proceed to checkout' }).click();

  // 🧱 Expect error message or redirection prevention
  const errorText = await page.locator('[data-testid="cart-error"]').innerText();
  expect(errorText.toLowerCase()).toContain('cart is empty');
});
