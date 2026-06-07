'use client';

import { useMemo, useState } from 'react';
import { ComparisonBars, RadarChart } from '../components/comparison-chart';
import {
  featureTracks,
  groupMembers,
  imbalanceFrames,
  insights,
  modelProfiles,
  modelRuns,
  narrativePoints,
  pipeline,
  projectMeta,
  storyModes,
} from '../lib/project-data';

const filters = ['All', 'XGBoost', 'Random Forest', 'KNN', 'Logistic Regression', 'SVM', 'AutoML'] as const;
const lensKeys = ['honest', 'balanced', 'optimistic'] as const;
const focusMetrics = ['f1', 'auc', 'recall', 'accuracy'] as const;

function rowKey(row: (typeof modelRuns)[number]) {
  return `${row.model}::${row.setup}`;
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All');
  const [activeLens, setActiveLens] = useState<(typeof lensKeys)[number]>('balanced');
  const [activeMetric, setActiveMetric] = useState<(typeof focusMetrics)[number]>('f1');
  const [selectedRunKey, setSelectedRunKey] = useState(rowKey(modelRuns[7]));
  const [recallBias, setRecallBias] = useState(74);
  const [interpretabilityBias, setInterpretabilityBias] = useState(62);
  const [stabilityBias, setStabilityBias] = useState(68);

  const visibleRows = useMemo(() => {
    return activeFilter === 'All' ? modelRuns : modelRuns.filter((row) => row.model === activeFilter);
  }, [activeFilter]);

  const bestRow = useMemo(() => {
    return [...modelRuns].sort((left, right) => right.f1 - left.f1)[0];
  }, []);

  const selectedRow = useMemo(() => {
    return visibleRows.find((row) => rowKey(row) === selectedRunKey) ?? visibleRows[0] ?? bestRow;
  }, [bestRow, selectedRunKey, visibleRows]);

  const rankedByFocus = useMemo(() => {
    return [...visibleRows].sort((left, right) => right[activeMetric] - left[activeMetric]);
  }, [activeMetric, visibleRows]);

  const strategicRecommendation = useMemo(() => {
    const recallWeight = recallBias / 100;
    const interpretabilityWeight = interpretabilityBias / 100;
    const stabilityWeight = stabilityBias / 100;

    return [...visibleRows]
      .map((row) => {
        const profile = modelProfiles[row.model];
        const weightedScore =
          row.f1 * 0.34 +
          row.auc * 0.24 +
          row.recall * (0.22 * recallWeight) +
          profile.interpretability * (0.1 * interpretabilityWeight) +
          profile.stability * (0.1 * stabilityWeight);

        return {
          ...row,
          weightedScore,
          profile,
        };
      })
      .sort((left, right) => right.weightedScore - left.weightedScore)[0];
  }, [interpretabilityBias, recallBias, stabilityBias, visibleRows]);

  const lens = storyModes[activeLens];
  const spotlightValue = selectedRow[activeMetric];

  const stageSignals = [
    {
      label: 'Majority-class baseline',
      value: '90.27%',
      hint: 'A classifier can look accurate by mostly predicting no relationship.',
    },
    {
      label: 'Best F1 in group outputs',
      value: `${(bestRow.f1 * 100).toFixed(2)}%`,
      hint: 'Random Forest + Dataset B + SMOTE produces the strongest balance.',
    },
    {
      label: 'Why the ceiling happens',
      value: 'Weak separability',
      hint: 'Behavioral variance in the dataset is too noisy for clean long-term classification.',
    },
  ];

  return (
    <div className="shell">
      <section className="hero hero-immersive">
        <div className="panel panel-hero">
          <div className="badge-row">
            <span className="badge">WIA1006 / WID3006 Machine Learning</span>
            <span className="badge">Front-end only dashboard</span>
            <span className="badge">Vercel / Railway deployable</span>
          </div>
          <h1>{projectMeta.title}</h1>
          <p>
            {projectMeta.subtitle}. Instead of pretending this is an easy prediction problem, the dashboard tells the stronger story:
            the pipeline is solid, the comparison is honest, and the data itself explains why model performance saturates near a random-guess ceiling.
          </p>
          <div className="hero-actions">
            <button className="button" onClick={() => document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
              Open strategy studio
            </button>
            <button className="button-secondary" onClick={() => document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
              Explore leaderboard
            </button>
            <button className="button-secondary" onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
              See team roles
            </button>
          </div>
          <div className="badge-row" style={{ marginTop: 18 }}>
            {narrativePoints.map((point) => (
              <span className="badge" key={point}>{point}</span>
            ))}
          </div>
        </div>

        <div className="panel hero-stage">
          <div className="mini-pill">Decision theatre</div>
          <div className="floating-cluster" aria-hidden="true">
            <div className="float-chip coral">swipes</div>
            <div className="float-chip teal">replies</div>
            <div className="float-chip gold">emoji</div>
            <div className="float-chip navy">matches</div>
          </div>
          <div className="baseline-block">
            <span className="baseline-label">Project truth</span>
            <div className="baseline-number">{projectMeta.positiveRate}%</div>
            <p>Only a small portion of cases belong to the positive class, which is why raw accuracy is never enough.</p>
          </div>
          <div className="field-grid">
            {stageSignals.map((signal) => (
              <div className="field-card" key={signal.label}>
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
                <p>{signal.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section story-section">
        <div className="section-header">
          <div>
            <h2>Presentation lens</h2>
            <div className="subtle">Choose how the dashboard frames the story while keeping the evidence fixed.</div>
          </div>
          <div className="tabs">
            {lensKeys.map((lensKey) => (
              <button key={lensKey} className="tab" data-active={activeLens === lensKey} onClick={() => setActiveLens(lensKey)}>
                {storyModes[lensKey].label}
              </button>
            ))}
          </div>
        </div>

        <div className="story-grid">
          <div className="story-card" style={{ borderColor: lens.accent }}>
            <span className="mini-pill">{lens.label}</span>
            <h3>{projectMeta.target}</h3>
            <p>{lens.description}</p>
            <div className="story-wave" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="story-card">
            <span className="mini-pill">Metric spotlight</span>
            <div className="tabs" style={{ marginTop: 12 }}>
              {focusMetrics.map((metric) => (
                <button key={metric} className="tab" data-active={activeMetric === metric} onClick={() => setActiveMetric(metric)}>
                  {metric.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="metric-focus">
              <strong>{(spotlightValue * 100).toFixed(2)}%</strong>
              <p>
                {activeMetric === 'f1' && 'Use this when you want the audience to focus on balanced performance under class imbalance.'}
                {activeMetric === 'auc' && 'Use this when explaining that many models remain close to a random-guess separator.'}
                {activeMetric === 'recall' && 'Use this when you want to highlight how aggressively some models chase the minority class.'}
                {activeMetric === 'accuracy' && 'Use this only with context, because it can seriously mislead under a skewed target.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="studio-layout" id="studio">
        <div className="section slider-card">
          <div className="section-header">
            <div>
              <h2>Model strategy studio</h2>
              <div className="subtle">Tune what matters most and watch the recommended run change in real time.</div>
            </div>
          </div>

          <div className="slider-row">
            <div className="range-header">
              <strong>Recall priority</strong>
              <span>{recallBias}%</span>
            </div>
            <input type="range" min="0" max="100" value={recallBias} onChange={(event) => setRecallBias(Number(event.target.value))} />
            <p className="range-meta">Higher values favor models that catch more positive cases, even if precision drops.</p>
          </div>

          <div className="slider-row">
            <div className="range-header">
              <strong>Interpretability priority</strong>
              <span>{interpretabilityBias}%</span>
            </div>
            <input type="range" min="0" max="100" value={interpretabilityBias} onChange={(event) => setInterpretabilityBias(Number(event.target.value))} />
            <p className="range-meta">Higher values reward models that are easier to explain in a class presentation or report.</p>
          </div>

          <div className="slider-row">
            <div className="range-header">
              <strong>Stability priority</strong>
              <span>{stabilityBias}%</span>
            </div>
            <input type="range" min="0" max="100" value={stabilityBias} onChange={(event) => setStabilityBias(Number(event.target.value))} />
            <p className="range-meta">Higher values emphasize consistent behavior instead of one flashy metric spike.</p>
          </div>

          <div className="strategy-score">
            <span>Recommended run</span>
            <strong>{strategicRecommendation.model}</strong>
            <p>{strategicRecommendation.setup}</p>
            <div className="badge-row">
              <span className="badge">Composite {(strategicRecommendation.weightedScore * 100).toFixed(1)}%</span>
              <span className="badge">Owner {strategicRecommendation.owner}</span>
            </div>
            <p className="footer-note">{strategicRecommendation.profile.narrative}</p>
          </div>
        </div>

        <div className="section strategy-card">
          <div className="section-header">
            <div>
              <h2>Run explorer</h2>
              <div className="subtle">Select a run and inspect the metric shape instead of relying on one headline score.</div>
            </div>
          </div>

          <div className="run-selector">
            {rankedByFocus.slice(0, 8).map((row) => (
              <button
                key={rowKey(row)}
                className="run-pill"
                data-active={rowKey(selectedRow) === rowKey(row)}
                onClick={() => setSelectedRunKey(rowKey(row))}
              >
                <strong>{row.model}</strong>
                <span>{row.setup}</span>
              </button>
            ))}
          </div>

          <RadarChart row={selectedRow} />

          <div className="metric-shelf">
            <div className="metric-box">
              <span>Accuracy</span>
              <strong>{(selectedRow.accuracy * 100).toFixed(2)}%</strong>
            </div>
            <div className="metric-box">
              <span>Precision</span>
              <strong>{(selectedRow.precision * 100).toFixed(2)}%</strong>
            </div>
            <div className="metric-box">
              <span>Recall</span>
              <strong>{(selectedRow.recall * 100).toFixed(2)}%</strong>
            </div>
            <div className="metric-box">
              <span>ROC-AUC</span>
              <strong>{(selectedRow.auc * 100).toFixed(2)}%</strong>
            </div>
          </div>
          <p className="footer-note">{selectedRow.insight}</p>
        </div>
      </section>

      <section className="grid-2">
        <div className="chart-card">
          <div className="chart-title">
            <h3>Highest-scoring runs by current focus</h3>
            <span className="subtle">Top 6 in the selected metric lens</span>
          </div>
          <ComparisonBars rows={rankedByFocus} metricKey={activeMetric} />
        </div>

        <div className="chart-card distribution-card">
          <div className="chart-title">
            <h3>Imbalance theatre</h3>
            <span className="subtle">Why SMOTE matters</span>
          </div>
          {imbalanceFrames.map((frame) => (
            <div className="split-block" key={frame.label}>
              <div className="split-head">
                <strong>{frame.label}</strong>
                <span>{frame.takeaway}</span>
              </div>
              <div className="split-bar">
                <div className="split-bar-fill negative" style={{ width: `${frame.negative}%` }}>
                  {frame.negative.toFixed(2)}%
                </div>
                <div className="split-bar-fill positive" style={{ width: `${frame.positive}%` }}>
                  {frame.positive.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Feature-track trade-off</h2>
            <div className="subtle">Explainability and mathematical compression tell different stories.</div>
          </div>
        </div>
        <div className="feature-track-grid">
          {featureTracks.map((track) => (
            <div className="feature-track-card" key={track.name}>
              <span className="mini-pill">{track.name}</span>
              <strong>{track.label}</strong>
              <p>{track.value}</p>
              <div className="footer-note">{track.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="leaderboard">
        <div className="section-header">
          <div>
            <h2>Model leaderboard</h2>
            <div className="subtle">Filter the runs and compare them under the exact same evaluation metrics.</div>
          </div>
          <div className="tabs">
            {filters.map((filter) => (
              <button key={filter} className="tab" data-active={activeFilter === filter} onClick={() => setActiveFilter(filter)}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Setup</th>
                <th>Owner</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1</th>
                <th>ROC-AUC</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={rowKey(row)}>
                  <td>
                    <strong>{row.model}</strong>
                    <span className="subtle">{modelProfiles[row.model].narrative}</span>
                  </td>
                  <td>{row.setup}</td>
                  <td>{row.owner}</td>
                  <td>{(row.accuracy * 100).toFixed(2)}%</td>
                  <td>{(row.precision * 100).toFixed(2)}%</td>
                  <td>{(row.recall * 100).toFixed(2)}%</td>
                  <td>{(row.f1 * 100).toFixed(2)}%</td>
                  <td>{(row.auc * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-note">This table keeps the uncomfortable truth visible: once imbalance is accounted for, many runs sit close to a random-guess boundary.</div>
      </section>

      <section className="section" id="pipeline">
        <div className="section-header">
          <div>
            <h2>Pipeline narrative</h2>
            <div className="subtle">A strong pipeline matters even when the final classifier has a low ceiling.</div>
          </div>
        </div>
        <div className="timeline">
          {pipeline.map((item) => (
            <div className="timeline-item" key={item.step}>
              <span className="step">Step {item.step}</span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Insights and interpretation</h2>
            <div className="subtle">The dashboard is designed to help you explain why the result ceiling exists, not hide it.</div>
          </div>
        </div>
        <div className="insight-list">
          {insights.map((item) => (
            <div className="insight-card" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="team">
        <div className="section-header">
          <div>
            <h2>Team structure</h2>
            <div className="subtle">Every group member is included with role ownership and matric number.</div>
          </div>
        </div>
        <div className="member-grid">
          {groupMembers.map((member) => (
            <div className="member-card" key={member.matric}>
              <div className="mini-pill">{member.matric}</div>
              <strong>{member.name}</strong>
              <span className="member-role">{member.role}</span>
              <p>{member.focus}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
