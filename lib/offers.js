const Account = require("./models/Account");

const dayMilliseconds = 1000 * 60 * 60 * 24;
const offerTypes = {
  grant: "grant",
  revocation: "revocation"
};

function processOffers(offers) {
  const state = { blockIndex: 0, currentPartner: null };
  const blocks = [];

  offers
    .sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date);
      if (diff === 0) {
        if (a.type !== b.type) {
          return a.type === offerTypes.revocation ? -1 : 1;
        }
      }
      return diff;
    })
    .forEach((offer, index) => {
      const offerDate = new Date(offer.date);

      if (!state.currentPartner) {
        const startDate = offerDate;
        const endDate = new Date(offer.date);
        endDate.setMonth(endDate.getMonth() + offer.period);

        if (offer.type === offerTypes.grant) {
          blocks[index === 0 ? 0 : ++state.blockIndex] = {
            start: startDate,
            end: endDate,
            partner: offer.partner
          };
          state.currentPartner = offer.partner;
        }
      } else {
        if (state.currentPartner && state.currentPartner !== offer.partner)
          return;

        if (offer.type === offerTypes.revocation) {
          blocks[state.blockIndex].end = offerDate;
          state.currentPartner = null;
          return;
        }

        if (offer.type === offerTypes.grant) {
          const { end, start } = blocks[state.blockIndex];
          end.setMonth(end.getMonth() + offer.period);
        }
      }
    });

  return blocks.reduce((acc, cur) => {
    acc[cur.partner] = Math.floor((cur.end - cur.start) / dayMilliseconds);
    return acc;
  }, {});
}

async function getOffersForAllAccounts(knex) {
  try {
    return await Account.query()
      .select(
        "account.id",
        "account.name",
        "grant.partner",
        "grant.period",
        knex.raw("'grant' as type"),
        "grant.date"
      )
      .join("grant", "account.number", "grant.number")
      .where("grant.period", ">", 0)
      .unionAll(
        Account.query()
          .select(
            "account.id",
            "account.name",
            "revocation.partner",
            knex.raw("NULL as period"),
            knex.raw("'revocation' as type"),
            "revocation.date"
          )
          .join("revocation", "account.number", "revocation.number")
      )
      .orderBy(["account.id", "date"]);
  } catch (error) {
    throw error;
  }
}

async function processOffersForAllAccounts(knex, logger) {
  logger.info("begin processOffersForAllAccounts");
  try {
    logger.info("querying all offers from database");
    const rows = await getOffersForAllAccounts(knex);
    logger.info("query complete");

    // Initially I wrote a more memory-friendly approach, but it got
    // increasingly complicated as I cover more edge cases and I don't
    // want to make the wrong impression that I am preoptmizing, so I rewrote
    // as a simple array reduce
    //
    // METRICS: set number of accounts and max number of offers per account
    // so we can optimize the approach to produce final output

    logger.info("build intermediary list of accounts to process offers");
    const accounts = rows.reduce((acc, cur, index) => {
      const { id, name, date, ...rest } = cur;
      // remove tz info from SQLite as it affects accuracy of calculation and
      // doesn't have any use in this context
      const dateWithoutTZ = date.slice(0, -6);
      const offer = { ...rest, date: dateWithoutTZ };
      if (acc[id]) {
        acc[id].offers.push(offer);
      } else {
        acc[id] = { id, name, offers: [offer] };
      }
      return acc;
    }, {});

    logger.info("process offers for list of accounts");
    const res = {};
    Object.keys(accounts).forEach(id => {
      logger.debug(
        `process offers for account id: ${id} (${accounts[id].name})`
      );
      res[accounts[id].name] = processOffers(accounts[id].offers, logger);
    });

    return res;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  processOffers,
  getOffersForAllAccounts,
  processOffersForAllAccounts
};
