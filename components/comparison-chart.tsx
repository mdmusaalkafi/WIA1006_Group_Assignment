import { MetricRow } from '../lib/project-data';

type Props = {
  rows: MetricRow[];
  metricKey?: 'accuracy' | 'precision' | 'recall' | 'f1' | 'auc';
};

const metricOrder = [
  { key: 'accuracy' as const, label: 'Accuracy' },
  { key: 'precision' as const, label: 'Precision' },
  { key: 'recall' as const, label: 'Recall' },
  { key: 'f1' as const, label: 'F1' },
  { key: 'auc' as const, label: 'ROC-AUC' },
];

function formatPercent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}

export function ComparisonBars({ rows, metricKey = 'f1' }: Props) {
  const bestMetric = Math.max(...rows.map((row) => row[metricKey]));
  const activeMetric = metricOrder.find((metric) => metric.key === metricKey) ?? metricOrder[3];

  return (
    <div className="bar-list">
      {rows.slice(0, 6).map((row) => {
        const highlight = row[metricKey] === bestMetric;
        return (
          <div className="bar-item" key={`${row.model}-${row.setup}`}>
            <div className="bar-row">
              <div>
                <strong>{row.model}</strong>
                <span className="subtle">{row.setup}</span>
              </div>
              <div className="bar-track" aria-hidden="true">
                <div
                  className="bar-fill"
                  style={{ width: `${Math.max(row[metricKey], 0.03) * 100}%`, opacity: highlight ? 1 : 0.82 }}
                />
              </div>
              <div className="bar-value">{formatPercent(row[metricKey])}</div>
            </div>
            <span className="subtle">{activeMetric.label}</span>
          </div>
        );
      })}
    </div>
  );
}

type RadarProps = {
  row: MetricRow;
};

export function RadarChart({ row }: RadarProps) {
  const size = 420;
  const center = size / 2;
  const radius = 145;
  const points = metricOrder.map((metric, index) => {
    const value = row[metric.key];
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / metricOrder.length;
    return {
      x: center + Math.cos(angle) * radius * value,
      y: center + Math.sin(angle) * radius * value,
      label: metric.label,
      raw: value,
      angle,
    };
  });

  const polygon = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <div className="svg-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${row.model} radar chart`}>
        {[0.25, 0.5, 0.75, 1].map((tick) => (
          <circle key={tick} cx={center} cy={center} r={radius * tick} fill="none" stroke="rgba(18,38,58,0.12)" />
        ))}
        {points.map((point) => (
          <line
            key={point.label}
            x1={center}
            y1={center}
            x2={center + Math.cos(point.angle) * radius}
            y2={center + Math.sin(point.angle) * radius}
            stroke="rgba(18,38,58,0.12)"
          />
        ))}
        <polygon points={polygon} fill="rgba(240,109,94,0.26)" stroke="var(--coral)" strokeWidth="3" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="5" fill="var(--navy)" />
            <text
              x={center + Math.cos(point.angle) * (radius + 24)}
              y={center + Math.sin(point.angle) * (radius + 24)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--navy)"
              fontSize="14"
              fontWeight="700"
            >
              {metricOrder.find((metric) => metric.label === point.label)?.label}
            </text>
          </g>
        ))}
        <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" fill="var(--navy)" fontSize="16" fontWeight="800">
          {formatPercent(row.f1)} F1
        </text>
      </svg>
    </div>
  );
}
