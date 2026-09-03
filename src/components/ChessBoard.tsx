import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { chessGame } from '../data/content'
import { PIECE_SCALE, pieceManifest } from '../data/pieces'

/**
 * The board.
 *
 * Real Staunton meshes rather than boxes and cones: six decimated
 * pieces quantised into one 126 kB binary (see src/data/pieces.ts for
 * where they came from and what was done to them). The position is
 * parsed from FEN in content.ts, so correcting it is a one-line edit.
 */

const LIGHT = '#c6d6dc'
const DARK = '#2f5a6b'
const WHITE_PIECE = '#eef3f5'
const BLACK_PIECE = '#1d262c'

/** Height of each piece in board squares, so the set is proportioned. */
const HEIGHTS: Record<string, number> = { p: 0.62, r: 0.7, n: 0.78, b: 0.86, q: 0.98, k: 1.08 }

type Piece = { type: string; white: boolean; file: number; rank: number }

function parseFen(fen: string): Piece[] {
  const rows = fen.split(' ')[0].split('/')
  const out: Piece[] = []
  rows.forEach((row, i) => {
    const rank = 7 - i
    let file = 0
    for (const ch of row) {
      if (/\d/.test(ch)) {
        file += Number(ch)
        continue
      }
      out.push({ type: ch.toLowerCase(), white: ch === ch.toUpperCase(), file, rank })
      file += 1
    }
  })
  return out
}

const squareToCoord = (sq: string): [number, number] => [sq.charCodeAt(0) - 97, Number(sq[1]) - 1]
const toWorld = (file: number, rank: number): [number, number] => [file - 3.5, rank - 3.5]

/** Loads the packed meshes once and hands back a geometry per piece. */
function usePieceGeometries() {
  const [geos, setGeos] = useState<Record<string, THREE.BufferGeometry> | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(import.meta.env.BASE_URL + 'chess-pieces.bin')
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        if (cancelled) return
        const all = new Int16Array(buf)
        const next: Record<string, THREE.BufferGeometry> = {}
        for (const [key, slice] of Object.entries(pieceManifest)) {
          const src = all.subarray(slice.off, slice.off + slice.len)
          const pos = new Float32Array(src.length)
          for (let i = 0; i < src.length; i++) pos[i] = src[i] / PIECE_SCALE
          const g = new THREE.BufferGeometry()
          g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
          g.computeVertexNormals()
          next[key] = g
        }
        setGeos(next)
      })
      .catch(() => setGeos({}))
    return () => {
      cancelled = true
    }
  }, [])

  return geos
}

function Board({ played }: { played: boolean }) {
  const geos = usePieceGeometries()
  const pieces = useMemo(() => parseFen(played ? chessGame.after : chessGame.before), [played])
  const [fromF, fromR] = squareToCoord(chessGame.from)
  const [toF, toR] = squareToCoord(chessGame.to)

  const moving = useRef<THREE.Group>(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    if (!moving.current) return
    t.current = THREE.MathUtils.clamp(t.current + (played ? delta * 1.4 : -delta * 3), 0, 1)
    const k = t.current * t.current * (3 - 2 * t.current)
    const [ax, az] = toWorld(fromF, fromR)
    const [bx, bz] = toWorld(toF, toR)
    moving.current.position.set(
      THREE.MathUtils.lerp(ax, bx, k),
      Math.sin(k * Math.PI) * 0.8,
      THREE.MathUtils.lerp(az, bz, k),
    )
  })

  const material = (white: boolean) => (
    <meshStandardMaterial
      color={white ? WHITE_PIECE : BLACK_PIECE}
      roughness={white ? 0.42 : 0.5}
      metalness={0.06}
    />
  )

  const renderPiece = (type: string, white: boolean, key?: string) => {
    const g = geos?.[type]
    if (!g) return null
    const h = HEIGHTS[type] ?? 0.7
    return (
      <mesh key={key} geometry={g} scale={[h, h, h]} castShadow receiveShadow>
        {material(white)}
      </mesh>
    )
  }

  return (
    <group>
      {/* the squares, lifted clear of the plinth so they cannot z-fight */}
      {Array.from({ length: 8 }).map((_, f) =>
        Array.from({ length: 8 }).map((_, r) => {
          const [x, z] = toWorld(f, r)
          const isFrom = f === fromF && r === fromR
          const isTo = f === toF && r === toR
          return (
            <mesh
              key={`${f}-${r}`}
              position={[x, 0.001, z]}
              rotation={[-Math.PI / 2, 0, 0]}
              receiveShadow
            >
              <planeGeometry args={[1, 1]} />
              <meshStandardMaterial
                color={isTo ? '#7fe6ff' : isFrom ? '#3f7f93' : (f + r) % 2 === 0 ? DARK : LIGHT}
                roughness={0.92}
              />
            </mesh>
          )
        }),
      )}

      {/* plinth, kept below the squares */}
      <mesh position={[0, -0.16, 0]} receiveShadow>
        <boxGeometry args={[8.7, 0.3, 8.7]} />
        <meshStandardMaterial color="#16242e" roughness={0.85} flatShading />
      </mesh>

      {pieces
        .filter(
          (p) =>
            !(
              p.type === 'r' &&
              !p.white &&
              p.file === (played ? toF : fromF) &&
              p.rank === (played ? toR : fromR)
            ),
        )
        .map((p, i) => {
          const [x, z] = toWorld(p.file, p.rank)
          return (
            <group key={i} position={[x, 0, z]}>
              {renderPiece(p.type, p.white)}
            </group>
          )
        })}

      <group ref={moving}>{renderPiece('r', false, 'moving')}</group>
    </group>
  )
}

export function ChessBoard() {
  const [played, setPlayed] = useState(false)

  return (
    <div>
      <div className="relative aspect-[5/4] w-full overflow-hidden border border-[color:var(--color-hud)]/25 bg-[color:var(--color-void)]">
        <Canvas
          shadows
          dpr={[1, 1.6]}
          /* The board's half-diagonal is ~5.7 units. At this distance a 34°
             vertical field only covers ~4.5, which cropped the near rank —
             42° covers ~6.5 and leaves a margin. */
          camera={{ position: [0, 9.5, 10.5], fov: 42 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#06121a']} />
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[5, 10, 6]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-7}
            shadow-camera-right={7}
            shadow-camera-top={7}
            shadow-camera-bottom={-7}
          />
          <directionalLight position={[-6, 5, -5]} intensity={0.35} color="#7fe6ff" />
          <Suspense fallback={null}>
            <Board played={played} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableDamping
            minDistance={9}
            maxDistance={26}
            minPolarAngle={0.2}
            maxPolarAngle={Math.PI / 2.4}
          />
        </Canvas>

        <p className="pointer-events-none absolute bottom-2 left-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--on-surface-soft)]">
          drag to orbit · scroll to zoom
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPlayed((p) => !p)}
          className="stencil inline-flex h-11 items-center bg-[color:var(--color-amber)] px-5 text-[11px] font-bold text-[#1a0e00] transition-transform duration-200 hover:-translate-y-0.5"
        >
          {played ? 'Reset the position' : `Play ${chessGame.title}`}
        </button>
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--on-surface-soft)]">
          {played ? (
            <>
              Evaluation{' '}
              <span className="text-[color:var(--color-crimson)]">{chessGame.evaluation}</span> —
              Black winning
            </>
          ) : (
            <>Black to move · vs {chessGame.opponent}</>
          )}
        </p>
      </div>
    </div>
  )
}
