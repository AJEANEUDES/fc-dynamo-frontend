import { test, expect } from '@playwright/test';

test.describe('Internationalisation RU/EN', () => {
  test('le site se charge en russe par défaut', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: 'Главная' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Клуб' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Команда' })).toBeVisible();
    await expect(page.getByTitle('Язык')).toContainText('RU');
  });

  test('le toggle RU→EN met à jour la navbar en anglais', async ({ page }) => {
    await page.goto('/');

    await page.getByTitle('Язык').click();

    await expect(page.getByTitle('Language')).toContainText('EN');
    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Club' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Team' })).toBeVisible();
  });

  test('la langue persiste après une navigation SPA', async ({ page }) => {
    await page.goto('/');

    await page.getByTitle('Язык').click();
    await expect(page.getByTitle('Language')).toContainText('EN');

    await page.goto('/club');

    await expect(page.getByTitle('Language')).toContainText('EN');
    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: 'Club' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
  });

  test('un nouveau contexte navigateur démarre toujours en russe', async ({ browser }) => {
    const freshCtx = await browser.newContext({ storageState: undefined });
    const freshPage = await freshCtx.newPage();

    await freshPage.goto('/');

    const nav = freshPage.locator('nav');
    await expect(nav.getByRole('link', { name: 'Главная' })).toBeVisible();
    await expect(freshPage.getByTitle('Язык')).toContainText('RU');

    await freshCtx.close();
  });
});
