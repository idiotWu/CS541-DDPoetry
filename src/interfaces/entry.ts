// WIDE data entry
export type Entry = {
  country: string;
  isoCode: string;
  values: number[];
  difference: number;
};

export type Dataset = {
  [indicator: string]: Entry[];
};
