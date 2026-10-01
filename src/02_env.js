// ---------- Gökyüzü, ışık, hava durumu ----------
const TOD = {
  morning: { top: '#6f9fd8', hor: '#f2d3ac', bot: '#c9b48e', sunDir: [0.55, 0.32, 0.4], sunCol: '#ffe0b0', sun: 2.4, hemiSky: '#cfe0ff', hemiGround: '#7a6a48', hemi: 1.15, fogNear: 45, fogFar: 230, stars: 0, glow: 0.6 },
  day: { top: '#4d86d1', hor: '#cfe2ee', bot: '#b9c5a8', sunDir: [0.4, 0.75, 0.35], sunCol: '#fff3dc', sun: 2.8, hemiSky: '#d8e8ff', hemiGround: '#6f6a4a', hemi: 1.2, fogNear: 60, fogFar: 260, stars: 0, glow: 0.3 },
  dusk: { top: '#2e3f75', hor: '#f08a4f', bot: '#5d4a4a', sunDir: [-0.7, 0.12, 0.3], sunCol: '#ff9a55', sun: 2.2, hemiSky: '#8f88c9', hemiGround: '#5a4030', hemi: 0.95, fogNear: 40, fogFar: 210, stars: 0.25, glow: 1 },
  night: { top: '#070b1c', hor: '#1d2a4a', bot: '#0b0f1a', sunDir: [0.35, 0.55, -0.6], sunCol: '#9fb6ff', sun: 0.55, hemiSky: '#4a5f9a', hemiGround: '#1a1a22', hemi: 0.55, fogNear: 25, fogFar: 150, stars: 1, glow: 0.4, moon: true },
  storm: { top: '#05070d', hor: '#151b26', bot: '#05070b', sunDir: [0.3, 0.6, -0.5], sunCol: '#8090b0', sun: 0.35, hemiSky: '#3a4458', hemiGround: '#111214', hemi: 0.5, fogNear: 12, fogFar: 110, stars: 0, glow: 0 },
  winter: { top: '#8aa6c6', hor: '#e3e8ee', bot: '#d9dde3', sunDir: [0.5, 0.4, 0.45], sunCol: '#fff2e2', sun: 2.0, hemiSky: '#e6eeff', hemiGround: '#9aa0aa', hemi: 1.35, fogNear: 30, fogFar: 170, stars: 0, glow: 0.3 },
  winterdusk: { top: '#26304f', hor: '#c98d77', bot: '#8a8a99', sunDir: [-0.6, 0.1, 0.35], sunCol: '#ffb08a', sun: 1.5, hemiSky: '#9aa3d0', hemiGround: '#6a6670', hemi: 1.0, fogNear: 25, fogFar: 150, stars: 0.3, glow: 0.8 },
  interior: { top: '#1a1410', hor: '#2a2018', bot: '#120e0a', sunDir: [0.4, 0.7, 0.5], sunCol: '#ffe6c0', sun: 2.2, hemiSky: '#ffe6cc', hemiGround: '#6a5038', hemi: 1.35, fogNear: 30, fogFar: 90, stars: 0, glow: 0 },
  interiorNight: { top: '#05060a', hor: '#0a0c12', bot: '#050505', sunDir: [0.3, 0.6, 0.6], sunCol: '#7d93d8', sun: 0.5, hemiSky: '#4b5a88', hemiGround: '#1a140f', hemi: 0.45, fogNear: 20, fogFar: 70, stars: 0, glow: 0 },
  hall: { top: '#1a1712', hor: '#3a3226', bot: '#15120e', sunDir: [0.3, 0.8, 0.35], sunCol: '#fff0d0', sun: 1.8, hemiSky: '#e8dcc8', hemiGround: '#4a3e30', hemi: 1.0, fogNear: 40, fogFar: 120, stars: 0, glow: 0 },
};

const SKY_VS = `varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = normalize(w.xyz - cameraPosition); gl_Position = projectionMatrix*viewMatrix*w; gl_Position.z = gl_Position.w; }`;
const SKY_FS = `uniform vec3 top; uniform vec3 hor; uniform vec3 bot; uniform vec3 sunDir; uniform vec3 sunCol; uniform float glow; uniform float flash; varying vec3 vW;
void main(){ float h = vW.y; vec3 c = h > 0.0 ? mix(hor, top, pow(clamp(h,0.0,1.0), 0.55)) : mix(hor, bot, pow(clamp(-h,0.0,1.0), 0.35));
 float s = max(dot(vW, normalize(sunDir)), 0.0); c += sunCol * (pow(s, 900.0) * 1.6 + pow(s, 10.0) * 0.28 * glow);
 c += vec3(flash); gl_FragColor = vec4(c, 1.0); }`;

class Env {
  constructor(scene) {
    this.scene = scene;
    const u = { top: { value: new T.Vector3() }, hor: { value: new T.Vector3() }, bot: { value: new T.Vector3() }, sunDir: { value: new T.Vector3(0, 1, 0) }, sunCol: { value: new T.Vector3(1, 1, 1) }, glow: { value: 0.5 }, flash: { value: 0 } };
    this.skyU = u;
    this.sky = new T.Mesh(new T.SphereGeometry(500, 24, 12), new T.ShaderMaterial({ uniforms: u, vertexShader: SKY_VS, fragmentShader: SKY_FS, side: T.BackSide, depthWrite: false, fog: false }));
    this.sky.renderOrder = -10; this.sky.frustumCulled = false;
    scene.add(this.sky);
    this.hemi = new T.HemisphereLight('#ffffff', '#444444', 1); scene.add(this.hemi);
    this.sun = new T.DirectionalLight('#ffffff', 2);
    this.sun.castShadow = true;
    const sc = this.sun.shadow.camera; sc.left = -32; sc.right = 32; sc.top = 32; sc.bottom = -32; sc.near = 1; sc.far = 160;
    this.sun.shadow.mapSize.set(2048, 2048); this.sun.shadow.bias = -0.0006; this.sun.shadow.normalBias = 0.03;
    scene.add(this.sun); scene.add(this.sun.target);
    scene.fog = new T.Fog('#ffffff', 50, 200);
    // yıldızlar
    const sp = []; for (let i = 0; i < 900; i++) { const th = Math.random() * TAU, ph = Math.acos(Math.random() * 0.95); sp.push(Math.sin(ph) * Math.cos(th) * 420, Math.cos(ph) * 420, Math.sin(ph) * Math.sin(th) * 420); }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3));
    this.stars = new T.Points(sg, new T.PointsMaterial({ color: '#dfe8ff', size: 1.6, sizeAttenuation: false, transparent: true, fog: false, depthWrite: false }));
    this.stars.renderOrder = -9; this.stars.frustumCulled = false; scene.add(this.stars);
    this.moon = new T.Mesh(new T.SphereGeometry(9, 16, 12), new T.MeshBasicMaterial({ color: '#f1efe2', fog: false }));
    this.moon.renderOrder = -8; scene.add(this.moon);
    this.focus = new T.Vector3();
    this.rain = null; this.snow = null; this.weather = 'none'; this.lightning = 0; this.lightTimer = 6; this.flashFn = null;
    this.preset = null;
  }
  set(name, opts = {}) {
    const p = Object.assign({}, TOD[name] || TOD.day, opts);
    this.preset = p;
    const s = c => { const o = hexRGB(c); return new T.Vector3(o.r, o.g, o.b); };
    this.skyU.top.value.copy(s(p.top)); this.skyU.hor.value.copy(s(p.hor)); this.skyU.bot.value.copy(s(p.bot));
    this.skyU.sunCol.value.copy(s(p.sunCol)); this.skyU.glow.value = p.glow;
    this.sunDir = new T.Vector3(...p.sunDir).normalize();
    this.skyU.sunDir.value.copy(this.sunDir);
    this.sun.color.set(p.sunCol); this.sun.intensity = p.sun; this.baseSun = p.sun;
    this.hemi.color.set(p.hemiSky); this.hemi.groundColor.set(p.hemiGround); this.hemi.intensity = p.hemi; this.baseHemi = p.hemi;
    this.scene.fog.color.set(p.hor); this.scene.fog.near = p.fogNear; this.scene.fog.far = p.fogFar;
    this.stars.material.opacity = p.stars; this.stars.visible = p.stars > 0;
    this.moon.visible = !!p.moon;
    this.sky.visible = !opts.noSky;
    this.setWeather(opts.weather || 'none');
  }
  setWeather(w) {
    this.weather = w;
    if (this.rain) { this.scene.remove(this.rain); this.rain.geometry.dispose(); this.rain = null; }
    if (this.snow) { this.scene.remove(this.snow); this.snow.geometry.dispose(); this.snow = null; }
    if (w === 'rain' || w === 'storm') {
      const N = 1400, a = new Float32Array(N * 6); this.rainV = new Float32Array(N);
      for (let i = 0; i < N; i++) { const x = frand(-25, 25), y = frand(0, 22), z = frand(-25, 25); a.set([x, y, z, x + 0.05, y + 0.55, z], i * 6); this.rainV[i] = frand(18, 26); }
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(a, 3));
      this.rain = new T.LineSegments(g, new T.LineBasicMaterial({ color: '#9fb0c8', transparent: true, opacity: 0.45, fog: false }));
      this.rain.frustumCulled = false; this.scene.add(this.rain);
    }
    if (w === 'snow') {
      const N = 1300, a = new Float32Array(N * 3); this.snowP = new Float32Array(N);
      for (let i = 0; i < N; i++) { a.set([frand(-22, 22), frand(0, 18), frand(-22, 22)], i * 3); this.snowP[i] = Math.random() * TAU; }
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(a, 3));
      this.snow = new T.Points(g, new T.PointsMaterial({ color: '#ffffff', size: 0.09, transparent: true, opacity: 0.9, depthWrite: false }));
      this.snow.frustumCulled = false; this.scene.add(this.snow);
    }
  }
  flash(v = 1) { this.lightning = Math.max(this.lightning, v); }
  update(dt, cam) {
    this.sky.position.copy(cam.position); this.stars.position.copy(cam.position);
    if (this.moon.visible) this.moon.position.copy(cam.position).addScaledVector(this.sunDir, 380);
    const f = this.focus;
    this.sun.position.copy(f).addScaledVector(this.sunDir, 70);
    this.sun.target.position.copy(f);
    if (this.rain) {
      const a = this.rain.geometry.attributes.position.array, N = this.rainV.length;
      const cx = cam.position.x, cy = cam.position.y, cz = cam.position.z;
      for (let i = 0; i < N; i++) {
        const o = i * 6; let y = a[o + 1] - this.rainV[i] * dt;
        let x = a[o], z = a[o + 2];
        if (y < cy - 8 || Math.abs(x - cx) > 25 || Math.abs(z - cz) > 25) { y = cy + frand(4, 16); x = cx + frand(-25, 25); z = cz + frand(-25, 25); }
        a[o] = x; a[o + 1] = y; a[o + 2] = z; a[o + 3] = x + 0.04; a[o + 4] = y + 0.6; a[o + 5] = z;
      }
      this.rain.geometry.attributes.position.needsUpdate = true;
      if (this.weather === 'storm') {
        this.lightTimer -= dt;
        if (this.lightTimer < 0) { this.lightTimer = frand(5, 11); this.flash(1); if (this.flashFn) this.flashFn(); }
      }
    }
    if (this.snow) {
      const a = this.snow.geometry.attributes.position.array, N = this.snowP.length;
      const cx = cam.position.x, cy = cam.position.y, cz = cam.position.z, t = G.t;
      for (let i = 0; i < N; i++) {
        const o = i * 3; let y = a[o + 1] - 0.9 * dt; let x = a[o] + Math.sin(t * 0.8 + this.snowP[i]) * 0.4 * dt, z = a[o + 2] + 0.25 * dt;
        if (y < cy - 6 || Math.abs(x - cx) > 22 || Math.abs(z - cz) > 22) { y = cy + frand(2, 14); x = cx + frand(-22, 22); z = cz + frand(-22, 22); }
        a[o] = x; a[o + 1] = y; a[o + 2] = z;
      }
      this.snow.geometry.attributes.position.needsUpdate = true;
    }
    if (this.lightning > 0) {
      this.lightning = Math.max(0, this.lightning - dt * 3.5);
      const fl = this.lightning * (0.6 + 0.4 * Math.sin(G.t * 60));
      this.skyU.flash.value = fl * 0.5; this.hemi.intensity = this.baseHemi + fl * 2.5; this.sun.intensity = this.baseSun + fl * 2;
    } else { this.skyU.flash.value = 0; this.hemi.intensity = this.baseHemi; this.sun.intensity = this.baseSun; }
  }
}
