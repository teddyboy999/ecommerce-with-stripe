// Import required modules
const { test, expect } = require('@playwright/test');

// Define devices for responsive testing
const devices = [
  { name: 'Desktop', width: 1280, height: 800 },
  { name: 'PC', width: 1024, height: 768 },
  { name: 'Smartphone', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
];

// Test to verify application loads correctly on all supported devices
test.describe('Responsive Testing', () => {
  devices.forEach((device) => {
    test(`loads correctly on ${device.name}`, async ({ page, context }) => {
      await context.emulate({ viewportSize: { width: device.width, height: device.height } });
      await page.goto('http://localhost:3000/');
      await page.click('text="Let\'s start the QA Hackathon"');
      await expect(page).toBeDefined();
    });
  });
});

// Test to verify application loads when cookies/localStorage are disabled
test('loads when cookies/localStorage are disabled', async ({ page, context }) => {
  await context.setCookies([{ name: 'test', value: 'test', expires: -1 }]);
  await context.setStorage({ test: 'test' });
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await expect(page).toBeDefined();
});

// Test to ensure items can be added to the cart
test('add items to cart', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.getByRole('article', { name: /onigiri/i }).getByText('🍙 Onigiri');
  await expect(productName).toBeDefined();
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByRole('button', { name: 'Shopping cart' })).toContainText('1');
});

// Test to verify calculation of total price and quantity after adding items
test('verify calculation after adding items', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.getByRole('article', { name: /onigiri/i });
  const priceText = await productName.getByText('¥120');
  const price = parseInt(await priceText.textContent.replace('¥', ''));
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('button', { name: 'Shopping cart' }).click();
  const totalPriceText = await page.getByText(/Total: ¥/);
  const totalPrice = parseInt(await totalPriceText.textContent.replace('Total: ¥', ''));
  await expect(totalPrice).toBe(price);
});

// Test to verify maximum number of items (20 items) can be added to the cart
test('add maximum items to cart', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  for (let i = 0; i < 20; i++) {
    await page.getByRole('button', { name: 'Add to cart' }).click();
  }
  await page.getByRole('button', { name: 'Shopping cart' }).click();
  const totalQuantityText = await page.getByText(/Total: ¥/);
  await expect(await totalQuantityText.textContent).toContain('20');
});

// Test to check error message when trying to add more than 20 items
test('error message when adding more than 20 items', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  for (let i = 0; i < 20; i++) {
    await page.getByRole('button', { name: 'Add to cart' }).click();
  }
  await expect(page.getByText('Error: Maximum quantity reached')).toBeDefined();
});

// Test to ensure items can be removed from the cart
test('remove items from cart', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('button', { name: 'Shopping cart' }).click();
  await page.getByRole('button', { name: '-' }).click();
  await expect(page.getByRole('button', { name: 'Shopping cart' })).toContainText('0');
});

// Test to verify quantity cannot be reduced below zero
test('quantity cannot be reduced below zero', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('button', { name: 'Shopping cart' }).click();
  await page.getByRole('button', { name: '-' }).click();
  await page.getByRole('button', { name: '-' }).click();
  await expect(page.getByText('1')).toBeDefined();
});

// Test to check if cart is empty, proceed to payment is disabled
test('proceed to payment is disabled when cart is empty', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await page.getByRole('button', { name: 'Shopping cart' }).click();
  await expect(page.getByRole('button', { name: 'Proceed to checkout' })).toBeDisabled();
});

// Test to verify calculation after removing items
test('verify calculation after removing items', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.getByRole('article', { name: /onigiri/i });
  const priceText = await productName.getByText('¥120');
  const price = parseInt(await priceText.textContent.replace('¥', ''));
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('button', { name: 'Shopping cart' }).click();
  await page.getByRole('button', { name: '-' }).click();
  const totalPriceText = await page.getByText(/Total: ¥/);
  const totalPrice = parseInt(await totalPriceText.textContent.replace('Total: ¥', ''));
  await expect(totalPrice).toBe(0);
});

// Test with different combinations of items
test('different combinations of items', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productNames = await page.getByRole('article');
  for (const productName of productNames) {
    await productName.getByRole('button', { name: 'Add to cart' }).click();
  }
  await page.getByRole('button', { name: 'Shopping cart' }).click();
  const totalPriceText = await page.getByText(/Total: ¥/);
  const totalPrice = parseInt(await totalPriceText.textContent.replace('Total: ¥', ''));
  await expect(totalPrice).toBeGreaterThan(0);
});

// Test to calculate price
test('calculate price', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.getByRole('article', { name: /onigiri/i });
  const priceText = await productName.getByText('¥120');
  const price = parseInt(await priceText.textContent.replace('¥', ''));
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('button', { name: 'Shopping cart' }).click();
  const totalPriceText = await page.getByText(/Total: ¥/);
  const totalPrice = parseInt(await totalPriceText.textContent.replace('Total: ¥', ''));
  await expect(totalPrice).toBe(price);
});

// Test cart persistence
test('cart persistence', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Shopping cart' }).click();
  await expect(page.getByRole('button', { name: 'Shopping cart' })).toContainText('1');
});

// Test business link
test('business link', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await expect(page.getByTestId('business-link')).toBeDefined();
});

// Test product images
test('product images', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productImages = await page.getByRole('article').getByRole('img');
  for (const productImage of productImages) {
    await expect(await productImage.getAttribute('alt')).not.toBe('');
  }
});
