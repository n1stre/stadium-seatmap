"use client";

import React from "react";
import { SeatMap } from "@/types";
import { useSeatmapStore } from "@/hooks/useSeatmap";

type Props = {
  seatMap: SeatMap;
};

const SeatmapStateInitializer = ({ seatMap }: Props) => {
  const seatmapStore = useSeatmapStore({});

  React.useEffect(() => {
    seatmapStore.actions.setSeatMap(seatMap);
  }, [seatmapStore.actions, seatMap]);

  return null;
};

export default SeatmapStateInitializer;
