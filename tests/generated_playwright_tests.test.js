const { test, expect } = require('@playwright/test');

const devices = [
  { name: 'Desktop', width: 1280, height: 800 },
  { name: 'PC', width: 1024, height: 768 },
  { name: 'Smartphone', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
];

devices.forEach(device => {
  test(`loads correctly on ${device.name}`, async ({ page }) => {
    await page.emulate({ width: device.width, height: device.height });
    await page.goto('http://localhost:3000/');
    await page.click('text="Let\'s start the QA Hackathon"');
    await expect(page).toHaveTitle('E-commerce App');
  });
});

test('loads when cookies/localStorage are disabled', async ({ page, context }) => {
  const contextWithNoStorage = await browser.newContext({
    storageState: null,
  });
  const pageWithNoStorage = await contextWithNoStorage.newPage();
  await pageWithNoStorage.goto('http://localhost:3000/');
  await pageWithNoStorage.click('text="Let\'s start the QA Hackathon"');
  await expect(pageWithNoStorage).toHaveTitle('E-commerce App');
});

test('adds items to cart', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.getByRole('article', { name: /onigiri/i }).getByText('🍙 Onigiri');
  const addButton = await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: 'Add to cart' });
  await addButton.click();
  await expect(page.getByRole('button', { name: 'Open cart' })).toContainText('1');
});

test('calculates total price and quantity', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.getByRole('article', { name: /onigiri/i }).getByText('🍙 Onigiri');
  const addButton = await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: 'Add to cart' });
  await addButton.click();
  await addButton.click();
  await page.click('text="Open cart"');
  await expect(page).toContainText('🍙 Onigiri (2) ¥240');
  await expect(page).toContainText('Total: ¥240');
});

test('limits items to 20', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.getByRole('article', { name: /onigiri/i }).getByText('🍙 Onigiri');
  const addButton = await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: 'Add to cart' });
  for (let i = 0; i < 20; i++) {
    await addButton.click();
  }
  await expect(page.getByRole('button', { name: 'Open cart' })).toContainText('20');
});

test('displays error message when adding more than 20 items', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.getByRole('article', { name: /onigiri/i }).getByText('🍙 Onigiri');
  const addButton = await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: 'Add to cart' });
  for (let i = 0; i < 20; i++) {
    await addButton.click();
  }
  await addButton.click();
  await expect(page).toContainText('Error: Cannot add more than 20 items');
});

test('removes items from cart', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.getByRole('article', { name: /onigiri/i }).getByText('🍙 Onigiri');
  const addButton = await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: 'Add to cart' });
  await addButton.click();
  await page.click('text="Open cart"');
  const removeButton = await page.getByRole('button', { name: '-' });
  await removeButton.click();
  await expect(page).not.toContainText('🍙 Onigiri');
});

test('does not allow quantity to go below zero', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.getByRole('article', { name: /onigiri/i }).getByText('🍙 Onigiri');
  const addButton = await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: 'Add to cart' });
  await addButton.click();
  await page.click('text="Open cart"');
  const removeButton = await page.getByRole('button', { name: '-' });
  await removeButton.click();
  await expect(page).not.toContainText('🍙 Onigiri (0)');
});

test('disables proceed to checkout when cart is empty', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await page.click('text="Open cart"');
  const proceedButton = await page.getByRole('button', { name: 'Proceed to checkout' });
  await expect(proceedButton).toBeDisabled();
});

test('calculates total price and quantity after removing items', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.getByRole('article', { name: /onigiri/i }).getByText('🍙 Onigiri');
  const addButton = await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: 'Add to cart' });
  await addButton.click();
  await addButton.click();
  await page.click('text="Open cart"');
  const removeButton = await page.getByRole('button', { name: '-' });
  await removeButton.click();
  await expect(page).toContainText('🍙 Onigiri (1) ¥120');
  await expect(page).toContainText('Total: ¥120');
});

test('product images have meaningful alt attributes', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const images = await page.getByRole('img');
  for (const image of images) {
    await expect(await image.getAttribute('alt')).not.toBe('');
  }
});

test('cart persistence', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.getByRole('article', { name: /onigiri/i }).getByText('🍙 Onigiri');
  const addButton = await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: 'Add to cart' });
  await addButton.click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Open cart' })).toContainText('1');
});

test('business link is present', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await expect(page.getByTestId('business-link')).toBeVisible();
});
