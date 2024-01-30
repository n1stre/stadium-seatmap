import fs from "fs/promises";
import path from "path";
import { Dict, Seat, SeatMap, Section, AvailableSeats } from "@/types";

const resolveDataPath = (...args: string[]) => {
  return path.resolve(process.cwd(), "src/db/fake/data", ...args);
};

const readData = async <T>(...dataPath: string[]) => {
  const jsonPath = resolveDataPath(...dataPath);
  const json = await fs.readFile(jsonPath, "utf-8");
  const data: T = JSON.parse(json);
  return data;
};

export const getSeatMapDataByMapId = async (mapId: string) => {
  try {
    return await readData<SeatMap>(mapId, "main.json");
  } catch (err) {
    console.log("[getSeatMapDataByMapId]", err);
    return null;
  }
};

export const getAllSectionsByMapId = async (mapId: string) => {
  try {
    return await readData<Dict<Section>>(mapId, "allSections.json");
  } catch (err) {
    console.log("[getAllSeatMapSectionsByMapId]", err);
    return null;
  }
};

export const getSectionByMapIdAndSectionId = async (
  mapId: string,
  sectionId: string
) => {
  try {
    const sections = await readData<Dict<Section>>(mapId, "allSections.json");
    return sections[sectionId] ?? null;
  } catch (err) {
    console.log("[getSectionByMapIdAndSectionId]", err);
    return null;
  }
};

export const getAllSeatsByMapIdAndSectionId = async (
  mapId: string,
  sectionId: string
) => {
  try {
    const path = [mapId, `allSeatsPerSection/${sectionId}.json`];
    return await readData<Dict<Seat>>(...path);
  } catch (err) {
    console.log("[getAllSeatsByMapIdAndSectionId]", err);
    return null;
  }
};

export const getAvailableSeatsByMapId = async (mapId: string) => {
  try {
    const path = [mapId, `availableSeatsPerSection.json`];
    return await readData<AvailableSeats>(...path);
  } catch (err) {
    console.log("[getAllSeatsByMapIdAndSectionId]", err);
    return null;
  }
};

export const getRandomNumber = async (max: number) => {
  return Math.floor(Math.random() * max);
};
