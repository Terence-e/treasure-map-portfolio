import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Island } from './Island'
import { Sea } from './Sea'
import { District } from './District'
import { padHeightAt } from './terrain'
import { districts, districtById } from '../data/world'

type SceneProps = {
  activeId: string | null
  hoveredId: string | null
  daylight: boolean
  reducedMotion: boolean
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
  onDeselect: () => void
}

/**
 * The camera.
 *
 * OrbitControls owns the input — drag to turn, wheel or pinch to zoom —
 * and this rig only takes over when a district is selected, easing the
 * orbit target and the distance toward that district and back out again
 * when it is closed. Damping is left on so a released drag coasts.
 */
function CameraRig({
  activeId,
  reducedMotion,
}: {
  activeId: string | null
  reducedMotion: boolean
}) {
  const controls = useThree((s) => s.controls) as
    | (THREE.EventDispatcher & {
        target: THREE.Vector3
        update: () => void
        enabled: boolean
        minDistance: number
        maxDistance: number
      })
    | null
  const { camera } = useThree()
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0))
  const desiredDistance = useRef(44)
  /** Counts down after a change of focus, easing harder at the start. */
  const cut = useRef(0)
  /** Lateral offset applied so the drawer does not cover the subject. */
  const shift = useRef(0)

  useEffect(() => {
    cut.current = 1
  }, [activeId])

  useFrame((_, delta) => {
    if (!controls) return
    const d = districtById(activeId ?? '')

    if (d) {
      const [x, z] = d.position
      desiredTarget.current.set(x, padHeightAt(x, z) + 1.6, z)
      desiredDistance.current = 16
    } else {
      desiredTarget.current.set(0, 1.5, 0)
      desiredDistance.current = 44
    }

    cut.current = Math.max(0, cut.current - delta * 1.4)
    const ease = reducedMotion ? 1 : 0.045 + cut.current * 0.06

    // Current view axis, from the orbit target out to the camera.
    const offset = camera.position.clone().sub(controls.target)

    /* With the drawer open on a wide screen the focused district would
       sit underneath it. Aiming at a point to the district's screen-right
       parks the district in the visible half instead.
       This has to be an absolute offset from the district, not something
       added to controls.target each frame — added incrementally it never
       settles and the camera walks off the island. */
    const wide = typeof window !== 'undefined' && window.innerWidth >= 640
    const wantShift = d && wide ? desiredDistance.current * 0.24 : 0
    shift.current = THREE.MathUtils.lerp(shift.current, wantShift, ease)

    const screenRight = new THREE.Vector3().crossVectors(camera.up, offset).normalize()
    const aim = desiredTarget.current.clone().addScaledVector(screenRight, shift.current)

    controls.target.lerp(aim, ease)

    // Keep whatever orbit angle the visitor chose; drive only the
    // centre of the orbit and how far out the camera sits.
    const next = THREE.MathUtils.lerp(offset.length(), desiredDistance.current, ease)
    offset.setLength(next)
    camera.position.copy(controls.target).add(offset)

    controls.update()
  })

  return null
}

export function Scene({
  activeId,
  hoveredId,
  daylight,
  reducedMotion,
  onHover,
  onSelect,
  onDeselect,
}: SceneProps) {
  const bg = daylight ? '#b9ccd6' : '#05090d'

  return (
    <Canvas
      dpr={[1, 1.75]}
      shadows
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [26, 30, 42], fov: 42, near: 0.1, far: 400 }}
      onPointerMissed={() => {
        onHover(null)
        onDeselect()
      }}
    >
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 55, 135]} />

      <ambientLight intensity={daylight ? 0.95 : 0.62} />
      <hemisphereLight
        intensity={daylight ? 0.5 : 0.35}
        color={daylight ? '#ffffff' : '#7fe6ff'}
        groundColor={daylight ? '#c9d8e0' : '#0a1c26'}
      />
      <directionalLight
        position={[22, 34, 16]}
        intensity={daylight ? 1.15 : 0.95}
        color={daylight ? '#ffffff' : '#cdeeff'}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <directionalLight
        position={[-24, 12, -18]}
        intensity={0.45}
        color={daylight ? '#c9d8e0' : '#ffb554'}
      />

      <Sea daylight={daylight} />
      <Island daylight={daylight} />

      {districts.map((d, i) => (
        <District
          key={d.id}
          data={d}
          index={i}
          active={activeId === d.id}
          hovered={hoveredId === d.id}
          dimmed={activeId !== null && activeId !== d.id}
          reducedMotion={reducedMotion}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.55}
        zoomSpeed={0.7}
        minDistance={9}
        maxDistance={80}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI / 2.35}
      />
      <CameraRig activeId={activeId} reducedMotion={reducedMotion} />
    </Canvas>
  )
}
