import { districts } from '../data/world'
import { padHeightAt, setPads } from './terrain'

/**
 * Cut the district pads into the terrain before anything reads a
 * height. Imported for its side effect from main.tsx, ahead of the app,
 * so the island mesh and every building agree about where the floor is.
 */
setPads(
  districts.map((d) => ({
    x: d.position[0],
    z: d.position[1],
    radius: d.radius,
    height: padHeightAt(d.position[0], d.position[1]),
  })),
)
