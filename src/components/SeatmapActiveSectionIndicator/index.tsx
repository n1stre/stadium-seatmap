"use client";
import { useParams } from "next/navigation";
import React from "react";

type Props = {};

const SECTION_CLASSNAME = "js-seatmap-section-[id]";
const SECTION_ACTIVE_CLASSNAME = "js-seatmap-section--active";

const SeatmapActiveSectionIndicator = ({}: Props) => {
  const params = useParams();
  const activeSectionId = params.sectionId;

  React.useEffect(() => {
    document
      .querySelectorAll(`.${SECTION_ACTIVE_CLASSNAME}`)
      .forEach((elem) => elem.classList.remove(SECTION_ACTIVE_CLASSNAME));

    if (typeof activeSectionId === "string") {
      const className = SECTION_CLASSNAME.replace("[id]", activeSectionId);
      document
        .querySelectorAll(`.${className}`)
        .forEach((elem) => elem.classList.add(SECTION_ACTIVE_CLASSNAME));
    }
  }, [activeSectionId]);

  return null;
};

export default SeatmapActiveSectionIndicator;
