const { test, expect } = require('@playwright/test');

test('generates boundary lengths, announces validation, and copies by keyboard', async ({ page, context, browserName }) => {
    const consoleErrors = [];
    page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
    });
    await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({
        status: 200,
        contentType: 'text/css',
        body: ''
    }));

    if (browserName === 'chromium') {
        await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4173' });
    }
    await page.goto('/');

    const length = page.locator('#length');
    const output = page.locator('#passwordOutput');
    const error = page.locator('#passwordError');
    const generate = page.locator('#generatePasswordBtn');
    const copy = page.locator('#copyPasswordBtn');
    const toast = page.locator('#toast');

    await expect(output).toHaveValue(/^[\s\S]{16}$/);
    await expect(error).toBeHidden();

    await length.fill('8');
    await generate.focus();
    await page.keyboard.press('Enter');
    await expect(output).toHaveValue(/^[\s\S]{8}$/);

    await length.fill('128');
    await generate.click();
    await expect(output).toHaveValue(/^[\s\S]{128}$/);

    await length.fill('');
    await generate.click();
    await expect(output).toHaveValue('');
    await expect(error).toBeVisible();
    await expect(error).toHaveAttribute('role', 'alert');
    await expect(error).toContainText('between 8 and 128');

    await length.fill('129');
    await generate.click();
    await expect(output).toHaveValue('');
    await expect(error).toBeVisible();

    await length.fill('16');
    await page.locator('#uppercase').uncheck();
    await page.locator('#lowercase').uncheck();
    await page.locator('#numbers').uncheck();
    await page.locator('#symbols').uncheck();
    await generate.click();
    await expect(output).toHaveValue('');
    await expect(error).toContainText('Select at least one character type');

    await page.locator('#uppercase').check();
    await generate.click();
    await expect(output).toHaveValue(/^[A-Z]{16}$/);

    await copy.focus();
    await page.keyboard.press('Enter');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveText('Copied to clipboard');
    if (browserName === 'chromium') {
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toHaveLength(16);
    }

    expect(consoleErrors).toEqual([]);
});
