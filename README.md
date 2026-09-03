# Knightmare City — Portfolio

A personal portfolio for **Terence Eloundou Gaston** built as a place
rather than a page: an island city you orbit, with eight districts you
can look at and click. No scroll rail — you land on the world, the name
is above it, and you go where you want.

Eight districts, 24 project dossiers in full prose, 39 photographs from
the real work, four modelled machines and a Knightmare Frame standing
over the Foundry.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production bundle into dist/
npm run preview
```

Node 20 or newer. Entirely client-side — no server, no API keys.

## How it works

**One scene, no pages.** The viewport is fixed; only the district drawer
scrolls. `OrbitControls` owns the input — drag to turn, wheel or pinch to
zoom — and `CameraRig` takes over only when a district is selected,
easing the orbit centre and distance toward it and back out on close. The
visitor keeps whatever orbit angle they chose; the rig drives the centre
and the distance, never the angle.

**Districts are generated, not placed.** Each skyline comes from a seeded
PRNG keyed on the district index, so it is identical on every visit and
every machine, and eight districts of hand-typed boxes never have to be
maintained. Each district gets a landmark that carries its silhouette: a
glass tower, dock cranes, a shopping arcade, a service gantry, a clock
tower, bunker racks, a giant chessboard, an antenna mast.

**The ground agrees with itself.** Buildings on a noise heightfield
either float or sink. `setPads()` registers each district's pad before
anything reads a height, and `groundHeight()` eases the terrain to the
pad level inside its radius and blends back outside it. The island mesh
and every prop call the same function, so nothing can disagree about
where the floor is.

**The machines are modelled.** The Trilobot, the smart-bicycle
instrument, the PIC development board and the myCobot arm stand in the
Foundry as real geometry — deliberately given a printed look, matte and
flat-shaded with a warm filament colour, rather than trying and failing
to look photographic. The photos of the real things are in the panel.
The Knightmare Frame is primitives too: no licence, no 8 MB GLB on the
critical path, and the silhouette is what carries the reference anyway.

## What is where

```
src/
  data/
    content.ts     Every word: profile, roles, 24 projects, workshop
                   repos, hardware reference, chess, education, skills.
    gallery.ts     39 images extracted from the Project Portfolio PDF,
                   keyed by project id, with the portfolio's captions.
    world.ts       The eight districts: name, kind, landmark, colour,
                   position, pad radius, billboard.
  three/
    setup.ts       Cuts the district pads into the terrain. Imported for
                   its side effect from main.tsx, before the app.
    terrain.ts     Island height (value-noise fbm + radial falloff), the
                   pad system, and the contour/grid/shore shaders.
    Island.tsx     The displaced mesh.
    Sea.tsx        Coordinate lattice and sensor sweep.
    Buildings.tsx  Seeded block generator + the eight landmarks.
    Knightmare.tsx The frame.
    props.tsx      Trilobot, BikeUnit, DevBoard, CobotArm.
    District.tsx   One district: pad, hit target, blocks, landmark,
                   billboard, beacon, hover and press states.
    Scene.tsx      Canvas, lights, OrbitControls and the camera rig.
  components/
    Header.tsx     Name, welcome line, district chips, theme toggle.
    HoverCard.tsx  Pointer-following preview.
    Panel.tsx      The district drawer and its lightbox gallery.
    Glass.tsx      The liquid-glass primitive and its SVG filter.
  index.css        Design tokens, glass recipe, corner brackets.
public/img/        The 39 WebP images.
```

## Design

**Palette — "Knightmare".** Near-black hull (`#05090d`), cyan telemetry
(`#7fe6ff`), amber for anything actionable (`#ffb554`), crimson
(`#ff4d4d`) reserved for the active district. Each district also carries
its own accent, used for its ring, its lit windows and its beacon.
Checked pairs: cyan 12.6:1, amber 11.1:1, body `#cfe6f2` 12.9:1, muted
`#8fa9ba` 6.4:1.

**High-ambient mode** is a real second theme, not an inversion: the
accents re-tone *and* the 3D world re-tones with them. The contour shader
carries a `uInk` uniform for this — additive blending can only brighten,
so glowing lines that read on a black hull vanish on a pale one; at
`uInk = 1` they are mixed in as ink and the chart prints dark-on-light.

**Type.** Chakra Petch for display, Inter for body, JetBrains Mono for
designations and figures, with tabular numerals.

**Liquid glass.** Blurred saturated backdrop, an SVG displacement
refraction **masked to a 16px rim** (across the whole panel it smears
bright terrain into a halo that destroys text contrast), and a specular
top edge. The pane is tinted dark, not white — a white veil over lit
terrain raises the backdrop luminance and drops body text below 4.5:1.
Where `backdrop-filter` is unsupported it falls back to a solid tint, so
legibility never depends on the effect.

## Third-party assets and how they got here

**Chess pieces** — `@aestheticbookshelf/threejs3dchesspieces` (MIT). Ships
17.3 MB of raw OBJ, which is not a defensible thing to put on a portfolio
for one panel. `scripts/decimate-pieces.mjs` welds each mesh (they arrive
as non-indexed triangle soup, which is why SimplifyModifier collapsed
them to nothing on the first attempt), decimates to ~1,100 triangles,
normalises them to a common height and quantises to Int16 in
`public/chess-pieces.bin`. Six pieces, 126 kB. The pawn is the exception:
its mesh is non-manifold and the modifier throws on it, so its profile is
sampled by height band and re-lathed — same silhouette, ~200 triangles.

**No city library was worth adopting.** The npm results for procedural
city generation are 2D canvas toys or unrelated (`country-state-city`
and friends). The districts stay procedural in-house.

**Hardware models** are built from the photographs in the portfolio, not
from memory. The first pass had the Matrix E-blocks2 board green (it is
black), the bike unit on a green PCB (it is tan stripboard) with a 4×4
keypad (it is 3×4), and the Trilobot on tracks (it has two driven wheels
and a rear castor). Those are corrected; the notes in `props.tsx` record
what the real thing looks like so the next edit does not undo it.

**Chart data** in `content.ts` is read off `Trading_Project_Report.pdf` —
measured output of the harness, not illustration.

## Accessibility

The canvas is decorative and cannot be reached by keyboard, so it is
never the only route to anything:

- Every district is a real button in the header, in DOM order.
- A visually hidden district list carries each district's name, subtitle
  and summary, so a screen reader or a browser without WebGL gets the
  whole map as text.
- The drawer takes focus on open, closes on Escape and on clicking away.
- District state is carried by colour **and** height **and** ring
  behaviour, never colour alone.
- `prefers-reduced-motion` stops the scanlines, the ring pulses, the
  frame's idle, the arm, the Trilobot spin and the camera easing — the
  camera arrives rather than travels.
- The trading charts encode polarity, not identity, so they use a
  diverging pair on a neutral zero line; every bar carries its signed
  value as a direct label and the same numbers are available as a table.
- Focus rings are amber, 3px, never removed; targets are at least 44px.

## Deploying

Static build. Cloudflare Pages or Vercel, free tier:

```bash
npm run build      # then serve dist/
```

## Notes

- The `three` chunk is ~1 MB (~280 kB gzipped) and the images ~1.9 MB.
  If first paint matters more than the reveal, lazy-load `<Scene>` behind
  a `React.lazy` boundary; the header and the hidden district list render
  without it.
- Adding a project is one object in the `projects` array with a `group`.
  Adding a district is one object in `districts` plus a `landmark` case.
- The island is seeded (`SEED = 1337` in `terrain.ts`); change it for a
  different coastline. District skylines are seeded by index.
- `/#foundry-sector` deep-links straight into a district.
