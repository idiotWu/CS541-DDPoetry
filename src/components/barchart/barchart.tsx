import * as d3 from 'd3';
import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

import type { Entry } from '@interfaces';

import styles from './barchart.module.scss';

const charMargins = { top: 60, right: 20, bottom: 40, left: 60 };
const wealthLevels = ['poorest', 'poor', 'middle', 'rich', 'richest'];

export type BarChartProps = {
  indicator: string;
  data: Entry;
  color?: string;
  width?: number;
  height?: number;
};

export function BarChart({
  indicator,
  data,
  color = '#69b3a2',
  width = 500,
  height = 300,
}: BarChartProps) {
  const chartDivRef = useRef<HTMLDivElement>(null);
  const popoverDivRef = useRef<HTMLDivElement>(null);
  const chartWidth = width - charMargins.left - charMargins.right;
  const chartHeight = height - charMargins.top - charMargins.bottom;

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

    const xAxis = d3.scaleLinear().domain([0, 1]).range([0, chartWidth]);
    const yAxis = d3
      .scaleBand()
      .range([0, chartHeight])
      .domain(wealthLevels)
      .padding(0.5);

    // add x-axis
    chart.append('g').attr('class', 'x-axis').call(d3.axisBottom(xAxis));

    // add y-axis
    chart.append('g').attr('class', 'y-axis').call(d3.axisLeft(yAxis));

    // add title
    chart.append('text').attr('class', 'chart-title');
  }, [chartHeight, chartWidth]);

  useEffect(() => {
    if (!chartDivRef.current) {
      return;
    }

    const barData = data.values.map((v, i) => ({
      wealthLevel: wealthLevels[i],
      value: v,
    }));

    const xAxis = d3.scaleLinear().domain([0, 1]).range([0, chartWidth]);
    const yAxis = d3
      .scaleBand()
      .range([0, chartHeight])
      .domain(wealthLevels)
      .padding(0.5);

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
      .call(d3.axisBottom(xAxis));

    // update y-axis
    chart.select<SVGGElement>('.y-axis').call(d3.axisLeft(yAxis));

    // update bars
    let bars = chart.selectAll('.bar').data(barData);

    // only add bars once
    if (bars.empty()) {
      bars = bars.join('rect').attr('class', 'bar');
    }

    bars
      .attr('x', xAxis(0))
      .attr('y', d => yAxis(d.wealthLevel)!)
      .attr('height', yAxis.bandwidth())
      .attr('fill', color)
      .transition()
      .attr('width', d => xAxis(d.value))
      .duration(300);

    // update values
    let valueLabels = chart.selectAll('.value').data(barData);

    if (valueLabels.empty()) {
      valueLabels = valueLabels.join('text').attr('class', 'value');
    }

    valueLabels
      .attr('y', d => yAxis(d.wealthLevel)!)
      .transition()
      .attr('x', d => xAxis(d.value) - 4)
      .duration(300)
      .style('font-size', '12px')
      .style('fill', d3.hsl(color).l > 0.7 ? 'black' : 'white')
      .attr('text-anchor', 'end')
      .attr('dy', yAxis.bandwidth() - 5)
      .text(d => d.value.toFixed(2));

    // update title
    chart
      .select<SVGTextElement>('.chart-title')
      .attr('x', chartWidth / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('fill', '#233')
      .text(`${indicator} @ ${data.country}`);
  }, [chartHeight, chartWidth, color, data, height, indicator, width]);

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
    </motion.div>,
    document.body,
  );
}
