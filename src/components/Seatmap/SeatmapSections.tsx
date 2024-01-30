"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Dict, Section } from "@/types";
import styles from "./Seatmap.module.css";
import { useSeatmapStore } from "@/hooks/useSeatmap";

type Props = {
  sections: Dict<Section>;
};

const SeatmapSections = ({ sections }: Props) => {
  const params = useParams();
  const router = useRouter();
  const seatmap = useSeatmapStore({});

  return (
    <g id="sections">
      {Object.values(sections).map((section) => {
        return (
          <path
            key={section.id}
            d={section.d}
            className={`${styles.section} js-seatmap-section-${section.id}`}
            onMouseEnter={() => seatmap.actions.setHoveredSection(section.id)}
            onMouseLeave={() => seatmap.actions.setHoveredSection(null)}
            onClick={() =>
              router.push(
                `/seatmaps/${params.seatmapId}/sections/${section.id}`
              )
            }
          />
        );
      })}
    </g>
  );
};

export default React.memo(SeatmapSections);
