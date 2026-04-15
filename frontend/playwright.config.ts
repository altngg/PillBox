import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true, 
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});