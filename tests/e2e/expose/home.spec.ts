import {expect, test} from '@playwright/test';

test('home page opens', async ({page}) => {
    const response = await page.goto('/');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle('Expose');
});

test('etf holdings page opens', async ({page}) => {
    const response = await page.goto('/etf-holdings');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle('Expose');
});

test('setup page opens', async ({page}) => {
    const response = await page.goto('/setup');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle('Expose');
});

test('network page opens', async ({page}) => {
    const response = await page.goto('/network');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle('Expose');
});

test('about page opens', async ({page}) => {
    const response = await page.goto('/about');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle('Expose');
});
