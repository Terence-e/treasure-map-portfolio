import { Suspense, useEffect, useState } from 'react'
import { Scene } from './three/Scene'
import { GlassDefs } from './components/Glass'
import { Header } from './components/Header'
import { HoverCard } from './components/HoverCard'
import { Panel } from './components/Panel'
import { useReducedMotion } from './hooks'
import { districts, districtById } from './data/world'
import { profile, tally } from './data/content'

export default function App() {
  const reducedMotion = useReducedMotion()
  const [daylight, setDaylight] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('daylight', daylight)
  }, [daylight])

  /* Deep links: /#the-workshop opens that district, and selecting one
     writes the hash back, so a district can be shared or bookmarked. */
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace('#', '')
      setActiveId(districtById(id) ? id : null)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const select = (id: string) => {
    setActiveId(id)
    if (window.location.hash !== `#${id}`) {
      window.history.replaceState(null, '', `#${id}`)
    }
  }

  const deselect = () => {
    setActiveId(null)
    window.history.replaceState(null, '', window.location.pathname)
  }

  return (
    <div className="scanlines fixed inset-0 overflow-hidden">
      <GlassDefs />

      <a className="skip-link" href="#district-list">
        Skip to the district list
      </a>

      <Suspense fallback={null}>
        <Scene
          activeId={activeId}
          hoveredId={hoveredId}
          daylight={daylight}
          reducedMotion={reducedMotion}
          onHover={setHoveredId}
          onSelect={select}
          onDeselect={deselect}
        />
      </Suspense>

      <Header
        activeId={activeId}
        panelOpen={activeId !== null}
        daylight={daylight}
        onSelect={select}
        onToggleTheme={() => setDaylight((d) => !d)}
      />

      <HoverCard id={activeId ? null : hoveredId} />
      <Panel id={activeId} onClose={deselect} />

      {/* Controls hint and the headline numbers, out of the way at the
          bottom-left. Hidden once a panel is open. */}
      {!activeId && (
        <div className="pointer-events-none fixed bottom-3 left-3 z-30 max-w-[22rem] sm:bottom-5 sm:left-5">
          <div className="glass bracketed p-4">
            <p className="stencil text-[10px] text-[color:var(--color-hud)]">
              Drag to look · scroll to zoom · click a district
            </p>
            <dl className="mt-3 grid grid-cols-4 gap-px bg-[color:var(--color-hud)]/15">
              {tally.map((t) => (
                <div key={t.label} className="bg-[color:var(--surface)]/80 px-2 py-2">
                  <dt className="stencil tnum text-[13px] text-[color:var(--color-amber)]">
                    {t.value}
                  </dt>
                  <dd className="font-[family-name:var(--font-mono)] text-[8px] uppercase leading-tight tracking-[0.1em] text-[color:var(--on-surface-soft)]">
                    {t.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {/*
        The canvas is decorative and unreachable by keyboard, so every
        district also exists here as a real link with its real content
        summary. Screen readers and no-WebGL browsers get the whole map
        as a list; sighted users never see it.
      */}
      <div id="district-list" className="sr-only">
        <h2>Districts</h2>
        <p>
          {profile.name} — {profile.role}, {profile.location}. {profile.summary}
        </p>
        <ul>
          {districts.map((d) => (
            <li key={d.id}>
              <button type="button" onClick={() => select(d.id)}>
                {d.name}: {d.subtitle}. {d.blurb}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
