import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A Knightmare Frame, standing over the Foundry.
 *
 * Built from primitives rather than a downloaded model: no licence to
 * worry about, no 8 MB GLB on the critical path, and the silhouette is
 * what carries the reference anyway — narrow waist, high shoulders,
 * forward-canted head with a single sensor eye, and the landspinners
 * the machines roll on instead of walking.
 */

const HULL = '#dfe6ea'
const TRIM = '#b0402c'
const DARK = '#2a3a44'

function Plate({
  position,
  args,
  colour = HULL,
  rotation,
}: {
  position: [number, number, number]
  args: [number, number, number]
  colour?: string
  rotation?: [number, number, number]
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={colour} roughness={0.42} metalness={0.28} flatShading />
    </mesh>
  )
}

export function Knightmare({
  position,
  rotation = 0,
  scale = 1,
  reducedMotion,
  accent = '#ff4d4d',
}: {
  position: [number, number, number]
  rotation?: number
  scale?: number
  reducedMotion: boolean
  accent?: string
}) {
  const group = useRef<THREE.Group>(null)
  const eye = useRef<THREE.Mesh>(null)
  const head = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (reducedMotion) return
    const t = state.clock.elapsedTime
    // Idle: the frame breathes, and the head tracks slowly across the
    // sector as if something out there is being watched.
    if (group.current) group.current.position.y = position[1] + Math.sin(t * 0.7) * 0.05
    if (head.current) head.current.rotation.y = Math.sin(t * 0.28) * 0.45
    if (eye.current) {
      const m = eye.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.6 + (Math.sin(t * 2.4) + 1) * 0.2
    }
  })

  return (
    <group ref={group} position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* legs */}
      {[-0.42, 0.42].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Plate position={[0, 0.55, 0]} args={[0.42, 1.1, 0.44]} colour={DARK} />
          <Plate position={[0, 1.45, 0]} args={[0.5, 0.9, 0.5]} />
          {/* landspinner */}
          <mesh position={[0, 0.22, 0.06]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.26, 14]} />
            <meshStandardMaterial color={DARK} roughness={0.6} metalness={0.3} flatShading />
          </mesh>
        </group>
      ))}

      {/* waist and torso */}
      <Plate position={[0, 2.1, 0]} args={[0.9, 0.42, 0.62]} colour={DARK} />
      <Plate position={[0, 2.95, 0]} args={[1.32, 1.32, 0.86]} />
      <Plate position={[0, 3.0, 0.46]} args={[0.6, 0.7, 0.16]} colour={TRIM} />

      {/* shoulders */}
      {[-1.02, 1.02].map((x) => (
        <group key={x} position={[x, 3.3, 0]}>
          <Plate position={[0, 0, 0]} args={[0.62, 0.72, 0.86]} />
          <Plate position={[0, -0.85, 0]} args={[0.36, 1.15, 0.4]} colour={DARK} />
          {/* forearm, angled forward */}
          <Plate
            position={[0, -1.72, 0.2]}
            args={[0.42, 0.95, 0.46]}
            rotation={[0.22, 0, 0]}
          />
        </group>
      ))}

      {/* neck and head */}
      <group ref={head} position={[0, 3.95, 0]}>
        <Plate position={[0, 0, 0]} args={[0.5, 0.44, 0.52]} colour={DARK} />
        <Plate position={[0, 0.34, 0.06]} args={[0.66, 0.4, 0.6]} />
        {/* the crest */}
        <Plate position={[0, 0.62, 0.02]} args={[0.14, 0.34, 0.5]} colour={TRIM} />
        {/* single sensor eye */}
        <mesh ref={eye} position={[0, 0.32, 0.32]}>
          <boxGeometry args={[0.46, 0.1, 0.06]} />
          <meshBasicMaterial color={accent} transparent opacity={0.85} />
        </mesh>
      </group>

      {/* slash harken housings on the hips */}
      {[-0.62, 0.62].map((x) => (
        <Plate key={x} position={[x, 2.2, -0.34]} args={[0.3, 0.3, 0.3]} colour={TRIM} />
      ))}
    </group>
  )
}
