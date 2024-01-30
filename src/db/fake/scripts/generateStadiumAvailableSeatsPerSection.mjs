import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_SEATS_PER_SET = 10;

async function main() {
  const jsonPathRaw = "../data/stadium/allSeatsPerSection.json";
  const jsonPath = path.resolve(__dirname, jsonPathRaw);
  const jsonString = await fs.readFile(jsonPath, "utf-8");
  const data = JSON.parse(jsonString);
  const result = {};

  for (let sectionId in data) {
    if (!data[sectionId]) return;

    result[sectionId] = {
      sid: sectionId,
      seats: {},
      sets: [],
    };

    const sectionAvailibleSeats = result[sectionId];
    const sectionSeats = data[sectionId];
    const seatsIds = Object.keys(sectionSeats);
    const seatsIdsChunks = randSplit(seatsIds, 1, MAX_SEATS_PER_SET);

    seatsIdsChunks.forEach((idsChunk) => {
      const shouldInclude = Math.random() > 0.8;
      if (!shouldInclude) return;

      const seatPrice = 100 + Math.round(Math.random() * 1000);
      const seatsSet = {
        length: idsChunk.length,
        seats: idsChunk,
        price: seatPrice,
        color: getSeatColor(seatPrice),
      };
      sectionAvailibleSeats.sets.push(seatsSet);
      idsChunk.forEach((id) => {
        const seat = sectionSeats[id];
        sectionAvailibleSeats.seats[id] = seat;
      });
    });
  }

  const strigified = JSON.stringify(result);
  const filePathRaw = `../data/stadium/availableSeatsPerSection.json`;
  const filePath = path.resolve(__dirname, filePathRaw);
  await fs.writeFile(filePath, strigified);
}

const getSeatColor = (price) => {
  if (price < 200) return "lime";
  if (price < 600) return "green";
  if (price < 900) return "orange";
  return "red";
};

const randSplit = (arr, min, max) => {
  if (min > arr.length || max <= min) return [arr];

  let res = [];
  let i = 0;
  let rnd;

  while (i < arr.length) {
    rnd = Math.floor(Math.random() * (max - min)) + min;
    res.push(arr.slice(i, i + rnd));
    i += rnd;
  }

  if (res.some((x) => x.length < min)) {
    return randSplit(arr, min, max);
  }

  return res;
};

await main();
