import type { ReactNode } from 'react'

/**
 * The SVG filter that gives the glass its edge refraction.
 * Rendered once, near the root, and referenced by CSS as url(#liquid-refract).
 * This is the same trick liquid-glass-js uses: turbulence displaces the
 * backdrop so straight lines behind the panel bend at its rim.
 */
export function GlassDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="liquid-refract" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.012"
            numOctaves="2"
            seed="11"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="3" result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}

type GlassProps = {
  children: ReactNode
  className?: string
  /** Kept for compatibility; the HUD canopy has no moving sheen. */
  sheen?: boolean
  as?: 'div' | 'section' | 'article' | 'aside' | 'nav'
}

export function Glass({ children, className = '', as = 'div' }: GlassProps) {
  const Tag = as
  return (
    <Tag
      className={['glass glass-refract', 'p-6 sm:p-8', className].filter(Boolean).join(' ')}
    >
      {children}
    </Tag>
  )
}
