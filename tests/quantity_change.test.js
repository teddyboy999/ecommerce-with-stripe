// tests/quantity-change.test.js
import { test, expect } from '@playwright/test';

test('Increase and decrease quantity of Onigiri and Pretzel', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Onigiri: increase x2, then decrease x1
  const onigiriCard = page.getByRole('article').filter({ hasText: 'Onigiri' });
  await onigiriCard.getByRole('button', { name: '+' }).click();
  await onigiriCard.getByRole('button', { name: '+' }).click();
  await onigiriCard.getByRole('button', { name: '-' }).click();

  // Assert final quantity is 2
  await expect(onigiriCard.getByText('2')).toBeVisible();

  // Pretzel: increase x1, decrease x1
  const pretzelCard = page.getByRole('article').filter({ hasText: 'Pretzel' });
  await pretzelCard.getByRole('button', { name: '+' }).click();
  await pretzelCard.getByRole('button', { name: '-' }).click();

  // Assert quantity back to 1
  await expect(pretzelCard.getByText('1')).toBeVisible();
});
