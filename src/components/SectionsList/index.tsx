"use client";

import React from "react";
import { Dict, SeatMap, Section } from "@/types";
import { useSeatmapStore } from "@/hooks/useSeatmap";
import SeatmapStaticGraphics from "../Seatmap/SeatmapStaticGraphics";
import styles from "./SectionsList.module.css";
import { useParams, useRouter } from "next/navigation";

type Props = {
  sections: Dict<Section>;
};

const SectionsList = ({ sections }: Props) => {
  const params = useParams();
  const router = useRouter();
  const seatmapStore = useSeatmapStore({
    watch: ["sectionsVisible", "seatMap"],
  });
  const sectionsVisible = seatmapStore.state.sectionsVisible;
  const seatMap = seatmapStore.state.seatMap;
  const sectionsIdsToRender = sectionsVisible ?? Object.keys(sections);

  return (
    <ul className="mt-4">
      {sectionsIdsToRender.map((id) => {
        return (
          <SectionsListItem
            key={id}
            section={sections[id]}
            seatMap={seatMap}
            onMouseEnter={() => seatmapStore.actions.setHoveredSection(id)}
            onMouseLeave={() => seatmapStore.actions.setHoveredSection(null)}
            onClick={() =>
              router.push(`/seatmaps/${params.seatmapId}/sections/${id}`)
            }
          />
        );
      })}
    </ul>
  );
};

type SectionListItemProps = {
  section: Section;
  seatMap: SeatMap | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
};

const SectionsListItem = ({
  section,
  seatMap,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: SectionListItemProps) => {
  return (
    <li
      className={`${styles.section} js-seatmap-section-${section.id} p-4 border-b cursor-pointer`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className="flex h-[36px] items-center justify-between">
        <p className="text-lg">Section #{section.id}</p>

        {seatMap && (
          <svg height="100%" viewBox={`0 0 ${seatMap.width} ${seatMap.height}`}>
            <SeatmapStaticGraphics data={seatMap.props} opacity={0.4} />
            <path d={section.d} />
          </svg>
        )}
      </div>
    </li>
  );
};

export default SectionsList;
