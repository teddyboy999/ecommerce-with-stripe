// Import required modules
const { test, expect } = require('@playwright/test');

// Define devices for responsive testing
const devices = [
  { name: 'Desktop', width: 1280, height: 800 },
  { name: 'PC', width: 1024, height: 768 },
  { name: 'Smartphone', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
];

// Test application loads correctly on all supported devices
devices.forEach((device) => {
  test(`loads correctly on ${device.name}`, async ({ page }) => {
    await page.setViewportSize({ width: device.width, height: device.height });
    await page.goto('http://localhost:3000/');
    await page.click('text="Let\'s start the QA Hackathon"');
    await expect(page).toContainText('article', 'Onigiri');
  });
});

// Test app loads when cookies/localStorage are disabled
test('loads when cookies/localStorage are disabled', async ({ page, context }) => {
  const contextWithNoStorage = await browser.newContext({
    storageState: null,
  });
  await page.goto('http://localhost:3000/', { context: contextWithNoStorage });
  await page.click('text="Let\'s start the QA Hackathon"');
  await expect(page).toContainText('article', 'Onigiri');
});

// Test items can be added to the cart
test('adds items to cart', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await page.click(`text="Add to cart"`);
  await expect(page.locator('#cart-icon')).toContainText('1');
});

// Verify calculation of total price and quantity after adding items
test('calculates total price and quantity', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.locator('article').first().textContent();
  const price = await page.locator('article').first().locator('text=¥').textContent();
  await page.locator(`text="Add to cart"`).first().click();
  await page.click('text="Shopping cart"');
  await expect(page.locator('text=Total:')).toContainText(`Total: ${price} 1`);
});

// Test maximum number of items can be added to cart
test('limits items to 20', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  for (let i = 0; i < 20; i++) {
    await page.locator(`text="Add to cart"`).first().click();
  }
  await expect(page.locator('#cart-icon')).toContainText('20');
});

// Test error message when adding more than 20 items
test('displays error message when adding more than 20 items', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  for (let i = 0; i < 20; i++) {
    await page.locator(`text="Add to cart"`).first().click();
  }
  await expect(page.locator(`text="Add to cart"`).first()).toBeDisabled();
  await expect(page).toContainText('Error: Cannot add more than 20 items');
});

// Test items can be removed from cart
test('removes items from cart', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await page.locator(`text="Add to cart"`).first().click();
  await page.click('text="Shopping cart"');
  await page.locator(`text="-"`).first().click();
  await expect(page.locator('#cart-icon')).toContainText('0');
});

// Test quantity cannot be reduced below zero
test('prevents quantity from going below zero', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await page.locator(`text="Add to cart"`).first().click();
  await page.click('text="Shopping cart"');
  await page.locator(`text="-"`).first().click();
  await expect(page.locator(`text="0"`)).toBeVisible();
});

// Test proceed to checkout is disabled when cart is empty
test('disables proceed to checkout when cart is empty', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await page.click('text="Shopping cart"');
  await expect(page.locator(`text="Proceed to checkout"`)).toBeDisabled();
});

// Test calculation of total price and quantity after removing items
test('calculates total price and quantity after removing items', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const productName = await page.locator('article').first().textContent();
  const price = await page.locator('article').first().locator('text=¥').textContent();
  await page.locator(`text="Add to cart"`).first().click();
  await page.click('text="Shopping cart"');
  await page.locator(`text="-"`).first().click();
  await expect(page.locator('text=Total:')).toContainText('Total: 0');
});

// Test business link presence
test('displays business link', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await expect(page.locator(`[data-testid="business-link"]`)).toBeVisible();
});

// Test product images have meaningful alt attributes
test('product images have alt attributes', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  const images = await page.locator('article img');
  for (const image of await images.all()) {
    await expect(await image.getAttribute('alt')).not.toBeNull();
  }
});

// Test cart persistence
test('persists cart after refresh', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('text="Let\'s start the QA Hackathon"');
  await page.locator(`text="Add to cart"`).first().click();
  await page.reload();
  await expect(page.locator('#cart-icon')).toContainText('1');
});
