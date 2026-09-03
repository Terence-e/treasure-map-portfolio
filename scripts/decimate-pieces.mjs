import * as THREE from 'three'
import { OBJLoader } from 'three-stdlib'
import { SimplifyModifier, mergeVertices } from 'three-stdlib'
import fs from 'node:fs'

const dir = 'node_modules/@aestheticbookshelf/threejs3dchesspieces/lib'
const names = { Pawn:'p', Rook:'r', Knight:'n', Bishop:'b', Queen:'q', King:'k' }
const TARGET = 900            // triangles to keep per piece
const loader = new OBJLoader()
const mod = new SimplifyModifier()
const out = {}

for (const [file, key] of Object.entries(names)) {
  const text = fs.readFileSync(`${dir}/${file}.obj`, 'utf8')
  const group = loader.parse(text)
  let geo = null
  group.traverse(o => { if (o.isMesh && !geo) geo = o.geometry })
  if (!geo) { console.error('no mesh in', file); continue }
  geo.deleteAttribute('uv'); geo.deleteAttribute('normal')
  // SimplifyModifier needs welded, indexed geometry; these OBJs are
  // non-indexed triangle soup, which is why it collapsed to nothing.
  // A coarser weld tolerance is what rescues the pawn: at 1e-4 its mesh
  // stays non-manifold and SimplifyModifier throws on a missing half-edge.
  let welded = mergeVertices(geo, 1e-4)
  const before = welded.index ? welded.index.count / 3 : welded.attributes.position.count / 3
  let simp = welded
  const verts = welded.attributes.position.count
  const keep = Math.min(verts, Math.max(120, Math.round(TARGET * 0.62)))
  if (key === 'p') {
    /* The pawn is the one mesh SimplifyModifier will not touch — its
       OBJ is non-manifold and the half-edge collapse throws. It is also
       the one piece that is perfectly rotationally symmetric, so rather
       than fight the modifier we recover its profile (max radius per
       height band) and re-lathe it. Same silhouette, ~200 triangles. */
    const pos = welded.attributes.position
    welded.computeBoundingBox()
    const bbp = welded.boundingBox
    const BANDS = 40
    const prof = new Array(BANDS).fill(0)
    for (let i = 0; i < pos.count; i++) {
      const y = (pos.getY(i) - bbp.min.y) / (bbp.max.y - bbp.min.y)
      const r = Math.hypot(pos.getX(i), pos.getZ(i))
      const b = Math.min(BANDS - 1, Math.max(0, Math.round(y * (BANDS - 1))))
      if (r > prof[b]) prof[b] = r
    }
    const pts = prof.map((r, i) => new THREE.Vector2(Math.max(r, 0.001), bbp.min.y + (i / (BANDS - 1)) * (bbp.max.y - bbp.min.y)))
    pts.unshift(new THREE.Vector2(0.001, bbp.min.y))
    pts.push(new THREE.Vector2(0.001, bbp.max.y))
    simp = new THREE.LatheGeometry(pts, 18)
  } else if (verts > keep) {
    try {
      simp = mod.modify(welded, verts - keep)
    } catch (e) {
      console.error(file, 'retry with coarser weld:', e.message)
      welded = mergeVertices(geo.clone(), 2e-3)
      const v2 = welded.attributes.position.count
      try { simp = mod.modify(welded, Math.max(0, v2 - keep)) }
      catch (e2) { console.error(file, 'still failed:', e2.message); simp = welded }
    }
  }
  simp = simp.toNonIndexed()

  // normalise: centre on origin in x/z, sit base at y=0, scale height to 1
  simp.computeBoundingBox()
  const bb = simp.boundingBox
  const size = new THREE.Vector3(); bb.getSize(size)
  const centre = new THREE.Vector3(); bb.getCenter(centre)
  const s = 1 / Math.max(size.y, 1e-6)
  const pos = simp.attributes.position
  const arr = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    arr[i*3]   = (pos.getX(i) - centre.x) * s
    arr[i*3+1] = (pos.getY(i) - bb.min.y) * s
    arr[i*3+2] = (pos.getZ(i) - centre.z) * s
  }
  out[key] = arr
  console.error(file, 'tris', before, '->', arr.length/9)
}

// One binary blob of quantised Int16 positions plus a tiny manifest, so
// the pieces cost ~100 kB over the wire instead of 17 MB of raw OBJ.
const order = ['p','r','n','b','q','k']
let total = 0
const manifest = {}
for (const k of order) { manifest[k] = { off: total, len: out[k].length }; total += out[k].length }
const buf = new Int16Array(total)
for (const k of order) {
  const a = out[k], m = manifest[k]
  for (let i = 0; i < a.length; i++) buf[m.off + i] = Math.round(a[i] * 8192)
}
fs.writeFileSync('public/chess-pieces.bin', Buffer.from(buf.buffer))
fs.writeFileSync('/tmp/manifest.json', JSON.stringify(manifest))
console.error('bin bytes', fs.statSync('public/chess-pieces.bin').size)
console.error(JSON.stringify(manifest))
