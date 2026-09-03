import { useState } from 'react'
import { costLesson, luckGate, tradingViews, type Bar } from '../data/content'

/**
 * The trading results, plotted from the report rather than screenshotted.
 *
 * Colour here encodes POLARITY, not identity — the whole finding is that
 * these numbers change sign — so it is a diverging pair on a neutral
 * zero line, not a categorical set. The palette validator's lightness
 * band is a categorical rule and is deliberately not applied: a red at
 * the same OKLab lightness as this cyan does not exist at usable chroma.
 * What does apply, and passes, is CVD separation (ΔE 16.6 deutan, 24.3
 * tritan) and contrast against the surface. Nothing is carried by colour
 * alone either — every bar is directly labelled with its signed value,
 * and a table view holds the same numbers.
 */
const NEG = '#ff6b6b'
const POS = '#6fd0e8'
const HILITE = '#f0b45c'

function BarChart({
  bars,
  unit,
  hovered,
  onHover,
}: {
  bars: Bar[]
  unit: string
  hovered: number | null
  onHover: (i: number | null) => void
}) {
  const max = Math.max(...bars.map((b) => Math.abs(b.value)))
  const H = 214
  const W = 460
  const PAD_L = 34
  const PAD_B = 34
  const plotH = H - PAD_B - 12
  const zeroY = 12 + (plotH * max) / (2 * max)
  const bw = (W - PAD_L - 8) / bars.length
  const scale = (v: number) => (Math.abs(v) / max) * (plotH / 2)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label={`Bar chart, ${unit}. ${bars.map((b) => `${b.label} ${b.value}`).join('; ')}`}
    >
      {/* recessive grid */}
      {[-1, -0.5, 0.5, 1].map((f) => (
        <line
          key={f}
          x1={PAD_L}
          x2={W - 4}
          y1={zeroY - (plotH / 2) * f}
          y2={zeroY - (plotH / 2) * f}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[color:var(--color-hud)]/10"
        />
      ))}
      {[-1, -0.5, 0.5, 1].map((f) => (
        <text
          key={`t${f}`}
          x={PAD_L - 6}
          y={zeroY - (plotH / 2) * f + 3}
          textAnchor="end"
          className="fill-[color:var(--on-surface-soft)] text-[8px]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {Math.round(max * f)}
        </text>
      ))}

      {/* the zero line is the whole point, so it is the strongest rule */}
      <line
        x1={PAD_L}
        x2={W - 4}
        y1={zeroY}
        y2={zeroY}
        stroke="currentColor"
        strokeWidth={1.5}
        className="text-[color:var(--on-surface-soft)]"
      />

      {bars.map((b, i) => {
        const h = scale(b.value)
        const x = PAD_L + i * bw + 4
        const w = bw - 10
        const up = b.value >= 0
        const y = up ? zeroY - h : zeroY
        const on = hovered === i
        return (
          <g
            key={b.label}
            onPointerEnter={() => onHover(i)}
            onPointerLeave={() => onHover(null)}
            tabIndex={0}
            onFocus={() => onHover(i)}
            onBlur={() => onHover(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* hit target, larger than the mark */}
            <rect x={x - 4} y={12} width={w + 8} height={plotH} fill="transparent" />
            <rect
              x={x}
              y={y}
              width={w}
              height={Math.max(h, 1.5)}
              rx={3}
              fill={b.note ? HILITE : up ? POS : NEG}
              opacity={hovered === null || on ? 1 : 0.42}
            />
            {/* signed direct label — identity never rests on colour */}
            {/* The value sits just outside the bar end, clamped so a full-height
                bar cannot push its label onto the category row. */}
            <text
              x={x + w / 2}
              y={up ? Math.max(10, y - 5) : Math.min(zeroY + plotH / 2 + 8, y + h + 10)}
              textAnchor="middle"
              className="fill-[color:var(--on-surface)] text-[8px]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {b.value > 0 ? '+' : ''}
              {b.value}
            </text>
            <text
              x={x + w / 2}
              y={H - 6}
              textAnchor="middle"
              className="fill-[color:var(--on-surface-soft)] text-[8px]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {b.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function Readout({ bar }: { bar: Bar | null }) {
  if (!bar) {
    return (
      <p className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--on-surface-soft)]">
        Hover or tab a bar for its trade statistics.
      </p>
    )
  }
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-1 font-[family-name:var(--font-mono)] text-[11px] sm:grid-cols-4">
      {[
        ['Trades', bar.trades.toLocaleString()],
        ['Win rate', `${bar.win}%`],
        ['Risk / reward', bar.rr.toFixed(2)],
        ['Expectancy', `${bar.exp > 0 ? '+' : ''}${bar.exp}%`],
      ].map(([k, v]) => (
        <div key={k}>
          <dt className="text-[color:var(--on-surface-soft)]">{k}</dt>
          <dd className="tnum text-[color:var(--color-hud)]">{v}</dd>
        </div>
      ))}
      {bar.note && (
        <div className="col-span-2 sm:col-span-4">
          <dd className="text-[color:var(--color-amber)]">{bar.note}</dd>
        </div>
      )}
    </dl>
  )
}

export function QuantChart() {
  const [view, setView] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const [table, setTable] = useState(false)
  const v = tradingViews[view]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tradingViews.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setView(i)
              setHovered(null)
            }}
            aria-pressed={view === i}
            className={[
              'stencil flex h-11 items-center border-l-2 px-3 text-[10px] transition-all duration-200',
              view === i
                ? 'border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/12 text-[color:var(--on-surface)]'
                : 'border-[color:var(--color-hud-dim)]/50 text-[color:var(--on-surface-soft)] hover:border-[color:var(--color-hud)]',
            ].join(' ')}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="plate p-4">
        <p className="stencil text-[11px] text-[color:var(--color-hud)]">{v.title}</p>
        <p className="mb-3 text-[13px] leading-relaxed text-[color:var(--on-surface-soft)]">
          {v.lede}
        </p>

        {/* legend — present because two encodings are in play */}
        <ul className="mb-2 flex flex-wrap gap-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">
          {[
            ['Gain', POS],
            ['Loss', NEG],
            ['The one that looks like a discovery', HILITE],
          ].map(([label, c]) => (
            <li key={label} className="flex items-center gap-2">
              <span className="inline-block h-2 w-3 rounded-[2px]" style={{ background: c }} />
              {label}
            </li>
          ))}
        </ul>

        <BarChart bars={v.bars} unit={v.unit} hovered={hovered} onHover={setHovered} />

        <div className="mt-2 min-h-[3.2rem]">
          <Readout bar={hovered === null ? null : v.bars[hovered]} />
        </div>

        <p className="mt-3 border-t border-[color:var(--color-hud)]/15 pt-3 text-[13px] leading-relaxed">
          {v.takeaway}
        </p>

        <button
          type="button"
          onClick={() => setTable((t) => !t)}
          className="stencil mt-3 h-11 border border-[color:var(--color-hud)]/40 px-3 text-[10px] text-[color:var(--on-surface-soft)] hover:text-[color:var(--color-hud)]"
        >
          {table ? 'Hide the numbers' : 'Show the numbers'}
        </button>

        {table && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-left font-[family-name:var(--font-mono)] text-[11px]">
              <thead>
                <tr className="border-b border-[color:var(--color-hud)]/25 text-[color:var(--color-hud)]">
                  <th className="py-1 pr-3">Period</th>
                  <th className="py-1 pr-3">Trades</th>
                  <th className="py-1 pr-3">Win</th>
                  <th className="py-1 pr-3">R/R</th>
                  <th className="py-1 pr-3">Expectancy</th>
                  <th className="py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {v.bars.map((b) => (
                  <tr key={b.label} className="border-b border-[color:var(--color-hud)]/10">
                    <td className="py-1 pr-3">{b.label}</td>
                    <td className="tnum py-1 pr-3">{b.trades.toLocaleString()}</td>
                    <td className="tnum py-1 pr-3">{b.win}%</td>
                    <td className="tnum py-1 pr-3">{b.rr.toFixed(2)}</td>
                    <td className="tnum py-1 pr-3">
                      {b.exp > 0 ? '+' : ''}
                      {b.exp}%
                    </td>
                    <td className="tnum py-1">
                      {b.value > 0 ? '+' : ''}
                      {b.value}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* The cost lesson is one comparison, so it is a stat pair, not a chart. */}
      <div className="plate p-4">
        <p className="stencil text-[11px] text-[color:var(--color-hud)]">
          The cost lesson — EUR/USD 2009, one model
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[costLesson.before, costLesson.after].map((s, i) => (
            <div key={s.label} className="border-l-2 pl-3" style={{ borderColor: i ? NEG : POS }}>
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--on-surface-soft)]">
                {s.label}
              </p>
              <p className="stencil tnum text-2xl" style={{ color: i ? NEG : POS }}>
                {s.pct > 0 ? '+' : ''}
                {s.pct}%
              </p>
              <p className="font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--on-surface-soft)]">
                final equity {s.equity}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[13px] leading-relaxed">
          {costLesson.note} <span className="tnum">{costLesson.trades.toLocaleString()}</span> trades.
        </p>
      </div>

      {/* The gate */}
      <div className="plate p-4">
        <p className="stencil text-[11px] text-[color:var(--color-hud)]">
          The luck gate — ten pure-noise strategies
        </p>
        <ul className="mt-3 space-y-2">
          {luckGate.map((g) => (
            <li key={g.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12px]">{g.label}</span>
                <span
                  className="tnum font-[family-name:var(--font-mono)] text-[12px]"
                  style={{ color: g.kind === 'honest' ? POS : NEG }}
                >
                  {g.value.toFixed(3)}
                </span>
              </div>
              <div className="mt-1 h-2 w-full bg-[color:var(--color-hud)]/10">
                <div
                  className="h-full rounded-r-[2px]"
                  style={{
                    width: `${g.value * 100}%`,
                    background: g.kind === 'honest' ? POS : NEG,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] leading-relaxed">
          Given ten tries at pure noise, the naive statistic says 87% confident. The deflated Sharpe
          knows how many tries were taken and returns 0.245 — correctly calling it luck-of-ten. That
          gate is the actual deliverable of the project.
        </p>
      </div>
    </div>
  )
}
