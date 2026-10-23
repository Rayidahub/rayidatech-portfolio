import { test, expect } from '@playwright/test';

test.describe('Public Site End-to-End User Flows', () => {
  test('Home page renders with brand identity, hero, and main sections', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Raymond Gaius|Rayida Tech/i);

    // Verify presence of key sections
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('What We Do')).toBeVisible();
  });

  test('Projects page renders filterable project cards', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveTitle(/Projects/i);

    // Filter pills check
    await expect(page.getByText('All', { exact: true })).toBeVisible();
  });

  test('Blog page renders articles and search functionality', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Blog/i);

    // Search input
    const searchInput = page.getByPlaceholder(/search articles/i);
    await expect(searchInput).toBeVisible();
  });

  test('About page displays skills and bio', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: /About Raymond Gaius/i })).toBeVisible();
  });

  test('Contact page renders inquiry form and WhatsApp action', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByPlaceholder(/your name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/your email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
  });

  test('Admin login page renders security credentials form', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
});

