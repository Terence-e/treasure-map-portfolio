/**
 * District glyphs.
 *
 * Drawn as SVG rather than emoji on purpose: emoji are font-dependent,
 * render differently on Windows, macOS, Android and Linux, cannot take
 * the district's accent colour, and sit at whatever baseline the font
 * decides. These inherit `currentColor`, so each chip's glyph is its
 * district's colour, and they keep one stroke weight across the set.
 *
 * Each one is 16×16, 1.5 stroke, and says what the place is: a tower for
 * Production, a crane for the Docks, a spanner for the Workshop, a plot
 * for the Quant Lab, a shield for Blacksite, a frame's head for the
 * Foundry, a winding path for the Parcours, a rook for Hobbies, an
 * antenna for Comms, and a beacon for the Overlook.
 */
export function DistrictIcon({ id, size = 15 }: { id: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  }

  switch (id) {
    case 'the-overlook': // beacon on a lookout
      return (
        <svg {...common}>
          <circle cx="8" cy="2.6" r="1.4" fill="currentColor" stroke="none" />
          <path d="M8 4.2v5.4" />
          <path d="M3.6 13.8 8 9.6l4.4 4.2" />
          <path d="M5.4 11.9h5.2" />
        </svg>
      )
    case 'production-quarter': // a tower with lit floors
      return (
        <svg {...common}>
          <path d="M4 13.6V3.4h8v10.2" />
          <path d="M2.6 13.8h10.8" />
          <path d="M6.2 6h.9M8.9 6h.9M6.2 8.6h.9M8.9 8.6h.9M6.2 11.2h.9M8.9 11.2h.9" />
        </svg>
      )
    case 'the-docks': // container crane
      return (
        <svg {...common}>
          <path d="M3.6 13.6V2.8h8.2" />
          <path d="M11 2.8v3.1" />
          <path d="M2.4 13.8h11.2" />
          <path d="M5.9 13.6v-2.4h4v2.4" />
        </svg>
      )
    case 'the-workshop': // spanner
      return (
        <svg {...common}>
          <path d="M10.6 2.6a3.1 3.1 0 0 0-3.4 4.7l-4.4 4.4a1.3 1.3 0 0 0 1.9 1.9l4.4-4.4a3.1 3.1 0 0 0 4.7-3.4l-1.9 1.9-1.9-.6-.6-1.9z" />
        </svg>
      )
    case 'quant-lab': // a plot that crosses zero
      return (
        <svg {...common}>
          <path d="M2.8 2.8v10.4h10.4" />
          <path d="M4.6 10.6 7 6.9l2 2.6 3.1-5" />
        </svg>
      )
    case 'blacksite': // shield
      return (
        <svg {...common}>
          <path d="M8 2.3 12.9 4v4.1c0 3-2.1 5.1-4.9 6.1-2.8-1-4.9-3.1-4.9-6.1V4z" />
          <path d="M6.3 8.2 7.6 9.6l2.4-2.6" />
        </svg>
      )
    case 'foundry-sector': // a Knightmare's head
      return (
        <svg {...common}>
          <path d="M4.4 6.4 8 3.4l3.6 3v4.4c0 .6-.5 1.1-1.1 1.1H5.5c-.6 0-1.1-.5-1.1-1.1z" />
          <path d="M8 3.4V1.9" />
          <path d="M6.1 8.4h3.8" />
          <path d="M6.6 12.9v1.2M9.4 12.9v1.2" />
        </svg>
      )
    case 'parcours': // a graduation cap
      /* This was a winding path with an arrowhead. At 15px the S-curve
         and the head merged into an ambiguous diagonal smudge — a mark
         has to survive the size it is actually used at. */
      return (
        <svg {...common}>
          <path d="M8 2.6 14.2 5.8 8 9 1.8 5.8z" />
          <path d="M4.3 7.3v3.4c0 1.2 1.7 2.1 3.7 2.1s3.7-.9 3.7-2.1V7.3" />
          <path d="M13.2 6.3v3.3" />
        </svg>
      )
    case 'hobbies': // a rook
      return (
        <svg {...common}>
          <path d="M4.6 13.8h6.8" />
          <path d="M5.6 13.6V6.9h4.8v6.7" />
          <path d="M5.6 6.9V3.6h1.3v1.5h1.4V3.6h1.3v1.5h1.4V3.6h1.4v3.3" />
        </svg>
      )
    case 'comms-tower': // antenna with signal
      return (
        <svg {...common}>
          <path d="M8 14V8.4" />
          <path d="M5 14l3-5.6L11 14" />
          <path d="M4.9 6.3a4.2 4.2 0 0 1 6.2 0" />
          <path d="M6.4 4.4a2.3 2.3 0 0 1 3.2 0" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="4.5" />
        </svg>
      )
  }
}
