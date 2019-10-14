import { join } from "path";
import { writeFile } from "fs";
import { promisify } from "util";
import Objection from "objection";
import Knex from "knex";
import { __dirname } from "./constants";
import { processOffersForAllAccounts } from "./offers";
import knexConfig from "../knexfile";

const pWriteFile = promisify(writeFile);
const knex = Knex(knexConfig.development);
Objection.Model.knex(knex);

async function main() {
  try {
    const res = await processOffersForAllAccounts(knex);
    await pWriteFile(
      join(__dirname, "..", "output", "result.json"),
      JSON.stringify({ subscriptions: res })
    );
  } catch (error) {
    console.error(error);
  } finally {
    knex.destroy();
  }
}

main();
