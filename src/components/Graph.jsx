// Gráfico simple 2D en SVG puro (sin librerías externas) para mostrar
// la función asociada al ejercicio: lineal, cuadrática o senoidal.

const WIDTH = 400;
const HEIGHT = 240;
const PAD = { left: 46, right: 16, top: 16, bottom: 36 };

function evaluate(type, params, x) {
  if (type === 'linear') {
    const { m = 1, b = 0 } = params || {};
    return m * x + b;
  }
  if (type === 'quadratic') {
    const { a = 1, b = 0, c = 0 } = params || {};
    return a * x * x + b * x + c;
  }
  if (type === 'sine') {
    const { amplitude = 1, omega = 1, phase = 0 } = params || {};
    return amplitude * Math.sin(omega * x + phase);
  }
  return 0;
}

export default function Graph({ graph }) {
  if (!graph || !graph.type) return null;

  const { type, xLabel, yLabel, xMin = 0, xMax = 10, params } = graph;
  const N = 100;
  const points = [];
  let yMin = Infinity, yMax = -Infinity;

  for (let i = 0; i <= N; i++) {
    const x = xMin + ((xMax - xMin) * i) / N;
    const y = evaluate(type, params, x);
    points.push([x, y]);
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  }

  if (yMin === yMax) { yMin -= 1; yMax += 1; }
  const yPad = (yMax - yMin) * 0.1;
  yMin -= yPad;
  yMax += yPad;

  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;

  const toSvgX = x => PAD.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = y => PAD.top + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const pathD = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(x).toFixed(2)} ${toSvgY(y).toFixed(2)}`)
    .join(' ');

  const zeroY = yMin <= 0 && yMax >= 0 ? toSvgY(0) : null;
  const zeroX = xMin <= 0 && xMax >= 0 ? toSvgX(0) : null;

  const xTicks = 5;
  const yTicks = 4;

  return (
    <div className="graph-card">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="graph-svg">
        {/* ejes de referencia en 0 si están dentro del rango */}
        {zeroY !== null && (
          <line x1={PAD.left} y1={zeroY} x2={WIDTH - PAD.right} y2={zeroY} className="graph-zero-axis" />
        )}
        {zeroX !== null && (
          <line x1={zeroX} y1={PAD.top} x2={zeroX} y2={HEIGHT - PAD.bottom} className="graph-zero-axis" />
        )}

        {/* marco de ejes */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={HEIGHT - PAD.bottom} className="graph-axis" />
        <line x1={PAD.left} y1={HEIGHT - PAD.bottom} x2={WIDTH - PAD.right} y2={HEIGHT - PAD.bottom} className="graph-axis" />

        {/* ticks eje x */}
        {Array.from({ length: xTicks + 1 }, (_, i) => {
          const x = xMin + ((xMax - xMin) * i) / xTicks;
          const sx = toSvgX(x);
          return (
            <g key={`x${i}`}>
              <line x1={sx} y1={HEIGHT - PAD.bottom} x2={sx} y2={HEIGHT - PAD.bottom + 4} className="graph-axis" />
              <text x={sx} y={HEIGHT - PAD.bottom + 16} className="graph-tick-label" textAnchor="middle">
                {x.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* ticks eje y */}
        {Array.from({ length: yTicks + 1 }, (_, i) => {
          const y = yMin + ((yMax - yMin) * i) / yTicks;
          const sy = toSvgY(y);
          return (
            <g key={`y${i}`}>
              <line x1={PAD.left - 4} y1={sy} x2={PAD.left} y2={sy} className="graph-axis" />
              <text x={PAD.left - 8} y={sy + 3} className="graph-tick-label" textAnchor="end">
                {y.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* curva */}
        <path d={pathD} className="graph-curve" fill="none" />

        {/* labels de ejes */}
        <text x={WIDTH / 2} y={HEIGHT - 4} className="graph-axis-label" textAnchor="middle">{xLabel}</text>
        <text x={12} y={HEIGHT / 2} className="graph-axis-label" textAnchor="middle" transform={`rotate(-90 12 ${HEIGHT / 2})`}>{yLabel}</text>
      </svg>
    </div>
  );
}
