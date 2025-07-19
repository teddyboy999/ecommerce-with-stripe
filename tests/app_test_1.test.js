// tests/ecommerce_full_suite.test.js
import { test, expect } from '@playwright/test';

test.describe('E-commerce Cart Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Add Croissant to cart updates total price', async ({ page }) => {
    const croissant = page.getByRole('article', { name: /croissant/i });
    await croissant.getByRole('button', { name: /add/i }).click();
    await page.getByRole('button', { name: /cart/i }).click();
    
    const total = await page.getByTestId('cart-total'); // update if you have custom IDs
    await expect(total).toContainText('$3.50'); // replace with actual value
  });

  test('Add then remove item resets cart', async ({ page }) => {
    const croissant = page.getByRole('article', { name: /croissant/i });
    await croissant.getByRole('button', { name: /add/i }).click();
    await croissant.getByRole('button', { name: /remove/i }).click();

    await page.getByRole('button', { name: /cart/i }).click();
    const cartEmpty = await page.locator('.cart-empty-message'); // adjust as needed
    await expect(cartEmpty).toBeVisible();
  });

  test('Edge case: Adding same item multiple times sums price correctly', async ({ page }) => {
    const muffin = page.getByRole('article', { name: /muffin/i });
    await muffin.getByRole('button', { name: /add/i }).click();
    await muffin.getByRole('button', { name: /add/i }).click();

    await page.getByRole('button', { name: /cart/i }).click();
    const total = await page.getByTestId('cart-total');
    await expect(total).toContainText('$7.00'); // example: $3.50 * 2
  });

  test('Bug check: Negative quantity should not occur', async ({ page }) => {
    const item = page.getByRole('article', { name: /bagel/i });
    await item.getByRole('button', { name: /remove/i }).click(); // removing without adding
    
    await page.getByRole('button', { name: /cart/i }).click();
    const quantity = await page.locator('[data-testid="bagel-qty"]'); // adjust if needed
    await expect(quantity).not.toHaveText('-1');
  });
});
