/**
 * The island.
 *
 * Height is generated on the CPU rather than in a vertex shader for one
 * reason: the markers, the route line and the camera all need to know
 * exactly how tall the ground is at a given (x, z). Keeping a single
 * `islandHeight()` used by both the mesh and everything standing on it
 * means nothing ever floats or sinks.
 */

const SEED = 1337

function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + SEED) * 43758.5453123
  return n - Math.floor(n)
}

function smooth(t: number) {
  return t * t * (3 - 2 * t)
}

/** Classic value noise: bilinear blend of four hashed lattice corners. */
function valueNoise(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = smooth(x - xi)
  const yf = smooth(y - yi)

  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)

  const top = a + (b - a) * xf
  const bottom = c + (d - c) * xf
  return top + (bottom - top) * yf
}

/** Fractal Brownian motion — five octaves, each half the amplitude. */
function fbm(x: number, y: number, octaves = 5) {
  let value = 0
  let amplitude = 0.5
  let frequency = 1
  let norm = 0
  for (let i = 0; i < octaves; i++) {
    value += amplitude * valueNoise(x * frequency, y * frequency)
    norm += amplitude
    amplitude *= 0.5
    frequency *= 2.07
  }
  return value / norm
}

export const ISLAND_RADIUS = 26
export const ISLAND_SIZE = 68
export const SEA_LEVEL = 0

/**
 * Height in world units at (x, z). Negative values are underwater.
 * The radial falloff is what turns a noise field into an island rather
 * than an infinite landscape.
 */
export function islandHeight(x: number, z: number) {
  // Distance from the centre, warped so the coastline is not a circle.
  const coast = fbm(x * 0.055 + 40, z * 0.055 - 12, 3)
  const d = (Math.sqrt(x * x + z * z) / ISLAND_RADIUS) * (1.18 - coast * 0.36)

  // A soft dome that reaches zero at the shoreline and keeps falling
  // beyond it, so the land slides under the water instead of ending
  // in a cliff.
  const falloff = Math.pow(Math.max(0, 1 - d), 1.5)

  const ridges = fbm(x * 0.085, z * 0.085)
  const detail = fbm(x * 0.3 + 7, z * 0.3 + 3, 4) * 0.3

  const land = (ridges * 0.9 + detail) * falloff * 6.4

  // The shelf: gentle underwater slope past the beach.
  const shelf = (1 - falloff) * 1.15

  return land - shelf
}

/** Ground position for anything standing on the island. */
export function groundAt(x: number, z: number, lift = 0): [number, number, number] {
  return [x, Math.max(islandHeight(x, z), SEA_LEVEL) + lift, z]
}

/* ------------------------------------------------------------------
   Shaders. The mesh is coloured entirely by height, in the language of
   a printed chart: contour bands, a darker coastline, a paper grain.
   ------------------------------------------------------------------ */

export const islandVertexShader = /* glsl */ `
  varying float vHeight;
  varying vec3 vWorld;
  varying vec3 vNormalW;

  void main() {
    vHeight = position.y;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const islandFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uLow;        // valley floor
  uniform vec3 uHigh;       // ridge
  uniform vec3 uContour;    // minor contour lines
  uniform vec3 uIndex;      // every fifth contour
  uniform vec3 uCoast;      // shoreline glow
  uniform float uContourStep;
  uniform float uTime;
  /** 0 = glow lines (night optics), 1 = ink lines (high ambient).
      Additive blending can only brighten, so a pale chart needs the
      lines mixed in as ink rather than added as light. */
  uniform float uInk;

  varying float vHeight;
  varying vec3 vWorld;
  varying vec3 vNormalW;

  float grain(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float h = vHeight;

    // Terrain body: a dark tactical plate, brightening with elevation.
    float t = clamp(h / 5.2, 0.0, 1.0);
    vec3 terrain = mix(uLow, uHigh, pow(t, 0.8));

    // Contour lines, drawn as light on dark the way a display renders
    // them rather than ink on paper. fwidth keeps them a pixel wide at
    // any distance instead of collapsing into moire.
    float band = h / uContourStep;
    float line = abs(fract(band) - 0.5) / max(fwidth(band), 0.0001);
    float contour = 1.0 - smoothstep(0.0, 1.3, line);
    terrain = mix(terrain + uContour * contour * 0.34, mix(terrain, uContour, contour * 0.8), uInk);

    // Index contours every fifth line, in amber.
    float indexBand = h / (uContourStep * 5.0);
    float indexLine = abs(fract(indexBand) - 0.5) / max(fwidth(indexBand), 0.0001);
    float idx = 1.0 - smoothstep(0.0, 1.1, indexLine);
    terrain = mix(terrain + uIndex * idx * 0.30, mix(terrain, uIndex, idx * 0.75), uInk);

    // A survey grid over the whole territory — this is a chart of
    // captured ground, so it carries a coordinate lattice.
    vec2 g = abs(fract(vWorld.xz / 4.0) - 0.5) / max(fwidth(vWorld.xz / 4.0), vec2(0.0001));
    float grid = 1.0 - smoothstep(0.0, 1.0, min(g.x, g.y));
    terrain = mix(terrain + uContour * grid * 0.10, mix(terrain, uContour, grid * 0.28), uInk);

    // Shoreline: a scanned edge where land meets water. Kept narrow and
    // well under 1.0 — additive blending saturates to white very fast,
    // and a blown-out coast reads as a bug, not a glow.
    float shore = 1.0 - smoothstep(0.0, 0.34, h);
    float shoreEdge = smoothstep(0.0, 0.10, h) * shore;
    terrain = mix(terrain + uCoast * shoreEdge * 0.45, mix(terrain, uCoast, shoreEdge * 0.9), uInk);

    // Relief lighting, kept low so the linework stays dominant.
    float lambert = clamp(dot(normalize(vNormalW), normalize(vec3(0.35, 0.9, 0.3))), 0.0, 1.0);
    terrain *= 0.85 + lambert * 0.55;

    // Sensor noise.
    float n = grain(floor(vWorld.xz * 30.0 + floor(uTime * 8.0)));
    terrain += (n - 0.5) * 0.018;

    float edgeFade = smoothstep(-0.45, 0.06, h);
    gl_FragColor = vec4(terrain, edgeFade);
  }
`

/* ------------------------------------------------------------------
   District pads.

   Buildings on a noisy heightfield either float or sink, and correcting
   each one by hand is a losing game. Instead the terrain itself is
   flattened under each district: inside the pad radius the height eases
   to the pad's own level, and the ring outside blends back to the
   natural ground. Both the mesh and everything standing on it call the
   same function, so nothing can disagree about where the floor is.
   ------------------------------------------------------------------ */

export type Pad = { x: number; z: number; radius: number; height: number }

let pads: Pad[] = []

/** Registered once at startup from the district list. */
export function setPads(next: Pad[]) {
  pads = next
}

export function getPads() {
  return pads
}

/** Height of the natural terrain, with district pads cut into it. */
export function groundHeight(x: number, z: number) {
  const base = islandHeight(x, z)
  let h = base
  for (const pad of pads) {
    const d = Math.hypot(x - pad.x, z - pad.z)
    const outer = pad.radius * 1.65
    if (d > outer) continue
    // 1 at the centre of the pad, 0 at the outer edge of the apron.
    const t = 1 - smoothstepScalar(pad.radius, outer, d)
    h = h * (1 - t) + pad.height * t
  }
  return h
}

function smoothstepScalar(a: number, b: number, t: number) {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)))
  return x * x * (3 - 2 * x)
}

/** Where a district's pad should sit: the natural height at its centre. */
export function padHeightAt(x: number, z: number) {
  return Math.max(islandHeight(x, z), 0.35)
}

/** Position for anything standing on the finished ground. */
export function surfaceAt(x: number, z: number, lift = 0): [number, number, number] {
  return [x, groundHeight(x, z) + lift, z]
}
