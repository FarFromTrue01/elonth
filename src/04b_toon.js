// ---------- Anime görünüm: toon malzeme, kontur, yüz dokusu, yuvarlak geometri ----------
const TOON = {
  grad: null, outline: null,
  init() {
    const d = new Uint8Array([105, 105, 105, 255, 178, 178, 178, 255, 236, 236, 236, 255, 255, 255, 255, 255]);
    const t = new T.DataTexture(d, 4, 1, T.RGBAFormat); t.minFilter = T.NearestFilter; t.magFilter = T.NearestFilter; t.generateMipmaps = false; t.needsUpdate = true;
    this.grad = t;
    const d2 = new Uint8Array([150, 150, 150, 255, 205, 205, 205, 255, 245, 245, 245, 255, 255, 255, 255, 255]);
    const t2 = new T.DataTexture(d2, 4, 1, T.RGBAFormat); t2.minFilter = T.NearestFilter; t2.magFilter = T.NearestFilter; t2.generateMipmaps = false; t2.needsUpdate = true;
    this.gradSoft = t2;
    const d3 = new Uint8Array([178, 178, 178, 255, 222, 222, 222, 255, 246, 246, 246, 255, 255, 255, 255, 255]);
    const t3 = new T.DataTexture(d3, 4, 1, T.RGBAFormat); t3.minFilter = T.NearestFilter; t3.magFilter = T.NearestFilter; t3.generateMipmaps = false; t3.needsUpdate = true;
    this.gradFace = t3;
    this.outline = new T.ShaderMaterial({
      uniforms: { thick: { value: 0.0105 }, color: { value: new T.Color('#1d1512') }, fogC: { value: new T.Color('#888') }, fogN: { value: 30 }, fogF: { value: 200 } },
      vertexShader: `uniform float thick; varying float vD;
        void main(){ vec4 wp = modelMatrix * vec4(position,1.0); vec3 n = normalize(mat3(modelMatrix) * normal);
          float d = distance(wp.xyz, cameraPosition); wp.xyz += n * thick * clamp(d * 0.16, 0.55, 3.5);
          vec4 mv = viewMatrix * wp; vD = -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform vec3 color; uniform vec3 fogC; uniform float fogN; uniform float fogF; varying float vD;
        void main(){ float f = smoothstep(fogN, fogF, vD); gl_FragColor = vec4(mix(color, fogC, f), 1.0); }`,
      side: T.BackSide,
    });
  },
  syncFog(fog) { const u = this.outline.uniforms; u.fogC.value.copy(fog.color); u.fogN.value = fog.near; u.fogF.value = fog.far; },
  mat(hex, o = {}) { return new T.MeshToonMaterial(Object.assign({ color: hex, gradientMap: this.grad }, o)); },
};

// Döndürülmüş profil (lathe): [[yarıçap, y], ...] aşağıdan yukarıya
function latheGeo(pts, segs = 14, phiStart = 0, phiLen = TAU) {
  const g = new T.LatheGeometry(pts.map(p => new T.Vector2(Math.max(0.0005, p[0]), p[1])), segs, phiStart, phiLen);
  g.computeVertexNormals(); return g;
}
// Konik kapsül: üst yarıçap r1 (y=0), alt yarıçap r2 (y=-len)
function capsGeo(r1, r2, len, segs = 10) {
  const pts = [];
  for (let i = 0; i <= 4; i++) { const a = -Math.PI / 2 + i / 4 * Math.PI / 2; pts.push([r2 * Math.cos(a), -len + r2 * Math.sin(a) * 0.9]); }
  for (let i = 0; i <= 4; i++) { const a = i / 4 * Math.PI / 2; pts.push([r1 * Math.cos(a), r1 * Math.sin(a) * 0.9]); }
  return latheGeo(pts, segs);
}
function sphGeo(ws = 12, hs = 9) { return new T.SphereGeometry(0.5, ws, hs); }
// Anime kafa: alt yarı çeneye doğru daralır
function deformHead(g, chin = 0.36) {
  const p = g.attributes.position, v = new T.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    if (v.y < 0) { const t = -v.y / 0.5; v.x *= 1 - chin * Math.pow(t, 1.4); v.z *= 1 - 0.12 * t; v.z += 0.05 * t * Math.max(0, v.z / 0.5 + 0.2); v.y *= 1 + 0.1 * t; }
    else { const t = v.y / 0.5; v.z *= 1 + 0.04 * t; }
    if (v.z < 0) v.z *= 1.04;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals(); return g;
}
// Birden çok geometriyi (dönüşümleriyle) tek geometride birleştir
function mergeParts(list) {
  let n = 0; const prep = [];
  for (const { geo, m } of list) { const g = geo.index ? geo.toNonIndexed() : geo; prep.push([g, m]); n += g.attributes.position.count; }
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3); let o = 0; const v = new T.Vector3(), nm = new T.Matrix3();
  for (const [g, m] of prep) {
    nm.getNormalMatrix(m); const P = g.attributes.position, N = g.attributes.normal;
    for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i).applyMatrix4(m); pos.set([v.x, v.y, v.z], o * 3); v.fromBufferAttribute(N, i).applyMatrix3(nm).normalize(); nor.set([v.x, v.y, v.z], o * 3); o++; }
  }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('normal', new T.BufferAttribute(nor, 3)); g.computeBoundingSphere(); return g;
}
const _mq = new T.Quaternion(), _up = new T.Vector3(0, 1, 0);
function mtx(px, py, pz, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) { return mkMatrix(px, py, pz, rx, ry, rz, sx, sy, sz); }
// +y ekseni dir'e bakacak şekilde, from noktasından başlayan parça matrisi
function alongMatrix(from, dir, len, sx, sz, twist = 0) {
  const d = dir.clone().normalize(); _mq.setFromUnitVectors(_up, d);
  if (twist) _mq.multiply(new T.Quaternion().setFromAxisAngle(_up, twist));
  return new T.Matrix4().compose(from.clone().addScaledVector(d, len / 2), _mq, new T.Vector3(sx, len, sz));
}

// ---- Yüz dokusu ----
const FACE_W = 256, FACE_H = 256;
function drawFace(g, f, expr = 'neutral', eyes = 'open', mouth = 'closed') {
  const W = FACE_W, H = FACE_H;
  g.fillStyle = f.skin; g.fillRect(0, 0, W, H);
  const fem = f.female, ch = f.child || 0;
  const ink = f.ink || '#20140f';
  // yanak allığı
  if (fem || ch > 0.5 || f.blush) { for (const s of [-1, 1]) { const gr = g.createRadialGradient(128 + s * 66, 178, 2, 128 + s * 66, 178, 24); gr.addColorStop(0, 'rgba(240,120,120,0.30)'); gr.addColorStop(1, 'rgba(240,120,120,0)'); g.fillStyle = gr; g.fillRect(128 + s * 66 - 26, 152, 52, 52); } }
  const ew = (fem ? 74 : 64) * (1 + ch * 0.06), eh = (fem ? 76 : 54) * (1 + ch * 0.18), ey = 138, ex = 64;
  const iris = new T.Color(f.eyes || '#3a2a20');
  const col = (c, k) => { const t = c.clone().multiplyScalar(k); return '#' + t.getHexString(); };
  for (const s of [-1, 1]) {
    const cx = 128 + s * ex;
    // kaş
    let bIn = 0, bOut = 0;
    if (expr === 'angry') { bIn = 9; bOut = -5; } else if (expr === 'sad' || expr === 'pain') { bIn = -9; bOut = 4; } else if (expr === 'surprised') { bIn = -8; bOut = -8; } else if (expr === 'smile') { bIn = -2; bOut = -2; }
    if (f.stern) { bIn += 4; bOut -= 2; }
    const by = ey - eh * 0.6 - 8;
    g.strokeStyle = f.brow || ink; g.lineCap = 'round'; g.lineWidth = fem ? 3.5 : 6;
    g.beginPath(); g.moveTo(cx - s * ew * 0.42, by + bIn); g.quadraticCurveTo(cx, by - 5 + (bIn + bOut) / 2, cx + s * ew * 0.55, by + 3 + bOut); g.stroke();
    if (eyes === 'closed' || expr === 'pain' || (expr === 'smile' && eyes === 'happy')) {
      g.strokeStyle = ink; g.lineWidth = fem ? 4 : 4.5;
      g.beginPath();
      if (expr === 'smile' || eyes === 'happy') { g.moveTo(cx - ew * 0.45, ey + 4); g.quadraticCurveTo(cx, ey - 12, cx + ew * 0.45, ey + 4); }
      else if (expr === 'pain') { g.moveTo(cx - s * ew * 0.45, ey - 6); g.lineTo(cx + s * ew * 0.1, ey + 2); g.lineTo(cx + s * ew * 0.45, ey - 2); }
      else { g.moveTo(cx - ew * 0.48, ey + 2); g.quadraticCurveTo(cx, ey + 10, cx + ew * 0.48, ey + 2); }
      g.stroke();
      if (fem) { g.lineWidth = 2.5; g.beginPath(); g.moveTo(cx + s * ew * 0.46, ey + 2); g.lineTo(cx + s * ew * 0.62, ey - 4); g.stroke(); }
      continue;
    }
    const open = expr === 'surprised' ? 1.12 : expr === 'angry' ? 0.82 : 1;
    const top = ey - eh * 0.5 * open, bot = ey + eh * 0.5 * open;
    // göz akı
    g.fillStyle = '#fbf8f2';
    g.beginPath(); g.moveTo(cx - ew * 0.5, ey + 2);
    g.bezierCurveTo(cx - ew * 0.45, top + (expr === 'angry' ? (s > 0 ? 8 : 2) : 0), cx + ew * 0.35, top - 2, cx + ew * 0.5, ey - 2);
    g.bezierCurveTo(cx + ew * 0.45, bot, cx - ew * 0.35, bot + 2, cx - ew * 0.5, ey + 2); g.fill();
    // iris
    const ir = ew * (fem ? 0.32 : 0.29), irh = eh * 0.44 * open;
    const icx = cx + s * 1.5, icy = ey + 1;
    const ig = g.createLinearGradient(0, icy - irh, 0, icy + irh); ig.addColorStop(0, col(iris, 0.35)); ig.addColorStop(0.55, col(iris, 0.95)); ig.addColorStop(1, col(iris, 1.45));
    g.fillStyle = ig; g.beginPath(); g.ellipse(icx, icy, ir, irh, 0, 0, TAU); g.fill();
    g.strokeStyle = col(iris, 0.3); g.lineWidth = 1.5; g.stroke();
    g.fillStyle = '#120c0a'; g.beginPath(); g.ellipse(icx, icy + 1, ir * 0.45, irh * 0.5, 0, 0, TAU); g.fill();
    // parıltılar
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(icx - ir * 0.38, icy - irh * 0.42, ir * 0.3, irh * 0.24, -0.4, 0, TAU); g.fill();
    g.beginPath(); g.arc(icx + ir * 0.4, icy + irh * 0.45, ir * 0.14, 0, TAU); g.fill();
    // üst kirpik çizgisi
    g.strokeStyle = ink; g.lineWidth = fem ? 6 : 5; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - ew * 0.52, ey + 3); g.bezierCurveTo(cx - ew * 0.45, top - 1, cx + ew * 0.35, top - 4, cx + ew * 0.55, ey - 1); g.stroke();
    if (fem) { g.lineWidth = 3; for (let k = 0; k < 3; k++) { const ox = cx + s * ew * (0.42 + k * 0.05), oy = top + 4 + k * 5; g.beginPath(); g.moveTo(ox, oy); g.lineTo(ox + s * 9, oy - 7 + k * 2); g.stroke(); } }
    else { g.lineWidth = 3; g.beginPath(); g.moveTo(cx + s * ew * 0.48, ey); g.lineTo(cx + s * ew * 0.6, ey - 4); g.stroke(); }
    // alt göz kapağı
    g.strokeStyle = 'rgba(40,20,15,0.55)'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(cx + s * ew * 0.05, bot + 1); g.quadraticCurveTo(cx + s * ew * 0.35, bot, cx + s * ew * 0.48, ey + 5); g.stroke();
  }
  // burun
  g.strokeStyle = col(new T.Color(f.skin), 0.68); g.lineWidth = 2.2; g.beginPath(); g.moveTo(130, 166); g.lineTo(126, 175); g.stroke();
  // sakal gölgesi
  if (f.beard) { g.fillStyle = f.beard; g.globalAlpha = 0.85; g.beginPath(); g.ellipse(128, 236, 74, 40, 0, Math.PI, TAU); g.rect(54, 236, 148, 30); g.fill(); g.globalAlpha = 1; }
  if (f.mustache) { g.fillStyle = f.mustache; g.beginPath(); g.ellipse(118, 193, 14, 5, 0.2, 0, TAU); g.ellipse(138, 193, 14, 5, -0.2, 0, TAU); g.fill(); }
  // ağız
  const my = 203, lip = fem ? '#b0484a' : col(new T.Color(f.skin), 0.45);
  g.strokeStyle = fem ? '#8a3036' : '#5a2a22'; g.lineWidth = 2.6; g.lineCap = 'round';
  if (mouth === 'open' || expr === 'surprised') {
    const mw = expr === 'surprised' ? 9 : 11, mh = expr === 'surprised' ? 11 : 7;
    g.fillStyle = '#5a1a1e'; g.beginPath(); g.ellipse(128, my + 2, mw, mh, 0, 0, TAU); g.fill();
    g.fillStyle = '#d0606a'; g.beginPath(); g.ellipse(128, my + 2 + mh * 0.45, mw * 0.6, mh * 0.4, 0, 0, TAU); g.fill();
  } else if (expr === 'smile') { g.beginPath(); g.moveTo(116, my - 2); g.quadraticCurveTo(128, my + 8, 140, my - 2); g.stroke(); }
  else if (expr === 'sad' || expr === 'pain') { g.beginPath(); g.moveTo(118, my + 4); g.quadraticCurveTo(128, my - 3, 138, my + 4); g.stroke(); }
  else if (expr === 'angry') { g.beginPath(); g.moveTo(117, my + 3); g.lineTo(128, my); g.lineTo(139, my + 3); g.stroke(); }
  else { g.beginPath(); g.moveTo(120, my); g.quadraticCurveTo(128, my + 2, 136, my); g.stroke(); }
  if (fem && mouth !== 'open' && expr !== 'surprised') { g.fillStyle = 'rgba(190,80,90,0.35)'; g.beginPath(); g.ellipse(128, my + 4, 6, 2.5, 0, 0, TAU); g.fill(); }
  // gözyaşı
  if (f.tears) { g.fillStyle = 'rgba(160,210,255,0.85)'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(128 + s * 50, 168, 3, 9, 0, 0, TAU); g.fill(); } }
}
function faceTexture(f, expr, eyes, mouth) {
  const c = document.createElement('canvas'); c.width = FACE_W; c.height = FACE_H;
  drawFace(c.getContext('2d'), f, expr, eyes, mouth);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;
}
