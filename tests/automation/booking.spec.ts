
import { test, expect } from '../../test-options';



test('TC-01 — Full booking flow (General)', async ({ bookingPage,page }) => {
  await expect(page).toHaveURL('/');
  let expectedPostalCode = "SW1A 1AA";
  await bookingPage.toBookingPage.postalCodeVerification(expectedPostalCode)
  const expectedAddress = bookingPage.toBookingPage.getFirstAddressAndSelect()
  await bookingPage.toBookingPage.selectAddressByText(await expectedAddress)
  const expectedWaste = 'General'
  await bookingPage.toBookingPage.selectWasteType(expectedWaste);
  const expectedSkip = '4-yard'
  await bookingPage.toBookingPage.selectSkip(expectedSkip)
  const expectedPrice = await bookingPage.toBookingPage.getSelectedSkipPrice();
  await bookingPage.toBookingPage.verifyReviewSummary(await expectedAddress, expectedPostalCode, expectedSkip, expectedPrice, expectedWaste)
  await bookingPage.toBookingPage.confirmBookingAndAcceptAlert();
  
  


});


test('TC-02 — Full booking flow (Heavy)', async ({ bookingPage, page }) => {

  await expect(page).toHaveURL('/');
  const postcode = "SW1A 1AA";
  const address = bookingPage.toBookingPage.getFirstAddressAndSelect()

  await bookingPage.toBookingPage.postalCodeVerification(postcode);
  await bookingPage.toBookingPage.selectAddressByText(await address);

  const waste = "Heavy";
  await bookingPage.toBookingPage.selectWasteType(waste);


  // HEAVY RULE VALIDATION


  const twelve = page.locator('.skip-box', { hasText: '12-yard' });
  const fourteen = page.locator('.skip-box', { hasText: '14-yard' });
  const ten = page.locator('.skip-box', { hasText: '10-yard' });

  //  they exist
  await expect(twelve).toBeVisible();
  await expect(fourteen).toBeVisible();

  //  they are disabled (business rule)
  await expect(twelve).toHaveClass(/disabled/);
  await expect(fourteen).toHaveClass(/disabled/);

  //  they are NOT clickable (strong QA assertion)
  await expect(twelve).toHaveCSS('pointer-events', 'none');
  await expect(fourteen).toHaveCSS('pointer-events', 'none');

  //  valid skip is selectable
  await expect(ten).not.toHaveClass(/disabled/);


  // SELECT VALID SKIP


  const skip = "10-yard";
  await bookingPage.toBookingPage.selectSkip(skip);

  const price = await bookingPage.toBookingPage.getSelectedSkipPrice();


  // REVIEW CHECK


  await bookingPage.toBookingPage.verifyReviewSummary(
    await address,
    postcode,
    skip,
    price,
    waste
  );

  await bookingPage.toBookingPage.confirmBookingAndAcceptAlert();
});


test('TC-03 — Full booking flow (Plasterboard)', async ({ bookingPage,page }) => {
 await expect(page).toHaveURL('/');
  const postcode = "SW1A 1AA";
  const address = bookingPage.toBookingPage.getFirstAddressAndSelect()

  await bookingPage.toBookingPage.postalCodeVerification(postcode);
  await bookingPage.toBookingPage.selectAddressByText(await address);

  const waste = "Plasterboard";
  await bookingPage.toBookingPage.selectWasteType(waste);

  const plasterOption = "Medium";
  await bookingPage.toBookingPage.selectPlaster(plasterOption);

  const skipSize = "4-yard";
  await bookingPage.toBookingPage.selectSkip(skipSize);

  const expectedPrice =
    bookingPage.toBookingPage.basePrices[skipSize] +
    bookingPage.toBookingPage.getIncrease(plasterOption);

  const actualPrice = await bookingPage.toBookingPage.getSelectedSkipPrice();

  //  review validation
  await bookingPage.toBookingPage.verifyReviewSummaryState({
    postcode: "SW1A 1AA",
    address: await address,
    waste,
    plasterOption,
    skip: skipSize,
    price: String(expectedPrice)
  });

  await bookingPage.toBookingPage.confirmBookingAndAcceptAlert();
});


test.describe('TC-04 —Plaster pricing rules', () => {

  const options = ["Small", "Medium", "Large"];

  for (const option of options) {

    test(`Plaster pricing rule - ${option}`, async ({ bookingPage,page }) => {

      await expect(page).toHaveURL('/');
      await bookingPage.toBookingPage.selectWasteType('Plasterboard');

      await bookingPage.toBookingPage.selectPlaster(option);

      const skips = await bookingPage.toBookingPage.getSkipPrices();

      const increase = bookingPage.toBookingPage.getIncrease(option);

      skips.forEach(skip => {
        const expected =
          bookingPage.toBookingPage.basePrices[skip.size] + increase;

        expect(skip.price).toBe(expected);
      });


    });



  }
});


test.describe('TC-05 —Plaster review summary', () => {

  const cases = [
    { option: 'Small' },
    { option: 'Medium' },
    { option: 'Large' }
  ];

  for (const { option } of cases) {
    
    test(`Review summary - ${option}`, async ({ bookingPage,page }) => {
       await expect(page).toHaveURL('/');
      await bookingPage.toBookingPage.selectWasteType('Plasterboard');

      const skipSize = '4-yard';

      await bookingPage.toBookingPage.selectPlaster(option);
      await bookingPage.toBookingPage.selectSkip(skipSize);

      const increase = bookingPage.toBookingPage.getIncrease(option);
      const expectedPrice =
        bookingPage.toBookingPage.basePrices[skipSize] + increase;

      await bookingPage.toBookingPage.verifyReviewSummaryState({
        postcode: "-",
        address: "-",
        waste: "Plasterboard",
        plasterOption: option,
        skip: skipSize,
        price: String(expectedPrice)
      });
    });
  }
});





test('TC-06 — Booking blocked when fields incomplete', async ({ bookingPage,page }) => {
  await expect(page).toHaveURL('/');
  await bookingPage.toBookingPage.confirmBookingFailure()
});




test('TC-07— Empty address state (EC1A 1BB)', async ({ bookingPage, page }) => {
     await expect(page).toHaveURL('/');
  //  enter postcode that returns no addresses
  await bookingPage.toBookingPage.postalCodeVerification('EC1A 1BB');

  // verify empty state message
  await expect(page.getByText('No addresses found')).toBeVisible();

  // ensure no selectable address cards exist
  await expect(page.locator('.address-card')).toHaveCount(0);
});


test('TC-08- Postcode lookup latency (M1 1AE)', async ({ bookingPage, page }) => {

 await expect(page).toHaveURL('/');
  const start = Date.now();
  //  trigger slow postcode
  await bookingPage.toBookingPage.postalCodeVerification('M1 1AE');

  // should eventually show addresses
  await expect(page.locator('.address-card').first()).toBeVisible();

  const duration = Date.now() - start;

  // optional: ensure latency was actually simulated
  expect(duration).toBeGreaterThan(1200);
});




test('TC-09 — Postcode retry recovery after error state (BS1 4DJ)', async ({ bookingPage, page }) => {
 await expect(page).toHaveURL('/');
  const postcode = 'BS1 4DJ';

  // FIRST TRY (fails inside mock)
  await bookingPage.toBookingPage.postalCodeVerification(postcode);

  await expect(page.getByText('Error fetching addresses')).toBeVisible();

  //  RETRY (second call succeeds)
  await bookingPage.toBookingPage.postalCodeVerification(postcode);

  // SUCCESS CHECK
  const cards = page.locator('.address-card');
  await expect.poll(async () => cards.count())
    .toBeGreaterThan(0);
});



