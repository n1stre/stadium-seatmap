import React from "react";

interface DraggingProps {
  onDragStart?: (evt: React.MouseEvent) => boolean;
  onDrag?: (evt: MouseEvent) => void;
  onDragEnd?: (evt: MouseEvent) => void;
}

export default function useDragging({
  onDrag,
  onDragEnd,
  onDragStart,
}: DraggingProps = {}) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleStartDragging = React.useCallback(
    (evt: React.MouseEvent) => {
      const started = onDragStart?.(evt) ?? false;
      setIsDragging(started);
    },
    [onDragStart]
  );

  const handleDragging = React.useCallback(
    (evt: MouseEvent) => {
      if (!isDragging) return;
      onDrag?.(evt);
    },
    [onDrag, isDragging]
  );

  const handleStopDragging = React.useCallback(
    (evt: MouseEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      onDragEnd?.(evt);
    },
    [onDragEnd, isDragging]
  );

  React.useEffect(() => {
    document.addEventListener("mousemove", handleDragging);
    return () => document.removeEventListener("mousemove", handleDragging);
  }, [handleDragging]);

  React.useEffect(() => {
    document.addEventListener("mouseup", handleStopDragging);
    return () => document.removeEventListener("mouseup", handleStopDragging);
  }, [handleStopDragging]);

  return {
    isDragging,
    startDragging: handleStartDragging,
    stopDragging: handleStopDragging,
  };
}
