import { useEffect, useState } from 'react'
import { districtById } from '../data/world'
import { DistrictIcon } from './DistrictIcon'
import { heroShot } from '../data/gallery'
import { projects } from '../data/content'

/**
 * The floating preview that follows the pointer over a district.
 * Purely a hover affordance — everything it shows is also in the panel,
 * and it is hidden from assistive technology and on touch, where there
 * is no hover to speak of.
 */
export function HoverCard({ id }: { id: string | null }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!id) return
    const move = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [id])

  const d = districtById(id ?? '')
  if (!d) return null

  const hero = d.preview ? heroShot(d.preview) : undefined
  const count =
    d.kind.sort === 'projects'
      ? projects.filter((p) => p.group === (d.kind as { group: string }).group).length
      : null

  // Flip the card away from the edges it would otherwise run off.
  const flipX = pos.x > window.innerWidth - 300
  const flipY = pos.y > window.innerHeight - 260

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-30 hidden w-64 md:block"
      style={{
        left: pos.x + (flipX ? -276 : 18),
        top: pos.y + (flipY ? -240 : 18),
      }}
    >
      <div className="glass bracketed overflow-hidden p-0">
        {hero && (
          <img
            src={hero.src}
            alt=""
            className="h-28 w-full object-cover opacity-90"
            loading="lazy"
          />
        )}
        <div className="p-3">
          <p
            className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em]"
            style={{ color: d.colour }}
          >
            <DistrictIcon id={d.id} size={13} />
            {d.code}
          </p>
          <p className="stencil text-[12px] text-[color:var(--on-surface)]">{d.name}</p>
          <p className="text-[12px] leading-snug text-[color:var(--on-surface-soft)]">
            {d.subtitle}
            {count !== null && (
              <>
                {' · '}
                <span className="tnum">{count}</span> projects
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
