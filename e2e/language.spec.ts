import { test, expect } from '@playwright/test';

test.describe('Internationalisation RU/EN', () => {
  test('le site se charge en russe par défaut', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Главная')).toBeVisible();
    await expect(page.getByText('Клуб')).toBeVisible();
    await expect(page.getByText('Команда')).toBeVisible();
    await expect(page.getByTitle('Язык')).toContainText('RU');
  });

  test('le toggle RU→EN met à jour la navbar en anglais', async ({ page }) => {
    await page.goto('/');

    await page.getByTitle('Язык').click();

    await expect(page.getByTitle('Language')).toContainText('EN');
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('Club')).toBeVisible();
    await expect(page.getByText('Team')).toBeVisible();
  });

  test('la langue persiste après une navigation SPA', async ({ page }) => {
    await page.goto('/');

    await page.getByTitle('Язык').click();
    await expect(page.getByTitle('Language')).toContainText('EN');

    await page.goto('/club');

    await expect(page.getByTitle('Language')).toContainText('EN');
    await expect(page.getByText('Club')).toBeVisible();
    await expect(page.getByText('Home')).toBeVisible();
  });

  test('un nouveau contexte navigateur démarre toujours en russe', async ({ browser }) => {
    const freshCtx = await browser.newContext({ storageState: undefined });
    const freshPage = await freshCtx.newPage();

    await freshPage.goto('/');

    await expect(freshPage.getByText('Главная')).toBeVisible();
    await expect(freshPage.getByTitle('Язык')).toContainText('RU');

    await freshCtx.close();
  });
});
