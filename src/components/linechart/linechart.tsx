import * as d3 from 'd3';
import { useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

import type { Entry, WithAverage } from '@interfaces';

import styles from './linechart.module.scss';

const charMargins = { top: 60, right: 100, bottom: 40, left: 60 };
const wealthLevels = ['poorest', 'poor', 'middle', 'rich', 'richest'];

export type LineChartProps = {
  indicator: string;
  data: WithAverage<Entry>;
  width?: number;
  height?: number;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
};

export function LineChart({
  indicator,
  data,
  width = 500,
  height = 300,
  yMin = 0,
  yMax = 1,
  xMin = 2000,
  xMax = 2019,
}: LineChartProps) {
  const chartDivRef = useRef<HTMLDivElement>(null);
  const popoverDivRef = useRef<HTMLDivElement>(null);
  const chartWidth = width - charMargins.left - charMargins.right;
  const chartHeight = height - charMargins.top - charMargins.bottom;

  const colorScale = useMemo(() => {
    return d3
      .scaleOrdinal(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'])
      .domain(wealthLevels);
  }, []);

  useEffect(() => {
    function updatePointerPosition(evt: PointerEvent) {
      if (!popoverDivRef.current || !chartDivRef.current) {
        return;
      }

      // follows mouse
      const x = Math.min(evt.clientX + 10, window.innerWidth - width - 10);
      const y = Math.min(evt.clientY + 10, window.innerHeight - height - 10);

      popoverDivRef.current.style.display = 'flex';
      popoverDivRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    document.addEventListener('pointermove', updatePointerPosition);
    document.addEventListener('pointerup', updatePointerPosition);

    return () => {
      document.removeEventListener('pointermove', updatePointerPosition);
      document.removeEventListener('pointerup', updatePointerPosition);
    };
  }, [height, width]);

  useEffect(() => {
    // init once
    if (!chartDivRef.current) {
      return;
    }

    d3.select(chartDivRef.current).select('*').remove();

    const svg = d3.select(chartDivRef.current).append('svg');

    // add chart
    const chart = svg.append('g').attr('class', 'chart');

    const xAxis = d3.scaleLinear().domain([xMin, xMax]).range([0, chartWidth]);
    const yAxis = d3.scaleLinear().domain([yMin, yMax]).range([0, chartHeight]);

    // add x-axis
    chart.append('g').attr('class', 'x-axis').call(d3.axisBottom(xAxis));

    // add y-axis
    chart.append('g').attr('class', 'y-axis').call(d3.axisLeft(yAxis));

    // add title
    chart.append('text').attr('class', 'chart-title');

    // add legend
    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr(
        'transform',
        `translate(${chartWidth + charMargins.left}, ${charMargins.top + 10})`,
      );

    // border
    legend
      .append('rect')
      .attr('width', 85)
      .attr('height', 85)
      .style('fill', 'none')
      .style('stroke-width', 1)
      .style('stroke', 'black');

    // boxes
    legend
      .selectAll('boxes')
      .data(wealthLevels)
      .enter()
      .append('rect')
      .attr('x', 4)
      .attr('y', (_, i) => 10 + i * 14)
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', d => colorScale(d));

    // Labels
    legend
      .selectAll('labels')
      .data(wealthLevels)
      .enter()
      .append('text')
      .attr('x', 25)
      .attr('y', (_, i) => i * 14 + 16)
      .text(d => d)
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle');
  }, [chartHeight, chartWidth, colorScale, xMax, xMin, yMax, yMin]);

  useEffect(() => {
    if (!chartDivRef.current) {
      return;
    }

    const lineData: Map<
      string,
      Array<{ year: number; value: number }>
    > = new Map();

    for (const wealth of wealthLevels) {
      lineData.set(wealth, []);
    }

    for (const [year, values] of Object.entries(data.values)) {
      values.forEach((v, i) => {
        lineData.get(wealthLevels[i])?.push({
          year: parseInt(year, 10),
          value: v,
        });
      });
    }

    const xAxis = d3.scaleLinear().domain([xMin, xMax]).range([0, chartWidth]);
    const yAxis = d3.scaleLinear().domain([yMin, yMax]).range([chartHeight, 0]);

    const svg = d3
      .select(chartDivRef.current)
      .select<SVGElement>('svg')
      .attr('width', width)
      .attr('height', height);

    const chart = svg
      .select('.chart')
      .attr('transform', `translate(${charMargins.left}, ${charMargins.top})`);

    // update x-axis
    chart
      .select<SVGGElement>('.x-axis')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xAxis).tickFormat(d3.format('d')));

    // update y-axis
    chart.select<SVGGElement>('.y-axis').call(d3.axisLeft(yAxis));

    // update lines
    let lines = chart.selectAll('.line').data(lineData);

    // only add bars once
    if (lines.empty()) {
      lines = lines
        .join('path')
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', d => colorScale(d[0]))
        .attr('stroke-width', 1.5);
    }

    lines.attr('d', dt => {
      return d3
        .line()
        .x(d => {
          // @ts-expect-error

          return xAxis(d.year);
        })
        .y(d => {
          // @ts-expect-error

          return yAxis(d.value);
          // @ts-expect-error
        })(dt[1]);
    });

    chart.selectAll('g.dot').remove();

    chart
      .selectAll('g.dot')
      .data(lineData)
      .enter()
      .append('g')
      .attr('class', 'dot')
      .attr('fill', d => colorScale(d[0]))
      .selectAll('circle')
      .data(d => {
        return d[1];
      })
      .enter()
      .append('circle')
      .attr('r', 2)
      .attr('cx', d => {
        return xAxis(d.year);
      })
      .attr('cy', d => {
        return yAxis(d.value);
      });

    // update title
    chart
      .select<SVGTextElement>('.chart-title')
      .attr('x', chartWidth / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('text-transform', 'capitalize')
      .style('fill', '#233')
      .text(`Average ${indicator} @ ${data.country}`);
  }, [
    chartHeight,
    chartWidth,
    colorScale,
    data.country,
    data.values,
    height,
    indicator,
    width,
    xMax,
    xMin,
    yMax,
    yMin,
  ]);

  return createPortal(
    <motion.div
      className={styles.popover}
      ref={popoverDivRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.chart} ref={chartDivRef} />
      <footer className={styles.footnote}>
        Average gap between the richest and the poorest: {data.gap.toFixed(2)}
      </footer>
    </motion.div>,
    document.body,
  );
}
