import React from "react";

type Props = {
  data: string;
  opacity?: number;
};

const SeatmapStaticGraphics = ({ data, opacity = 1 }: Props) => {
  return (
    <g
      id="static"
      dangerouslySetInnerHTML={{ __html: data }}
      style={{ opacity }}
    />
  );
};

export default React.memo(SeatmapStaticGraphics);
