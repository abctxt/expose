import {defineConfig} from '@playwright/test';
import {load} from 'js-toml';
import fs from 'fs';
import path from 'path';

interface Frontend {
    Url: string
}

interface E2eToml {
    Frontend: Frontend
}

// Dev config file must be created manually first
const cfgPath = path.resolve(import.meta.dirname, '../../config/e2e.toml');
const tomlCfg = load(fs.readFileSync(cfgPath, 'utf-8')) as unknown as E2eToml;
const frontendUrl = tomlCfg.Frontend.Url;

export default defineConfig({
    testDir: '.',
    use: {
        baseURL: frontendUrl,
        ignoreHTTPSErrors: false,
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'npm start',
        cwd: '../../src/expose-frontend',
        url: frontendUrl,
        reuseExistingServer: !process.env.CI,
        ignoreHTTPSErrors: true,
    },
});
