import type { ProjectGroup } from './content'

/**
 * The city.
 *
 * Eight districts sit on the island. Each is a place you can look at and
 * click rather than a stop on a rail: a flat pad cut into the terrain, a
 * cluster of buildings with a silhouette of its own, a landmark, and a
 * billboard showing real work from that district.
 */

export type Landmark =
  | 'tower'      // glass tower over the production quarter
  | 'docks'      // cranes and containers
  | 'arcade'     // shopping arcade with awnings
  | 'foundry'    // gantry + the Knightmare Frame
  | 'campus'     // the academic quad with a clock tower
  | 'plaza'      // the giant chessboard
  | 'mast'       // comms antenna
  | 'overlook'   // the lookout the whole city is read from
  | 'lab'        // quant research: dishes and a data spine
  | 'blacksite'  // security: a walled compound behind a fence

export type DistrictKind =
  | { sort: 'projects'; group: ProjectGroup }
  | { sort: 'roles' }
  | { sort: 'about' }
  | { sort: 'parcours' }
  | { sort: 'hobbies' }
  | { sort: 'contact' }

export type District = {
  id: string
  code: string
  /** The place name, as it reads on the map. */
  name: string
  /** What it holds, in plain words. */
  subtitle: string
  blurb: string
  kind: DistrictKind
  landmark: Landmark
  /** Ground position [x, z]; the island has radius ≈ 22. */
  position: [number, number]
  /** Radius of the flattened pad. */
  radius: number
  /** Accent colour for this district's lighting, label and buildings. */
  colour: string
  /**
   * Project id whose first image is used for the hover preview only.
   * Nothing is displayed in the world itself — the photographs are for
   * reading at full size in the panel, not for standing in a street.
   */
  preview?: string
}

/**
 * Ten districts, laid out as an outer ring of seven and an inner three,
 * so nothing overlaps and the whole city reads at a glance from the
 * default camera.
 */
export const districts: District[] = [
  {
    id: 'the-overlook',
    code: 'D-00',
    name: 'The Overlook',
    subtitle: 'Who this is',
    blurb: 'The short version, and the patterns that run through everything else on this island.',
    kind: { sort: 'about' },
    landmark: 'overlook',
    position: [0, 6],
    radius: 3.6,
    colour: '#ffd166',
  },
  {
    id: 'production-quarter',
    code: 'D-01',
    name: 'Production Quarter',
    subtitle: 'Systems in service',
    blurb:
      'Four delivered systems. Two are live and in daily use in Yaoundé right now — both behind school logins, which is why this district shows you the screens rather than a link.',
    kind: { sort: 'projects', group: 'production' },
    landmark: 'tower',
    position: [16, 0],
    radius: 4.8,
    colour: '#7fe6ff',
    preview: 'uniform',
  },
  {
    id: 'the-docks',
    code: 'D-02',
    name: 'The Docks',
    subtitle: 'Professional work',
    blurb: 'The jobs: Afryx Labs, ST Digital in Douala, and the school in Yaoundé where it started.',
    kind: { sort: 'roles' },
    landmark: 'docks',
    position: [10, 12.4],
    radius: 4.2,
    colour: '#5fe3a1',
  },
  {
    id: 'the-workshop',
    code: 'D-03',
    name: 'The Workshop',
    subtitle: 'Personal builds',
    blurb: 'Things built unprompted, plus the smaller repositories that never became projects.',
    kind: { sort: 'projects', group: 'personal' },
    landmark: 'arcade',
    position: [-3.6, 15.6],
    radius: 4.4,
    colour: '#ffb554',
    preview: 'knightmare',
  },
  {
    id: 'quant-lab',
    code: 'D-04',
    name: 'Quant Lab',
    subtitle: 'Machine learning & statistics',
    blurb:
      'Applied ML and statistical method, kept well away from the security work because they are not the same discipline and should not be read as one.',
    kind: { sort: 'projects', group: 'quant' },
    landmark: 'lab',
    position: [-14.4, 7],
    radius: 4.2,
    colour: '#8ecbff',
    preview: 'truth-machine',
  },
  {
    id: 'blacksite',
    code: 'D-05',
    name: 'Blacksite',
    subtitle: 'Defensive security',
    blurb: 'Scanning and access control, on authorised targets only. Its own compound for a reason.',
    kind: { sort: 'projects', group: 'security' },
    landmark: 'blacksite',
    position: [-14.4, -7],
    radius: 4.0,
    colour: '#ff4d4d',
    preview: 'sentinel',
  },
  {
    id: 'foundry-sector',
    code: 'D-06',
    name: 'Foundry Sector',
    subtitle: 'Hardware, control and silicon',
    blurb:
      'Eleven engineering builds and the machines they ran on. These came out of Brunel modules — the module is named on each — but they are builds, not exam papers.',
    kind: { sort: 'projects', group: 'engineering' },
    landmark: 'foundry',
    position: [-5.2, -3],
    radius: 5.6,
    colour: '#ff8a4d',
    preview: 'smart-bicycle',
  },
  {
    id: 'parcours',
    code: 'D-07',
    name: 'Parcours',
    subtitle: 'Where I came from',
    blurb:
      'Cameroon to Moray to Uxbridge: the schooling, the modules, the tools each one put in my hands, and the languages underneath all of it.',
    kind: { sort: 'parcours' },
    landmark: 'campus',
    position: [-3.6, -15.6],
    radius: 4.6,
    colour: '#b58cff',
  },
  {
    id: 'hobbies',
    code: 'D-08',
    name: 'Hobbies',
    subtitle: 'Off duty',
    blurb: 'Chess, basketball, piano. One of them has a board you can play through.',
    kind: { sort: 'hobbies' },
    landmark: 'plaza',
    position: [5.2, -3],
    radius: 3.6,
    colour: '#ffd166',
    preview: 'chess',
  },
  {
    id: 'comms-tower',
    code: 'D-09',
    name: 'Comms Tower',
    subtitle: 'How to reach me',
    blurb: 'Open to industrial placements and graduate roles in software and systems engineering.',
    kind: { sort: 'contact' },
    landmark: 'mast',
    position: [10, -12.4],
    radius: 3.4,
    colour: '#5fe3a1',
  },
]

export function districtById(id: string | null) {
  return districts.find((d) => d.id === id)
}

/**
 * Deterministic pseudo-random, so a district's skyline is the same on
 * every visit and every machine. Buildings are generated rather than
 * placed by hand — eight districts of hand-placed boxes is a lot of
 * numbers to maintain for no gain.
 */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
