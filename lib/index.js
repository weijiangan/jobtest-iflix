const { join } = require("path");
const { writeFile } = require("fs");
const { promisify } = require("util");
const Objection = require("objection");
const Knex = require("knex");
const { processOffersForAllAccounts } = require("./offers");
const logger = require("./utils/logger");
const knexConfig = require("../knexfile");

const pWriteFile = promisify(writeFile);
const knex = Knex(knexConfig.development);
Objection.Model.knex(knex);

async function main() {
  try {
    const res = await processOffersForAllAccounts(knex, logger);
    logger.info(
      "writing processOffersForAllAccounts results to output/result.json"
    );
    await pWriteFile(
      join(__dirname, "..", "output", "result.json"),
      JSON.stringify({ subscriptions: res })
    );
    logger.info("write to file complete");
  } catch (error) {
    logger.error(error);
  } finally {
    knex.destroy();
  }
}

main();

module.exports = { main };
