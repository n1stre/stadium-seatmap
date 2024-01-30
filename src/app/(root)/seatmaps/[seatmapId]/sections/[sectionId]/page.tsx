import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import SeatmapStaticGraphics from "@/components/Seatmap/SeatmapStaticGraphics";
import SectionStateInitializer from "@/components/SectionStateInitializer";

type Props = {
  params: { seatmapId: string; sectionId: string };
};

export default async function SeatmapSectionPage({ params }: Props) {
  const { seatmapId, sectionId } = params;
  const [section, seatMap, seats] = await Promise.all([
    db.getSectionByMapIdAndSectionId(seatmapId, sectionId),
    db.getSeatMapDataByMapId(seatmapId),
    db.getAllSeatsByMapIdAndSectionId(seatmapId, sectionId),
  ]);

  if (!section || !seatMap || !seats) return notFound();

  return (
    <div className="h-full flex flex-col">
      <h2 className="p-4 flex items-baseline justify-between">
        <span className="font-bold text-xl">Section #{sectionId}</span>
        <Link href={`/seatmaps/${seatmapId}`}>Back</Link>
      </h2>

      <div className="p-4">
        <div className="flex h-[100px] py-2 px-4 gap-4 items-center justify-between overflow-hidden bg-gray-100 border border-gray-300 rounded-md">
          <svg height="100%" viewBox={`0 0 ${seatMap.width} ${seatMap.height}`}>
            <SeatmapStaticGraphics data={seatMap.props} opacity={0.4} />
            <path d={section.d} />
          </svg>

          <div>
            <p>
              Total Seats: <b>{Object.keys(seats).length}</b>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* <SectionsList sections={sections} /> */}
      </div>

      <SectionStateInitializer section={section} seats={seats} />
    </div>
  );
}
