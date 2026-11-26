import * as THREE from "three";
export function outline(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}
export function plate(
  w: number,
  h: number,
  d: number,
  r: number,
  holes: { x: number; z: number; w: number; h: number; r: number }[] = [],
) {
  const s = outline(w, h, r);
  for (const h of holes) {
    const p = new THREE.Path(
      outline(h.w, h.h, h.r)
        .getPoints(12)
        .map((v) => new THREE.Vector2(v.x + h.x, v.y - h.z)),
    );
    s.holes.push(p);
  }
  const g = new THREE.ExtrudeGeometry(s, {
    depth: d,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.025,
    curveSegments: 24,
  });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -d / 2, 0);
  return g;
}
export function capGeometry() {
  const positions: number[] = [];
  const indices: number[] = [];
  const rings = 12,
    N = 48;
  for (let j = 0; j <= rings; j++) {
    const t = j / rings;
    const half = 0.48 - 0.07 * t - 0.025 * Math.pow(t, 8) - 0.018 * Math.pow(1-t, 8);
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const x =
        Math.sign(Math.cos(a)) * Math.pow(Math.abs(Math.cos(a)), 0.25) * half;
      const z =
        Math.sign(Math.sin(a)) * Math.pow(Math.abs(Math.sin(a)), 0.25) * half;
      positions.push(x, t * 0.36, z);
    }
  }
  for (let j = 0; j < rings; j++)
    for (let i = 0; i < N; i++) {
      const a = j * N + i,
        b = j * N + ((i + 1) % N);
      indices.push(a, b, a + N, b, b + N, a + N);
    }
  // Concentric surface rings form a shallow concave key top.
  for(let j=1;j<=8;j++){
    const r=1-j/9;
    for(let i=0;i<N;i++){
      const k=(rings*N+i)*3;
      positions.push(positions[k]*r,.36-.05*(1-r*r),positions[k+2]*r);
      const a=(rings+j-1)*N+i,b=(rings+j-1)*N+(i+1)%N;
      indices.push(a,b,a+N,b,b+N,a+N);
    }
  }
  const center=positions.length/3;
  positions.push(0,.31,0);
  for(let i=0;i<N;i++) indices.push((rings+8)*N+i,(rings+8)*N+(i+1)%N,center);
  const bottom=positions.length/3;
  positions.push(0,0,0);
  for(let i=0;i<N;i++) indices.push((i+1)%N,i,bottom);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  for (let i = 0; i < indices.length; i += 3) {
    const b = indices[i + 1];
    indices[i + 1] = indices[i + 2];
    indices[i + 2] = b;
  }
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}
