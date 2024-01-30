import { SeatMap } from "@/types";

type Props = {
  translate: { x: number; y: number };
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
};

const SeatmapFooter = ({ translate, zoom, zoomIn, zoomOut, reset }: Props) => {
  return (
    <footer className="w-full cursor-default pt-4">
      <div className="flex items-center justify-center gap-4">
        <div className="flex">
          <nav className="inline-flex rounded-md shadow-sm">
            <button
              onClick={zoomOut}
              className="bg-white inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              -
            </button>

            <span className="bg-white w-[64px] inline-flex items-center justify-center py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <span>{zoom}%</span>
            </span>

            <button
              onClick={zoomIn}
              className="bg-white inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              +
            </button>
          </nav>
        </div>

        <button
          onClick={reset}
          className="bg-white h-[40px] rounded-md inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          Reset
        </button>
      </div>
    </footer>
  );
};

export default SeatmapFooter;
