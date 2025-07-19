// tests/cart-remove.test.js
import { test, expect } from '@playwright/test';

test('Add items and remove from cart', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Add 2 items
  const onigiri = page.getByRole('article').filter({ hasText: 'Onigiri' });
  const sushi = page.getByRole('article').filter({ hasText: 'Sushi' });

  await onigiri.getByRole('button', { name: 'Add to cart' }).click();
  await sushi.getByRole('button', { name: 'Add to cart' }).click();

  // Confirm cart shows "2"
  await expect(page.getByText('2')).toBeVisible();

  // Open cart
  await page.getByRole('button').filter({ has: page.locator('text=2') }).click();

  // Remove Onigiri (assume remove button labeled "Remove" near item name)
  await page.getByRole('row').filter({ hasText: 'Onigiri' }).getByRole('button', { name: 'Remove' }).click();

  // Cart should now show "1"
  await expect(page.getByText('1')).toBeVisible();
});
