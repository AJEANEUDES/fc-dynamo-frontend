import { test, expect } from '@playwright/test';

test.describe('Boutique — flux achat', () => {
  test('ajout au panier → badge +1 dans la navbar', async ({ page }) => {
    await page.goto('/boutique');

    await expect(page.getByText('Официальный магазин')).toBeVisible();

    const firstProduct = page.locator('a[href^="/boutique/"]').first();
    await firstProduct.waitFor({ state: 'visible', timeout: 10_000 });
    await firstProduct.click();

    await page.waitForURL('**/boutique/**');

    await page.getByRole('button', { name: 'В корзину' }).click();

    const cartBadge = page.getByRole('link', { name: 'Корзина' }).locator('span');
    await expect(cartBadge).toHaveText('1');
  });

  test('panier → checkout → confirmation commande', async ({ page }) => {
    await page.goto('/connexion');
    await page.getByLabel('Электронная почта').fill('ivan@example.ru');
    await page.getByLabel('Пароль').fill('Member1234!');
    await page.getByRole('button', { name: 'Войти' }).click();
    await page.waitForURL('**/mon-espace', { timeout: 10_000 });

    await page.goto('/boutique');
    const firstProduct = page.locator('a[href^="/boutique/"]').first();
    await firstProduct.waitFor({ state: 'visible', timeout: 10_000 });
    await firstProduct.click();
    await page.waitForURL('**/boutique/**');
    await page.getByRole('button', { name: 'В корзину' }).click();

    await page.goto('/panier');
    await expect(page.getByText('Корзина')).toBeVisible();

    await page.getByRole('link', { name: 'Оформить заказ' }).click();
    await page.waitForURL('**/commande', { timeout: 8_000 });

    await expect(page.getByText('Оформление заказа')).toBeVisible();

    const textInputs = page.locator('form input[type="text"]');
    await textInputs.nth(0).fill('Иван Петров');
    await textInputs.nth(1).fill('ул. Пушкина 1');
    await textInputs.nth(2).fill('Москва');
    await textInputs.nth(3).fill('101000');
    await textInputs.nth(4).fill('Россия');

    await page.getByRole('button', { name: 'Подтвердить заказ' }).click();

    await page.waitForURL('**/commande-confirmee', { timeout: 12_000 });
    await expect(page.getByText('Заказ оформлен!')).toBeVisible();
    await expect(page.getByText('Спасибо за покупку в FC Dynamo City')).toBeVisible();
  });
});
