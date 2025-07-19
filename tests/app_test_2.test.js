// full_app_test.test.js
import { test, expect } from '@playwright/test';  
  
test.describe('E-commerce Webpage Full Suite', () => {  
  test.beforeEach(async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
  });  
  
  test('Landing page has start button and products', async ({ page }) => {  
    // Start button visible  
    await expect(page.getByRole('button', { name: /start.*qa hackathon/i })).toBeVisible();  
  
    // Click it and confirm articles present  
    await page.getByRole('button', { name: /start.*qa hackathon/i }).click();  
    await expect(page.getByRole('article', { name: /onigiri/i })).toBeVisible();  
    await expect(page.getByRole('article', { name: /pudding/i })).toBeVisible();  
    await expect(page.getByRole('article', { name: /buritto/i })).toBeVisible();  
  });  
  
  test('Can add, increase, and decrease product quantities', async ({ page }) => {  
    await page.getByRole('button', { name: /start/i }).click();  
  
    // Add Onigiri 3x, Buritto 2x, Pudding 2x  
    const onigiri = page.getByRole('article', { name: /onigiri/i });  
    const buritto = page.getByRole('article', { name: /buritto/i });  
    const pudding = page.getByRole('article', { name: /pudding/i });  
  
    // Add 2 Onigiri (+), then one more with the 3rd "+" if available  
    await onigiri.getByRole('button', { name: '+' }).click();  
    await onigiri.getByRole('button', { name: '+' }).click();  
    // In case there is a third, use nth and fallback if not  
    // (Change as needed based on your UI; codegen shows nth(2) for 3rd click):  
    await onigiri.getByRole('button', { name: '+' }).nth(1).click(); // click 3rd "+"  
  
    // Add 2 Buritto (+)  
    await buritto.getByRole('button', { name: '+' }).click();  
    await buritto.getByRole('button', { name: '+' }).click();  
  
    // Add 2 Pudding  
    await pudding.getByRole('button', { name: '+' }).click();  
    await pudding.getByRole('button', { name: '+' }).click();  
  
    // Quantities should show appropriately in the article text  
    await expect(onigiri).toContainText('-3+');  
    await expect(buritto).toContainText('-2+');  
    await expect(pudding).toContainText('-2+');  
  });  
  
  test('Cart shows correct results and proceeds to checkout', async ({ page }) => {  
    await page.getByRole('button', { name: /start/i }).click();  
  
    // Add 3 Onigiri, 2 Buritto, 2 Pudding (see test above)  
    const onigiri = page.getByRole('article', { name: /onigiri/i });  
    const buritto = page.getByRole('article', { name: /buritto/i });  
    const pudding = page.getByRole('article', { name: /pudding/i });  
  
    await onigiri.getByRole('button', { name: '+' }).click();  
    await onigiri.getByRole('button', { name: '+' }).click();  
    await onigiri.getByRole('button', { name: '+' }).nth(1).click();  
  
    await buritto.getByRole('button', { name: '+' }).click();  
    await buritto.getByRole('button', { name: '+' }).click();  
  
    await pudding.getByRole('button', { name: '+' }).click();  
    await pudding.getByRole('button', { name: '+' }).click();  
  
    // Open cart via shopping cart icon  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
  
    // Cart should show correct products and quantities  
    await expect(page.locator('div').getByText(/^🍙Onigiri \(3\)￥120$/)).toBeVisible();  
    await expect(page.locator('div').getByText(/^🌯Buritto \(2\)￥390$/)).toBeVisible();  
    await expect(page.locator('div').getByText(/^🍮Pudding \(2\)￥150$/)).toBeVisible();  
  
    // Remove 1 Onigiri, 1 Pudding  
    await page.locator('div').filter({ hasText: /^🍙Onigiri \(3\)￥120$/ }).getByRole('button', { name: '-' }).click();  
    await page.locator('div').filter({ hasText: /^🍮Pudding \(2\)￥150$/ }).getByRole('button', { name: '-' }).click();  
  
    // Quantities update after removal (now 2 each)  
    await expect(page.locator('div').getByText(/^🍙Onigiri \(2\)￥120$/)).toBeVisible();  
    await expect(page.locator('div').getByText(/^🍮Pudding \(1\)￥150$/)).toBeVisible();  
  
    // Proceed to checkout  
    await page.getByRole('button', { name: /proceed to checkout/i }).click();  
  
    // You may want to check for checkout confirmation!  
    await expect(page.getByText(/order confirmation|thank you/i)).toBeVisible();  
  });  
  
  test('Edge case: Cart empty disables checkout', async ({ page }) => {  
    await page.getByRole('button', { name: /start/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
  
    const checkoutBtn = page.getByRole('button', { name: /proceed to checkout/i });  
    await expect(checkoutBtn).toBeDisabled();  
  });  
  
  test('Business/contact link is present and clickable', async ({ page }) => {  
    await page.getByRole('button', { name: /start/i }).click();  
    // This appears after checkout, but we'll test as if it's present  
    await page.getByTestId('business-link').click();  
    // Should open target page or show business page/contact info  
    // Optional: await expect(page.getByText(/contact|business/i)).toBeVisible();  
  });  
  
  test('All product images have alt text', async ({ page }) => {  
    await page.getByRole('button', { name: /start/i }).click();  
    const images = page.locator('img');  
    const count = await images.count();  
    for (let i = 0; i < count; ++i) {  
      await expect(images.nth(i)).toHaveAttribute('alt', /.+/);  
    }  
  });  
});  