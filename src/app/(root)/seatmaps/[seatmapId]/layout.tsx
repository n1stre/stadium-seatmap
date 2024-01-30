import Seatmap from "@/components/Seatmap";
import SeatmapActiveSectionIndicator from "@/components/SeatmapActiveSectionIndicator";
import SeatmapHoveredSectionIndicator from "@/components/SeatmapHoveredSectionIndicator";
import SeatmapStateInitializer from "@/components/SeatmapStateInitializer";
import { db } from "@/db";
import { notFound } from "next/navigation";

type Props = {
  params: { seatmapId: string };
  children: React.ReactNode;
};

export default async function SeatmapSectionsLayout({
  children,
  params,
}: Props) {
  const [seatMap, sections, availableSeats] = await Promise.all([
    db.getSeatMapDataByMapId(params.seatmapId),
    db.getAllSectionsByMapId(params.seatmapId),
    db.getAvailableSeatsByMapId(params.seatmapId),
  ]);

  if (!seatMap || !sections) return notFound();

  return (
    <div className="h-screen flex">
      <aside className="w-[33%] border-r border-gray-300 overflow-hidden">
        {children}
      </aside>

      <main className="flex-1 flex flex-col items-center justify-between p-8 overflow-hidden">
        <Seatmap
          sections={sections}
          seatMap={seatMap}
          availableSeats={availableSeats}
        />
      </main>

      <SeatmapStateInitializer seatMap={seatMap} />
      <SeatmapHoveredSectionIndicator />
      <SeatmapActiveSectionIndicator />
    </div>
  );
}
