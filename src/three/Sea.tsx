import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Water on a tactical display: a coordinate lattice fading into the
 * dark, with a sensor sweep travelling outward from the territory.
 * No vertex simulation — the motion is a phase offset in the shader.
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uHatch;
  varying vec3 vWorld;

  void main() {
    float d = length(vWorld.xz);

    vec3 water = mix(uShallow, uDeep, smoothstep(18.0, 52.0, d));

    // Coordinate lattice.
    vec2 g = abs(fract(vWorld.xz / 6.0) - 0.5) / max(fwidth(vWorld.xz / 6.0), vec2(0.0001));
    float grid = 1.0 - smoothstep(0.0, 1.0, min(g.x, g.y));
    water += uHatch * grid * 0.22;

    // Sensor sweep: a single ring travelling out and repeating.
    float sweep = fract(d * 0.035 - uTime * 0.09);
    water += uHatch * smoothstep(0.965, 1.0, sweep) * 0.5;

    // Fade the plane out at the horizon so it never shows a hard edge.
    float fade = 1.0 - smoothstep(44.0, 66.0, d);
    gl_FragColor = vec4(water, fade);
  }
`

export function Sea({ daylight }: { daylight: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color('#05090d') },
      uShallow: { value: new THREE.Color('#0a1c26') },
      uHatch: { value: new THREE.Color('#2f6d85') },
    }),
    [],
  )

  useEffect(() => {
    const u = material.current?.uniforms
    if (!u) return
    if (daylight) {
      u.uDeep.value.set('#b9ccd6')
      u.uShallow.value.set('#cfdde5')
      u.uHatch.value.set('#7d99a8')
    } else {
      u.uDeep.value.set('#05090d')
      u.uShallow.value.set('#0a1c26')
      u.uHatch.value.set('#2f6d85')
    }
  }, [daylight])

  useFrame((state) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[140, 140, 1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}
