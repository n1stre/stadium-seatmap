"use client";
import { useSeatmapStore } from "@/hooks/useSeatmap";
import React from "react";

type Props = {};

const SECTION_CLASSNAME = "js-seatmap-section-[id]";
const SECTION_HOVERED_CLASSNAME = "js-seatmap-section--hovered";

const SeatmapHoveredSectionIndicator = ({}: Props) => {
  const seatmap = useSeatmapStore({ watch: ["hoveredSectionId"] });
  const hoveredSectionId = seatmap.state.hoveredSectionId;

  React.useEffect(() => {
    document
      .querySelectorAll(`.${SECTION_HOVERED_CLASSNAME}`)
      .forEach((elem) => elem.classList.remove(SECTION_HOVERED_CLASSNAME));

    if (hoveredSectionId) {
      const className = SECTION_CLASSNAME.replace("[id]", hoveredSectionId);
      document
        .querySelectorAll(`.${className}`)
        .forEach((elem) => elem.classList.add(SECTION_HOVERED_CLASSNAME));
    }
  }, [hoveredSectionId]);

  return null;
};

export default SeatmapHoveredSectionIndicator;
