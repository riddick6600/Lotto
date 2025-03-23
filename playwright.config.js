// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 120 * 1000, // Увеличиваем таймаут для долгих операций с блокчейном
  expect: {
    timeout: 10000
  },
  fullyParallel: false, // Последовательное выполнение тестов
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1, // Один воркер для избежания конфликтов
  reporter: [['html'], ['line']],
  use: {
    actionTimeout: 15000,
    baseURL: 'http://localhost:5173',
    trace: 'on',
    video: 'on-first-retry',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});