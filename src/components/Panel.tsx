import { useEffect, useRef, useState } from 'react'
import {
  about,
  additional,
  alsoRan,
  bicycleBus,
  chessGame,
  experience,
  hardware,
  hobbies,
  languages,
  modules,
  parcours,
  profile,
  projects,
  skills,
  workshop,
  type Project,
} from '../data/content'
import { ChessBoard } from './ChessBoard'
import { QuantChart } from './QuantChart'
import { gallery } from '../data/gallery'
import { districtById } from '../data/world'
import { DistrictIcon } from './DistrictIcon'

/**
 * The district panel.
 *
 * A drawer rather than a page: the world stays on screen behind it, so
 * closing it puts you back exactly where you were standing. It traps
 * nothing, closes on Escape and on the backdrop, and takes focus on open
 * so a keyboard user is not left behind on the canvas.
 */
export function Panel({
  id,
  onClose,
  scrollToProjectId,
  onScrolledToProject,
}: {
  id: string | null
  onClose: () => void
  scrollToProjectId?: string | null
  onScrolledToProject?: () => void
}) {
  const d = districtById(id ?? '')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [id, onClose])

  useEffect(() => {
    if (!id || !scrollToProjectId) return
    const el = document.getElementById(`dossier-${scrollToProjectId}`)
    if (el) {
      el.scrollIntoView({ block: 'start', behavior: 'smooth' })
      el.classList.add('dossier-highlight')
      window.setTimeout(() => el.classList.remove('dossier-highlight'), 1600)
    }
    onScrolledToProject?.()
  }, [id, scrollToProjectId, onScrolledToProject])

  if (!d) return null

  return (
    <aside
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-label={`${d.name} — ${d.subtitle}`}
      className="panel-in fixed inset-x-0 bottom-0 z-40 max-h-[76dvh] overflow-y-auto sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[min(34rem,92vw)]"
    >
      <div className="glass glass-refract min-h-full rounded-none border-y-0 border-r-0 p-5 sm:p-7">
        <div className="sticky -top-5 z-10 -mx-5 -mt-5 mb-5 bg-[color:var(--surface)]/85 px-5 pb-3 pt-5 backdrop-blur sm:-mx-7 sm:-mt-7 sm:px-7 sm:pt-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]"
                style={{ color: d.colour }}
              >
                {d.code} · {d.subtitle}
              </p>
              <h2 className="stencil mt-1 flex items-center gap-2 text-xl text-[color:var(--color-amber)] sm:text-2xl">
                <span style={{ color: d.colour }}>
                  <DistrictIcon id={d.id} size={22} />
                </span>
                {d.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="stencil flex h-11 min-w-11 items-center justify-center border border-[color:var(--color-hud)]/40 px-3 text-[10px] text-[color:var(--on-surface-soft)] transition-colors hover:border-[color:var(--color-crimson)] hover:text-[color:var(--color-crimson)]"
            >
              Close
              <span className="sr-only"> {d.name}</span>
            </button>
          </div>
          <div className="rule-hud mt-3" />
        </div>

        <p className="mb-6 text-[15px] leading-relaxed text-[color:var(--on-surface-soft)]">
          {d.blurb}
        </p>

        {d.kind.sort === 'projects' && <ProjectList group={d.kind.group} />}
        {d.kind.sort === 'roles' && <Roles />}
        {d.kind.sort === 'about' && <About />}
        {d.kind.sort === 'parcours' && <Parcours />}
        {d.kind.sort === 'hobbies' && <Hobbies />}
        {d.kind.sort === 'contact' && <Contact />}
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------ */

function Gallery({ id }: { id: string }) {
  const shots = gallery[id]
  const [open, setOpen] = useState<number | null>(null)
  if (!shots?.length) return null

  return (
    <>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {shots.map((s, i) => (
          <li key={s.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden border border-[color:var(--color-hud)]/20 transition-colors hover:border-[color:var(--color-amber)]"
            >
              <img
                src={s.src}
                alt={s.caption}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-label={shots[open].caption}
        >
          <figure className="max-h-full max-w-4xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <img src={shots[open].src} alt={shots[open].caption} className="w-full" />
            <figcaption className="mt-3 text-sm leading-relaxed text-[color:var(--color-readout)]">
              {shots[open].caption}
            </figcaption>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="stencil mt-4 h-11 border border-[color:var(--color-hud)]/40 px-4 text-[10px] text-[color:var(--color-readout)]"
            >
              Close image
            </button>
          </figure>
        </div>
      )}
    </>
  )
}

function Dossier({ p, n }: { p: Project; n: number }) {
  return (
    <article id={`dossier-${p.id}`} className="plate p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="stencil text-[12px] leading-snug text-[color:var(--color-hud)]">
          <span className="mr-2 font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--color-hud-dim)] tnum">
            {String(n).padStart(2, '0')}
          </span>
          {p.name}
        </h3>
        <span className="tnum shrink-0 border border-[color:var(--color-amber)]/40 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase text-[color:var(--color-amber)]">
          {p.badge}
        </span>
      </div>
      <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[color:var(--on-surface-soft)]">
        {p.meta}
      </p>
      <p className="mt-3 border-l-2 border-[color:var(--color-hud)]/40 pl-3 text-[14px] italic leading-relaxed">
        {p.lede}
      </p>
      <div className="mt-3 space-y-2">
        {p.paras.map((para, i) => (
          <p key={i} className="text-[13px] leading-relaxed">
            {para}
          </p>
        ))}
      </div>
      {p.kicker && (
        <p className="mt-3 border-t border-[color:var(--color-hud)]/15 pt-3 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[color:var(--color-crimson)]">
          {p.kicker}
        </p>
      )}
      <Gallery id={p.id} />
    </article>
  )
}

function ProjectList({ group }: { group: Project['group'] }) {
  const list = projects.filter((p) => p.group === group)
  return (
    <div className="space-y-4">
      {list.map((p, i) => (
        <Dossier key={p.id} p={p} n={i + 1} />
      ))}

      {group === 'personal' && (
        <>
          <p className="stencil pt-2 text-[11px] text-[color:var(--color-amber)]">
            Also in the workshop
          </p>
          <ul className="space-y-2">
            {workshop.map((w) => (
              <li key={w.name} className="border-l-2 border-[color:var(--color-hud-dim)]/50 pl-3">
                <p className="font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-hud)]">
                  {w.name}{' '}
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">
                    {w.tag}
                  </span>
                </p>
                <p className="text-[13px] leading-relaxed text-[color:var(--on-surface-soft)]">
                  {w.note}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      {group === 'quant' && (
        <>
          <div className="rule-hud" />
          <p className="stencil text-[11px] text-[color:var(--color-amber)]">
            The results, plotted
          </p>
          <p className="text-[13px] leading-relaxed text-[color:var(--on-surface-soft)]">
            Every figure below is measured output from the harness, read off the project report —
            not an illustration.
          </p>
          <QuantChart />
        </>
      )}

      {group === 'engineering' && <HardwareRef />}
    </div>
  )
}

function HardwareRef() {
  return (
    <div className="pt-2">
      <p className="stencil mb-1 text-[11px] text-[color:var(--color-amber)]">Hardware reference</p>
      <p className="mb-3 text-[13px] text-[color:var(--on-surface-soft)]">
        Manufacturers' own published figures, listed as facts rather than reproduced pages. The
        machines standing in this sector are modelled from them.
      </p>
      <ul className="space-y-3">
        {hardware.map((h) => (
          <li key={h.part} className="plate p-3">
            <p className="font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-amber)]">
              {h.part}
              <span className="ml-2 text-[10px] text-[color:var(--on-surface-soft)]">{h.kind}</span>
            </p>
            <p className="mt-1 text-[12px] leading-relaxed">{h.spec}</p>
            <p className="mt-1 text-[12px] italic leading-relaxed text-[color:var(--on-surface-soft)]">
              {h.used}
            </p>
          </li>
        ))}
      </ul>

      <p className="stencil mb-2 mt-5 text-[11px] text-[color:var(--color-amber)]">
        Smart bicycle — interfaces as built
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {bicycleBus.map((b) => (
          <li key={b.node} className="border border-[color:var(--color-hud)]/20 p-2">
            <p className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-hud)]">
              {b.node}
            </p>
            <p className="text-[11px] text-[color:var(--on-surface-soft)]">{b.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Roles() {
  return (
    <div className="space-y-6">
      <p className="max-w-[60ch] text-[15px] leading-relaxed">{profile.summary}</p>
      <ol className="space-y-6">
        {experience.map((r, n) => (
          <li key={r.org} className="plate p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="stencil text-[12px] text-[color:var(--color-hud)]">
                <span className="mr-2 font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--color-hud-dim)] tnum">
                  {String(n + 1).padStart(2, '0')}
                </span>
                {r.title} — {r.org}
              </h3>
              <p className="tnum font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-amber)]">
                {r.period}
              </p>
            </div>
            <p className="mb-2 font-[family-name:var(--font-mono)] text-[11px] uppercase text-[color:var(--on-surface-soft)]">
              {r.place}
            </p>
            <ul className="space-y-2">
              {r.bullets.map((b, i) => (
                <li key={i} className="text-[13px] leading-relaxed">
                  {b}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <Gallery id="school-it" />
      <p className="text-[13px] text-[color:var(--on-surface-soft)]">Also: {alsoRan.join(' · ')}</p>
    </div>
  )
}

function About() {
  return (
    <div className="space-y-5">
      <p className="border-l-2 border-[color:var(--color-amber)] pl-4 text-[17px] leading-snug text-[color:var(--color-amber)]">
        {about.headline}
      </p>
      {about.paras.map((p, i) => (
        <p key={i} className="max-w-[62ch] text-[14px] leading-relaxed">
          {p}
        </p>
      ))}

      <div className="rule-hud" />
      <ul className="space-y-2">
        {about.traits.map((t) => (
          <li key={t.label} className="plate p-3">
            <p className="stencil text-[11px] text-[color:var(--color-hud)]">{t.label}</p>
            <p className="text-[13px] leading-relaxed text-[color:var(--on-surface-soft)]">
              {t.note}
            </p>
          </li>
        ))}
      </ul>

      <p className="font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[color:var(--on-surface-soft)]">
        {profile.role} · {profile.location} · right to work in the UK, willing to relocate UK-wide.
      </p>
    </div>
  )
}

function Parcours() {
  return (
    <div className="space-y-6">
      <ol className="space-y-4">
        {parcours.map((stage, i) => (
          <li key={stage.id} className="plate p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="stencil text-[13px] text-[color:var(--color-hud)]">
                <span className="mr-2 font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--color-hud-dim)] tnum">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {stage.place}
              </h3>
              <p className="tnum font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-amber)]">
                {stage.period}
              </p>
            </div>
            <p className="mb-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[color:var(--on-surface-soft)]">
              {stage.where}
            </p>
            {stage.lines.map((l, n) => (
              <p key={n} className="mt-2 text-[13px] leading-relaxed">
                {l}
              </p>
            ))}
            {stage.chips && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {stage.chips.map((c) => (
                  <li
                    key={c}
                    className="border border-[color:var(--color-hud)]/25 px-2 py-1 font-[family-name:var(--font-mono)] text-[11px]"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            )}
            {stage.pending && (
              <p className="mt-3 border-l-2 border-[color:var(--color-amber)]/60 pl-3 font-[family-name:var(--font-mono)] text-[11px] italic leading-relaxed text-[color:var(--on-surface-soft)]">
                {stage.pending}
              </p>
            )}
          </li>
        ))}
      </ol>

      <div>
        <p className="stencil mb-1 text-[11px] text-[color:var(--color-amber)]">
          Brunel — module by module
        </p>
        <p className="mb-3 text-[13px] text-[color:var(--on-surface-soft)]">
          What each module actually put in my hands, rather than a list of titles.
        </p>
        {modules.map((y) => (
          <div key={y.year} className="mb-4">
            <p className="mb-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-hud)]">
              {y.year}
            </p>
            <ul className="space-y-1.5">
              {y.items.map((m) => (
                <li key={m.code} className="border-l-2 border-[color:var(--color-hud-dim)]/50 pl-3">
                  <p className="text-[13px]">
                    <span className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-amber)]">
                      {m.code}
                    </span>{' '}
                    {m.name}
                  </p>
                  <p className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--on-surface-soft)]">
                    {m.tools}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div>
        <p className="stencil mb-2 text-[11px] text-[color:var(--color-amber)]">Languages</p>
        <ul className="space-y-1.5">
          {languages.map((l) => (
            <li key={l.name} className="text-[13px]">
              <span className="font-[family-name:var(--font-mono)] text-[color:var(--color-hud)]">
                {l.name}
              </span>{' '}
              — {l.level}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="stencil mb-2 text-[11px] text-[color:var(--color-amber)]">
          What that adds up to
        </p>
        <dl className="space-y-4">
          {skills.map((g) => (
            <div key={g.group}>
              <dt className="mb-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-hud)]">
                {g.group}
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((i) => (
                    <li
                      key={i}
                      className="border border-[color:var(--color-hud)]/25 bg-[color:var(--color-hud)]/6 px-3 py-1.5 font-[family-name:var(--font-mono)] text-[12px]"
                    >
                      {i}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="space-y-2 text-[13px] text-[color:var(--on-surface-soft)]">
        {additional.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
      <Gallery id="pic-labs" />
    </div>
  )
}

function Hobbies() {
  const [open, setOpen] = useState<string>('chess')
  return (
    <div className="space-y-4">
      <ul className="flex flex-wrap gap-2">
        {hobbies.map((h) => (
          <li key={h.id}>
            <button
              type="button"
              onClick={() => setOpen(h.id)}
              aria-pressed={open === h.id}
              className={[
                'stencil flex h-11 items-center border-l-2 px-4 text-[11px] transition-all duration-200',
                open === h.id
                  ? 'border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/12 text-[color:var(--on-surface)]'
                  : 'border-[color:var(--color-hud-dim)]/50 text-[color:var(--on-surface-soft)] hover:border-[color:var(--color-hud)] hover:text-[color:var(--on-surface)]',
              ].join(' ')}
            >
              {h.name}
            </button>
          </li>
        ))}
      </ul>

      {hobbies
        .filter((h) => h.id === open)
        .map((h) => (
          <div key={h.id} className="space-y-3">
            <p className="border-l-2 border-[color:var(--color-hud)]/40 pl-3 text-[14px] italic leading-relaxed">
              {h.line}
            </p>
            {h.stat && (
              <p className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--on-surface-soft)]">
                {h.stat}
              </p>
            )}
            {h.paras.map((p, i) => (
              <p key={i} className="text-[13px] leading-relaxed">
                {p}
              </p>
            ))}

            {h.id === 'chess' && (
              <>
                <div className="rule-hud my-2" />
                <p className="stencil text-[11px] text-[color:var(--color-amber)]">
                  {chessGame.title} — play it through
                </p>
                <ChessBoard />
                <div className="mt-4 space-y-2">
                  {chessGame.why.map((w, i) => (
                    <p key={i} className="text-[13px] leading-relaxed">
                      {w}
                    </p>
                  ))}
                </div>
                <Gallery id="chess" />
              </>
            )}
          </div>
        ))}
    </div>
  )
}

function Contact() {
  const rows: { label: string; value: string; href: string; ext?: boolean }[] = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { label: 'LinkedIn', value: 'terence-eloundou-g', href: profile.linkedin, ext: true },
    { label: 'GitHub', value: 'Terence-e', href: profile.github, ext: true },
  ]
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.label}>
            <a
              href={r.href}
              {...(r.ext ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              className="flex min-h-11 items-center justify-between gap-4 border-l-2 border-[color:var(--color-hud-dim)]/50 bg-[color:var(--color-hud)]/4 px-4 py-2 transition-all duration-200 hover:border-[color:var(--color-amber)] hover:bg-[color:var(--color-hud)]/12"
            >
              <span className="stencil text-[10px] text-[color:var(--color-hud)]">{r.label}</span>
              <span className="font-[family-name:var(--font-mono)] text-[13px]">{r.value}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[color:var(--on-surface-soft)]">
        Right to work in the UK · willing to relocate UK-wide
      </p>
    </div>
  )
}
