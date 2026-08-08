const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests/browser',
    timeout: 30_000,
    expect: { timeout: 5_000 },
    use: {
        baseURL: 'http://127.0.0.1:4173',
        trace: 'retain-on-failure'
    },
    webServer: {
        command: 'node tests/static-server.js',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: false
    },
    projects: [
        { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
        { name: 'chromium-mobile', use: { ...devices['Pixel 5'] } },
        { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'] } },
        {
            name: 'firefox-mobile',
            use: { ...devices['Desktop Firefox'], viewport: { width: 390, height: 844 }, hasTouch: true }
        }
    ]
});
