import { processOffers } from "../lib/offers";

describe("Test processOffers", () => {
  test("Single offer on 30 day month", () => {
    expect(
      processOffers([
        {
          type: "grant",
          period: 1,
          date: "2015-04-30T20:34:44",
          partner: "a"
        }
      ])
    ).toEqual({ a: 30 });
  });

  test("Single offer on 31 day month", () => {
    expect(
      processOffers([
        {
          type: "grant",
          period: 1,
          date: "2015-05-30T20:34:44",
          partner: "a"
        }
      ])
    ).toEqual({ a: 31 });
  });

  test("Stacking offer from same partner", () => {
    expect(
      processOffers([
        {
          type: "grant",
          period: 3,
          date: "2015-03-10T04:55:10",
          partner: "a"
        },
        {
          type: "grant",
          period: 6,
          date: "2015-04-30T20:34:44",
          partner: "a"
        }
      ])
    ).toEqual({ a: 275 });
  });

  test("Different partner ignored (no revoke)", () => {
    expect(
      processOffers([
        {
          type: "grant",
          period: 3,
          date: "2015-03-10T04:55:10",
          partner: "a"
        },
        {
          type: "grant",
          period: 4,
          date: "2015-06-30T20:34:44",
          partner: "b"
        }
      ])
    ).toEqual({ a: 92 });
  });

  test("Different partner with revoke at exact same time", () => {
    expect(
      processOffers([
        {
          type: "grant",
          period: 3,
          date: "2015-03-10T04:55:10",
          partner: "a"
        },
        {
          type: "revoke",
          date: "2015-06-10T20:34:44",
          partner: "a"
        },
        {
          type: "grant",
          period: 4,
          date: "2015-06-10T20:34:44",
          partner: "b"
        }
      ])
    ).toEqual({ a: 92, b: 122 });
  });

  test("Second partner grant before revoke", () => {
    expect(
      processOffers([
        {
          type: "grant",
          period: 3,
          date: "2015-01-10T04:55:10",
          partner: "a"
        },
        {
          type: "revoke",
          date: "2015-03-10T20:34:44",
          partner: "a"
        },
        {
          type: "grant",
          period: 4,
          date: "2015-03-09T20:34:44",
          partner: "b"
        }
      ])
    ).toEqual({ a: 59 });
  });
});
