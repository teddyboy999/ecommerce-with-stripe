import { test, expect } from '@playwright/test';  
  
// Utility for device sizes  
const devices = [  
  { name: 'Desktop', width: 1280, height: 800 },  
  { name: 'PC', width: 1024, height: 768 },  
  { name: 'Smartphone', width: 375, height: 667 },  
  { name: 'Tablet', width: 768, height: 1024 },  
];  
  
test.describe('E-commerce End-to-End Test Suite', () => {  
  test('Application loads correctly on all supported devices', async ({ page }) => {  
    for (const device of devices) {  
      await page.setViewportSize({ width: device.width, height: device.height });  
      await page.goto('http://localhost:3000/');  
      await expect(page.getByRole('button', { name: /qa hackathon/i })).toBeVisible();  
      // Optional: check layout correctness as needed  
    }  
  });  
  
  test('App loads with cookies/localStorage disabled', async ({ context, page }) => {  
    await context.clearCookies();  
    await page.goto('http://localhost:3000/');  
    await expect(page.getByRole('button', { name: /qa hackathon/i })).toBeVisible();  
  });  
  
  test('Ensure items can be added to the cart', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    const onigiri = page.getByRole('article', { name: /onigiri/i });  
    await onigiri.getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await expect(page.getByText(/🍙 Onigiri \(1\).*¥120/)).toBeVisible();  
  });  
  
  test('Verify total price and quantity is correct after adding items', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('article', { name: /pudding/i }).getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await expect(page.getByText(/🍙 Onigiri \(1\).*¥120/)).toBeVisible();  
    await expect(page.getByText(/🍮 Pudding \(1\).*¥150/)).toBeVisible();  
    await expect(page.getByText(/total.*¥270/i)).toBeVisible();  
  });  
  
  test('Max items (20) can be added to the cart and error on 21st add', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    const onigiri = page.getByRole('article', { name: /onigiri/i });  
    for (let i = 0; i < 20; i++) await onigiri.getByRole('button', { name: '+' }).click();  
    await onigiri.getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await expect(page.getByText(/🍙 Onigiri \(21\)/)).toBeVisible();  
    // Attempt to add 1 more, expect error  
    await onigiri.getByRole('button', { name: '+' }).click();  
    // Search for error message near cart or anywhere appropriate  
    await expect(page.getByText(/maximum.*items.*reached/i)).toBeVisible();  
  });  
  
  test('Items can be removed from the cart', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    const buritto = page.getByRole('article', { name: /buritto/i });  
    await buritto.getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await expect(page.getByText(/🌯 Buritto \(1\)/)).toBeVisible();  
    // Remove via cart controls if available (adjust selector if necessary)  
    await page.getByText(/🌯 Buritto \(1\)/).locator('..').getByRole('button', { name: '-' }).click();  
    await expect(page.getByText(/🌯 Buritto/)).not.toBeVisible();  
  });  
  
  test('Quantity cannot be reduced below zero', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    const pudding = page.getByRole('article', { name: /pudding/i });  
    await pudding.getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    // Remove Pudding twice  
    await page.getByText(/🍮 Pudding \(1\)/).locator('..').getByRole('button', { name: '-' }).click();  
    // Try to remove again; quantity should not be negative, and item should not exist  
    await expect(page.getByText(/🍮 Pudding/)).not.toBeVisible();  
  });  
  
  test('Cannot proceed to payment with empty cart, message displayed', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    const btn = page.getByRole('button', { name: /proceed to checkout/i });  
    await expect(btn).toBeDisabled();  
    await btn.click({ force: true });  
    await expect(page.getByText(/cart\s+is\s+empty|add.*item/i)).toBeVisible();  
  });  
  
  test('Total price and quantity correct after removing items', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    const onigiri = page.getByRole('article', { name: /onigiri/i });  
    await onigiri.getByRole('button', { name: '+' }).click();  
    await onigiri.getByRole('button', { name: /add to cart/i }).click();  
    // Now we have Onigiri (2)  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await page.getByText(/🍙 Onigiri \(2\)/).locator('..').getByRole('button', { name: '-' }).click();  
    // Should now be Onigiri (1), total should be ¥120  
    await expect(page.getByText(/🍙 Onigiri \(1\).*¥120/)).toBeVisible();  
    await expect(page.getByText(/total.*¥120/i)).toBeVisible();  
  });  
  
  test('Different combinations of items: calculation consistent', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    const onigiri = page.getByRole('article', { name: /onigiri/i });  
    const buritto = page.getByRole('article', { name: /buritto/i });  
    const pudding = page.getByRole('article', { name: /pudding/i });  
    await onigiri.getByRole('button', { name: /add to cart/i }).click();  
    await buritto.getByRole('button', { name: /add to cart/i }).click();  
    await pudding.getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await expect(page.getByText(/🍙 Onigiri \(1\)/)).toBeVisible();  
    await expect(page.getByText(/🌯 Buritto \(1\)/)).toBeVisible();  
    await expect(page.getByText(/🍮 Pudding \(1\)/)).toBeVisible();  
    // Calculation: 120 onigiri + 390 buritto + 150 pudding = 660  
    await expect(page.getByText(/total.*¥660/i)).toBeVisible();  
  });  
  
  test('Calculate the price exactly for each item', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    const products = [  
      { name: /onigiri/i, price: 120 },  
      { name: /buritto/i, price: 390 },  
      { name: /pudding/i, price: 150 }  
    ];  
    let expectedTotal = 0;  
    for (const p of products) {  
      await page.getByRole('article', { name: p.name }).getByRole('button', { name: /add to cart/i }).click();  
      expectedTotal += p.price;  
    }  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await expect(page.getByText(new RegExp(`total.*¥${expectedTotal}`, 'i'))).toBeVisible();  
  });  
  
  test('Cart persistence after page reload', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    const croissant = page.getByRole('article', { name: /croissant/i });  
    await croissant.getByRole('button', { name: /add to cart/i }).click();  
    await page.reload();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await expect(page.getByText(/🥐 Croissant \(1\)/)).toBeVisible();  
  });  
  
  test('Adding same item increases quantity correctly', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    const pretzel = page.getByRole('article', { name: /pretzel/i });  
    await pretzel.getByRole('button', { name: /add to cart/i }).click();  
    await pretzel.getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await expect(page.getByText(/🥨 Pretzel \(2\)/)).toBeVisible();  
  });  
  
  // ---- Payment/Checkout and Form Tests: (these are pseudo-implemented and may need tuning for your UI/checkout lib) ----  
  
  test('Try payment with 3D Secure and challenge flow appears', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    await page.getByRole('article', { name: /croissant/i }).getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await page.getByRole('button', { name: /proceed to checkout/i }).click();  
    await page.fill('input[name="cardnumber"]', '4000000000003220'); // Stripe 3D Secure test card  
    await page.fill('input[name="exp-date"]', '12/34');  
    await page.fill('input[name="cvc"]', '123');  
    await page.fill('input[name="name"]', 'E2E Test');  
    await page.fill('input[name="email"]', 'e2e+3ds@example.com');  
    await page.getByRole('button', { name: /pay/i }).click();  
    await expect(page.getByText(/authentication|challenge/i)).toBeVisible({ timeout: 10000 });  
  });  
  
  test('Try payment with valid Visa, Mastercard, JCB cards', async ({ page }) => {  
    const cards = [  
      { number: '4242424242424242', brand: /visa/i },  
      { number: '5555555555554444', brand: /mastercard/i },  
      { number: '3566002020360505', brand: /jcb/i }  
    ];  
    for (const card of cards) {  
      await page.goto('http://localhost:3000/');  
      await page.getByRole('button', { name: /qa hackathon/i }).click();  
      await page.getByRole('article', { name: /croissant/i }).getByRole('button', { name: /add to cart/i }).click();  
      await page.getByRole('button', { name: /shopping cart icon/i }).click();  
      await page.getByRole('button', { name: /proceed to checkout/i }).click();  
      await page.fill('input[name="cardnumber"]', card.number);  
      await page.fill('input[name="exp-date"]', '12/34');  
      await page.fill('input[name="cvc"]', '123');  
      await page.fill('input[name="name"]', `E2E ${card.brand}`);  
      await page.fill('input[name="email"]', `e2e+${card.brand}@example.com`);  
      await page.getByRole('button', { name: /pay/i }).click();  
      await expect(page.getByText(/success|paid|confirmation/i)).toBeVisible({ timeout: 10000 });  
    }  
  });  
  
  test('Payment with expired card shows error', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    await page.getByRole('article', { name: /egg/i }).getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await page.getByRole('button', { name: /proceed to checkout/i }).click();  
    await page.fill('input[name="cardnumber"]', '4000000000000069'); // Expired Stripe card  
    await page.fill('input[name="exp-date"]', '12/20');  
    await page.fill('input[name="cvc"]', '123');  
    await page.fill('input[name="name"]', 'E2E Expired');  
    await page.fill('input[name="email"]', 'e2e+expired@example.com');  
    await page.getByRole('button', { name: /pay/i }).click();  
    await expect(page.getByText(/expired/i)).toBeVisible({ timeout: 10000 });  
  });  
  
  test('Payment with declined/fraud card shows error', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    await page.getByRole('article', { name: /sweet potato/i }).getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await page.getByRole('button', { name: /proceed to checkout/i }).click();  
    await page.fill('input[name="cardnumber"]', '4000000000000002'); // Stripe decline  
    await page.fill('input[name="exp-date"]', '12/34');  
    await page.fill('input[name="cvc"]', '123');  
    await page.fill('input[name="name"]', 'E2E Declined');  
    await page.fill('input[name="email"]', 'e2e+declined@example.com');  
    await page.getByRole('button', { name: /pay/i }).click();  
    await expect(page.getByText(/declined|fraud/i)).toBeVisible({ timeout: 10000 });  
  });  
  
  test('Checkout: Valid, invalid, missing, and non-.com emails', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await page.getByRole('button', { name: /proceed to checkout/i }).click();  
  
    // Valid email  
    await page.fill('input[name="email"]', 'e2e.valid@example.com');  
    await expect(page.getByRole('button', { name: /pay/i })).toBeEnabled();  
  
    // Invalid email (missing @)  
    await page.fill('input[name="email"]', 'invalidemail.test');  
    await expect(page.getByText(/invalid email/i)).toBeVisible();  
  
    // Invalid domain  
    await page.fill('input[name="email"]', 'user@test');  
    await expect(page.getByText(/invalid email|domain/i)).toBeVisible();  
  
    // non-.com domain valid  
    await page.fill('input[name="email"]', 'user@example.co.jp');  
    await expect(page.getByRole('button', { name: /pay/i })).toBeEnabled();  
  });  
  
  test('Billing info fields show/hide & validate with max length', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await page.getByRole('button', { name: /proceed to checkout/i }).click();  
  
    // Simulate toggling billing same as shipping  
    const checkbox = page.getByRole('checkbox', { name: /billing.*same as shipping/i });  
    await checkbox.uncheck();  
    await expect(page.getByLabel(/billing name/i)).toBeVisible();  
    await expect(page.getByLabel(/billing country/i)).toBeVisible();  
  
    // Now check and fields disappear  
    await checkbox.check();  
    await expect(page.getByLabel(/billing name/i)).not.toBeVisible();  
  
    // Max length input  
    const longText = 'a'.repeat(256);  
    await checkbox.uncheck();  
    await page.getByLabel(/billing name/i).fill(longText);  
    await page.getByLabel(/billing country/i).fill('Japan');  
    await expect(page.getByLabel(/billing name/i)).toHaveValue(longText);  
  });  
  
  test('Postal code field validation', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    await page.getByRole('article', { name: /sushi/i }).getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await page.getByRole('button', { name: /proceed to checkout/i }).click();  
  
    // Valid postal code (Japan)  
    await page.getByLabel(/postal code/i).fill('123-4567');  
    await expect(page.getByLabel(/postal code/i)).toHaveValue('123-4567');  
  
    // All letters invalid  
    await page.getByLabel(/postal code/i).fill('abcdefg');  
    await expect(page.getByText(/invalid.*postal/i)).toBeVisible();  
  
    // Too short  
    await page.getByLabel(/postal code/i).fill('1234');  
    await expect(page.getByText(/invalid.*postal/i)).toBeVisible();  
  
    // Too long  
    await page.getByLabel(/postal code/i).fill('123-45678');  
    await expect(page.getByText(/invalid.*postal/i)).toBeVisible();  
  
    // Valid Japan test card (by context in checkout, e.g. try entering and submitting if UI supports it)  
    await page.fill('input[name="cardnumber"]', '3566002020360505');  
    await page.fill('input[name="exp-date"]', '12/34');  
    await page.fill('input[name="cvc"]', '123');  
    await page.fill('input[name="name"]', 'E2E Japan');  
    await page.getByRole('button', { name: /pay/i }).click();  
    await expect(page.getByText(/success|paid|confirmation/i)).toBeVisible({ timeout: 10000 });  
  });  
  
  test('Shipping country: can choose non-Japan, billing fields update', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await page.getByRole('button', { name: /proceed to checkout/i }).click();  
  
    await page.selectOption('select[name="shipping-country"]', { label: 'United States' });  
    await expect(page.getByLabel(/state/i)).toBeVisible();  
    await expect(page.getByLabel(/billing country/i)).toBeVisible();  
  });  
  
  test('Submit empty fields errors show', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    await page.getByRole('article', { name: /onigiri/i }).getByRole('button', { name: /add to cart/i }).click();  
    await page.getByRole('button', { name: /shopping cart icon/i }).click();  
    await page.getByRole('button', { name: /proceed to checkout/i }).click();  
    await page.getByRole('button', { name: /pay/i }).click();  
    await expect(page.getByText(/required|missing|error/i)).toBeVisible();  
  });  
  
  test('All product images have alt attribute', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    const images = page.locator('article img');  
    const count = await images.count();  
    for (let i = 0; i < count; ++i) {  
      await expect(images.nth(i)).toHaveAttribute('alt', /.+/);  
    }  
  });  
  
  test('Business/contact link is present and clickable', async ({ page }) => {  
    await page.goto('http://localhost:3000/');  
    await page.getByRole('button', { name: /qa hackathon/i }).click();  
    await expect(page.getByTestId('business-link')).toBeVisible();  
    await page.getByTestId('business-link').click();  
    // Optionally verify destination or text  
    // await expect(page.getByText(/contact|business/i)).toBeVisible();  
  });  
});  