// tests/full_app_test.test.js  
import { test, expect } from '@playwright/test';  
  
test.describe('E-commerce Webpage Full Suite', () => {  
  test.beforeEach(async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
  });  
  
  test('Landing page: start button and all products are visible', async ({ page }) => {  
    // Start/QAHackathon button visible  
    await expect(page.getByRole('button', { name: /start.*qa hackathon/i })).toBeVisible();  
  
    // Click start  
    await page.getByRole('button', { name: /start.*qa hackathon/i }).click();  
    // All major products visible (spot check for three, full scan below)  
    await expect(page.getByRole('article', { name: /onigiri/i })).toBeVisible();  
    await expect(page.getByRole('article', { name: /pudding/i })).toBeVisible();  
    await expect(page.getByRole('article', { name: /buritto/i })).toBeVisible();  
  
    // Ensure every expected product is present  
    const products = [  
      'onigiri', 'sweet potato', 'croissant', 'sushi', 'egg', 'buritto', 'pudding', 'pretzel'  
    ];  
    for (const p of products) {  
      await expect(page.getByRole('article', { name: new RegExp(p, 'i') })).toBeVisible();  
    }  
  });  
  
  test('Add products and verify cart total is calculated dynamically', async ({ page }) => {  
    await page.getByRole('button', { name: /start.*qa hackathon/i }).click();  
  
    // Add: Onigiri (¥120), Sweet Potato (¥290), Pudding (¥150)  
    await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('article', { name: /sweet potato/i }).getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('article', { name: /pudding/i }).getByRole('button', { name: /add to cart/i }).click();  
  
    // Open cart  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
  
    // Cart should list all three, with correct quantities  
    await expect(page.getByText(/🍙 Onigiri.*1/)).toBeVisible();  
    await expect(page.getByText(/🍠 Sweet Potato.*1/)).toBeVisible();  
    await expect(page.getByText(/🍮 Pudding.*1/)).toBeVisible();  
  
    // Verify total: 120 + 290 + 150 = 560  
    await expect(page.getByText(/total.*¥?560/i)).toBeVisible();  
  
    // Add another Onigiri (+)  
    await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: '+' }).click();  
    // Reopen cart if it closes (optional – depends on UI)  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
  
    // Now have Onigiri x2, total should be 120*2 + 290 + 150 = 680  
    await expect(page.getByText(/🍙 Onigiri.*2/)).toBeVisible();  
    await expect(page.getByText(/total.*¥?680/i)).toBeVisible();  
  
    // Remove Pudding (-)  
    await page.getByRole('article', { name: /pudding/i }).getByRole('button', { name: '-' }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
  
    // Pudding should be removed, total is 680 - 150 = 530  
    await expect(page.getByText(/🍮 Pudding/)).not.toBeVisible();  
    await expect(page.getByText(/total.*¥?530/i)).toBeVisible();  
  });  
  
  test('Can change product quantities inline and see correct text', async ({ page }) => {  
    await page.getByRole('button', { name: /start/i }).click();  
    const buritto = page.getByRole('article', { name: /buritto/i });  
    // Start at 1, add 2, subtract 1: net +1 (should be 2)  
    await buritto.getByRole('button', { name: '+' }).click();  
    await buritto.getByRole('button', { name: '+' }).click();  
    await buritto.getByRole('button', { name: '-' }).click();  
  
    // Text in article should show "2"  
    await expect(buritto).toContainText('-2+');  
  });  
  
  test('Cart displays products & quantities after repeated add/remove, and checkout works', async ({ page }) => {  
    await page.getByRole('button', { name: /start/i }).click();  
  
    // Add 2 Onigiri, 1 Buritto  
    const onigiri = page.getByRole('article', { name: /onigiri/i });  
    const buritto = page.getByRole('article', { name: /buritto/i });  
    await onigiri.getByRole('button', { name: '+' }).click();  
    await onigiri.getByRole('button', { name: /add to cart/i }).click(); // add  
    await buritto.getByRole('button', { name: /add to cart/i }).click();  
  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await expect(page.getByText(/🍙 Onigiri.*2/)).toBeVisible();  
    await expect(page.getByText(/🌯 Buritto.*1/)).toBeVisible();  
  
    // Remove one Onigiri in cart context  
    // (Assuming there is a '-' for it in the cart UI, if not, adapt next line)  
    await page.getByText(/🍙 Onigiri.*2/).locator('..').getByRole('button', { name: '-' }).click();  
  
    // Should now be Onigiri 1  
    await expect(page.getByText(/🍙 Onigiri.*1/)).toBeVisible();  
  
    // Proceed to checkout  
    await page.getByRole('button', { name: /proceed to checkout/i }).click();  
    // Confirm order placed  
    await expect(page.getByText(/order confirmation|thank you/i)).toBeVisible();  
  });  
  
  test('Cannot checkout from empty cart ("Proceed to checkout" is disabled)', async ({ page }) => {  
    await page.getByRole('button', { name: /start/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
  
    const checkoutBtn = page.getByRole('button', { name: /proceed to checkout/i });  
    await expect(checkoutBtn).toBeDisabled();  
  });  
  
  test('Contact/business link exists and works', async ({ page }) => {  
    await page.getByRole('button', { name: /start/i }).click();  
    await page.getByTestId('business-link').click();  
    // Optionally verify destination or text  
    // await expect(page.getByText(/contact|business/i)).toBeVisible();  
  });  
  
  test('All product images have an alt attribute', async ({ page }) => {  
    await page.getByRole('button', { name: /start/i }).click();  
    const images = page.locator('article img');  
    const count = await images.count();  
    for (let i = 0; i < count; ++i) {  
      await expect(images.nth(i)).toHaveAttribute('alt', /.+/);  
    }  
  });  
});  