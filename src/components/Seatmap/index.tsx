"use client";
import React from "react";
import { AvailableSeats, Dict, SeatMap, Section } from "@/types";
import useDragging from "@/hooks/useDragging";
import SeatmapFooter from "./SeatmapFooter";
import SeatmapStaticGraphics from "./SeatmapStaticGraphics";
import SeatmapSections from "./SeatmapSections";
import { useParams } from "next/navigation";
import SeatmapLoadedSectionsSeats from "./SeatmapLoadedSectionsSeats";
import SeatmapAvailableSeats from "./SeatmapAvailableSeats";

type Props = {
  seatMap: SeatMap;
  sections: Dict<Section>;
  availableSeats: AvailableSeats | null;
};

const MIN_SCALE = 0.3;
const TRANSITION_DURATION_MS = 1000;
const TRANSITION_VALUE = `transform ${TRANSITION_DURATION_MS}ms ease`;

const Seatmap = ({ seatMap, sections, availableSeats }: Props) => {
  const params = useParams();
  const sectionId = params.sectionId;
  const [updatedAt, setUpdatedAt] = React.useState(performance.now());
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const svgInitialRect = React.useRef<DOMRect>();
  const mousePos = React.useRef({ x: 50, y: 50 });
  const translate = React.useRef({ x: 0, y: 0 });
  const translateBeforeDrag = React.useRef({ x: 0, y: 0 });
  const translateAnchor = React.useRef({ x: 0, y: 0 });
  const scale = React.useRef(1);
  const isTransitioning = React.useRef(false);
  const isDraggingPossible = React.useRef(false);

  const reset = React.useCallback(() => {
    translate.current = { x: 0, y: 0 };
    scale.current = 1;
    setUpdatedAt(performance.now());
  }, []);

  const updateMousePos = React.useCallback(
    (evt: { clientX: number; clientY: number }) => {
      if (!svgRef.current) return;

      const svgRect = svgRef.current.getBoundingClientRect();
      const x = evt.clientX - (svgRect.left + svgRect.width / 2);
      const y = evt.clientY - (svgRect.top + svgRect.height / 2);
      mousePos.current.x = x / svgRect.width;
      mousePos.current.y = y / svgRect.height;
    },
    []
  );

  const updateScale = React.useCallback((scaleAmount: number) => {
    if (!svgInitialRect.current) return;

    const direction = Math.sign(scaleAmount);
    const nextScale = scale.current + scaleAmount;
    // TODO: handle minmax accurately
    if (direction === -1 && nextScale <= MIN_SCALE) return;

    const svgRect = svgInitialRect.current;
    const wNew = svgRect.width * (1 + scaleAmount);
    const hNew = svgRect.height * (1 + scaleAmount);

    const diffX = wNew - svgRect.width;
    const diffY = hNew - svgRect.height;
    const offsetX = diffX * mousePos.current.x;
    const offsetY = diffY * mousePos.current.y;
    translate.current.x -= offsetX;
    translate.current.y -= offsetY;
    scale.current = nextScale;
    setUpdatedAt(performance.now());
  }, []);

  const stopTransition = React.useCallback(() => {
    isTransitioning.current = false;
    setUpdatedAt(performance.now());
  }, []);

  const startTransition = React.useCallback(() => {
    isTransitioning.current = true;
    setTimeout(() => stopTransition(), TRANSITION_DURATION_MS);
  }, []);

  const onDragStart = React.useCallback(
    (evt: React.MouseEvent) => {
      if (!wrapperRef.current) return false;
      if (isTransitioning.current) return false;

      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const x = evt.clientX - wrapperRect.left;
      const y = evt.clientY - wrapperRect.top;
      translateAnchor.current = { x, y };
      translateBeforeDrag.current = { ...translate.current };

      updateMousePos(evt);
      return true;
    },
    [updateMousePos]
  );

  const onDrag = React.useCallback((evt: MouseEvent) => {
    if (!wrapperRef.current) return;

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const origin = translateAnchor.current;
    const prev = translateBeforeDrag.current;
    const x = evt.clientX - wrapperRect.left - origin.x;
    const y = evt.clientY - wrapperRect.top - origin.y;
    translate.current = { x: prev.x + x, y: prev.y + y };

    setUpdatedAt(performance.now());
  }, []);

  const { isDragging, startDragging } = useDragging({ onDrag, onDragStart });

  const onMouseMove = React.useCallback(
    (evt: React.MouseEvent) => {
      if (!isDragging && isDraggingPossible.current) startDragging(evt);
      updateMousePos(evt);
    },
    [isDragging, startDragging, updateMousePos]
  );

  const onWheel = React.useCallback(
    (evt: React.UIEvent) => {
      if (evt.type !== "wheel") return;
      if (isTransitioning.current) return;

      const delta = (evt.nativeEvent as any).deltaY ?? 0;
      const scaleAmount = delta * 0.01;
      updateMousePos(evt as any);
      updateScale(scaleAmount);
    },
    [updateScale, updateMousePos]
  );

  React.useEffect(() => {
    svgInitialRect.current = svgRef.current?.getBoundingClientRect();
  }, []);

  React.useEffect(() => {
    if (typeof sectionId !== "string") return;
    if (!svgRef.current) return;
    if (!wrapperRef.current) return;
    if (isTransitioning.current) return;

    const selector = `.js-seatmap-section-${sectionId}`;
    const elem = svgRef.current.querySelector(selector);
    if (!elem) return;

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const wrapperCenterX = wrapperRect.left + wrapperRect.width / 2;
    const wrapperCenterY = wrapperRect.top + wrapperRect.height / 2;

    const sectionRect = elem.getBoundingClientRect();
    const sectionCenterX = sectionRect.left + sectionRect.width / 2;
    const sectionCenterY = sectionRect.top + sectionRect.height / 2;

    translate.current.x += -sectionCenterX + wrapperCenterX;
    translate.current.y += -sectionCenterY + wrapperCenterY;

    setUpdatedAt(performance.now());
    startTransition();
  }, [sectionId, startTransition]);

  const svgStyles = {
    "--section-fill": seatMap.settings.sectionFill,
    "--section-fill-hover": seatMap.settings.sectionFillHover,
    "--section-stroke": seatMap.settings.sectionStroke,
    transformOrigin: `50% 50%`,
    transform: `translate3d(${translate.current.x}px, ${translate.current.y}px, 0px) scale3d(${scale.current}, ${scale.current}, ${scale.current})`,
    pointerEvents: isTransitioning.current || isDragging ? "none" : "auto",
    transition: isTransitioning.current ? TRANSITION_VALUE : "none",
    // willChange: "transform",
  } as React.CSSProperties;

  return (
    <div className="h-full w-full flex flex-col">
      <div
        ref={wrapperRef}
        className="relative flex-1 flex items-center justify-center overflow-hidden select-none rounded-lg"
        onWheel={onWheel}
        onMouseMove={onMouseMove}
        onMouseDown={() => (isDraggingPossible.current = true)}
        onMouseUp={() => (isDraggingPossible.current = false)}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div className="w-full" style={svgStyles}>
          <svg
            ref={svgRef}
            width={svgInitialRect.current?.width?.toFixed() ?? "100%"}
            height={svgInitialRect.current?.height?.toFixed()}
            viewBox={`0 0 ${seatMap.width} ${seatMap.height}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <SeatmapStaticGraphics data={seatMap.props} />
            <SeatmapSections sections={sections} />
            <SeatmapLoadedSectionsSeats />
            {availableSeats && <SeatmapAvailableSeats data={availableSeats} />}
          </svg>
        </div>

        <div className="absolute h-[2px] w-[2px] bg-[red] l-[50%] t-[50%]" />
      </div>

      <SeatmapFooter
        zoom={+(scale.current * 100).toFixed(3)}
        zoomIn={() => updateScale(0.1)}
        zoomOut={() => updateScale(-0.1)}
        translate={translate.current}
        reset={reset}
      />
    </div>
  );
};

export default Seatmap;
