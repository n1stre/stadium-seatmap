"use client";
import { Dict, Seat, SeatMap, Section } from "@/types";
import {
  useObservableState,
  createObservableState,
} from "@/lib/ObservableState";

export const SeatmapState = createObservableState({
  seatMap: null as SeatMap | null,
  hoveredSectionId: null as Section["id"] | null,
  sectionsVisible: null as Array<Section["id"]> | null,
  sectionsLoaded: [] as Array<Section["id"]>,
  seatsPerSection: {} as Record<Section["id"], Dict<Seat>>,
});

export const useSeatmapStore = (props: {
  watch?: Array<keyof (typeof SeatmapState)["state"] | "*">;
}) => {
  const { watch = [] } = props || {};
  const state = useObservableState(SeatmapState, watch);

  return { state, actions };
};

export const actions = {
  setSeatMap: (seatMap: SeatMap | null) => {
    SeatmapState.setState(() => {
      return { seatMap };
    });
  },

  setHoveredSection: (id: Section["id"] | null) => {
    SeatmapState.setState(() => {
      return { hoveredSectionId: id };
    });
  },

  appendLoadedSection: (id: Section["id"]) => {
    SeatmapState.setState(({ sectionsLoaded }) => {
      if (sectionsLoaded.includes(id)) return { sectionsLoaded };
      return { sectionsLoaded: [...sectionsLoaded, id] };
    });
  },

  appendSeatesPerSection: (id: Section["id"], seats: Dict<Seat>) => {
    SeatmapState.setState(({ seatsPerSection }) => {
      return { seatsPerSection: { ...seatsPerSection, [id]: seats } };
    });
  },
};
