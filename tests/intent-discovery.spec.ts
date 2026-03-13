import { test, expect } from '@playwright/test';

test.describe('Intent Discovery Widget', () => {

    let widget;

    test.beforeEach(async ({ page }) => {
        await page.goto('/tops-men.html?re-debug=intentdiscovery');

        widget = page.locator('intentdiscovery-widget');

        await expect(widget).toBeVisible();
    });

    test('title is visible', async () => {

        const title = widget.getByRole('heading', {
            name: 'May I ask why you came here to shop?'
        });

        await expect(title).toBeVisible();
    });

    test('step finder cards are partially rendered', async () => {

        const subtitle = widget.locator('label.intent-subtitle', {
            hasText: "Describe what you're looking for"
        });

        await expect(subtitle).toBeVisible();

        const cards = widget.locator('[data-intent-card]');

        await expect(cards).toHaveCount(3);
    });

    test('step finder cards toggle works', async () => {

        const toggle = widget.locator('.choice-tile--view-all');

        await expect(toggle).toHaveText('View all');

        await toggle.click();

        await expect(toggle).toHaveText('Show less');

        const options = widget.locator('[data-intent-option]');

        await expect(options).not.toBeVisible();
    });

    test('step finder cards are all shown when view all is clicked', async () => {

        const toggle = widget.locator('.choice-tile--view-all');

        await toggle.click();

        const cards = widget.locator('[data-intent-card]');

        await expect(cards).toHaveCount(6);
    });

    test('clicking a card reveals its options', async () => {

        const weatherCard = widget.locator('[data-intent-card="climate"]');
        const coldOption = widget.locator('[data-intent-option="Cold"]');

        // option should not be visible initially
        await expect(coldOption).toBeHidden();

        await weatherCard.click();

        // option should now appear
        await expect(coldOption).toBeVisible();

    });

    test('selecting an option activates option and card', async () => {

        const weatherCard = widget.locator('[data-intent-card="climate"]');
        const coldOption = widget.locator('[data-intent-option="Cold"]');

        await weatherCard.click();

        await coldOption.click();

        await expect(coldOption).toHaveAttribute('data-intent-selected', 'true');

        await expect(weatherCard).toHaveAttribute('data-intent-active', 'true');
    });

    test('AI evaluation is triggered when option count is low', async () => {

        const weatherCard = widget.locator('[data-intent-card="climate"]');
        const coldOption = widget.locator('[data-intent-option="Spring"]');

        await weatherCard.click();
        await coldOption.click();

        await expect(
            widget.getByText('Evaluating your preferences')
        ).toBeVisible();

        // await widget.locator('[data-intent-card="color"]').click();
        // await expect(widget.locator('[data-intent-card="color"]'))
        //     .toHaveAttribute('data-intent-active', 'true');
    });
});