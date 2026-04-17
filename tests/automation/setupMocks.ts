export async function setupMocks(page) {

  // POSTCODE
  await page.route('**/api/postcode/lookup*', async route => {
    const url = new URL(route.request().url());
    const postcode = url.searchParams.get('postcode') || '';

    if (postcode === 'M1 1AE') {
      await new Promise(res => setTimeout(res, 1500));
    }

    const data: Record<string, any> = {
      'SW1A 1AA': Array.from({ length: 12 }, (_, i) => ({
        id: `addr_${i}`,
        line1: `${10 + i} Downing Street`,
        city: 'London'
      })),
      'EC1A 1BB': [],
      'M1 1AE': Array.from({ length: 12 }, (_, i) => ({
        id: `addr_${i}`,
        line1: `${i} Test Street`,
        city: 'Manchester'
      }))
    };

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        postcode,
        addresses: data[postcode] || []
      })
    });
  });

  // SKIPS
  await page.route('**/api/skips*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        skips: [
          { size: '4-yard', price: 120, disabled: false },
          { size: '8-yard', price: 180, disabled: false },
          { size: '12-yard', price: 260, disabled: true }
        ]
      })
    });
  });

  // BOOKING
  await page.route('**/api/booking/confirm', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        bookingId: 'BK-12345'
      })
    });
  });
}