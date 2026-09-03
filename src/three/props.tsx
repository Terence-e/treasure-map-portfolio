import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * The hardware, modelled from the photographs in the portfolio rather
 * than from imagination — the first pass got these wrong, so the notes
 * on each say what the real thing looks like.
 */

const BOARD_BLACK = '#12161a'   // Matrix E-blocks2 substrate
const STRIPBOARD = '#c9a877'    // tan perfboard the bike unit is built on
const LCD_BEZEL = '#1d4a2a'     // the green PCB skirt around a 16x2 module
const LCD_SCREEN = '#7fd36a'    // its backlit face
const KEY_CAP = '#d8dde0'
const KEY_BODY = '#15181b'
const METAL = '#9aa6ad'
const WHITE_ABS = '#eef1f3'
const JOINT = '#22282d'

function Part({
  args,
  position,
  rotation,
  colour,
  rough = 0.8,
  metal = 0.05,
}: {
  args: [number, number, number]
  position: [number, number, number]
  rotation?: [number, number, number]
  colour: string
  rough?: number
  metal?: number
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={colour} roughness={rough} metalness={metal} flatShading />
    </mesh>
  )
}

/**
 * Pimoroni Trilobot: a flat black chassis on two driven wheels with a
 * rear castor — not tracks, which is what the first version had. Camera
 * on a short front mount, underlighting along the edge.
 */
export function Trilobot({ position, spin }: { position: [number, number, number]; spin: boolean }) {
  const body = useRef<THREE.Group>(null)
  const left = useRef<THREE.Mesh>(null)
  const right = useRef<THREE.Mesh>(null)
  /** Eased so hovering speeds the robot up rather than switching it on. */
  const rate = useRef(0.35)

  useFrame((_, delta) => {
    const target = spin ? 3.2 : 0.35
    rate.current += (target - rate.current) * Math.min(1, delta * 3)

    // Accumulate. Setting rotation from clock.elapsedTime made the body
    // jump to an absolute angle the instant hover changed.
    if (body.current) body.current.rotation.y += delta * rate.current * 0.09

    /* The wheels spin about their OWN axle. The first version rotated the
       parent group about X, which — because the wheels sit at x = ±0.8 —
       swung them in an arc around the chassis instead of rolling them,
       and dragged them through the deck on the way past. */
    const spinBy = delta * rate.current
    if (left.current) left.current.rotation.y -= spinBy
    if (right.current) right.current.rotation.y -= spinBy
  })

  /**
   * A smooth cylinder in one flat colour reads as static however fast it
   * turns — there is nothing on it to track. The hub and the tread blocks
   * are what make the rotation visible.
   */
  const Wheel = ({ side }: { side: 'l' | 'r' }) => (
    <group position={[side === 'l' ? -0.74 : 0.74, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh ref={side === 'l' ? left : right} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.16, 18]} />
        <meshStandardMaterial color="#20262b" roughness={0.95} />
        {/* hub */}
        <mesh position={[0, 0.085, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 14]} />
          <meshStandardMaterial color="#c8cdd1" roughness={0.4} metalness={0.4} />
        </mesh>
        {/* tread */}
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.3, 0, Math.sin(a) * 0.3]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.05, 0.17, 0.09]} />
              <meshStandardMaterial color="#0f1316" roughness={1} />
            </mesh>
          )
        })}
      </mesh>
    </group>
  )

  return (
    <group ref={body} position={position} scale={1.3}>
      {/* chassis plate */}
      {/* Narrower than the track: at 1.5 wide the deck covered both wheels
          and the rotation was invisible from above, which is most of the
          time on this map. */}
      <Part args={[1.16, 0.1, 1.15]} position={[0, 0.36, 0]} colour="#2b3238" rough={0.6} />
      {/* the Pi underneath */}
      <Part args={[0.86, 0.12, 0.6]} position={[0, 0.25, 0]} colour="#1d7a56" />
      {/* underlight */}
      <mesh position={[0, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.74, 24]} />
        <meshBasicMaterial color="#7fe6ff" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      <Wheel side="l" />
      <Wheel side="r" />

      {/* rear castor */}
      <mesh position={[0, 0.14, -0.46]} castShadow>
        <sphereGeometry args={[0.12, 12, 10]} />
        <meshStandardMaterial color={METAL} roughness={0.35} metalness={0.6} />
      </mesh>

      {/* camera on its mount */}
      <Part args={[0.09, 0.42, 0.09]} position={[0, 0.6, 0.42]} colour={BOARD_BLACK} />
      <Part args={[0.3, 0.22, 0.06]} position={[0, 0.86, 0.42]} colour="#1d5f45" />
      <mesh position={[0, 0.86, 0.47]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.04, 12]} />
        <meshStandardMaterial color="#0b0e11" roughness={0.2} metalness={0.5} />
      </mesh>
    </group>
  )
}

/**
 * The smart-bicycle instrument as photographed: tan stripboard, a green
 * 16x2 LCD reading Speed:0.0km/h, a black 3x4 telephone keypad with
 * light keys, and the battery pack sitting behind it.
 */
export function BikeUnit({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -0.55, 0]} scale={1.15}>
      {/* stripboard */}
      <Part args={[1.7, 0.08, 1.25]} position={[0, 0.3, 0]} colour={STRIPBOARD} rough={0.95} />

      {/* 16x2 LCD module: green board, lighter backlit face */}
      <Part args={[1.02, 0.09, 0.42]} position={[-0.06, 0.38, -0.32]} colour={LCD_BEZEL} />
      <mesh position={[-0.06, 0.43, -0.32]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.84, 0.26]} />
        <meshBasicMaterial color={LCD_SCREEN} />
      </mesh>
      {/* two rows of characters, suggested rather than spelled out */}
      {[-0.06, 0.06].map((dz, r) => (
        <mesh key={r} position={[-0.14, 0.44, -0.32 + dz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[r === 0 ? 0.6 : 0.34, 0.045]} />
          <meshBasicMaterial color="#14361a" />
        </mesh>
      ))}

      {/* 3x4 keypad, black body with light keys */}
      <Part args={[0.62, 0.07, 0.78]} position={[-0.02, 0.37, 0.28]} colour={KEY_BODY} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <Part
            key={`${r}-${c}`}
            args={[0.15, 0.05, 0.15]}
            position={[-0.19 + c * 0.17, 0.42, -0.01 + r * 0.18]}
            colour={KEY_CAP}
            rough={0.6}
          />
        )),
      )}

      {/* battery / module box behind the board */}
      <Part args={[0.86, 0.4, 0.5]} position={[0.1, 0.52, -0.78]} colour="#1a1e22" rough={0.7} />
      <Part args={[0.9, 0.06, 0.54]} position={[0.1, 0.74, -0.78]} colour="#2a3036" />
    </group>
  )
}

/**
 * Matrix E-blocks2 development centre: a large BLACK board — the first
 * version had it green — with the Matrix wordmark, a four-digit red
 * seven-segment bank, an LCD, a DC motor and an LED row, plus the small
 * daughter board that sits alongside it.
 */
export function DevBoard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0.65, 0]} scale={1.05}>
      {/* the mat it sits on */}
      <Part args={[2.6, 0.03, 1.9]} position={[0, 0.24, 0]} colour="#c8ccce" rough={0.98} />

      {/* main board */}
      <Part args={[2.1, 0.09, 1.5]} position={[0, 0.31, 0]} colour={BOARD_BLACK} rough={0.55} />
      {/* wordmark strip */}
      <mesh position={[0.66, 0.36, 0.02]} rotation={[-Math.PI / 2, 0, -0.25]}>
        <planeGeometry args={[0.62, 0.13]} />
        <meshBasicMaterial color="#e8ecee" transparent opacity={0.85} />
      </mesh>

      {/* four-digit red seven-segment bank */}
      <Part args={[0.62, 0.07, 0.3]} position={[0.28, 0.38, -0.34]} colour="#0d1013" />
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0.06 + i * 0.145, 0.42, -0.34]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 0.2]} />
          <meshBasicMaterial color="#ff3b30" />
        </mesh>
      ))}

      {/* LCD in the corner */}
      <Part args={[0.5, 0.07, 0.26]} position={[0.72, 0.38, 0.42]} colour={LCD_BEZEL} />
      <mesh position={[0.72, 0.42, 0.42]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 0.17]} />
        <meshBasicMaterial color="#9fd0c0" />
      </mesh>

      {/* DC motor */}
      <mesh position={[-0.42, 0.44, -0.12]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.4, 16]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.65} />
      </mesh>
      {/* the big blue capacitor next to it */}
      <mesh position={[-0.1, 0.44, 0.3]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.26, 14]} />
        <meshStandardMaterial color="#2b5fb8" roughness={0.5} />
      </mesh>

      {/* LED row */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.66 + i * 0.11, 0.37, 0.6]}>
          <sphereGeometry args={[0.04, 8, 6]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#ffb554' : '#7fe6ff'} />
        </mesh>
      ))}

      {/* the small daughter board alongside */}
      <Part
        args={[0.75, 0.07, 0.34]}
        position={[-1.15, 0.33, -0.5]}
        rotation={[0, 0.25, 0]}
        colour={BOARD_BLACK}
        rough={0.55}
      />
    </group>
  )
}

/** myCobot 280 Pi — white segments, dark joint housings, small base. */
export function CobotArm({
  position,
  reducedMotion,
}: {
  position: [number, number, number]
  reducedMotion: boolean
}) {
  const j1 = useRef<THREE.Group>(null)
  const j3 = useRef<THREE.Group>(null)

  useFrame((s) => {
    if (reducedMotion) return
    const t = s.clock.elapsedTime
    if (j1.current) j1.current.rotation.y = Math.sin(t * 0.35) * 0.7
    if (j3.current) j3.current.rotation.z = -0.6 + Math.sin(t * 0.5) * 0.28
  })

  const Seg = ({ len }: { len: number }) => (
    <mesh position={[0, len / 2, 0]} castShadow>
      <boxGeometry args={[0.24, len, 0.24]} />
      <meshStandardMaterial color={WHITE_ABS} roughness={0.45} metalness={0.04} />
    </mesh>
  )

  const Joint = () => (
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.17, 0.17, 0.3, 16]} />
      <meshStandardMaterial color={JOINT} roughness={0.5} metalness={0.2} />
    </mesh>
  )

  return (
    <group position={position} scale={1.2}>
      <mesh position={[0, 0.09, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.46, 0.52, 0.18, 22]} />
        <meshStandardMaterial color={JOINT} roughness={0.6} />
      </mesh>
      <group ref={j1} position={[0, 0.18, 0]}>
        <Joint />
        <Seg len={0.7} />
        <group position={[0, 0.7, 0]} rotation={[0, 0, 0.5]}>
          <Joint />
          <Seg len={0.8} />
          <group ref={j3} position={[0, 0.8, 0]} rotation={[0, 0, -0.6]}>
            <Joint />
            <Seg len={0.6} />
            <group position={[0, 0.6, 0]}>
              <Joint />
              {[-0.09, 0.09].map((x) => (
                <mesh key={x} position={[x, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.06, 0.28, 0.12]} />
                  <meshStandardMaterial color={WHITE_ABS} roughness={0.45} />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
