import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Blocks, LandmarkMesh } from './Buildings'
import { Knightmare } from './Knightmare'
import { BikeUnit, CobotArm, DevBoard, Trilobot } from './props'
import { padHeightAt } from './terrain'
import type { District as DistrictData } from '../data/world'

/**
 * Where the machines stand, as [x, z, radius] in district space. The
 * block generator is forbidden from placing anything inside these, which
 * is what stops a building from growing through the dev board.
 */
const FOUNDRY_PROPS: [number, number, number][] = [
  [0, 0, 3.0],      // the Knightmare and its floor markings
  [-4.0, 2.9, 2.2], // Trilobot
  [3.2, 2.3, 1.6],  // bike unit
  [3.7, -1.9, 1.7], // dev board
  [-3.5, -2.1, 1.6], // cobot arm
]

type Props = {
  data: DistrictData
  index: number
  active: boolean
  hovered: boolean
  dimmed: boolean
  reducedMotion: boolean
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
}

export function District({
  data,
  index,
  active,
  hovered,
  dimmed,
  reducedMotion,
  onHover,
  onSelect,
}: Props) {
  const [x, z] = data.position
  const y = padHeightAt(x, z)
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  const [pressed, setPressed] = useState(false)

  useFrame((state) => {
    if (ring.current) {
      const m = ring.current.material as THREE.MeshBasicMaterial
      const base = active ? 0.85 : hovered ? 0.7 : 0.28
      if (reducedMotion) {
        m.opacity = base
      } else {
        const pulse = (Math.sin(state.clock.elapsedTime * 1.6 + index) + 1) / 2
        m.opacity = base + (hovered || active ? pulse * 0.15 : pulse * 0.06)
      }
      const target = hovered || active ? 1.06 : 1
      ring.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12)
    }
    if (group.current) {
      const lift = pressed ? -0.05 : hovered ? 0.12 : 0
      group.current.position.y += (y + lift - group.current.position.y) * 0.14
    }
  })

  return (
    <group
      ref={group}
      position={[x, y, z]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(data.id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onHover(null)
        document.body.style.cursor = ''
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(data.id)
      }}
    >
      {/* The pad. Also the click target — a single flat disc is far more
          forgiving to hit than the buildings themselves. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[data.radius, 48]} />
        <meshStandardMaterial
          color="#0e1c24"
          roughness={0.9}
          transparent
          opacity={dimmed ? 0.5 : 0.95}
        />
      </mesh>

      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[data.radius - 0.22, data.radius, 64]} />
        <meshBasicMaterial
          color={data.colour}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group>
        <Blocks
          seed={index + 1}
          radius={data.radius}
          count={data.landmark === 'foundry' ? 8 : 9}
          colour={data.colour}
          maxHeight={data.landmark === 'tower' ? 2.2 : 2.6}
          keepOut={data.landmark === 'foundry' ? FOUNDRY_PROPS : undefined}
        />

        <LandmarkMesh kind={data.landmark} colour={data.colour} />

        {/* The Foundry is where the machines live. */}
        {data.landmark === 'foundry' && (
          <>
            <Knightmare
              position={[0, 0, 0]}
              rotation={-0.5}
              scale={1.18}
              reducedMotion={reducedMotion}
              accent={data.colour}
            />
            <Trilobot position={[-4.0, 0, 2.9]} spin={!reducedMotion && (hovered || active)}
              /* it idles at a walking pace even untouched — see props.tsx */ />
            <BikeUnit position={[3.2, 0, 2.3]} />
            <DevBoard position={[3.7, 0, -1.9]} />
            <CobotArm position={[-3.5, 0, -2.1]} reducedMotion={reducedMotion} />
          </>
        )}

      </group>

      {/* A beacon so a district is findable when the camera is far out. */}
      <mesh position={[0, 6.6, 0]}>
        <octahedronGeometry args={[active ? 0.3 : 0.2, 0]} />
        <meshBasicMaterial color={data.colour} transparent opacity={active ? 1 : 0.55} />
      </mesh>
      <mesh position={[0, 5.6, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2.0, 6]} />
        <meshBasicMaterial color={data.colour} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}
