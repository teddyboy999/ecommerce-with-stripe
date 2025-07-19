import { test, expect } from '@playwright/test';

test('Add all items and validate total', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  const items = [
    { name: '🍙Onigiri', price: 120 },
    { name: '🍠Sweet Potato', price: 290 },
    { name: '🥐Croissant', price: 200 },
    { name: '🌯Buritto', price: 390 },
    { name: '🍮Pudding', price: 150 },
    { name: '🥚Egg', price: 100 },
    { name: '🥨Pretzel', price: 520 }
  ];

  let expectedTotal = 0;
  for (const item of items) {
    await page.getByRole('article').filter({ hasText: item.name }).getByRole('button').nth(1).click();
    expectedTotal += item.price;
  }

  await page.getByRole('button', { name: 'Proceed to checkout' }).click();

  const total = await page.locator('[data-testid="cart-total"]').innerText();
  expect(parseInt(total.replace(/\D/g, ''))).toBe(expectedTotal);
});
