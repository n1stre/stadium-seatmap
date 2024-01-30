import Link from "next/link";

export default async function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Link href="/seatmaps/stadium" className="font-bold text-xl">
        <button className="bg-white rounded-lg shadow-md hover:shadow-sm px-4 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          Go to Stadium Seatsmap
        </button>
      </Link>
    </div>
  );
}
