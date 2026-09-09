import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', outputDir: './artifacts/test-results', workers: 1, reporter: 'list',
  testMatch: '**/*.spec.ts',
  forbidOnly: Boolean(process.env.CI),
  use: { trace: 'retain-on-failure' },
  projects: [18, 19].flatMap(version => (['chromium', 'firefox', 'webkit'] as const).map(browserName => ({
    name: `react${version}-${browserName}`,
    metadata: { react: version === 18 ? '18.3.1' : '19.1.1' },
    use: {
      browserName,
      baseURL: `http://127.0.0.1:${version === 18 ? 5218 : 5219}`,
      launchOptions: browserName === 'chromium' && process.env.DEMO_CHROMIUM ? { executablePath: process.env.DEMO_CHROMIUM } : {},
    },
  }))),
  webServer: [18, 19].map(version => ({
    command: `node node_modules/vite/bin/vite.js preview artifacts/react${version} --host 127.0.0.1 --port ${version === 18 ? 5218 : 5219} --strictPort`,
    url: `http://127.0.0.1:${version === 18 ? 5218 : 5219}`, reuseExistingServer: false,
  })),
});
