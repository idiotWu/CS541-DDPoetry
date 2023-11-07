import globeGL, { type GlobeInstance } from 'globe.gl';
import * as d3 from 'd3';
import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { useAtom } from 'jotai';

import { Legend, BarChart } from '@components';
import type { Entry, WithAverage } from '@interfaces';
import { highlightedVerseAtom } from '@atoms';
import { VERSES } from '@constants';

import countries from './ne_110m_admin_0_countries.json';
import styles from './globe.module.scss';

type GeoData = {
  [conutry: string]: (typeof countries.features)[0];
};

const emptyEntry: WithAverage<Entry> = {
  country: 'empty',
  isoCode: '',
  values: {},
  average: [],
  gap: -1,
};

const geoData: GeoData = {};

// map geo data
countries.features.forEach(feat => {
  geoData[feat.properties.ISO_A3] = feat;
});

export type GlobeProps = {
  indicator: string;
  data: WithAverage<Entry>[];
};

export function Globe({ indicator, data }: GlobeProps) {
  const globeDivRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [hoveredEntry, setHoveredEntry] = useState<WithAverage<Entry> | null>(
    null,
  );
  const [highlightedVerse, setHighlightedVerse] = useAtom(highlightedVerseAtom);
  const colorScale = useMemo(() => {
    // [green - yellow - red] color scale
    return d3.scaleSequential(v => d3.interpolateRdYlGn(1 - v));
  }, []);
  const minValue = Math.min(...data.map(d => d.gap));
  const maxValue = Math.max(...data.map(d => d.gap));

  const resize = useCallback(() => {
    if (!globeRef.current) {
      return;
    }

    globeRef.current.width(window.innerWidth - 300).height(window.innerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [resize]);

  useEffect(() => {
    if (!globeDivRef.current) {
      return;
    }

    const globe = globeGL();
    globeRef.current = globe;

    resize();

    // set color scale domain to [min_diff, max_diff]
    colorScale.domain([minValue, maxValue]);

    const compositeData = composeData(data);

    globe
      .globeImageUrl(`${import.meta.env.BASE_URL}earth-topology.png`)
      .backgroundImageUrl(`${import.meta.env.BASE_URL}night-sky.png`)
      .polygonsData(compositeData)
      .polygonAltitude(0.03)
      .polygonCapColor((d: any) =>
        d.country === emptyEntry.country ? '#333' : colorScale(d.gap),
      )
      .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
      .polygonStrokeColor(() => '#111')
      .polygonsTransitionDuration(300);

    // render
    globe(globeDivRef.current);

    // auto rotate
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    return () => {
      globe._destructor();
    };
  }, [colorScale, data, minValue, maxValue, resize]);

  useEffect(() => {
    if (!globeRef.current) {
      return;
    }

    const globe = globeRef.current;

    globe.onPolygonHover((hoverD: any) => {
      const controls = globe.controls();

      if (!hoverD || hoverD.country === emptyEntry.country) {
        controls.autoRotate = true;
        setHoveredEntry(null);
      } else {
        controls.autoRotate = false;
        setHoveredEntry(hoverD as WithAverage<Entry>);

        const percentile = (hoverD.gap - minValue) / (maxValue - minValue);

        if (percentile >= 0.5) {
          setHighlightedVerse(
            hoverD.average[0] < 0.3 ? VERSES.POOR : VERSES.RICH,
          );
        } else if (percentile >= 0.3) {
          setHighlightedVerse(VERSES.ACTION);
        } else {
          setHighlightedVerse(VERSES.ENDING);
        }
      }

      globe.polygonAltitude((d: any) =>
        d === hoverD && d.country !== emptyEntry.country ? 0.1 : 0.03,
      );
    });
  }, [highlightedVerse, maxValue, minValue, setHighlightedVerse]);

  return (
    <div className={styles.container}>
      <div className={styles.globe} ref={globeDivRef} />
      <Legend min={minValue} max={maxValue} />
      {hoveredEntry ? (
        <BarChart
          data={hoveredEntry}
          indicator={indicator}
          color={colorScale(hoveredEntry.gap)}
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
