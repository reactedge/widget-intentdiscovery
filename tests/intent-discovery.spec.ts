import { test, expect } from '@playwright/test';

test.describe('Intent Discovery Widget', () => {

    let widget;

    test.beforeEach(async ({ page }) => {
        await page.goto('/tops-men.html?re-debug=intentdiscovery');

        widget = page.locator('intentdiscovery-widget');

        await expect(widget).toBeVisible();
    });

    test('Title is visible', async () => {

        const title = widget.getByRole('heading', {
            name: 'May I ask why you came here to shop?'
        });

        await expect(title).toBeVisible();
    });

    test('Step finder cards are partially rendered', async () => {

        const subtitle = widget.locator('label.intent-subtitle', {
            hasText: "Describe what you're looking for"
        });

        await expect(subtitle).toBeVisible();

        const cards = widget.locator('[data-intent-card]');

        await expect(cards).toHaveCount(3);
    });

    test('Step finder cards toggle works', async () => {

        const toggle = widget.locator('.choice-tile--view-all');

        await expect(toggle).toHaveText('View all');

        await toggle.click();

        await expect(toggle).toHaveText('Show less');

        const options = widget.locator('[data-intent-option]');

        await expect(options).not.toBeVisible();
    });

    test('Step finder cards are all shown when view all is clicked', async () => {

        const toggle = widget.locator('.choice-tile--view-all');

        await toggle.click();

        const cards = widget.locator('[data-intent-card]');

        await expect(cards).toHaveCount(6);
    });

    test('Clicking a card reveals its options', async () => {

        const weatherCard = widget.locator('[data-intent-card="climate"]');
        const coldOption = widget.locator('[data-intent-option="Cold"]');

        // option should not be visible initially
        await expect(coldOption).toBeHidden();

        await weatherCard.click();

        // option should now appear
        await expect(coldOption).toBeVisible();

    });

    test('Selecting an option activates option and card', async () => {

        const weatherCard = widget.locator('[data-intent-card="climate"]');
        const coldOption = widget.locator('[data-intent-option="Cold"]');

        await weatherCard.click();

        await expect(coldOption).toHaveAttribute('data-intent-selected', 'false');
        await coldOption.click();

        await weatherCard.click();
        await expect(coldOption).toHaveAttribute('data-intent-selected', 'true');
        await expect(weatherCard).toHaveAttribute('data-intent-active', 'true');
    });

    test('AI evaluation is Ready when Product Matches count is low', async ({ page }) => {

        const suggestButton = widget.getByRole('button', { name: 'Suggest' });
        await expect(suggestButton).toBeDisabled();

        const weatherCard = widget.locator('[data-intent-card="climate"]');
        const coldOption = widget.locator('[data-intent-option="Spring"]');

        await weatherCard.click();
        await coldOption.click();

        await expect(
            widget.getByText('Ready to suggest')
        ).toBeVisible();

        await expect(suggestButton).toBeEnabled();
        await suggestButton.click();

        const loader = widget.getByRole('status', { name: 'Loading' });
        await expect(loader).toBeVisible();

        await page.waitForTimeout(3000);

        const successBanner = widget.locator('[data-state="success"]');
        await expect(successBanner).toBeVisible();

        const recommendationCard = widget.locator('[data-role="recommendation"]');
        await expect(recommendationCard).toBeVisible();
    });

    test('AI Readiness changes when intent is interpreted', async ({ page }) => {
        const warningBanner = widget.locator('[data-state="warning"]');
        await expect(warningBanner).toBeVisible();

        const suggestButton = widget.getByRole('button', { name: 'Suggest' });
        await expect(suggestButton).toBeDisabled();

        const input = page.getByRole('textbox');

        // become not ready if intent text length is too small
        await input.fill('blue running jacket');
        const readinessContainer = widget.locator('[data-readiness-hint]')
        await expect(readinessContainer).toContainText('Add 11+ characters or refine your preferences');

        await input.fill('blue running jacket in cold weather');
        await expect(readinessContainer).toContainText('AI ready to interpret your request');

        await expect(suggestButton).toBeEnabled();

        // become not ready if intent text length is too small again
        await input.fill('blue running jacket');
        await expect(readinessContainer).toContainText('Add 11+ characters or refine your preferences');

        await expect(suggestButton).toBeDisabled();
    });
});