import { districts } from '../data/world'
import { DistrictIcon } from './DistrictIcon'
import { profile } from '../data/content'

type Props = {
  activeId: string | null
  panelOpen: boolean
  daylight: boolean
  onSelect: (id: string) => void
  onToggleTheme: () => void
}

/**
 * The masthead. Whoever lands here should know whose portfolio this is
 * before they touch anything, so the name sits above the world rather
 * than inside it — and the district chips give a keyboard route to every
 * place on the map, which a 3D canvas cannot provide on its own.
 */
export function Header({ activeId, panelOpen, daylight, onSelect, onToggleTheme }: Props) {
  return (
    <header
      className={[
        'pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 transition-[padding] duration-300 sm:px-5 sm:pt-5',
        // Give the drawer its column back rather than sliding underneath it.
        panelOpen ? 'sm:pr-[calc(min(34rem,92vw)+1.25rem)]' : '',
      ].join(' ')}
    >
      <div className="glass glass-refract bracketed pointer-events-auto px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-amber)]">
              Welcome to my portfolio
            </p>
            <h1 className="stencil text-xl leading-tight text-[color:var(--on-surface)] sm:text-3xl">
              {profile.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden text-right text-sm text-[color:var(--color-hud)] md:block">
              {profile.role}
              <span className="block font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--on-surface-soft)]">
                {profile.location}
              </span>
            </p>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-pressed={daylight}
              className="stencil flex h-11 items-center gap-2 border border-[color:var(--color-hud)]/40 px-3 text-[10px] text-[color:var(--on-surface-soft)] transition-colors duration-200 hover:border-[color:var(--color-hud)] hover:text-[color:var(--color-hud)]"
            >
              <SunMoon daylight={daylight} />
              <span className="hidden sm:inline">{daylight ? 'High ambient' : 'Night optics'}</span>
            </button>
          </div>
        </div>

        <nav aria-label="Districts" className="chip-rail mt-3 -mb-1 overflow-x-auto pb-1">
          <ul className="flex gap-2">
            {districts.map((d) => {
              const on = activeId === d.id
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(d.id)}
                    aria-current={on ? 'true' : undefined}
                    className={[
                      'group stencil flex h-11 shrink-0 items-center gap-2 whitespace-nowrap border-l-2 px-3 text-[10px] transition-all duration-200',
                      on
                        ? 'border-[color:var(--color-crimson)] bg-[color:var(--color-crimson)]/12 text-[color:var(--on-surface)]'
                        : 'border-[color:var(--color-hud-dim)]/40 text-[color:var(--on-surface-soft)] hover:border-[color:var(--color-hud)] hover:text-[color:var(--on-surface)]',
                    ].join(' ')}
                  >
                    <span
                      className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ color: d.colour }}
                    >
                      <DistrictIcon id={d.id} />
                    </span>
                    {d.name}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function SunMoon({ daylight }: { daylight: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {daylight ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      ) : (
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      )}
    </svg>
  )
}
