/** Minimal column-major 4x4 matrix helpers (WebGL layout). */
export type Mat4 = Float32Array;

export const ident = (): Mat4 => {
  const m = new Float32Array(16);
  m[0] = m[5] = m[10] = m[15] = 1;
  return m;
};

export function mul(a: Mat4, b: Mat4): Mat4 {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
}

export function translate(x: number, y: number, z: number): Mat4 {
  const m = ident();
  m[12] = x;
  m[13] = y;
  m[14] = z;
  return m;
}

export function rotX(a: number): Mat4 {
  const m = ident(), c = Math.cos(a), s = Math.sin(a);
  m[5] = c; m[6] = s; m[9] = -s; m[10] = c;
  return m;
}

export function rotZ(a: number): Mat4 {
  const m = ident(), c = Math.cos(a), s = Math.sin(a);
  m[0] = c; m[1] = s; m[4] = -s; m[5] = c;
  return m;
}

/** Perspective with an NDC lens shift (sx, sy), so the subject can sit off-centre without rotating the camera. */
export function perspective(fovY: number, aspect: number, near: number, far: number, sx = 0, sy = 0): Mat4 {
  const f = 1 / Math.tan(fovY / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[8] = -sx;
  m[9] = -sy;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = (2 * far * near) / (near - far);
  return m;
}

/** Project a world point; returns NDC x, y and clip w. */
export function project(m: Mat4, x: number, y: number, z: number): [number, number, number] {
  const cx = m[0] * x + m[4] * y + m[8] * z + m[12];
  const cy = m[1] * x + m[5] * y + m[9] * z + m[13];
  const cw = m[3] * x + m[7] * y + m[11] * z + m[15];
  return [cx / cw, cy / cw, cw];
}
