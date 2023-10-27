import globeGL from 'globe.gl';
import * as d3 from 'd3';
import { useMemo, useRef, useEffect, useState } from 'react';

import { Legend, BarChart } from '@components';
import type { Entry } from '@interfaces';

import countries from './ne_110m_admin_0_countries.json';
import styles from './globe.module.scss';

type GeoData = {
  [conutry: string]: (typeof countries.features)[0];
};

const emptyEntry: Entry = {
  country: 'empty',
  isoCode: '',
  values: [],
  difference: -1,
};

const geoData: GeoData = {};

// map geo data
countries.features.forEach(feat => {
  geoData[feat.properties.ISO_A3] = feat;
});

export type GlobeProps = {
  indicator: string;
  data: Entry[];
};

export function Globe({ indicator, data }: GlobeProps) {
  const globeDivRef = useRef<HTMLDivElement>(null);
  const [hoveredEntry, setHoveredEntry] = useState<Entry | null>(null);
  const colorScale = useMemo(() => {
    // [green - yellow - red] color scale
    return d3.scaleSequential(v => d3.interpolateRdYlGn(1 - v));
  }, []);
  const globe = useMemo(() => globeGL(), []);
  const maxValue = Math.max(...data.map(d => d.difference));

  useEffect(() => {
    if (!globeDivRef.current) {
      return;
    }

    // set color scale domain to [0, max_difference]
    colorScale.domain([0, maxValue]);

    const compositeData = composeData(data);

    globe
      .globeImageUrl(`${import.meta.env.BASE_URL}earth-topology.png`)
      .polygonsData(compositeData)
      .polygonAltitude(0.03)
      .polygonCapColor((d: any) =>
        d.country === emptyEntry.country ? '#333' : colorScale(d.difference),
      )
      .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
      .polygonStrokeColor(() => '#111')
      .polygonsTransitionDuration(300);

    globe.onPolygonHover((hoverD: any) => {
      if (!hoverD || hoverD.country === emptyEntry.country) {
        setHoveredEntry(null);
      } else {
        setHoveredEntry(hoverD as Entry);
      }

      globe.polygonAltitude((d: any) =>
        d === hoverD && d.country !== emptyEntry.country ? 0.1 : 0.03,
      );
    });

    // render
    globe(globeDivRef.current);
  }, [colorScale, data, globe, maxValue]);

  return (
    <div className={styles.container}>
      <div className={styles.globe} ref={globeDivRef} />
      <Legend min={0} max={maxValue} />
      {hoveredEntry ? (
        <BarChart
          data={hoveredEntry}
          indicator={indicator}
          color={colorScale(hoveredEntry.difference)}
        />
      ) : null}
    </div>
  );
}

function composeData(data: Entry[]) {
  const results: Array<(typeof countries.features)[0] & Entry> = [];
  const mappedCountries = new Set<string>();

  for (const d of data) {
    if (geoData[d.isoCode]) {
      results.push({
        ...geoData[d.isoCode],
        ...d,
      });

      mappedCountries.add(d.isoCode);
    }
  }

  // makeup missing countries
  for (const [countryCode, d] of Object.entries(geoData)) {
    if (!mappedCountries.has(countryCode)) {
      results.push({
        ...d,
        ...emptyEntry,
      });
    }
  }

  return results;
}
