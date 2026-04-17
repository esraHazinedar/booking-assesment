import { Page, expect } from "@playwright/test";

export class BookingPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    basePrices = {
        "4-yard": 120,
        "6-yard": 150,
        "8-yard": 180,
        "10-yard": 210,
        "12-yard": 240,
        "14-yard": 270,
        "16-yard": 300,
        "20-yard": 350,
    };


    async postalCodeVerification(postalCode: string) {

        await expect(this.page.getByRole('heading', { name: 'Postcode' })).toBeVisible()
        const postcodeInputBox = this.page.getByPlaceholder('Enter postcode');
        const searchButton = this.page.getByRole("button", { name: 'Search' })
        await expect(postcodeInputBox).toBeVisible()
        await expect(postcodeInputBox).toBeEnabled()
        await postcodeInputBox.click()
        await postcodeInputBox.fill(postalCode);
        await expect(searchButton).toBeVisible()
        await expect(searchButton).toBeEnabled()
        await searchButton.click()

    }

    async selectAddressByText(address: string) {

        const addressList = this.page.locator('.address-card');
        await expect(addressList.first()).toBeVisible();
        await this.page.locator('.address-card', { hasText: address }).click();
        const count = await addressList.count();
        expect(count).toBeGreaterThan(0);

    }



    async getFirstAddressAndSelect() {

        const addressList = this.page.locator('.address-card');

        await expect(addressList.first()).toBeVisible();

        const count = await addressList.count();
        expect(count).toBeGreaterThan(0);

        const firstAddress = addressList.first();

        const selectedText = (await firstAddress.innerText()).trim();

        await firstAddress.click();

        return selectedText;
    }


    /**
     * 
     * @param type : Select the waste type as : General, Heavy or Plasterboard
     */
        async selectWasteType(type: 'General' | 'Heavy' | 'Plasterboard') {
        await expect(this.page.getByRole('heading', { name: 'Waste Type' })).toBeVisible()
        const wasteButton = this.page.getByRole('button', { name: type });
        await expect(wasteButton).toBeVisible()
        await expect(wasteButton).toBeEnabled()
        await wasteButton.click()


    }


    async selectSkip(skipSize: string) {
        await expect(this.page.getByRole('heading', { name: 'Skips' })).toBeVisible()
        const skips = this.page.locator('.skip-box');

        await expect(skips.first()).toBeVisible();

        const count = await skips.count();
        expect(count).toBeGreaterThanOrEqual(8)
        for (let i = 0; i < count; i++) {
            await expect(skips.nth(i)).not.toHaveText('');
        }
        const skipSizeBox = this.page.getByText(skipSize, { exact: true })
        await expect(skipSizeBox).toBeEnabled()
        await this.page.getByText(skipSize, { exact: true }).click();
        const selectedSkip = this.page.locator('.skip-box.selected');
        expect(await selectedSkip.count()).toBe(1)


    }


    async getSelectedSkipPrice() {
        const selected = this.page.locator('.skip-box.selected');
        const text = await selected.innerText();

        const match = text.match(/£\s?\d+(?:\.\d{1,2})?/);
        if (!match) {
            throw new Error(`No price found in selected skip: ${text}`);
        }

        return match[0].replace('£', '').trim();
    }

    /**
     * 
     * @param address : expectedAddress
     * @param postcode : expectedpostcode
     * @param skip :expectedskip
     * @param price :expectedprice
     * @param waste :expectedwaste
     * @param plasterOption : if selected expected plasterOption
     */

    async verifyReviewSummary(address: string,
        postcode: string,
        skip: string,
        price: string,
        waste: string,
        plasterOption?: string
    ) {

        const items = await this.page.locator('.review-box p').allInnerTexts();

        // Core assertions (strict + readable)
        expect(items).toContain(`Postcode: ${postcode}`);
        expect(items).toContain(`Address: ${address}`);
        expect(items).toContain(`Waste: ${waste}`);
        expect(items).toContain(`Skip: ${skip}`);
        expect(items).toContain(`Price: £${price}`);

        // Plaster rule
        if (waste === "Plasterboard") {
            expect(items).toContain(`Plaster Option: ${plasterOption}`);
        } else {
            expect(items.some(i => i.includes('Plaster Option:'))).toBe(false);
        }
    }


    async confirmBookingAndAcceptAlert() {


        const confirmBookingButton = this.page.getByRole('button', { name: 'Confirm Booking' });
        await expect(confirmBookingButton).toBeVisible()
        await expect(confirmBookingButton).toBeEnabled()
        const dialogPromise = this.page.waitForEvent('dialog');

        let dialogHandled = false;

        this.page.once('dialog', async (dialog) => {
            expect(dialog.message()).toContain('Booking Confirmed!');

            await dialog.accept();
            dialogHandled = true;
        });

        await confirmBookingButton.click({ force: true });

        const dialog = await dialogPromise;

        expect(dialog.message()).toContain('Booking Confirmed!');
        expect(dialog.message()).toMatch(/ID: BK-\d+/);

        await expect(confirmBookingButton).toBeDisabled()


    }




    async confirmBookingFailure() {

        const confirmBookingButton = this.page.getByRole('button', { name: 'Confirm Booking' });
        await expect(confirmBookingButton).toBeVisible()
        await expect(confirmBookingButton).toBeEnabled()
        const dialogPromise = this.page.waitForEvent('dialog');

        let dialogHandled = false;

        this.page.once('dialog', async (dialog) => {
            expect(dialog.message()).toBe('Please complete all steps');
            await dialog.accept();
            dialogHandled = true;
        });

        await confirmBookingButton.click({ force: true });

        // wait until dialog is actually handled
        const dialog = await dialogPromise;

        expect(dialog.message()).toBe('Please complete all steps');

        await expect(confirmBookingButton).toBeEnabled()

    }







    async getSkipPrices(): Promise<
        { size: string; price: number }[]
    > {
        const boxes = await this.page.locator('.skip-box').all();
        const result: { size: string; price: number }[] = [];
        for (const box of boxes) {
            const text = await box.innerText();

            const sizeMatch = text.match(/(\d+-yard)/);
            const priceMatch = text.match(/£\s?(\d+)/);

            if (!sizeMatch || !priceMatch) {
                throw new Error(`Invalid skip box: ${text}`);
            }

            result.push({
                size: sizeMatch[1],
                price: parseInt(priceMatch[1]),
            });
        }

        return result;
    }





    async selectPlaster(option: string) {
        await this.page.getByRole('button', { name: option }).click();
    }

    getIncrease(option: string): number {
        if (option === "Medium") return 10;
        if (option === "Large") return 20;
        return 0;
    }

    async verifyReviewSummaryState(expected: {
        postcode?: string;
        address?: string;
        waste: string;
        skip: string;
        price: string;
        plasterOption?: string;
    }) {

        const items = await this.page.locator('.review-box p').allInnerTexts();

        const expectedItems: string[] = [];

        // Postcode (optional per UI behavior)
        if (expected.postcode !== undefined) {
            expectedItems.push(`Postcode: ${expected.postcode}`);
        } else {
            expectedItems.push(`Postcode:`); // current UI behavior
        }

        // Always present fields
        expectedItems.push(
            `Address: ${expected.address ?? "-"}`,
            `Waste: ${expected.waste}`,
            `Skip: ${expected.skip}`,
            `Price: £${expected.price}`
        );

        // Plaster is conditional
        if (expected.plasterOption) {
            expectedItems.push(`Plaster Option: ${expected.plasterOption}`);
        }

        for (const item of expectedItems) {
            expect(items).toContain(item);
        }
    }






}

























