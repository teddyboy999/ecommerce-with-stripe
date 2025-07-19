// tests/add-to-cart.test.js
import { test, expect } from '@playwright/test';

test('Add each item to the cart', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  const items = [
    'Onigiri',
    'Sweet Potato',
    'Croissant',
    'Sushi',
    'Egg',
    'Buritto',
    'Pudding',
    'Pretzel',
  ];

  for (const item of items) {
    const card = page.getByRole('article').filter({ hasText: item });
    await card.getByRole('button', { name: 'Add to cart' }).click();
  }

  // Check if cart icon count = 8
  await expect(page.getByText('8')).toBeVisible();
});
