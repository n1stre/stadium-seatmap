"use client";
import { AvailableSeats } from "@/types";
import React from "react";

type Props = {
  data: AvailableSeats;
};

const style: React.CSSProperties = {
  pointerEvents: "none",
};

const SeatmapAvailableSeats = ({ data }: Props) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <g id="available-seats" style={style}>
      <CirclesImpl data={data} />
      {/* <RectsImpl data={data} /> */}
    </g>
  );
};

const CirclesImpl = ({ data }: Props) => {
  const sectionsIds = Object.keys(data);

  return (
    <>
      {sectionsIds.map((sectionId) => {
        const seatsSets = data[sectionId];

        if (!seatsSets) return null;

        return (
          <g key={sectionId}>
            {seatsSets.sets.map((set, idx) => {
              return set.seats.map((seatId) => {
                const seat = seatsSets.seats[seatId];
                if (!seat) return null;
                return (
                  <circle
                    key={seatId}
                    cx={seat.x}
                    cy={seat.y}
                    r={1.5}
                    fill={set.color}
                  />
                );
              });
            })}
          </g>
        );
      })}
    </>
  );
};

const RectsImpl = ({ data }: Props) => {
  const sectionsIds = Object.keys(data);

  return (
    <>
      {sectionsIds.map((sectionId) => {
        const seatsSets = data[sectionId];

        if (!seatsSets) return null;

        return (
          <g key={sectionId}>
            {seatsSets.sets.map((set, idx) => {
              return set.seats.map((seatId) => {
                const seat = seatsSets.seats[seatId];
                if (!seat) return null;
                return (
                  <rect
                    key={seatId}
                    fill={set.color}
                    x={seat.x.toFixed(0)}
                    y={seat.y.toFixed(0)}
                    width={2}
                    height={2}
                    // rx={1.5}
                    // ry={1.5}
                  />
                );
              });
            })}
          </g>
        );
      })}
    </>
  );
};

export default React.memo(SeatmapAvailableSeats);
