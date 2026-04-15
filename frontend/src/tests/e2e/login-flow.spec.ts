import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: 'test@example.com',
  password: 'test123',
};

test('TC-01: User can login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', TEST_USER.email);
  await page.fill('#password', TEST_USER.password);
  await page.click('.login-button');
  await expect(page).toHaveURL(/\/pillbox/, { timeout: 10000 });
});

test('TC-02: User can add new medicine', async ({ page }) => {

  await page.goto('/login');
  await page.fill('#email', TEST_USER.email);
  await page.fill('#password', TEST_USER.password);
  await page.click('.login-button');
  await expect(page).toHaveURL(/\/pillbox/, { timeout: 10000 });

  await page.click('.add-medicine-button button');
  await page.waitForURL(/\/addmed/, { timeout: 10000 });

  await page.fill('#name', 'E2E Test Medicine');
  await page.selectOption('#form', 'таблетки');
  await page.fill('#expires', '31.12.2025'); 
  
  await page.click('.confirm-button');

  await page.waitForURL(/\/pillbox/, { timeout: 10000 });
  
  await expect(page.getByText('E2E Test Medicine')).toBeVisible({ timeout: 10000 });
});

test('TC-03: User can filter medicines by name', async ({ page }) => {

  await page.goto('/login');
  await page.fill('#email', TEST_USER.email);
  await page.fill('#password', TEST_USER.password);
  await page.click('.login-button');
  await expect(page).toHaveURL(/\/pillbox/, { timeout: 10000 });

  await page.fill('#search', 'E2E');

  await page.waitForTimeout(1000);
  
  await expect(page.getByText('E2E Test Medicine')).toBeVisible({ timeout: 10000 });
});

test('TC-04: Unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/pillbox');
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
});