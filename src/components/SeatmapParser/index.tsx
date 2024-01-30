"use client";
import React from "react";
import SeatMapSvg from "./SeatMapSvg";
import { Dataset, Row, Seat, Section } from "@/types";

const SeatmapParser = () => {
  const isProcessed = React.useRef(false);

  React.useEffect(() => {
    if (isProcessed.current) return;

    const svgEl = document.getElementById("stadium-seat-map");
    if (!svgEl) return;

    const svgRect = svgEl.getBoundingClientRect();
    const sections: Dataset<Section> = { list: [], dict: {} };
    const rows: Dataset<Row> = { list: [], dict: {} };
    const seats: Dataset<Seat> = { list: [], dict: {} };
    const seatsPerSection: Record<Section["id"], Record<Seat["id"], Seat>> = {};

    document.querySelectorAll(".section").forEach((sectionEl, idx) => {
      const id = String(idx);
      const d = sectionEl.querySelector(".shape")?.getAttribute("d") ?? "";
      const section: Section = { id, rows: [], d };
      sections.list.push(section.id);
      sections.dict[section.id] = section;
      sectionEl.setAttribute("data-id", id);
    });

    document.querySelectorAll(".row").forEach((rowEl, idx) => {
      const id = String(idx);
      const sid = rowEl.parentElement?.getAttribute("data-id");
      if (!sid) return;

      const row: Row = { id, sid, seats: [] };
      sections.dict[sid]?.rows.push(row.id);
      rows.list.push(row.id);
      rows.dict[row.id] = row;
      rowEl.setAttribute("data-id", id);
      rowEl.setAttribute("data-sid", sid);
    });

    document.querySelectorAll(".seat").forEach((seatEl, idx) => {
      // if (seatEl.tagName === "path") return;
      // if (idx > 1000) return;

      const id = String(idx);
      const rowEl = seatEl.parentElement;
      const rid = rowEl?.getAttribute("data-id");
      const sid = rowEl?.getAttribute("data-sid");
      if (!sid || !rid) return;

      const seatRect = seatEl.getBoundingClientRect();
      const x = Number((seatRect.x - svgRect.x + 1.5).toFixed(3));
      const y = Number((seatRect.y - svgRect.y + 1.5).toFixed(3));
      const seat: Seat = { id, rid, sid, x, y };

      rows.dict[rid]?.seats.push(seat.id);
      seats.list.push(seat.id);
      seats.dict[seat.id] = seat;

      if (!seatsPerSection[seat.sid]) {
        seatsPerSection[seat.sid] = { [seat.id]: seat };
      } else {
        seatsPerSection[seat.sid][seat.id] = seat;
      }
    });

    console.log("sections", sections);
    console.log("rows", rows);
    console.log("seats", seats);
    console.log("seatsPerSection", seatsPerSection);

    isProcessed.current = true;
    // const seats = document.querySelectorAll('seat')
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <SeatMapSvg />
    </div>
  );
};

export default SeatmapParser;
