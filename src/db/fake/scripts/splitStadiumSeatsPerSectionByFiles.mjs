import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const jsonPathRaw = "../data/stadium/allSeatsPerSection.json";
  const jsonPath = path.resolve(__dirname, jsonPathRaw);
  const jsonString = await fs.readFile(jsonPath, "utf-8");
  const data = JSON.parse(jsonString);

  for (let sectionId in data) {
    const strigified = JSON.stringify(data[sectionId]);
    const filePathRaw = `../data/stadium/allSeatsPerSection/${sectionId}.json`;
    const filePath = path.resolve(__dirname, filePathRaw);
    await fs.writeFile(filePath, strigified);
  }
}

await main();
