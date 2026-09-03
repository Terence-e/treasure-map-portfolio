/**
 * Staunton chess pieces.
 *
 * Source: @aestheticbookshelf/threejs3dchesspieces (MIT) — 17.3 MB of raw
 * OBJ, which is far too much to ship for a panel on a portfolio. The
 * meshes were welded, decimated to ~1,100 triangles each with
 * SimplifyModifier, normalised (centred, base at y=0, height 1) and
 * quantised to Int16 in public/chess-pieces.bin — 126 kB for all six.
 *
 * The pawn is the exception: its OBJ is non-manifold and the modifier
 * throws on it, so its profile was sampled by height band and re-lathed.
 * Same silhouette, fewer triangles, no crash.
 *
 * Regenerate with scripts/decimate-pieces.mjs.
 */
export const PIECE_SCALE = 8192

export type PieceSlice = { off: number; len: number }

export const pieceManifest: Record<string, PieceSlice> = {
  p: { off: 0, len: 13284 },
  r: { off: 13284, len: 10008 },
  n: { off: 23292, len: 10008 },
  b: { off: 33300, len: 10008 },
  q: { off: 43308, len: 9882 },
  k: { off: 53190, len: 10008 },
}
