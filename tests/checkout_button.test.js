// tests/checkout-button.test.js
import { test, expect } from '@playwright/test';

test('Proceed to checkout navigates correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Add 1 item so checkout is enabled
  const croissant = page.getByRole('article').filter({ hasText: 'Croissant' });
  await croissant.getByRole('button', { name: 'Add to cart' }).click();

  // Click on checkout
  await page.getByRole('button', { name: 'Proceed to checkout' }).click();

  // Confirm checkout page loads (adapt selector to your actual checkout screen)
  await expect(page).toHaveURL(/.*checkout/i);
});
