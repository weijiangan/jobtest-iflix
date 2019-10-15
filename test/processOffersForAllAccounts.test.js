import Objection from "objection";
import Knex from "knex";
import Winston from "winston";
import mockDb from "mock-knex";
import {
  processOffersForAllAccounts,
  getOffersForAllAccounts
} from "../lib/offers";

let knex;
let testLogger;

beforeAll(() => {
  knex = Knex({
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./output/test.sqlite3"
    }
  });

  mockDb.mock(knex);

  Objection.Model.knex(knex);

  testLogger = Winston.createLogger({
    level: "warn",
    transports: [new Winston.transports.Console()]
  });
});

afterAll(() => {
  mockDb.unmock(knex);
  knex.destroy();
});

const testRows = [
  {
    id: 1,
    name: "Wei Jian",
    partner: "Maxis",
    period: 3,
    type: "grant",
    date: "2015-01-10T13:45:23+00:00"
  },
  {
    id: 1,
    name: "Wei Jian",
    partner: "Digi",
    period: 3,
    type: "grant",
    date: "2015-02-21T15:10:01+00:00"
  },
  {
    id: 5,
    name: "David",
    partner: "UMobile",
    period: 2,
    type: "grant",
    date: "2015-03-10T04:55:10+00:00"
  },
  {
    id: 2,
    name: "Karen",
    partner: "Celcom",
    period: 6,
    type: "grant",
    date: "2015-10-14T16:24:24+00:00"
  }
];

describe("Integration testing for getOffersForAllAccounts()", () => {
  test("Return the query result correctly", async () => {
    const tracker = mockDb.getTracker();
    tracker.install();
    tracker.on("query", query => {
      query.response(testRows);
    });

    expect(await getOffersForAllAccounts(knex)).toEqual(testRows);
  });
});

describe("Integration testing for processOffersForAllAccounts()", () => {
  test("Return correct results", async () => {
    const tracker = mockDb.getTracker();
    tracker.install();
    tracker.on("query", query => {
      query.response(testRows);
    });

    expect(await processOffersForAllAccounts(knex, testLogger)).toEqual({
      "Wei Jian": {
        Maxis: 90
      },
      Karen: {
        Celcom: 183
      },
      David: {
        UMobile: 61
      }
    });
  });
});
