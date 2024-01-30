import { notFound } from "next/navigation";
import Seatmap from "@/components/Seatmap";
import SeatmapParser from "@/components/SeatmapParser";
import SectionsList from "@/components/SectionsList";
import { db } from "@/db";

export default async function SeatmapSectionsPage() {
  const [sections] = await Promise.all([db.getAllSectionsByMapId("stadium")]);

  if (!sections) return notFound();

  return (
    <div className="h-full flex flex-col">
      <h2 className="font-bold text-xl p-4">Stadium Seats</h2>
      <div className="flex-1 overflow-auto">
        <SectionsList sections={sections} />
      </div>
    </div>
  );
}
