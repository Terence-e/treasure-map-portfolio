import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  ISLAND_SIZE,
  groundHeight,
  islandFragmentShader,
  islandVertexShader,
} from './terrain'

const SEGMENTS = 320

export function Island({ daylight }: { daylight: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(ISLAND_SIZE, ISLAND_SIZE, SEGMENTS, SEGMENTS)
    geo.rotateX(-Math.PI / 2)

    const pos = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      pos.setY(i, groundHeight(x, z))
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [])

  const uniforms = useMemo(
    () => ({
      uLow: { value: new THREE.Color('#0c2029') },
      uHigh: { value: new THREE.Color('#2f6270') },
      uContour: { value: new THREE.Color('#7fe6ff') },
      uIndex: { value: new THREE.Color('#ffb554') },
      uCoast: { value: new THREE.Color('#7fe6ff') },
      uContourStep: { value: 0.42 },
      uInk: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  )

  /* High-ambient mode re-tones the terrain too. Leaving the chart in
     night colours under a pale canopy is what broke the light theme the
     first time: the panel went white, the scene stayed black, and every
     accent landed at about 1.6:1. */
  useEffect(() => {
    const u = material.current?.uniforms
    if (!u) return
    if (daylight) {
      u.uLow.value.set('#9fb6c2')
      u.uHigh.value.set('#dbe8ee')
      u.uContour.value.set('#123742')
      u.uIndex.value.set('#7a3f00')
      u.uCoast.value.set('#0d4a63')
      u.uInk.value = 1
    } else {
      u.uLow.value.set('#0c2029')
      u.uHigh.value.set('#2f6270')
      u.uContour.value.set('#7fe6ff')
      u.uIndex.value.set('#ffb554')
      u.uCoast.value.set('#7fe6ff')
      u.uInk.value = 0
    }
  }, [daylight])

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh geometry={geometry} receiveShadow castShadow>
      <shaderMaterial
        ref={material}
        vertexShader={islandVertexShader}
        fragmentShader={islandFragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}
