// WIDE data entry
export type Entry = {
  country: string;
  isoCode: string;
  values: {
    [year: string]: number[];
  };
  gap: number;
};

export type WithAverage<T> = T & {
  average: number[];
};

export type Dataset = {
  [indicator: string]: Entry[];
};
