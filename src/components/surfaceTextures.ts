import * as THREE from "three";

// Original deterministic data textures; no external images or asset requests.
// One UV unit is one model unit on the extruded shell (approximately 20 mm).
export function surfaceTexture(directional: boolean) {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  let seed = 71;
  const noise = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const rows = Array.from({ length: size }, () => noise());
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const value = Math.round(128 + (directional ? (rows[y] - .5) * 70 + (noise() - .5) * 9 : (noise() - .5) * 75));
    const offset = (y * size + x) * 4;
    data[offset] = data[offset + 1] = data[offset + 2] = value;
    data[offset + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
