import * as d3 from 'd3';
import useSWRImmutable from 'swr/immutable';
import { useAtomValue } from 'jotai';
import { Globe } from '@components';
import { indicators } from '@constants';
import { activeIndicatorAtom, yearBeginAtom, yearEndAtom } from '@atoms';
import type { Entry, Dataset, WithAverage } from '@interfaces';

function extractByIndicator(
  csv: d3.DSVRowArray<string>,
  indicator: string,
): Entry[] {
  const countryEntries: { [country: string]: Entry } = {};

  csv.forEach(row => {
    // skip empty data
    if (!row[indicator]) {
      return;
    }

    const entry: Entry = countryEntries[row.country] || {
      country: row.country,
      isoCode: row.iso_code,
      values: {},
      gap: -1,
    };

    const quintile = row.Wealth.match(/\d+$/);

    if (!quintile) {
      return;
    }

    entry.values[row.year] ??= [];

    const wealthLevel = parseInt(quintile[0], 10) - 1;
    const value = parseFloat(row[indicator]);

    entry.values[row.year][wealthLevel] = value;

    countryEntries[row.country] = entry;
  });

  // convert to an array of data
  const results: Entry[] = [];

  for (const country of Object.values(countryEntries)) {
    for (const [k, v] of Object.entries(country.values)) {
      // filter out incomplete data
      if (v.length !== 5 || (v as (number | undefined)[]).includes(undefined)) {
        Reflect.deleteProperty(country.values, k);
      }
    }

    results.push(country);
  }

  return results;
}

async function dataFetcher(csvPath: string) {
  const csv = await d3.csv(csvPath);

  const dataset: Dataset = {};

  for (const ind of Object.keys(indicators)) {
    dataset[ind] = extractByIndicator(csv, ind);
  }

  return dataset;
}

export function Visulaizer() {
  const { data, isLoading, error } = useSWRImmutable(
    `${import.meta.env.BASE_URL}WIDE_wealth.csv`,
    dataFetcher,
  );

  const yearBegin = useAtomValue(yearBeginAtom);
  const yearEnd = useAtomValue(yearEndAtom);
  const activeIndicator = useAtomValue(activeIndicatorAtom);

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (error || !data) {
    const errorMsg = error ? String(error) : 'empty data';
    return <div>Fetch csv failed: {errorMsg}</div>;
  }

  const selectedData: WithAverage<Entry>[] = [];
  let maxValue = 1;

  for (const entry of data[activeIndicator]) {
    const slice = {
      ...entry,
      average: [] as number[],
      values: {} as typeof entry.values,
    };

    const sum: number[] = [0, 0, 0, 0, 0];

    for (const [k, v] of Object.entries(entry.values)) {
      const year = parseInt(k, 10);

      if (year >= yearBegin && year <= yearEnd) {
        slice.values[year] = v;
        maxValue = Math.max(maxValue, ...v);

        v.forEach((val, idx) => {
          sum[idx] += val;
        });
      }
    }

    const count = Object.keys(slice.values).length;

    if (count > 0) {
      slice.average = sum.map(val => val / count);
      slice.gap = Math.abs(slice.average[4] - slice.average[0]);

      selectedData.push(slice);
    }
  }

  return (
    <Globe
      indicator={indicators[activeIndicator][0]}
      data={selectedData}
      maxValue={maxValue}
    />
  );
}
