


import { Page, expect } from "@playwright/test";
import { BookingPage } from "./bookingPage";

export class PageManager {
    private readonly page: Page;
    private readonly bookingPage: BookingPage;



    constructor(page: Page) {
        this.page = page;
        this.bookingPage = new BookingPage(page);
    }



    get toBookingPage() {
        return this.bookingPage;
    } 







}