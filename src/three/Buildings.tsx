import { useMemo } from 'react'
import * as THREE from 'three'
import { rng, type Landmark } from '../data/world'

/**
 * District architecture.
 *
 * Blocks are generated from a seed rather than placed by hand — eight
 * districts of hand-typed boxes is a lot of numbers to maintain and
 * nobody would notice the difference. The seed is the district's index,
 * so a skyline is identical on every visit and every machine.
 */

export function Blocks({
  seed,
  radius,
  count,
  colour,
  maxHeight = 2.6,
  keepOut = [],
}: {
  seed: number
  radius: number
  count: number
  colour: string
  maxHeight?: number
  /**
   * Circles nothing may be generated inside, as [x, z, r] in district
   * space. Without this, a seeded block can land on top of a prop —
   * which is exactly how the dev board ended up buried in a wall.
   */
  keepOut?: [number, number, number][]
}) {
  const blocks = useMemo(() => {
    const rand = rng(seed * 7919 + 13)
    const out: {
      pos: [number, number, number]
      size: [number, number, number]
      rot: number
      lit: boolean
    }[] = []
    let guard = 0
    while (out.length < count && guard++ < count * 40) {
      // Ring placement keeps the middle clear for the landmark.
      const angle = rand() * Math.PI * 2
      const r = radius * (0.42 + rand() * 0.52)
      const w = 0.5 + rand() * 0.75
      const d = 0.5 + rand() * 0.75
      const h = 0.55 + rand() * maxHeight
      const px = Math.cos(angle) * r
      const pz = Math.sin(angle) * r

      // Reject anything overlapping a reserved circle, and try again.
      const clash = keepOut.some(
        ([kx, kz, kr]) => Math.hypot(px - kx, pz - kz) < kr + Math.max(w, d) * 0.7,
      )
      if (clash) continue

      out.push({
        pos: [px, h / 2, pz],
        size: [w, h, d],
        rot: rand() * Math.PI,
        lit: rand() > 0.55,
      })
    }
    return out
  }, [seed, radius, count, maxHeight, keepOut])

  return (
    <group>
      {blocks.map((b, i) => (
        <group key={i} position={b.pos} rotation={[0, b.rot, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={b.size} />
            <meshStandardMaterial
              color="#22384a"
              roughness={0.72}
              metalness={0.14}
              flatShading
            />
          </mesh>
          {/* A lit face, so the block reads as a building rather than a box. */}
          {b.lit && (
            <mesh position={[0, 0, b.size[2] / 2 + 0.005]}>
              <planeGeometry args={[b.size[0] * 0.62, b.size[1] * 0.6]} />
              <meshBasicMaterial color={colour} transparent opacity={0.3} />
            </mesh>
          )}
          {/* roof edge pick-out */}
          <mesh position={[0, b.size[1] / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[b.size[0] * 0.9, b.size[2] * 0.9]} />
            <meshBasicMaterial color={colour} transparent opacity={0.18} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** The thing that tells you which district you are looking at. */
export function LandmarkMesh({
  kind,
  colour,
}: {
  kind: Landmark
  colour: string
}) {
  const plate = (
    <meshStandardMaterial color="#2a4356" roughness={0.66} metalness={0.16} flatShading />
  )

  switch (kind) {
    case 'tower':
      return (
        <group>
          <mesh position={[0, 2.6, 0]} castShadow>
            <boxGeometry args={[1.5, 5.2, 1.5]} />
            {plate}
          </mesh>
          {[1.2, 2.4, 3.6, 4.8].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <boxGeometry args={[1.56, 0.12, 1.56]} />
              <meshBasicMaterial color={colour} transparent opacity={0.5} />
            </mesh>
          ))}
          <mesh position={[0, 5.35, 0]}>
            <coneGeometry args={[0.78, 0.9, 4]} />
            <meshBasicMaterial color={colour} transparent opacity={0.55} />
          </mesh>
          <mesh position={[0, 6.0, 0]}>
            <sphereGeometry args={[0.14, 12, 10]} />
            <meshBasicMaterial color={colour} />
          </mesh>
        </group>
      )

    case 'docks':
      return (
        <group>
          {/* gantry crane */}
          <mesh position={[0, 1.7, 0]} castShadow>
            <boxGeometry args={[0.24, 3.4, 0.24]} />
            {plate}
          </mesh>
          <mesh position={[0.9, 3.3, 0]} rotation={[0, 0, -0.25]} castShadow>
            <boxGeometry args={[2.6, 0.2, 0.2]} />
            {plate}
          </mesh>
          {/* hoist cable and hook block, so the thin bar under the jib
              reads as lifting gear rather than a stray green plank */}
          <mesh position={[1.9, 2.75, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 1.1, 6]} />
            <meshBasicMaterial color={colour} />
          </mesh>
          <mesh position={[1.9, 2.12, 0]} castShadow>
            <boxGeometry args={[0.24, 0.22, 0.24]} />
            {plate}
          </mesh>
          {/* containers */}
          {[
            [-1.2, 0.3, 0.7],
            [-1.2, 0.9, 0.7],
            [-0.4, 0.3, 1.2],
          ].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]} castShadow>
              <boxGeometry args={[1.1, 0.55, 0.6]} />
              <meshStandardMaterial
                color={i === 1 ? colour : '#20323d'}
                roughness={0.8}
                flatShading
              />
            </mesh>
          ))}
        </group>
      )

    case 'arcade':
      return (
        <group>
          {/* long shed roof on columns */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[4.2, 0.16, 2.0]} />
            {plate}
          </mesh>
          {[-1.9, -0.6, 0.6, 1.9].map((x) =>
            [-0.85, 0.85].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, 0.75, z]} castShadow>
                <boxGeometry args={[0.14, 1.5, 0.14]} />
                {plate}
              </mesh>
            )),
          )}
          {/* awnings */}
          {[-1.3, 0, 1.3].map((x) => (
            <mesh key={x} position={[x, 1.1, 1.05]} rotation={[0.5, 0, 0]}>
              <planeGeometry args={[1.1, 0.6]} />
              <meshBasicMaterial color={colour} transparent opacity={0.45} side={THREE.DoubleSide} />
            </mesh>
          ))}
          <mesh position={[0, 1.95, 0]}>
            <boxGeometry args={[2.4, 0.5, 0.08]} />
            <meshBasicMaterial color={colour} transparent opacity={0.35} />
          </mesh>
        </group>
      )

    case 'foundry':
      return (
        <group>
          {/* the gantry the frame is serviced under */}
          {[-2.3, 2.3].map((x) => (
            <mesh key={x} position={[x, 2.4, 0]} castShadow>
              <boxGeometry args={[0.3, 4.8, 0.3]} />
              {plate}
            </mesh>
          ))}
          <mesh position={[0, 4.9, 0]} castShadow>
            <boxGeometry args={[5.2, 0.28, 0.5]} />
            {plate}
          </mesh>
          {[-1.2, 1.2].map((x) => (
            <mesh key={x} position={[x, 4.55, 0]}>
              <boxGeometry args={[0.1, 0.5, 0.1]} />
              <meshBasicMaterial color={colour} />
            </mesh>
          ))}
          {/* floor markings */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
            <ringGeometry args={[2.0, 2.15, 32]} />
            <meshBasicMaterial color={colour} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )

    case 'campus':
      return (
        <group>
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[3.4, 1.8, 1.6]} />
            {plate}
          </mesh>
          {/* clock tower */}
          <mesh position={[1.3, 2.3, 0]} castShadow>
            <boxGeometry args={[0.8, 3.4, 0.8]} />
            {plate}
          </mesh>
          <mesh position={[1.3, 4.38, 0]}>
            <coneGeometry args={[0.6, 0.86, 4]} />
            <meshBasicMaterial color={colour} transparent opacity={0.6} />
          </mesh>
          <mesh position={[1.3, 3.5, 0.42]}>
            <circleGeometry args={[0.24, 20]} />
            <meshBasicMaterial color={colour} transparent opacity={0.75} />
          </mesh>
          {/* colonnade */}
          {[-1.4, -0.7, 0, 0.7].map((x) => (
            <mesh key={x} position={[x, 0.75, 0.9]} castShadow>
              <cylinderGeometry args={[0.11, 0.11, 1.5, 10]} />
              {plate}
            </mesh>
          ))}
        </group>
      )

    case 'overlook':
      return (
        <group>
          {/* a viewing platform on legs, the highest civilian point */}
          <mesh position={[0, 2.4, 0]} castShadow>
            <cylinderGeometry args={[1.5, 1.5, 0.18, 20]} />
            {plate}
          </mesh>
          <mesh position={[0, 2.7, 0]}>
            <torusGeometry args={[1.5, 0.05, 8, 28]} />
            <meshBasicMaterial color={colour} transparent opacity={0.7} />
          </mesh>
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2
            return (
              <mesh
                key={i}
                position={[Math.cos(a) * 0.9, 1.2, Math.sin(a) * 0.9]}
                rotation={[0.12, 0, 0.12]}
                castShadow
              >
                <cylinderGeometry args={[0.1, 0.14, 2.4, 8]} />
                {plate}
              </mesh>
            )
          })}
          {/* Beacon. This used to be a cone hanging in the air a metre
              above the deck with nothing joining the two, which read as a
              floating shape rather than a landmark. It now stands ON the
              platform, with the light at the top of the mast. */}
          <mesh position={[0, 3.1, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.1, 1.3, 10]} />
            {plate}
          </mesh>
          <mesh position={[0, 3.85, 0]}>
            <sphereGeometry args={[0.2, 14, 12]} />
            <meshBasicMaterial color={colour} />
          </mesh>
          <mesh position={[0, 3.85, 0]}>
            <sphereGeometry args={[0.34, 14, 12]} />
            <meshBasicMaterial color={colour} transparent opacity={0.18} />
          </mesh>
        </group>
      )

    case 'lab':
      return (
        <group>
          {/* a low research block with a data spine and two dishes */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <boxGeometry args={[3.0, 1.4, 1.8]} />
            {plate}
          </mesh>
          <mesh position={[0, 2.4, 0]} castShadow>
            <boxGeometry args={[0.3, 2.0, 0.3]} />
            {plate}
          </mesh>
          {[0.9, 1.5, 2.1, 2.7].map((y, i) => (
            <mesh key={y} position={[0, y, 0]}>
              <boxGeometry args={[1.6 - i * 0.3, 0.06, 0.06]} />
              <meshBasicMaterial color={colour} transparent opacity={0.6} />
            </mesh>
          ))}
          {/* Dishes. A partial sphere with DoubleSide is an open shell —
              from most angles it renders as a pale bow-tie floating in the
              air rather than a dish. A truncated cone is closed, solid and
              reads correctly from every side. */}
          {[-1.1, 1.1].map((x, i) => (
            <group key={x} position={[x, 1.6, 0.35]} rotation={[-0.6, i === 0 ? -0.5 : 0.5, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.46, 0.16, 0.2, 18]} />
                <meshStandardMaterial color="#dfe6ea" roughness={0.6} flatShading />
              </mesh>
              <mesh position={[0, 0.24, 0]}>
                <cylinderGeometry args={[0.035, 0.035, 0.3, 8]} />
                <meshStandardMaterial color="#4a545c" roughness={0.5} />
              </mesh>
              <mesh position={[0, -0.34, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
                {plate}
              </mesh>
            </group>
          ))}
        </group>
      )

    case 'blacksite':
      return (
        <group>
          {/* a walled compound: nothing here is on show */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[2.4, 1.6, 2.4]} />
            <meshStandardMaterial color="#141d24" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0, 1.66, 0]}>
            <boxGeometry args={[2.5, 0.08, 2.5]} />
            <meshBasicMaterial color={colour} transparent opacity={0.55} />
          </mesh>
          {/* perimeter fence */}
          {[0, 1, 2, 3].map((i) => {
            const a = (i / 4) * Math.PI * 2 + Math.PI / 4
            return (
              <mesh
                key={i}
                position={[Math.cos(a) * 2.6, 0.55, Math.sin(a) * 2.6]}
                rotation={[0, -a, 0]}
              >
                <boxGeometry args={[0.08, 1.1, 3.3]} />
                <meshBasicMaterial color={colour} transparent opacity={0.28} />
              </mesh>
            )
          })}
          {/* the one light that is always on */}
          <mesh position={[0, 2.1, 0]}>
            <sphereGeometry args={[0.16, 10, 8]} />
            <meshBasicMaterial color={colour} />
          </mesh>
        </group>
      )

    case 'plaza':
      return (
        <group>
          {/* the board */}
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 8 }).map((_, c) =>
              (r + c) % 2 === 0 ? (
                <mesh
                  key={`${r}-${c}`}
                  position={[(c - 3.5) * 0.44, 0.04, (r - 3.5) * 0.44]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <planeGeometry args={[0.42, 0.42]} />
                  <meshBasicMaterial color={colour} transparent opacity={0.28} />
                </mesh>
              ) : null,
            ),
          )}
          {/* two rooks, one of them toppled — the sacrifice */}
          <group position={[-0.66, 0, -0.66]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.26, 0.9, 12]} />
              <meshStandardMaterial color="#e8eef2" roughness={0.7} flatShading />
            </mesh>
            <mesh position={[0, 0.95, 0]} castShadow>
              <cylinderGeometry args={[0.26, 0.22, 0.2, 12]} />
              <meshStandardMaterial color="#e8eef2" roughness={0.7} flatShading />
            </mesh>
          </group>
          <group position={[0.9, 0.22, 0.66]} rotation={[Math.PI / 2, 0, 0.4]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.2, 0.26, 0.9, 12]} />
              <meshStandardMaterial color="#b0402c" roughness={0.7} flatShading />
            </mesh>
          </group>
        </group>
      )

    case 'mast':
      return (
        <group>
          <mesh position={[0, 3.0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.3, 6.0, 8]} />
            {plate}
          </mesh>
          {[1.4, 2.6, 3.8].map((y, i) => (
            <mesh key={y} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.5 + i * 0.12, 0.62 + i * 0.12, 20]} />
              <meshBasicMaterial
                color={colour}
                transparent
                opacity={0.45}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
          {/* Dish, on a strut off the mast. Previously an open spherical
              shell floating clear of the tower — the shape that read as a
              white bird. Solid truncated cone now, joined to the mast so it
              belongs to the structure. */}
          <group position={[0.34, 4.5, 0]}>
            <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.42, 8]} />
              {plate}
            </mesh>
            <group rotation={[0, 0, -0.75]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.56, 0.2, 0.26, 20]} />
                <meshStandardMaterial color="#e8eef2" roughness={0.55} flatShading />
              </mesh>
              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.36, 8]} />
                <meshStandardMaterial color="#4a545c" roughness={0.5} />
              </mesh>
            </group>
          </group>
          <mesh position={[0, 6.15, 0]}>
            <sphereGeometry args={[0.13, 10, 8]} />
            <meshBasicMaterial color="#ff4d4d" />
          </mesh>
        </group>
      )
  }
}
