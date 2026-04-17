import { test as base, expect,} from '@playwright/test';
import { PageManager } from './page-objects/pageManager';
import { setupMocks } from './tests/automation/setupMocks';

export type TestOptions = {

    bookingPage: PageManager;

}


export const test = base.extend<TestOptions>({




    bookingPage: async ({ page, }, use) => {
        const pm = new PageManager(page)
        await setupMocks(page);
        await page.goto('/')
        await use(pm)

    }
})

export { expect }