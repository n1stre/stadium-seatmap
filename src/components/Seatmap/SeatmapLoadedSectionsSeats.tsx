"use client";
import React from "react";
import { useSeatmapStore } from "@/hooks/useSeatmap";
import styles from "./Seatmap.module.css";

type Props = {};

const SeatmapLoadedSectionsSeats = ({}: Props) => {
  const seatmap = useSeatmapStore({
    watch: ["seatsPerSection", "sectionsLoaded"],
  });
  const sectionsLoaded = seatmap.state.sectionsLoaded;
  const seatsPerSection = seatmap.state.seatsPerSection;

  return (
    <g id="loaded-sections-seats">
      {sectionsLoaded.map((sectionId) => {
        const seats = seatsPerSection[sectionId];

        if (!seats) return null;

        return (
          <g key={sectionId} fill="#ccc" className={styles.sectionSeats}>
            {Object.values(seats).map((seat) => {
              return <circle key={seat.id} cx={seat.x} cy={seat.y} r={1.5} />;
            })}
          </g>
        );
      })}
    </g>
  );
};

export default React.memo(SeatmapLoadedSectionsSeats);
