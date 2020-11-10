import React from 'react';
import { line } from 'd3'

function ScenarioGraphPath({ data, prop, x, y, color }) {
  const coords = data.map((d) => [x(d.ts), y(d[prop])])
  const l = line()(coords)

  return <path d={l} stroke={color} fill="none" strokeWidth="2" />
}

export default ScenarioGraphPath;
