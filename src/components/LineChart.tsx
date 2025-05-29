import React from 'react';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { curveMonotoneX } from '@visx/curve';
import { ParentSize } from '@visx/responsive';
import type { ChartData } from '../types';

interface LineChartProps {
  data: ChartData[];
  title: string;
  color?: string;
}

// Helper function to safely parse date string without timezone issues
const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

const LineChartInner: React.FC<LineChartProps & { width: number; height: number }> = ({
  data,
  title,
  color = '#3b82f6',
  width,
  height
}) => {
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  if (data.length === 0) {
    return (
      <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>No data available</p>
      </div>
    );
  }

  // Accessors
  const getDate = (d: ChartData) => parseDate(d.date);
  const getValue = (d: ChartData) => d.value;

  // Scales
  const dateScale = scaleTime({
    range: [0, xMax],
    domain: [
      Math.min(...data.map(getDate).map(d => d.getTime())),
      Math.max(...data.map(getDate).map(d => d.getTime()))
    ]
  });

  const valueScale = scaleLinear({
    range: [yMax, 0],
    domain: [1, 5],
    nice: true
  });

  return (
    <div>
      <h3 style={{ textAlign: 'center', margin: '0 0 10px 0', color: 'var(--text-color)' }}>
        {title}
      </h3>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={valueScale}
            width={xMax}
            height={yMax}
            stroke="var(--border-color)"
            strokeOpacity={0.3}
          />
          <GridColumns
            scale={dateScale}
            width={xMax}
            height={yMax}
            stroke="var(--border-color)"
            strokeOpacity={0.3}
          />
          <LinePath
            data={data}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => valueScale(getValue(d)) ?? 0}
            stroke={color}
            strokeWidth={2}
            curve={curveMonotoneX}
          />
          <AxisBottom
            top={yMax}
            scale={dateScale}
            numTicks={width > 520 ? 10 : 5}
            stroke="var(--text-color)"
            tickStroke="var(--text-color)"
            tickLabelProps={{
              fill: 'var(--text-color)',
              fontSize: 11,
              textAnchor: 'middle'
            }}
          />
          <AxisLeft
            scale={valueScale}
            stroke="var(--text-color)"
            tickStroke="var(--text-color)"
            tickLabelProps={{
              fill: 'var(--text-color)',
              fontSize: 11,
              textAnchor: 'end'
            }}
          />
        </Group>
      </svg>
    </div>
  );
};

const LineChart: React.FC<LineChartProps> = (props) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <LineChartInner {...props} width={width} height={height || 400} />
      )}
    </ParentSize>
  );
};

export default LineChart; 