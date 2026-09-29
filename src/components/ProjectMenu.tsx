import { useEffect, useRef } from 'react'
import { projects } from '../data/content'
import { districts } from '../data/world'
import { DistrictIcon } from './DistrictIcon'

/**
 * The quick project list.
 *
 * The 3D map is the main way in, but it asks a visitor to explore before
 * they can tell whether anything here is relevant to them. This is the
 * flat alternative: every project, grouped by district, one click from
 * its full write-up.
 */
export function ProjectMenu({
  open,
  onClose,
  onOpenProject,
}: {
  open: boolean
  onClose: () => void
  onOpenProject: (districtId: string, projectId: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const projectDistricts = districts.filter((d) => d.kind.sort === 'projects')

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-3 pt-20 sm:pt-28" role="presentation">
      <button
        type="button"
        aria-label="Close project list"
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="All projects"
        className="glass glass-refract bracketed relative z-10 max-h-[74dvh] w-full max-w-2xl overflow-y-auto p-5 sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-amber)]">
              Full index
            </p>
            <h2 className="stencil mt-1 text-xl text-[color:var(--on-surface)] sm:text-2xl">
              All projects
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="stencil flex h-11 min-w-11 items-center justify-center border border-[color:var(--color-hud)]/40 px-3 text-[10px] text-[color:var(--on-surface-soft)] transition-colors hover:border-[color:var(--color-crimson)] hover:text-[color:var(--color-crimson)]"
          >
            Close
          </button>
        </div>
        <div className="rule-hud mt-3 mb-5" />

        <div className="space-y-6">
          {projectDistricts.map((d) => {
            const list = projects.filter((p) => d.kind.sort === 'projects' && p.group === d.kind.group)
            if (!list.length) return null
            return (
              <div key={d.id}>
                <p
                  className="stencil mb-2 flex items-center gap-2 text-[11px]"
                  style={{ color: d.colour }}
                >
                  <DistrictIcon id={d.id} />
                  {d.name}
                  <span className="text-[10px] font-normal normal-case text-[color:var(--on-surface-soft)]">
                    · {d.subtitle}
                  </span>
                </p>
                <ul className="space-y-1">
                  {list.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onOpenProject(d.id, p.id)}
                        className="flex w-full min-h-11 items-center justify-between gap-4 border-l-2 border-[color:var(--color-hud-dim)]/50 bg-[color:var(--color-hud)]/4 px-4 py-2 text-left transition-all duration-200 hover:border-[color:var(--color-amber)] hover:bg-[color:var(--color-hud)]/12"
                      >
                        <span className="text-[13px] leading-snug">{p.name}</span>
                        <span className="tnum shrink-0 border border-[color:var(--color-amber)]/40 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase text-[color:var(--color-amber)]">
                          {p.badge}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
