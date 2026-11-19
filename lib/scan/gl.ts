import type { Cloud } from "./house";

const VS = `
attribute vec3 aPos;
attribute vec3 aCol;
attribute float aKind;
uniform mat4 uMVP;
uniform float uCut;
uniform float uSize;
uniform float uWRef;
uniform float uInk;      // 0 = valós szín, 1 = tinta
uniform float uAlpha;    // összes pont átlátszósága
uniform vec4 uFade;      // floor, furn, ground, path láthatóság
varying vec4 vCol;
void main() {
  float k = aKind;
  float vis = 1.0;
  if (k < 0.5) vis = uFade.x;
  else if (k < 1.5) vis = 1.0;
  else if (k < 2.5) vis = uFade.y;
  else if (k < 3.5) vis = uFade.z;
  else vis = uFade.w;
  // a metszősík fölötti pontok eltűnnek (az útvonal kivétel, az mindig 1,1 m-en fut)
  if ((aPos.z > uCut && k < 3.5) || vis < 0.01) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    vCol = vec4(0.0);
    return;
  }
  gl_Position = uMVP * vec4(aPos, 1.0);
  float att = clamp(uWRef / gl_Position.w, 0.55, 1.8);
  gl_PointSize = uSize * att * (k > 3.5 ? 1.35 : 1.0);
  // magasság-skála (mint a szkennerszoftverben): indigó a padlón, égkék, türkiz, borostyán a metszősík fölött
  float t = clamp(aPos.z / 1.3, 0.0, 1.0);
  vec3 c0 = vec3(0.294, 0.231, 1.0);
  vec3 c1 = vec3(0.122, 0.608, 1.0);
  vec3 c2 = vec3(0.07, 0.75, 0.64);
  vec3 c3 = vec3(1.0, 0.62, 0.1);
  vec3 ink = t < 0.34 ? mix(c0, c1, t / 0.34) : (t < 0.68 ? mix(c1, c2, (t - 0.34) / 0.34) : mix(c2, c3, (t - 0.68) / 0.32));
  vec3 c = mix(aCol, ink, uInk * (k > 3.5 ? 0.0 : 1.0));
  vCol = vec4(c, vis * uAlpha);
}`;

const FS = `
precision mediump float;
varying vec4 vCol;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  if (dot(d, d) > 0.25) discard;
  gl_FragColor = vec4(vCol.rgb * vCol.a, vCol.a);
}`;

export type Renderer = {
  draw: (u: { mvp: Float32Array; cut: number; size: number; wref: number; ink: number; alpha: number; fade: [number, number, number, number] }) => void;
  resize: (w: number, h: number) => void;
  dispose: () => void;
};

function shader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

export function createRenderer(canvas: HTMLCanvasElement, cloud: Cloud): Renderer | null {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
  if (!gl) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl, gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, shader(gl, gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = (data: Float32Array, name: string, size: number) => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    return b;
  };
  const buffers = [buf(cloud.pos, "aPos", 3), buf(cloud.col, "aCol", 3), buf(cloud.kind, "aKind", 1)];

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uMVP = U("uMVP"), uCut = U("uCut"), uSize = U("uSize"), uWRef = U("uWRef"), uInk = U("uInk"), uAlpha = U("uAlpha"), uFade = U("uFade");

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  return {
    resize(w, h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    },
    draw(u) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // áttetsző tintafázisban a mélységírás kikapcsol, különben a pontok egymást "lyukasztják"
      gl.depthMask(u.alpha > 0.95);
      gl.uniformMatrix4fv(uMVP, false, u.mvp);
      gl.uniform1f(uCut, u.cut);
      gl.uniform1f(uSize, u.size);
      gl.uniform1f(uWRef, u.wref);
      gl.uniform1f(uInk, u.ink);
      gl.uniform1f(uAlpha, u.alpha);
      gl.uniform4f(uFade, u.fade[0], u.fade[1], u.fade[2], u.fade[3]);
      gl.drawArrays(gl.POINTS, 0, cloud.count);
    },
    dispose() {
      buffers.forEach((b) => gl.deleteBuffer(b));
      gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
