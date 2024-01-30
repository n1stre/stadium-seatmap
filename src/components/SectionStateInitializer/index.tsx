"use client";

import React from "react";
import { Dict, Seat, Section } from "@/types";
import { useSeatmapStore, SeatmapState, actions } from "@/hooks/useSeatmap";

type Props = {
  section: Section;
  seats: Dict<Seat>;
};

const SectionStateInitializer = ({ section, seats }: Props) => {
  const seatmapStore = useSeatmapStore({});

  React.useEffect(() => {
    seatmapStore.actions.appendLoadedSection(section.id);
    seatmapStore.actions.appendSeatesPerSection(section.id, seats);
  }, [seatmapStore.actions, section.id, seats]);

  return null;
};

export default SectionStateInitializer;
