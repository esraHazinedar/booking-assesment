let retryMap = {};

export const bookingApi = {

  // ---------------- POSTCODE LOOKUP ----------------
  postcode: {
    lookup: (postcode) => {
      return new Promise((resolve, reject) => {

        setTimeout(() => {

          // BS1 4DJ → fail first, success retry
          if (postcode === "BS1 4DJ") {
            if (!retryMap[postcode]) {
              retryMap[postcode] = true;
              reject(new Error("500 error"));
              return;
            }

            resolve({
              postcode,
              addresses: Array.from({ length: 12 }, (_, i) => ({
                id: `addr_${i}`,
                line1: `${10 + i} Bristol Street`,
                city: "Bristol"
              }))
            });

            return;
          }

          // M1 1AE → latency simulation
          if (postcode === "M1 1AE") {
            resolve({
              postcode,
              addresses: Array.from({ length: 12 }, (_, i) => ({
                id: `addr_${i}`,
                line1: `${i} Test Street`,
                city: "Manchester"
              }))
            });
            return;
          }

          // SW1A 1AA → 12 addresses
          if (postcode === "SW1A 1AA") {
            resolve({
              postcode,
              addresses: Array.from({ length: 12 }, (_, i) => ({
                id: `addr_${i}`,
                line1: `${10 + i} Downing Street`,
                city: "London"
              }))
            });
            return;
          }

          // EC1A 1BB → empty state
          if (postcode === "EC1A 1BB") {
            resolve({
              postcode,
              addresses: []
            });
            return;
          }

          // default
          resolve({ postcode, addresses: [] });

        }, postcode === "M1 1AE" ? 1500 : 300);
      });
    }
  },

  // ---------------- SKIPS ----------------
  skips: {
    get: (postcode, heavyWaste = false) => {

      const baseSkips = [
        { size: "4-yard", price: 120, disabled: false },
        { size: "6-yard", price: 150, disabled: false },
        { size: "8-yard", price: 180, disabled: false },
        { size: "10-yard", price: 210, disabled: false },
        { size: "12-yard", price: 240, disabled: false },
        { size: "14-yard", price: 270, disabled: false },
        { size: "16-yard", price: 300, disabled: false },
        { size: "20-yard", price: 350, disabled: false }
      ];

      if (heavyWaste) {
        return baseSkips.map(skip => {
          if (skip.size === "12-yard" || skip.size === "14-yard") {
            return { ...skip, disabled: true };
          }
          return skip;
        });
      }

      return baseSkips;
    }
  },

  // ---------------- BOOKING ----------------
  booking: {
    confirm: (payload) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: "success",
            bookingId: "BK-12345",
            ...payload
          });
        }, 500);
      });
    }
  }
};