import { main } from "../lib/";
import { promisify } from "util";
import { readFile } from "fs";
import { join } from "path";

const pReadFile = promisify(readFile);

describe("Test the entire system", () => {
  test("Run entry point and make sure output is correct", async () => {
    await main();
    const testData = await pReadFile(
      join(__dirname, "fixture", "expected_output.json")
    );
    const outputData = await pReadFile(
      join(__dirname, "..", "output", "result.json")
    );
    expect(JSON.parse(outputData)).toEqual(JSON.parse(testData));
  });
});
