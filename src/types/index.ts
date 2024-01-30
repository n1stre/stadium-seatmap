export type Dict<T extends { id: string }> = Record<T["id"], T>;

export type Dataset<T extends { id: string }> = {
  list: Array<T["id"]>;
  dict: Dict<T>;
};

export type SeatMap = {
  id: string;
  width: number;
  height: number;
  props: string;
  settings: SeatMapSettings;
  stats: SeatMapStats;
};

export type SeatMapSettings = {
  sectionFill: string;
  sectionFillHover: string;
  sectionStroke: string;
  sectionStrokeWidth: number;
  seatFill: string;
  seatRadius: number;
};

export type SeatMapStats = {
  sectionsCount: number;
  rowsCount: number;
  seatsCount: number;
};

export type Section = {
  id: string;
  rows: Array<Row["id"]>;
  d: string;
};

export type Row = {
  id: string;
  sid: Section["id"];
  seats: Array<Seat["id"]>;
};

export type Seat = {
  id: string;
  sid: Section["id"];
  rid: Row["id"];
  x: number;
  y: number;
};

export type SectionSeatsSets = {
  sid: Section["id"];
  seats: Dict<Seat>;
  sets: Array<SeatsSet>;
};

export type SeatsSet = {
  length: number;
  seats: Array<Seat["id"]>;
  price: number;
  color: string;
};

export type AvailableSeats = Record<Section["id"], SectionSeatsSets>;
