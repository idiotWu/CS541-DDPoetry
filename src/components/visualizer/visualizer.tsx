import * as d3 from 'd3';
import useSWRImmutable from 'swr/immutable';
import { Globe } from '@components';
import type { Entry } from '@interfaces';

// example row for static vis
const COLUMN = 'comp_prim_v2_m';

async function dataFetcher(csvPath: string) {
  const csv = await d3.csv(csvPath);

  const countryEntries: {
    [country: string]: Entry;
  } = {};

  csv.forEach(row => {
    // skip empty data
    if (!row[COLUMN]) {
      return;
    }

    const entry: Entry = countryEntries[row.country] || {
      country: row.country,
      isoCode: row.iso_code,
      values: [],
      difference: 0,
    };

    const quintile = row.Wealth.match(/\d+$/);

    if (!quintile) {
      return;
    }

    const wealthLevel = parseInt(quintile[0], 10) - 1;

    entry.values[wealthLevel] = parseFloat(row[COLUMN]);

    countryEntries[row.country] = entry;
  });

  // convert to an array of data
  const results: Entry[] = [];

  for (const entry of Object.values(countryEntries)) {
    // ignore incomplete data
    if (entry.values.length !== 5) {
      continue;
    }

    // calculate difference
    entry.difference = Math.max(...entry.values) - Math.min(...entry.values);

    results.push(entry);
  }

  return results;
}

export function Visulaizer() {
  const { data, isLoading, error } = useSWRImmutable(
    `${import.meta.env.BASE_URL}WIDE_wealth.csv`,
    dataFetcher,
  );

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (error || !data) {
    const errorMsg = error ? String(error) : 'empty data';
    return <div>Fetch csv failed: {errorMsg}</div>;
  }

  return <Globe indicator='Primary Completion Rate' data={data} />;
}
