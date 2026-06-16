import { test, expect } from '@playwright/test';

const UNIQUE_EMAIL = `e2e.${Date.now()}@fcdynamo.ru`;
const TEST_PASS = 'TestPass1234!';

test.describe('Authentification', () => {
  test('inscription réussie redirige vers confirmation en russe', async ({ page }) => {
    await page.goto('/inscription');

    await expect(page.getByRole('heading', { name: 'Регистрация', level: 1 })).toBeVisible();

    await page.getByLabel('Имя').fill('Тест');
    await page.getByLabel('Фамилия').fill('Пользователь');
    await page.getByLabel('Электронная почта').fill(UNIQUE_EMAIL);
    await page.getByLabel('Дата рождения').fill('2000-01-15');
    await page.getByLabel('Пароль', { exact: true }).fill(TEST_PASS);
    await page.getByLabel('Подтвердите пароль').fill(TEST_PASS);

    await page.getByRole('button', { name: 'Создать аккаунт' }).click();

    await page.waitForURL('**/confirmation', { timeout: 10_000 });
    await expect(page.getByText('Добро пожаловать в ФК Динамо Сити!')).toBeVisible();
    await expect(page.getByText('Ваш аккаунт успешно создан.')).toBeVisible();
  });

  test('connexion valide redirige vers /mon-espace', async ({ page }) => {
    await page.goto('/connexion');

    await expect(page.getByRole('heading', { name: 'Вход в аккаунт', level: 1 })).toBeVisible();

    await page.getByLabel('Электронная почта').fill('ivan@example.ru');
    await page.getByLabel('Пароль').fill('Member1234!');
    await page.getByRole('button', { name: 'Войти' }).click();

    await page.waitForURL('**/mon-espace', { timeout: 10_000 });
    await expect(page).toHaveURL(/mon-espace/);
  });

  test('erreur de connexion affiche le message russe', async ({ page }) => {
    await page.goto('/connexion');

    await page.getByLabel('Электронная почта').fill('mauvais@email.ru');
    await page.getByLabel('Пароль').fill('mauvaismdp123');
    await page.getByRole('button', { name: 'Войти' }).click();

    await expect(
      page.getByText('Неверный email или пароль. Попробуйте снова.')
    ).toBeVisible({ timeout: 8_000 });

    await expect(page).toHaveURL(/connexion/);
  });
});
