// ---------- VRM anime karakterleri: yükleme, renklendirme, ortaçağ kıyafetleri, poz sürücüsü ----------
// Temel modeller: VRoid Project örnek avatarları (pixiv), lisans: ticari kullanım, değiştirme ve dağıtım serbest.
const VRMKit = {
  ready: false, failed: false, bases: {},
  // m: erkek (AvatarSample_C), fa: kısa saçlı kız (AvatarSample_A), fb: ikiz örgü saç donörü (AvatarSample_B), fg: uzun saçlı kız (three-vrm-girl)
  FILES: { m: 'assets/vrm/m.vrm', fa: 'assets/vrm/fa.vrm', fb: 'assets/vrm/fb.vrm', fg: 'assets/vrm/fg.vrm' },
  async load(onProgress) {
    if (!window.VRMLib || location.hash.includes('novrm')) { this.failed = true; return false; }
    const L = new VRMLib.GLTFLoader(); L.register(p => new VRMLib.VRMLoaderPlugin(p));
    const keys = Object.keys(this.FILES); let done = 0;
    try {
      await Promise.all(keys.map(async k => {
        const g = await L.loadAsync(this.FILES[k]);
        this.bases[k] = this.prep(k, g); done++; if (onProgress) onProgress(done / keys.length);
      }));
      this.ready = true;
    } catch (e) { console.error('VRM yüklenemedi', e); this.failed = true; }
    return this.ready;
  },
  // Şablonu çözümle: kemik adları, ifadeler, yay kemikleri, ölçüler, vücut verisi
  prep(key, gltf) {
    const vrm = gltf.userData.vrm, sc = vrm.scene;
    const vrm0 = !!(vrm.meta && vrm.meta.metaVersion === '0');
    const B = { key, vrm0, scene: sc, F: vrm0 ? -1 : 1 };
    // three-vrm'in eklediği yardımcı nesneleri ayır, klonlanmasınlar
    vrm.humanoid.normalizedHumanBonesRoot.removeFromParent();
    const extras = []; sc.traverse(o => { if (o.type === 'VRMExpression' || o instanceof VRMLib.VRMSpringBoneCollider || /VRMLookAt/.test(o.type || '')) extras.push(o); });
    // aynı adlı mesh'leri tekilleştir
    const names = new Set();
    sc.traverse(o => { if (o.isMesh || o.isBone) { let n = o.name || 'n', i = 0; while (names.has(n)) n = o.name + '#' + (++i); o.name = n; names.add(n); } });
    // insan kemikleri
    B.human = {}; for (const [hn, b] of Object.entries(vrm.humanoid.humanBones)) if (b && b.node) B.human[hn] = b.node.name;
    B.humanOf = {}; for (const hn in B.human) B.humanOf[B.human[hn]] = hn;
    // ifadeler
    B.expr = {};
    for (const e of vrm.expressionManager.expressions) {
      const list = [];
      for (const b of e.binds) if (b.primitives) for (const m of b.primitives) list.push({ mesh: m.name, index: b.index, weight: b.weight });
      if (list.length) B.expr[e.expressionName] = list;
    }
    // yay kemikleri (saç, göğüs vb.)
    B.springs = []; B.colGroups = [];
    const sm = vrm.springBoneManager, gi = new Map();
    if (sm) for (const j of sm.joints) {
      const groups = j.colliderGroups.map(g => { if (!gi.has(g)) gi.set(g, gi.size); return gi.get(g); });
      B.springs.push({ bone: j.bone.name, child: j.child ? j.child.name : null, settings: Object.assign({}, j.settings, { gravityDir: j.settings.gravityDir.clone() }), groups });
    }
    for (const [g, i] of gi) B.colGroups[i] = g.colliders.map(c => ({ parent: c.parent ? c.parent.name : null, pos: c.position.clone(), q: c.quaternion.clone(), shape: c.shape }));
    for (const o of extras) o.removeFromParent();
    sc.position.set(0, 0, 0); sc.rotation.set(0, 0, 0); sc.scale.set(1, 1, 1); sc.updateMatrixWorld(true);
    // mesh rolleri
    B.meshes = [];
    sc.traverse(o => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      const mn = mats[0].name || '';
      const role = /hair/i.test(mn) ? 'hair' : /EyeIris/i.test(mn) ? 'iris' : /Brow/i.test(mn) ? 'brow' : /Eye|Lash|line/i.test(mn) ? 'eye' : /Mouth/i.test(mn) ? 'mouth' : /Face/i.test(mn) ? 'face' : /Body/i.test(mn) ? 'body' : 'other';
      o.userData.role = role; B.meshes.push(o);
      // vücut gölge atmaz (üstündeki kıyafete leke düşürüyordu); kıyafet ve saç atar
      o.castShadow = role === 'hair'; o.receiveShadow = false;
    });
    // saç kemikleri: saç mesh'lerinin ağırlık verdiği, insan iskeletine ait olmayan kemikler
    const hairBones = new Set();
    for (const m of B.meshes) if (m.userData.role === 'hair' && m.isSkinnedMesh) {
      const si = m.geometry.attributes.skinIndex, sw = m.geometry.attributes.skinWeight;
      for (let i = 0; i < si.count; i++) for (let k = 0; k < 4; k++) if (sw.getComponent(i, k) > 0.001) { const b = m.skeleton.bones[si.getComponent(i, k)]; if (b && !B.humanOf[b.name]) hairBones.add(b.name); }
    }
    // saç kemiklerinin üstündeki zinciri de ekle (kök kemikler)
    for (const n of [...hairBones]) { let o = sc.getObjectByName(n); while (o && o.parent && !B.humanOf[o.parent.name]) { o = o.parent; if (o.isBone || o.type === 'Bone' || o.isObject3D) hairBones.add(o.name); if (o === sc) break; } }
    B.hairBones = hairBones;
    B.hairRoots = [...hairBones].filter(n => { const o = sc.getObjectByName(n); return o && o.parent && !hairBones.has(o.parent.name); });
    // görünür mesh'lerin kullandığı kemikler (kıyafetten kalan boş yay kemiklerini atlamak için)
    const used = new Set();
    for (const m of B.meshes) if (m.isSkinnedMesh) { const si = m.geometry.attributes.skinIndex, sw = m.geometry.attributes.skinWeight; for (let i = 0; i < si.count; i++) for (let k = 0; k < 4; k++) if (sw.getComponent(i, k) > 0.001) used.add(m.skeleton.bones[si.getComponent(i, k)].name); }
    const springUsed = n => { if (used.has(n)) return true; const o = sc.getObjectByName(n); let ok = false; if (o) o.traverse(c => { if (used.has(c.name)) ok = true; }); return ok; };
    B.springs = B.springs.filter(s => springUsed(s.bone));
    // ölçüler
    const bw = n => { const o = sc.getObjectByName(B.human[n]); if (!o) return null; const p = o.getWorldPosition(V3()); p.x *= B.F; p.z *= B.F; return p; };
    B.bp = {}; for (const hn in B.human) B.bp[hn] = bw(hn);
    const box = new T.Box3(); for (const m of B.meshes) if (m.userData.role === 'face' || m.userData.role === 'body') { if (m.isSkinnedMesh) m.computeBoundingBox && m.computeBoundingBox(); box.union(new T.Box3().setFromObject(m)); }
    B.height = box.max.y; B.hipY = B.bp.hips.y; B.headY = B.bp.head.y;
    this.prepBody(B);
    this.prepColors(B);
    // geniş sınır küresi: yatarken/otururken yanlışlıkla kırpılmasın
    for (const m of B.meshes) { m.frustumCulled = true; }
    return B;
  },
  // Vücut: dinlenme pozundaki köşe verisi (kıyafet üretimi ve ölçüler için)
  prepBody(B) {
    const bodies = B.meshes.filter(m => m.userData.role === 'body' && m.isSkinnedMesh);
    const skel = bodies[0].skeleton;
    B.skelNames = skel.bones.map(b => b.name);
    B.skelInv = skel.bones.map(b => b.matrixWorld.clone().invert());
    // kemik -> en yakın insan kemiği (ör. J_Sec_L_Bust1 -> upperChest)
    B.semOf = skel.bones.map(b => { let o = b; while (o && !B.humanOf[o.name]) o = o.parent; return o ? B.humanOf[o.name] : 'hips'; });
    const P = [], N = [], UV = [], SI = [], SW = [], IDX = []; let base = 0;
    const v = V3(), nm = new T.Matrix3();
    for (const m of bodies) {
      const g = m.geometry, pos = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv, si = g.attributes.skinIndex, sw = g.attributes.skinWeight;
      const remap = m.skeleton.bones.map(b => B.skelNames.indexOf(b.name));
      m.updateMatrixWorld(true); nm.getNormalMatrix(m.matrixWorld);
      const local = new Map();
      const idx = g.index ? g.index.array : [...Array(pos.count).keys()];
      for (let t = 0; t < idx.length; t++) {
        const vi = idx[t]; let ni = local.get(vi);
        if (ni === undefined) {
          ni = base + local.size; local.set(vi, ni);
          v.fromBufferAttribute(pos, vi); m.applyBoneTransform(vi, v); v.applyMatrix4(m.matrixWorld); P.push(v.x * B.F, v.y, v.z * B.F);
          v.fromBufferAttribute(nor, vi).applyMatrix3(nm).normalize(); N.push(v.x * B.F, v.y, v.z * B.F);
          UV.push(uv ? uv.getX(vi) : 0, uv ? uv.getY(vi) : 0);
          for (let k = 0; k < 4; k++) { SI.push(Math.max(0, remap[si.getComponent(vi, k)])); SW.push(sw.getComponent(vi, k)); }
        }
        IDX.push(ni);
      }
      base += local.size;
    }
    const n = P.length / 3, sem = [], bp = B.bp;
    const shX = Math.abs(bp.leftUpperArm.x) - 0.02, elX = Math.abs(bp.leftLowerArm.x), haX = Math.abs(bp.leftHand.x) - 0.012;
    const crotch = bp.hips.y - 0.07, knee = bp.leftLowerLeg.y, ankle = bp.leftFoot.y + 0.045;
    for (let i = 0; i < n; i++) {
      const x = P[i * 3], y = P[i * 3 + 1], ax = Math.abs(x), L = x > 0 ? 'left' : 'right';
      let s;
      if (y > bp.neck.y + 0.02 && ax < 0.12) s = 'head';
      else if (ax > shX && y > bp.chest.y - 0.08) s = ax > haX ? L + 'Hand' : ax > elX ? L + 'LowerArm' : L + 'UpperArm';
      else if (y < crotch && ax > 0.015) s = y < ankle ? L + 'Foot' : y < knee ? L + 'LowerLeg' : L + 'UpperLeg';
      else if (y < crotch) s = 'hips';
      else s = y > bp.neck.y - 0.01 ? 'neck' : y > bp.upperChest.y ? 'upperChest' : y > bp.chest.y ? 'chest' : y > bp.spine.y ? 'spine' : 'hips';
      sem.push(s);
    }
    B.body = { P: new Float32Array(P), N: new Float32Array(N), UV: new Float32Array(UV), SI: new Uint16Array(SI), SW: new Float32Array(SW), IDX, sem, n };
    // gövde kesitleri: belirli yükseklikte yarıçaplar (gövde + bacaklar)
    const torsoSet = new Set(['hips', 'spine', 'chest', 'upperChest', 'neck', 'leftShoulder', 'rightShoulder', 'leftUpperLeg', 'rightUpperLeg']);
    const sect = (y, dy = 0.03) => { let rx = 0.02, zf = 0.02, zb = -0.02, cx = 0, cz = 0, c = 0; for (let i = 0; i < n; i++) { if (!torsoSet.has(sem[i])) continue; const py = B.body.P[i * 3 + 1]; if (Math.abs(py - y) > dy) continue; const px = B.body.P[i * 3], pz = B.body.P[i * 3 + 2]; rx = Math.max(rx, Math.abs(px)); zf = Math.max(zf, pz); zb = Math.min(zb, pz); cz += pz; c++; } return { rx, zf, zb, cz: c ? cz / c : 0 }; };
    B.sect = sect;
    B.dims = {
      chest: sect(lerp(bp.chest.y, bp.upperChest.y, 0.7)), waist: sect(bp.spine.y), hip: sect(bp.hips.y - 0.04),
      shoulderX: Math.abs(bp.leftUpperArm.x), neckY: bp.neck.y, headY: bp.head.y,
    };
    // kafa ölçüleri (yüz mesh'inden)
    const fb = new T.Box3(); for (const m of B.meshes) if (m.userData.role === 'face') fb.union(new T.Box3().setFromObject(m));
    if (B.F < 0) { const a = fb.min.clone(), b = fb.max.clone(); fb.min.set(-b.x, a.y, -b.z); fb.max.set(-a.x, b.y, -a.z); }
    B.head = { min: fb.min.clone(), max: fb.max.clone(), c: fb.getCenter(V3()), size: fb.getSize(V3()) };
  },
  // Renk örnekleri: yüz derisinin ortalama rengi (vücut dokusu için), saç parlaklığı
  prepColors(B) {
    const sample = tex => {
      try {
        const im = tex.image, c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d', { willReadFrequently: true });
        x.drawImage(im, 0, 0, 64, 64); const d = x.getImageData(0, 0, 64, 64).data; const rs = [], gs = [], bs = [];
        for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 220 && d[i] + d[i + 1] + d[i + 2] > 380) { rs.push(d[i]); gs.push(d[i + 1]); bs.push(d[i + 2]); }
        const med = a => { a.sort((p, q) => p - q); return a.length ? a[a.length >> 1] : 230; };
        return new T.Color().setRGB(med(rs) / 255, med(gs) / 255, med(bs) / 255, T.SRGBColorSpace);
      } catch (e) { return new T.Color('#f6dccb'); }
    };
    const face = B.meshes.find(m => m.userData.role === 'face' && /Face_00_SKIN|^Face$|Face_00/.test(m.material.name || m.material[0].name));
    const fm = face ? (Array.isArray(face.material) ? face.material[0] : face.material) : null;
    B.skinBase = fm && fm.map ? sample(fm.map) : new T.Color('#f6dccb');
  },
  // ---- doku renklendirme (önbellekli) ----
  texCache: new Map(),
  // Parlaklığı koruyarak hedef renge boyar (saç, iris, kaş)
  recolor(tex, hex, key, o = {}) {
    if (!tex || !tex.image) return tex;
    const k = key + '|' + hex + '|' + (o.gain || 1) + '|' + (o.contrast || 0) + (o.noHi ? 'n' : '');
    if (this.texCache.has(k)) return this.texCache.get(k);
    const im = tex.image, w = Math.min(512, im.width), h = Math.min(512, im.height);
    const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(im, 0, 0, w, h); const id = x.getImageData(0, 0, w, h), d = id.data;
    // ortalama parlaklık (opak pikseller)
    let sum = 0, cnt = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 128) { sum += 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]; cnt++; }
    const mean = Math.max(8, cnt ? sum / cnt : 128);
    const tc = new T.Color(hex); const tr = Math.pow(tc.r, 1 / 2.2) * 255, tg = Math.pow(tc.g, 1 / 2.2) * 255, tb = Math.pow(tc.b, 1 / 2.2) * 255;
    const tl = 0.3 * tr + 0.59 * tg + 0.11 * tb, gain = o.gain || 1;
    for (let i = 0; i < d.length; i += 4) {
      const l = (0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) / mean; // 1 = ortalama ton
      const f = Math.pow(l, o.contrast || 0.85) * gain;
      // açık tonlarda parlama: hedef renkten beyaza doğru
      const hi = o.noHi ? 0 : clamp((f - 1.15) * 0.5, 0, 0.5);
      d[i] = clamp(tr * f * (1 - hi) + 255 * hi, 0, 255); d[i + 1] = clamp(tg * f * (1 - hi) + 255 * hi, 0, 255); d[i + 2] = clamp(tb * f * (1 - hi) + 255 * hi, 0, 255);
    }
    x.putImageData(id, 0, 0);
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.flipY = tex.flipY; t.wrapS = tex.wrapS; t.wrapT = tex.wrapT; t.anisotropy = 2;
    this.texCache.set(k, t); return t;
  },
  // Kumaş dokuları (gri, malzeme rengiyle çarpılır)
  fabric(kind) {
    const k = 'fab|' + kind; if (this.texCache.has(k)) return this.texCache.get(k);
    const S = 256, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d');
    const img = x.createImageData(S, S), d = img.data; const rr = mulberry32(kind.length * 977 + kind.charCodeAt(0));
    for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++) {
      let v = 0.9;
      if (kind === 'linen' || kind === 'wool') { const wv = ((xx + yy) % 3 === 0 ? 1 : 0) - ((xx - yy + 999) % 3 === 0 ? 1 : 0); v = 0.93 + wv * (kind === 'wool' ? 0.012 : 0.018) + (fbm(xx * 0.2, yy * 0.2) - 0.44) * 0.05 + (rr() - 0.5) * 0.025; }
      else if (kind === 'leather') { v = 0.9 + (fbm(xx * 0.15, yy * 0.15) - 0.44) * 0.1 + (rr() - 0.5) * 0.02; }
      else if (kind === 'velvet') { v = 0.93 + (fbm(xx * 0.08, yy * 0.08) - 0.44) * 0.06; }
      else if (kind === 'metal') { v = 0.94 + (fbm(xx * 0.05, yy * 0.4) - 0.44) * 0.08; }
      const i = (yy * S + xx) * 4, q = clamp(v, 0, 1) * 255; d[i] = d[i + 1] = d[i + 2] = q; d[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 2;
    this.texCache.set(k, t); return t;
  },
  solid(hex) {
    const k = 'solid|' + hex; if (this.texCache.has(k)) return this.texCache.get(k);
    const c = document.createElement('canvas'); c.width = c.height = 4; const x = c.getContext('2d'); x.fillStyle = hex; x.fillRect(0, 0, 4, 4);
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; this.texCache.set(k, t); return t;
  },
};

// ---- MToon malzeme yardımcıları ----
const VMAT = {
  // Bir şablon malzemeden (vücut) türetilen kumaş malzemesi + kontur çifti
  make(B, hex, o = {}) {
    const src = B.meshes.find(m => m.userData.role === 'body'); const sm = Array.isArray(src.material) ? src.material : [src.material];
    const m = sm[0].clone(); const col = new T.Color(hex);
    m.map = o.tex === null ? null : VRMKit.fabric(o.tex || 'linen'); m.shadeMultiplyTexture = m.map;
    if (m.map) { m.uniforms && m.uniforms.mapUvTransform && m.uniforms.mapUvTransform.value; }
    m.color = col.clone();
    const sh = o.shade ? new T.Color(o.shade) : col.clone().multiplyScalar(0.62).lerp(new T.Color('#3a3150'), 0.18);
    m.shadeColorFactor = sh;
    m.normalMap = null; m.emissiveMap = null; m.matcapTexture = null; m.rimMultiplyTexture = null;
    m.shadingShiftFactor = o.shift !== undefined ? o.shift : -0.05; m.shadingToonyFactor = 0.86;
    m.parametricRimColorFactor = new T.Color(o.rim || '#000000'); m.parametricRimFresnelPowerFactor = 3.5; m.parametricRimLiftFactor = 0.05;
    if (o.double) m.side = T.DoubleSide;
    if (o.repeat) this.repeat(m, o.repeat);
    m.needsUpdate = true;
    const out = [m];
    if (sm[1]) { const ol = sm[1].clone(); ol.outlineWidthFactor = (sm[1].outlineWidthFactor || 0.002) * (o.olw || 1); ol.outlineColorFactor = new T.Color(o.ol || shade(hex, 0.3)); ol.map = m.map; ol.color = col.clone(); ol.side = T.BackSide; ol.needsUpdate = true; out.push(ol); }
    return out;
  },
  repeat(m, r) {
    // MToon'da doku tekrarı: map'in kendi transform'u
    if (m.map) { m.map = m.map.clone(); m.map.repeat.set(r, r); m.map.needsUpdate = true; m.shadeMultiplyTexture = m.map; }
  },
  // Gruplu (malzeme + kontur) mesh
  mesh(geo, mats, skinned) {
    if (mats.length > 1 && !geo.groups.length) { const n = geo.index ? geo.index.count : geo.attributes.position.count; geo.addGroup(0, n, 0); geo.addGroup(0, n, 1); }
    const me = skinned ? new T.SkinnedMesh(geo, mats.length > 1 ? mats : mats[0]) : new T.Mesh(geo, mats.length > 1 ? mats : mats[0]);
    me.castShadow = true; me.receiveShadow = false; return me;
  },
};

// ---- Kıyafet üretimi: vücut yüzeyinden şişirilmiş giysiler + etek/pelerin tüpleri ----
const Garments = {
  cache: new Map(),
  // Vücut yüzeyinden kabuk: field(i) > 0 içeride; sınırı kesen üçgenler kesilir (pürüzsüz kenar). off(i): kalınlık
  shell(B, field, off, o = {}) {
    const b = B.body, n = b.n;
    const fv = new Float32Array(n); for (let i = 0; i < n; i++) { const f = field(i); fv[i] = f === true ? 1 : f === false ? -1 : f; }
    const P = [], N = [], UV = [], SI = [], SW = [], IDX = [];
    const map = new Int32Array(n).fill(-1), edges = new Map();
    const push = (px, py, pz, nx, ny, nz, u, v, inf) => {
      P.push(px, py, pz); const l = Math.hypot(nx, ny, nz) || 1; N.push(nx / l, ny / l, nz / l); UV.push(u * (o.uvs || 1), v * (o.uvs || 1));
      inf.sort((p, q) => q[1] - p[1]); let t = 0; for (let k = 0; k < 4; k++) t += inf[k] ? inf[k][1] : 0;
      for (let k = 0; k < 4; k++) { SI.push(inf[k] ? inf[k][0] : 0); SW.push(inf[k] ? inf[k][1] / (t || 1) : 0); }
      return P.length / 3 - 1;
    };
    const infOf = i => { const r = []; for (let k = 0; k < 4; k++) if (b.SW[i * 4 + k] > 0) r.push([b.SI[i * 4 + k], b.SW[i * 4 + k]]); return r; };
    const vert = i => {
      if (map[i] < 0) { const d = off(i); map[i] = push(b.P[i * 3] + b.N[i * 3] * d, b.P[i * 3 + 1] + b.N[i * 3 + 1] * d, b.P[i * 3 + 2] + b.N[i * 3 + 2] * d, b.N[i * 3], b.N[i * 3 + 1], b.N[i * 3 + 2], b.UV[i * 2], b.UV[i * 2 + 1], infOf(i)); }
      return map[i];
    };
    const cut = (i, j) => {
      const key = i < j ? i * n + j : j * n + i; if (edges.has(key)) return edges.get(key);
      const t = fv[i] / (fv[i] - fv[j]), di = off(i), dj = off(j), L = (a, c) => a + (c - a) * t;
      const px = L(b.P[i * 3] + b.N[i * 3] * di, b.P[j * 3] + b.N[j * 3] * dj), py = L(b.P[i * 3 + 1] + b.N[i * 3 + 1] * di, b.P[j * 3 + 1] + b.N[j * 3 + 1] * dj), pz = L(b.P[i * 3 + 2] + b.N[i * 3 + 2] * di, b.P[j * 3 + 2] + b.N[j * 3 + 2] * dj);
      const w = new Map(); for (const [bi, bw] of infOf(i)) w.set(bi, (w.get(bi) || 0) + bw * (1 - t)); for (const [bi, bw] of infOf(j)) w.set(bi, (w.get(bi) || 0) + bw * t);
      const id = push(px, py, pz, L(b.N[i * 3], b.N[j * 3]), L(b.N[i * 3 + 1], b.N[j * 3 + 1]), L(b.N[i * 3 + 2], b.N[j * 3 + 2]), L(b.UV[i * 2], b.UV[j * 2]), L(b.UV[i * 2 + 1], b.UV[j * 2 + 1]), [...w.entries()]);
      edges.set(key, id); return id;
    };
    for (let t = 0; t < b.IDX.length; t += 3) {
      const v = [b.IDX[t], b.IDX[t + 1], b.IDX[t + 2]], ins = v.map(i => fv[i] > 0), c = ins.filter(Boolean).length;
      if (c === 3) { IDX.push(vert(v[0]), vert(v[1]), vert(v[2])); continue; }
      if (c === 0) continue;
      // Sutherland-Hodgman: üçgeni sınırla kırp (sıra korunur)
      const poly = [];
      for (let k = 0; k < 3; k++) { const a = v[k], q = v[(k + 1) % 3]; if (fv[a] > 0) poly.push(vert(a)); if ((fv[a] > 0) !== (fv[q] > 0)) poly.push(cut(a, q)); }
      for (let k = 1; k + 1 < poly.length; k++) IDX.push(poly[0], poly[k], poly[k + 1]);
    }
    return this.geo(P, N, UV, SI, SW, IDX, false, B.F);
  },
  geo(P, N, UV, SI, SW, IDX, computeN, F = 1) {
    if (F < 0) { for (let i = 0; i < P.length; i += 3) { P[i] = -P[i]; P[i + 2] = -P[i + 2]; } if (N) for (let i = 0; i < N.length; i += 3) { N[i] = -N[i]; N[i + 2] = -N[i + 2]; } }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(P, 3));
    if (N) g.setAttribute('normal', new T.Float32BufferAttribute(N, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(UV, 2));
    g.setAttribute('skinIndex', new T.Uint16BufferAttribute(SI, 4));
    g.setAttribute('skinWeight', new T.Float32BufferAttribute(SW, 4));
    g.setIndex(IDX); if (!N || computeN) g.computeVertexNormals();
    g.computeBoundingSphere(); return g;
  },
  bi(B, hn) { const i = B.skelNames.indexOf(B.human[hn]); return i < 0 ? 0 : i; },
  // Etek / elbise / cübbe / ceket eteği: belden aşağı tüp
  skirt(B, o) {
    const segs = 30, rings = 9, bp = B.bp, top = o.top, bot = o.bot;
    const hips = this.bi(B, 'hips'), lL = this.bi(B, 'leftUpperLeg'), lR = this.bi(B, 'rightUpperLeg'), kL = this.bi(B, 'leftLowerLeg'), kR = this.bi(B, 'rightLowerLeg');
    const P = [], UV = [], SI = [], SW = [], IDX = [];
    const a0 = o.a0 !== undefined ? o.a0 : -Math.PI, a1 = o.a1 !== undefined ? o.a1 : Math.PI, closed = a1 - a0 > TAU - 0.01;
    let prevR = null;
    for (let r = 0; r < rings; r++) {
      const t = r / (rings - 1), y = lerp(top, bot, t);
      const s = B.sect(Math.max(y, bp.leftLowerLeg.y + 0.1), 0.04);
      const flare = (o.flare || 0.08) * Math.pow(t, 1.3);
      let rx = s.rx + 0.012 + (o.loose || 0) + flare, zf = s.zf - s.cz + 0.012 + (o.loose || 0) + flare * 0.85, zb = s.cz - s.zb + 0.012 + (o.loose || 0) + flare * 0.85;
      if (prevR) { rx = Math.max(rx, prevR[0]); zf = Math.max(zf, prevR[1]); zb = Math.max(zb, prevR[2]); }
      prevR = [rx, zf, zb];
      for (let i = 0; i <= segs; i++) {
        const a = lerp(a0, a1, i / segs), sx = Math.sin(a), cz = Math.cos(a);
        const ruff = 1 + (o.ruff || 0.02) * Math.sin(a * 11) * t;
        P.push(sx * rx * ruff, y, s.cz + cz * (cz > 0 ? zf : zb) * ruff);
        UV.push(i / segs * 4, t * 2.5);
        // ağırlık: üstte kalça, aşağı indikçe yan taraflar bacaklara bağlanır, ön/arka iki bacağın ortalaması
        const side = clamp(Math.abs(sx) * 1.4, 0, 1), down = clamp(t * 1.15, 0, 1) * (o.follow !== undefined ? o.follow : 0.6);
        const own = down * side, shared = down * (1 - side) * 0.5;
        let wL = sx > 0 ? own + shared : shared, wR = sx > 0 ? shared : own + shared;
        const low = o.knee ? clamp((t - 0.55) * 2, 0, 1) * 0.5 : 0;
        const wh = Math.max(0, 1 - wL - wR);
        SI.push(hips, lL, lR, sx > 0 ? kL : kR); SW.push(wh, wL * (1 - low), wR * (1 - low), (sx > 0 ? wL : wR) * low);
      }
    }
    const row = segs + 1;
    for (let r = 0; r < rings - 1; r++) for (let i = 0; i < segs; i++) { const a = r * row + i, b = a + 1, c = a + row, d = c + 1; IDX.push(a, c, b, b, c, d); }
    return this.geo(P, null, UV, SI, SW, IDX, true, B.F);
  },
  // Pelerin: omuzlardan aşağı, sırtta yay; ek 'cape' kemiğine bağlı
  cape(B, o, capeIdx) {
    const segs = 14, rings = 8, bp = B.bp, top = lerp(bp.upperChest.y, bp.neck.y, 0.75), len = o.len || (top - bp.leftLowerLeg.y * 0.6);
    const ch = B.dims.chest, uc = this.bi(B, 'upperChest');
    const P = [], UV = [], SI = [], SW = [], IDX = [];
    for (let r = 0; r < rings; r++) {
      const t = r / (rings - 1), y = top - len * t;
      const w = (ch.rx + 0.05) * (1 + t * 0.5) * (o.wide || 1), back = ch.zb - 0.035 - t * 0.1;
      for (let i = 0; i <= segs; i++) {
        const u = i / segs, a = lerp(-1.25, 1.25, u);
        const x = Math.sin(a) * w, z = back + (1 - Math.cos(a)) * (ch.zf - ch.zb) * 0.55 * (1 - t * 0.4) + Math.sin(a * 6) * 0.008 * t;
        P.push(x, y, z); UV.push(u * 3, t * 3);
        const wc = clamp(t * 2.2, 0, 1); SI.push(uc, capeIdx, 0, 0); SW.push(1 - wc, wc, 0, 0);
      }
    }
    const row = segs + 1;
    for (let r = 0; r < rings - 1; r++) for (let i = 0; i < segs; i++) { const a = r * row + i, b = a + 1, c = a + row, d = c + 1; IDX.push(a, b, c, b, d, c); }
    return this.geo(P, null, UV, SI, SW, IDX, true, B.F);
  },
  // Tanımdan geometri (taban modeline göre önbellekli)
  build(B, spec, child) {
    const key = B.key + '|' + JSON.stringify(spec) + '|' + (child ? 1 : 0);
    if (this.cache.has(key)) return this.cache.get(key);
    const b = B.body, bp = B.bp, sem = b.sem, Y = i => b.P[i * 3 + 1], X = i => b.P[i * 3], Z = i => b.P[i * 3 + 2];
    const arm = s => s === 'leftUpperArm' || s === 'rightUpperArm', fore = s => s === 'leftLowerArm' || s === 'rightLowerArm';
    const torso = s => s === 'hips' || s === 'spine' || s === 'chest' || s === 'upperChest' || s === 'leftShoulder' || s === 'rightShoulder' || s === 'neck';
    const legU = s => s === 'leftUpperLeg' || s === 'rightUpperLeg', legL = s => s === 'leftLowerLeg' || s === 'rightLowerLeg', foot = s => /Foot|Toes/.test(s);
    const shX = B.dims.shoulderX, upLen = Math.abs(bp.leftLowerArm.x) - shX, loLen = Math.abs(bp.leftHand.x) - Math.abs(bp.leftLowerArm.x);
    const neckCut = lerp(bp.neck.y, bp.head.y, spec.collar === 'high' ? 0.45 : 0.08), waist = bp.spine.y + 0.02;
    let g = null;
    const armpit = bp.leftUpperArm.y - 0.05, abX = i => Math.abs(X(i));
    const armhole = (i, w) => Math.max(shX + w - abX(i), armpit - Y(i));
    switch (spec.t) {
      case 'shirt': {
        const sl = spec.sleeves || 'short';
        const armEnd = sl === 'short' ? shX + upLen * 0.62 : sl === 'elbow' ? shX + upLen * 1.05 : Math.abs(bp.leftHand.x) - 0.018;
        const bottom = bp.hips.y - 0.05;
        g = this.shell(B, i => Math.min(Y(i) - bottom, neckCut - Y(i), sl === 'none' ? armhole(i, 0.004) : armEnd - abX(i)),
          i => { const s = sem[i]; let d = spec.thick || 0.0075; if (fore(s) && sl === 'long') d += clamp((abX(i) - Math.abs(bp.leftLowerArm.x)) / loLen, 0, 1) * 0.012; if (Y(i) < waist) d += 0.003 + clamp((waist - Y(i)) * 0.15, 0, 0.01); return d; });
        break;
      }
      case 'pants': {
        const low = spec.boots ? lerp(bp.leftFoot.y, bp.leftLowerLeg.y, 0.55) : bp.leftFoot.y + 0.03;
        g = this.shell(B, i => Math.min(Y(i) - low, waist + 0.03 - Y(i)),
          i => { const s = sem[i]; let d = 0.0055; if (legL(s)) d += clamp((bp.leftLowerLeg.y - Y(i)) * 0.03, 0, 0.008) * (spec.baggy ? 2 : 1); if (legU(s)) d += spec.baggy ? 0.006 : 0.001; return d; });
        break;
      }
      case 'boots': case 'shoes': {
        const top = spec.t === 'boots' ? lerp(bp.leftFoot.y, bp.leftLowerLeg.y, spec.high ? 0.82 : 0.6) : bp.leftFoot.y + 0.05;
        g = this.shell(B, i => top - Y(i), i => { const s = sem[i]; return (spec.t === 'boots' ? 0.011 : 0.007) + (foot(s) ? 0.002 : 0) + (Y(i) > top - 0.04 && spec.t === 'boots' ? 0.004 : 0); });
        break;
      }
      case 'vest': {
        const open = spec.open !== false, bottom = spec.long ? bp.hips.y - 0.04 : waist - 0.03, top = lerp(bp.neck.y, bp.head.y, 0.02);
        const vh = y => 0.014 + clamp((y - bp.chest.y) / (bp.neck.y - bp.chest.y), 0, 1) * 0.045;
        g = this.shell(B, i => Math.min(Y(i) - bottom, top - Y(i), armhole(i, 0.004), open ? (Z(i) < 0 ? 1 : abX(i) - vh(Y(i))) : 1), () => spec.thick || 0.015);
        break;
      }
      case 'armor': {
        g = this.shell(B, i => Math.min(Y(i) - (bp.hips.y - 0.02), lerp(bp.neck.y, bp.head.y, 0.05) - Y(i), armhole(i, 0.02)), i => 0.022 + (Y(i) > bp.chest.y ? 0.006 : 0));
        break;
      }
      case 'bracers': {
        const a0 = Math.abs(bp.leftLowerArm.x) + loLen * 0.35, a1 = Math.abs(bp.leftHand.x) - 0.012;
        g = this.shell(B, i => Math.min(abX(i) - a0, a1 - abX(i)), () => 0.016);
        break;
      }
      case 'skirt': {
        const top = spec.from === 'waist' ? waist : spec.from === 'chest' ? bp.chest.y : bp.hips.y - 0.035;
        const bot = spec.len === 'floor' ? bp.leftFoot.y + 0.05 : spec.len === 'ankle' ? lerp(bp.leftFoot.y, bp.leftLowerLeg.y, 0.25) : spec.len === 'knee' ? bp.leftLowerLeg.y - 0.04 : spec.len === 'thigh' ? lerp(bp.leftUpperLeg.y, bp.leftLowerLeg.y, 0.55) : spec.len === 'tunic' ? lerp(bp.leftUpperLeg.y, bp.leftLowerLeg.y, 0.32) : lerp(bp.leftUpperLeg.y, bp.leftLowerLeg.y, 0.3);
        const ao = spec.open === 'front' ? { a0: 0.42, a1: TAU - 0.42 } : spec.open === 'apron' ? { a0: -1.05, a1: 1.05 } : {};
        g = this.skirt(B, Object.assign({ top, bot, flare: spec.flare, loose: spec.loose, follow: spec.follow, knee: spec.len === 'floor' || spec.len === 'ankle' }, ao));
        if (spec.open) { const a = g.attributes.position; for (let i = 0; i < a.count; i++) { /* önlük/ceket: içi görünür */ } }
        break;
      }
    }
    if (g && child && B.childFlat) B.childFlat(g);
    this.cache.set(key, g); return g;
  },
};

// ---- Hazır aksesuarlar (kemiğe sabit, iskeletsiz) ----
const VACC = {
  geo(type, B, ex) {
    const h = B.head, hw = h.size.x * 0.5, hh = h.size.y * 0.5, hd = h.size.z * 0.5;
    const ch = B.dims.chest, wa = B.dims.waist, hi = B.dims.hip;
    switch (type) {
      case 'belt': { const g = new T.TorusGeometry(1, 0.11, 6, 28); g.rotateX(Math.PI / 2); g.scale(wa.rx + 0.022, 0.18, (wa.zf - wa.zb) / 2 + 0.024); return { bone: 'hips', at: V3(0, B.bp.spine.y - B.bp.hips.y - 0.035, wa.cz), g, mat: 'leather' }; }
      case 'buckle': return { bone: 'hips', at: V3(0, B.bp.spine.y - B.bp.hips.y - 0.035, wa.zf + 0.026), g: new T.BoxGeometry(0.05, 0.04, 0.012), mat: 'metal' };
      case 'collar': { const g = new T.TorusGeometry(1, 0.16, 6, 24); g.rotateX(Math.PI / 2); g.scale(0.062, 0.05, 0.058); return { bone: 'neck', at: V3(0, 0.012, 0.006), g }; }
      case 'hoodDown': { const g = new T.TorusGeometry(1, 0.35, 7, 20); g.rotateX(Math.PI / 2 + 0.35); g.scale(ch.rx * 0.62, 0.08, (ch.zf - ch.zb) * 0.55); return { bone: 'upperChest', at: V3(0, B.bp.neck.y - B.bp.upperChest.y - 0.01, ch.cz - 0.035), g }; }
      case 'scarf': { const g = new T.TorusGeometry(1, 0.38, 7, 20); g.rotateX(Math.PI / 2); g.scale(0.068, 0.06, 0.068); return { bone: 'neck', at: V3(0, 0.035, 0.005), g }; }
      case 'hat': { const g = latheGeo([[0.001, 0.13], [0.33, 0.12], [0.37, 0.02], [0.66, 0.0], [0.7, -0.03], [0.62, -0.03], [0.34, 0.0], [0.001, 0.0]], 20); g.scale(hw * 1.45, hh * 0.95, hd * 1.45); return { bone: 'head', at: V3(0, h.max.y - B.bp.head.y - hh * 0.25, h.c.z - B.bp.head.z), g, mat: 'linen' }; }
      case 'cap': { const g = new T.SphereGeometry(1, 16, 8, 0, TAU, 0, Math.PI * 0.45); g.scale(hw * 1.13, hh * 1.0, hd * 1.15); return { bone: 'head', at: V3(0, h.c.y - B.bp.head.y + hh * 0.08, h.c.z - B.bp.head.z - 0.005), g, mat: 'wool' }; }
      case 'helmet': { const g = new T.SphereGeometry(1, 18, 10, 0, TAU, 0, Math.PI * 0.55); g.scale(hw * 1.18, hh * 1.08, hd * 1.2); return { bone: 'head', at: V3(0, h.c.y - B.bp.head.y + hh * 0.05, h.c.z - B.bp.head.z - 0.008), g, mat: 'metal' }; }
      case 'hood': { const g = new T.SphereGeometry(1, 18, 12, Math.PI * 1.5 - 1.95, 3.9, 0, Math.PI * 0.78); g.scale(hw * 1.3, hh * 1.18, hd * 1.32); return { bone: 'head', at: V3(0, h.c.y - B.bp.head.y + 0.01, h.c.z - B.bp.head.z - 0.012), g, double: true }; }
      case 'headscarf': { const g = new T.SphereGeometry(1, 18, 12, Math.PI * 1.5 - 1.7, 3.4, 0, Math.PI * 0.62); g.scale(hw * 1.14, hh * 1.05, hd * 1.18); return { bone: 'head', at: V3(0, h.c.y - B.bp.head.y + 0.012, h.c.z - B.bp.head.z - 0.008), g, double: true }; }
      case 'circlet': { const g = new T.TorusGeometry(1, 0.035, 5, 28); g.rotateX(Math.PI / 2 - 0.12); g.scale(hw * 1.06, 1, hd * 1.08); return { bone: 'head', at: V3(0, h.c.y - B.bp.head.y + hh * 0.42, h.c.z - B.bp.head.z), g, mat: 'metal' }; }
      case 'bandage': { const g = new T.TorusGeometry(1, 0.06, 5, 28); g.rotateX(Math.PI / 2 - 0.15); g.scale(hw * 1.05, 1, hd * 1.07); return { bone: 'head', at: V3(0, h.c.y - B.bp.head.y + hh * 0.38, h.c.z - B.bp.head.z), g }; }
      case 'beard': { const g = new T.SphereGeometry(1, 18, 10, Math.PI / 2 - 1.3, 2.6, Math.PI * 0.45, Math.PI * 0.4); g.scale(hw * 0.74, hh * 0.5, hd * 0.82); return { bone: 'head', at: V3(0, h.min.y - B.bp.head.y + hh * 0.36, h.c.z - B.bp.head.z + hd * 0.02), g, mat: 'hair', double: true }; }
      case 'mustache': { const g = new T.CapsuleGeometry(0.012, 0.05, 4, 8); g.rotateZ(Math.PI / 2); return { bone: 'head', at: V3(0, h.min.y - B.bp.head.y + hh * 0.55, h.max.z - B.bp.head.z - 0.006), g, mat: 'hair' }; }
      case 'baldRing': { const g = new T.TorusGeometry(1, 0.22, 7, 24, Math.PI * 1.3); g.rotateZ(-Math.PI * 0.15 + Math.PI); g.rotateX(Math.PI / 2); g.rotateY(-Math.PI / 2); g.scale(hw * 1.0, hh * 0.5, hd * 1.0); return { bone: 'head', at: V3(0, h.c.y - B.bp.head.y - hh * 0.08, h.c.z - B.bp.head.z - 0.01), g, mat: 'hair' }; }
      case 'satchel': return { bone: 'hips', at: V3(-(hi.rx + 0.05), -0.05, 0.02), g: new T.BoxGeometry(0.06, 0.16, 0.18), mat: 'leather' };
      case 'strap': { const g = new T.BoxGeometry(0.03, 0.62, 0.008); g.rotateZ(0.62); return { bone: 'upperChest', at: V3(0.0, -0.06, ch.zf + 0.012), g, mat: 'leather' }; }
      case 'sheath': { const g = new T.CylinderGeometry(0.024, 0.018, 0.74, 8); g.translate(0, -0.3, 0); g.rotateZ(0.16); g.rotateX(0.18); return { bone: 'hips', at: V3(hi.rx + 0.04, 0.05, -0.02), g, mat: 'leather' }; }
      case 'hilt': { const g = new T.CylinderGeometry(0.016, 0.016, 0.16, 8); g.translate(0, 0.12, 0); g.rotateZ(0.16); g.rotateX(0.18); return { bone: 'hips', at: V3(hi.rx + 0.04, 0.05, -0.02), g, mat: 'metal' }; }
      case 'quiver': { const g = new T.CylinderGeometry(0.05, 0.04, 0.48, 10); g.rotateZ(0.4); return { bone: 'upperChest', at: V3(-0.06, 0.02, ch.zb - 0.05), g, mat: 'leather' }; }
      case 'bowBack': { const g = new T.TorusGeometry(0.42, 0.012, 5, 22, Math.PI * 0.85); g.rotateY(Math.PI / 2); g.rotateX(-0.45); return { bone: 'upperChest', at: V3(0.03, -0.12, ch.zb - 0.07), g, mat: 'leather' }; }
      case 'necklace': { const g = new T.TorusGeometry(1, 0.03, 4, 24); g.rotateX(Math.PI / 2 - 0.5); g.scale(ch.rx * 0.42, 0.05, (ch.zf - ch.zb) * 0.4); return { bone: 'upperChest', at: V3(0, B.bp.neck.y - B.bp.upperChest.y - 0.035, (ch.cz || 0) + 0.012), g, mat: 'metal' }; }
      case 'gem': return { bone: 'upperChest', at: V3(0, B.bp.neck.y - B.bp.upperChest.y - 0.1, ch.zf + 0.006), g: new T.OctahedronGeometry(0.016), mat: 'gem' };
      case 'sash': { const g = new T.TorusGeometry(1, 0.05, 5, 26); g.rotateX(Math.PI / 2); g.rotateZ(0.62); g.scale(ch.rx + 0.03, 1, (ch.zf - ch.zb) / 2 + 0.03); return { bone: 'spine', at: V3(0, 0.08, ch.cz), g }; }
      case 'pauldron': { const g = new T.SphereGeometry(1, 12, 8, 0, TAU, 0, Math.PI * 0.55); g.scale(0.085, 0.06, 0.085); return { g, mat: 'metal' }; }
    }
    return null;
  },
};

// ---- Bir VRM karakteri: eski Humanoid ile aynı arayüz ----
const _q1 = new T.Quaternion(), _q2 = new T.Quaternion(), _qI = new T.Quaternion(), _e1 = new T.Euler(), _v1 = new T.Vector3(), _xAx = new T.Vector3(1, 0, 0);
const R2D_L = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 0, 1), -Math.PI / 2), R2D_R = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 0, 1), Math.PI / 2);
const R2D_Li = R2D_L.clone().invert(), R2D_Ri = R2D_R.clone().invert();
const FINGERS = ['Index', 'Middle', 'Ring', 'Little'], PHAL = ['Proximal', 'Intermediate', 'Distal'];
const OLD_H = (o) => { const ch = o.child || 0, hk = 1 + 0.3 * ch, lk = 1 - 0.07 * ch; return { hip: (0.44 + 0.43) * lk + 0.06, height: (0.44 + 0.43) * lk + 0.06 + 0.06 + 0.53 * (1 - 0.05 * ch) + 0.07 + 0.265 * hk }; };

class VRMHumanoid extends PoseRig {
  constructor(o) {
    super();
    this.vrm = true;
    this.o = o = Object.assign({ scale: 1, female: false, child: 0, skin: SKIN.light, hair: '#3a2a1c', hairStyle: 'short', eyes: '#4a3424', shirt: '#7a6a55', sleeves: 'short', pants: '#4b4033', shoes: '#3a2b20', extras: [] }, o);
    const V = this.V = vrmSpecFor(o);
    const B = this.B = VRMKit.bases[V.base];
    this.allMats = []; this.outlines = []; this.ownTex = []; this.meshes = [];
    const root = this.root = new T.Group();
    const pivot = this.pivot = new T.Group(); root.add(pivot);
    const body = this.body = new T.Group(); pivot.add(body);
    const holder = this.holder = new T.Group(); body.add(holder);
    if (B.vrm0) holder.rotation.y = Math.PI;
    // ölçek: eski karakter boyuyla aynı (sahnelerdeki yerleşimler korunsun)
    const old = OLD_H(o), ch = o.child || 0;
    this.headK = 1 + 0.2 * ch;
    const natural = B.height + (B.height - B.headY) * (this.headK - 1);
    const k = this.k = old.height * (V.heightMul || 1) / natural;
    holder.scale.setScalar(k);
    this.hipRatio = (B.hipY * k) / old.hip;
    this.PV = 0.55 * this.hipRatio;
    pivot.position.y = this.PV; body.position.y = -this.PV;
    // klon
    const sc = this.sc = VRMLib.cloneSkinned(B.scene); holder.add(sc);
    const nodes = this.nodes = new Map(); sc.traverse(n => nodes.set(n.name, n));
    sc.updateMatrixWorld(true);
    // normalleştirilmiş iskelet
    const hb = {}; for (const hn in B.human) { const n = nodes.get(B.human[hn]); if (n) hb[hn] = { node: n }; }
    this.hum = new VRMLib.VRMHumanoid(hb, { autoUpdateHumanBones: true });
    sc.add(this.hum.normalizedHumanBonesRoot);
    this.nb = {}; for (const hn in hb) this.nb[hn] = this.hum.getNormalizedBoneNode(hn);
    this.raw = {}; for (const hn in hb) this.raw[hn] = hb[hn].node;
    // kafa ve vücut oranları
    if (this.headK !== 1) this.raw.head.scale.setScalar(this.headK);
    if (V.wide && V.wide !== 1) { this.raw.spine.scale.set(V.wide, 1, lerp(1, V.wide, 0.6)); for (const s of ['leftShoulder', 'rightShoulder', 'neck']) if (this.raw[s]) this.raw[s].scale.set(1 / V.wide, 1, 1 / lerp(1, V.wide, 0.6)); }
    // malzemeler: örnek başına kopya + renklendirme
    this.setupMaterials();
    // saç
    this.setupHair();
    // kıyafetler
    this.capeBone = null; this.garments = [];
    this.setupGarments();
    // yay kemikleri
    root.scale.setScalar(o.scale); root.updateMatrixWorld(true);
    this.setupSprings();
    // ifadeler
    this.exprMap = {}; for (const name in B.expr) this.exprMap[name] = B.expr[name].map(b => ({ mesh: nodes.get(b.mesh), index: b.index, weight: b.weight })).filter(b => b.mesh && b.mesh.morphTargetInfluences);
    this.exprW = {}; this.exprT = {}; this.expr = o.expr || 'neutral'; this.faceState = ''; this.blinkW = 0; this.mouthW = 0;
    // el bağlantıları ve kafa çapası (portre, eşyalar)
    sc.updateMatrixWorld(true);
    const anchor = (bone, fixQ) => { const g = new T.Group(); bone.add(g); bone.updateWorldMatrix(true, false); const wq = bone.getWorldQuaternion(new T.Quaternion()), rq = root.getWorldQuaternion(new T.Quaternion()); g.quaternion.copy(wq.invert().multiply(rq)); if (fixQ) g.quaternion.multiply(fixQ); g.scale.setScalar(1 / k); return g; };
    this.handR = anchor(this.raw.rightHand, R2D_Ri); this.handL = anchor(this.raw.leftHand, R2D_Li);
    this.handR.position.set(0, 0, 0); this.handL.position.set(0, 0, 0);
    this.head = anchor(this.raw.head);
    const hd = B.head; this.D = { headH: (hd.max.y - B.bp.head.y) * k, height: (B.height + (B.height - B.headY) * (this.headK - 1)) * k, headW: hd.size.x * k, headD: hd.size.z * k };
    this.hc = V3(0, this.D.headH * 0.5, 0);
    // aksesuarlar
    this.building = true; for (const ex of (V.acc || [])) this.addExtra(ex); this.building = false;
    this.initRig();
    this.relax = 0.25; this.fist = 0; this.eyeYaw = 0; this.eyePitch = 0;
    this.closedEyes = false;
    // sınır küreleri (kırpılma hatasını önle)
    const hgt = B.height; sc.traverse(m => { if (m.isSkinnedMesh) { m.boundingSphere = new T.Sphere(V3(0, hgt * 0.5, 0), hgt * 0.8); } });
    this.olVis = true;
  }
  // ---- malzemeler ----
  setupMaterials() {
    const B = this.B, o = this.o, V = this.V;
    const skinT = new T.Color(o.skin), base = B.skinBase;
    const tint = new T.Color(clamp(skinT.r / base.r, 0, 1.25), clamp(skinT.g / base.g, 0, 1.25), clamp(skinT.b / base.b, 0, 1.25));
    this.skinTint = tint;
    const cache = new Map();
    this.sc.traverse(m => {
      if (!m.isMesh) return;
      const role = (B.meshes.find(x => x.name === m.name) || m).userData.role || 'other';
      m.userData.role = role;
      const src = Array.isArray(m.material) ? m.material : [m.material];
      const mats = src.map(mt => {
        if (cache.has(mt)) return cache.get(mt);
        const c = mt.clone(); cache.set(mt, c); this.allMats.push(c);
        if (c.isOutline) this.outlines.push(c);
        const isOl = !!c.isOutline;
        if (role === 'face' || role === 'body') {
          if (role === 'body' && !isOl) { c.map = VRMKit.solid('#' + base.getHexString(T.SRGBColorSpace)); c.shadeMultiplyTexture = c.map; c.normalMap = null; }
          if (c.color) c.color.multiply(tint);
          if (c.shadeColorFactor) c.shadeColorFactor.multiply(tint);
          if (isOl && c.outlineColorFactor) c.outlineColorFactor.copy(new T.Color(o.skin).multiplyScalar(0.35));
        } else if (role === 'hair' && !isOl) {
          if (V.hairColor) { c.map = VRMKit.recolor(c.map, V.hairColor, B.key + c.name, { gain: V.hairGain }); c.shadeMultiplyTexture = c.map; if (c.color) c.color.setRGB(1, 1, 1); if (c.shadeColorFactor) c.shadeColorFactor.set(new T.Color(V.hairColor).lerp(new T.Color('#5a5070'), 0.25).multiplyScalar(0.62).addScalar(0.18)); }
        } else if (role === 'iris' && !isOl) {
          if (V.eyeColor) { c.map = VRMKit.recolor(c.map, V.eyeColor, B.key + c.name, { gain: 0.8, contrast: 1.1, noHi: true }); c.shadeMultiplyTexture = c.map; }
        } else if (role === 'brow' && !isOl) {
          if (V.browColor) { c.map = VRMKit.recolor(c.map, V.browColor, B.key + c.name, { gain: 0.9 }); c.shadeMultiplyTexture = c.map; }
        }
        if (c.emissive) c.emissive.set(0, 0, 0);
        c.needsUpdate = true;
        return c;
      });
      m.material = Array.isArray(m.material) ? mats : mats[0];
      this.meshes.push(m);
    });
  }
  // ---- saç: kendi saçı ya da başka modelden nakil; ya da kel ----
  setupHair() {
    const B = this.B, V = this.V;
    this.hairMeshes = []; this.hairDonor = null;
    const own = []; this.sc.traverse(m => { if (m.isMesh && m.userData.role === 'hair') own.push(m); });
    if (V.hair === 'none' || (V.hair && V.hair !== B.key)) { for (const m of own) m.visible = false; this.ownHairHidden = true; }
    else { this.hairMeshes = own; return; }
    if (V.hair === 'none') return;
    const D = VRMKit.bases[V.hair]; if (!D) return;
    this.hairDonor = D;
    const headI = this.raw.head;
    // donör ile hedefin şablon yönü farklıysa (VRM0 -Z, VRM1 +Z) insan kemiklerine 180° döndürülmüş vekil kemik
    // vekil kemik: donör kemiğinin dinlenme yönünü (yüz +Z çerçevesinde) hedef kemiğin üzerine taşır
    this.proxies = new Map();
    const FQ = f => f < 0 ? new T.Quaternion().setFromAxisAngle(V3(0, 1, 0), Math.PI) : new T.Quaternion();
    const proxy = name => {
      const hn = D.humanOf[name]; if (!hn) return null; const tb = this.raw[hn]; if (!tb) return null;
      if (!this.proxies.has(hn)) {
        const ht = B.scene.getObjectByName(B.human[hn]).getWorldQuaternion(new T.Quaternion()), hd = D.scene.getObjectByName(name).getWorldQuaternion(new T.Quaternion());
        const g = new T.Bone(); g.name = 'proxy_' + hn;
        g.quaternion.copy(ht.invert().multiply(FQ(B.F)).multiply(FQ(D.F).invert()).multiply(hd));
        tb.add(g); g.updateMatrix(); this.proxies.set(hn, g);
      }
      return this.proxies.get(hn);
    };
    this.donorProxy = proxy;
    // donör saç kemiklerini kopyala, bu karakterin kafasına tak
    this.donorBones = new Map();
    for (const rn of D.hairRoots) {
      const src = D.scene.getObjectByName(rn); if (!src) continue;
      const cp = src.clone(true);
      // donör kafasına göre yerel dönüşüm: kökün ebeveyni kafa değilse kafaya göre hesapla
      const dh = D.scene.getObjectByName(D.human.head); const m = new T.Matrix4().copy(dh.matrixWorld).invert().multiply(src.matrixWorld);
      m.decompose(cp.position, cp.quaternion, cp.scale);
      (proxy(D.human.head) || headI).add(cp); cp.traverse(n => { n.matrixAutoUpdate = true; n.updateMatrix(); this.donorBones.set(n.name, n); });
    }
    // saç mesh'leri: donör geometrisi, bu karakterin kemiklerine bağlı yeni iskelet
    const findBone = n => this.donorBones.get(n) || proxy(n) || this.nodes.get(n);
    // kafa farkı: donör kafa boyu / hedef kafa boyu
    const hs = (B.head.size.x / D.head.size.x + B.head.size.z / D.head.size.z) / 2;
    for (const [n, b] of this.donorBones) if (D.hairRoots.includes(n)) { b.scale.setScalar(hs); b.updateMatrix(); }
    for (const dm of D.meshes) {
      if (dm.userData.role !== 'hair' || !dm.isSkinnedMesh) continue;
      const bones = dm.skeleton.bones.map(b => findBone(b.name) || this.raw.head);
      // kafa dışındaki insan kemiklerine (boyun/göğüs) bağlı ağırlıkları kafaya yönlendirmek yerine aynen bırak
      const inv = dm.skeleton.bones.map((b, i) => {
        // donör kemik dinlenme matrisinin tersi; kafa ölçeği farkı için kafa bazlı düzeltme
        return dm.skeleton.boneInverses[i].clone();
      });
      const mats = (Array.isArray(dm.material) ? dm.material : [dm.material]).map(mt => {
        const c = mt.clone(); this.allMats.push(c); if (c.isOutline) this.outlines.push(c);
        if (!c.isOutline && this.V.hairColor) { c.map = VRMKit.recolor(c.map, this.V.hairColor, D.key + c.name, { gain: this.V.hairGain }); c.shadeMultiplyTexture = c.map; if (c.color) c.color.setRGB(1, 1, 1); if (c.shadeColorFactor) c.shadeColorFactor.set(new T.Color(this.V.hairColor).lerp(new T.Color('#5a5070'), 0.25).multiplyScalar(0.62).addScalar(0.18)); }
        if (c.emissive) c.emissive.set(0, 0, 0);
        return c;
      });
      const me = new T.SkinnedMesh(dm.geometry, Array.isArray(dm.material) ? mats : mats[0]);
      me.name = 'xhair_' + dm.name; me.userData.role = 'hair';
      // donör mesh'in sahnedeki yerel dönüşümü
      me.position.copy(dm.position); me.quaternion.copy(dm.quaternion); me.scale.copy(dm.scale);
      me.castShadow = true;
      this.sc.add(me);
      me.bind(new T.Skeleton(bones, inv), dm.bindMatrix.clone());
      // donör kafa konumundan hedef kafa konumuna taşı: kafa kemiği dışında kalan köşeler için bindMatrix ile ofset
      this.hairMeshes.push(me); this.meshes.push(me);
    }
    this.hairShift = { donorHead: D.bp.head.clone(), headScale: hs };
  }
  // ---- kıyafetler ----
  setupGarments() {
    const B = this.B, V = this.V, child = (this.o.child || 0) > 0.4;
    const list = V.garments || [];
    // kıyafet iskeleti: vücut kemikleri (+ pelerin kemiği)
    const bones = B.skelNames.map(n => this.nodes.get(n));
    const inv = B.skelInv.slice();
    let capeIdx = -1;
    if (list.some(g => g.t === 'cape')) {
      const uc = this.raw.upperChest, cb = this.capeBone = new T.Bone(); cb.name = 'J_Cape';
      const ch = B.dims.chest, top = lerp(B.bp.upperChest.y, B.bp.neck.y, 0.75);
      const wp = V3(0, top, (ch.zb - 0.035) * B.F);
      // dinlenme konumu: üst göğüs kemiğine göre
      const ucw = this.B.scene.getObjectByName(B.human.upperChest).matrixWorld;
      const lp = wp.clone().applyMatrix4(ucw.clone().invert()); cb.position.copy(lp);
      // kemik ekseni: yüz +Z model çerçevesi (x ekseninde dönünce pelerin arkaya kalkar)
      const ucq = new T.Quaternion(); ucw.decompose(V3(), ucq, V3());
      const cq = this.capeQ = ucq.invert().multiply(B.F < 0 ? new T.Quaternion().setFromAxisAngle(V3(0, 1, 0), Math.PI) : new T.Quaternion());
      cb.quaternion.copy(cq); uc.add(cb);
      bones.push(cb); inv.push(ucw.clone().multiply(new T.Matrix4().compose(lp, cq, V3(1, 1, 1))).invert()); capeIdx = bones.length - 1;
    }
    this.gSkel = new T.Skeleton(bones, inv);
    const covered = { shirt: list.some(g => g.t === 'vest' || g.t === 'armor'), pants: false };
    for (const spec of list) {
      const geo = spec.t === 'cape' ? Garments.cape(B, spec, capeIdx) : Garments.build(B, spec, child);
      if (!geo || !geo.index || !geo.index.count) continue;
      const g2 = geo.clone(); // grup eklemek için paylaşılan geometriyi bozma
      const mats = VMAT.make(B, spec.c || '#7a6a55', { tex: spec.tex || (spec.t === 'boots' || spec.t === 'shoes' ? 'leather' : spec.t === 'armor' || spec.t === 'bracers' ? 'metal' : 'linen'), double: spec.t === 'skirt' || spec.t === 'cape', rim: spec.t === 'armor' || spec.t === 'bracers' ? '#5a6070' : null, shade: spec.shade, olw: spec.t === 'skirt' || spec.t === 'cape' ? 0.8 : 1, repeat: spec.t === 'skirt' || spec.t === 'cape' ? 1 : 3 });
      if (covered[spec.t]) mats.length = 1;
      for (const m of mats) { this.allMats.push(m); if (m.isOutline) this.outlines.push(m); }
      const me = VMAT.mesh(g2, mats, true); me.name = 'garment_' + spec.t;
      this.sc.add(me); me.bind(this.gSkel, new T.Matrix4());
      this.garments.push(me); this.meshes.push(me);
    }
  }
  // ---- yay kemikleri ----
  setupSprings() {
    const B = this.B;
    const mgr = this.springs = new VRMLib.VRMSpringBoneManager();
    const colCache = new Map(), ws = this.k * (this.o.scale || 1);
    const underHead = n => { let o = n; while (o) { if (o === this.raw.head) return true; o = o.parent; } return false; };
    const scaled = (shape, f) => { const c = Object.assign(Object.create(Object.getPrototypeOf(shape)), shape); if (c.radius !== undefined) c.radius = shape.radius * f; return c; };
    const mkGroups = (Bsrc, find) => (Bsrc.colGroups || []).map(cols => ({ colliders: cols.map(c => { const p = find(c.parent); if (!p) return null; const k = p.uuid + '|' + c.pos.toArray().join(',') + '|' + (c.shape.radius || 0); if (colCache.has(k)) return colCache.get(k); const co = new VRMLib.VRMSpringBoneCollider(scaled(c.shape, ws * (underHead(p) ? this.headK : 1))); co.position.copy(c.pos); co.quaternion.copy(c.q); p.add(co); colCache.set(k, co); return co; }).filter(Boolean), name: '' }));
    const add = (Bsrc, find, filter) => {
      const groups = mkGroups(Bsrc, find);
      for (const s of Bsrc.springs) {
        if (!filter(s)) continue;
        const bone = find(s.bone); if (!bone) continue;
        const child = s.child ? find(s.child) : null;
        const j = new VRMLib.VRMSpringBoneJoint(bone, child, Object.assign({}, s.settings, { gravityDir: s.settings.gravityDir.clone(), hitRadius: (s.settings.hitRadius || 0) * ws * (underHead(bone) ? this.headK : 1) }), s.groups.map(i => groups[i]).filter(Boolean));
        mgr.addJoint(j);
      }
    };
    const own = n => this.nodes.get(n);
    add(B, own, s => !(this.ownHairHidden && B.hairBones.has(s.bone)));
    if (this.hairDonor) { const D = this.hairDonor; add(D, n => this.donorBones.get(n) || this.donorProxy(n) || this.nodes.get(n), s => D.hairBones.has(s.bone)); }
    this.sc.updateMatrixWorld(true);
    mgr.setInitState();
    this.springOn = mgr.joints.size > 0 && !location.hash.includes('nospring');
  }
  mat(key) {
    if (!this.mats) this.mats = {};
    if (!this.mats[key]) { const [hex, flag] = key.split('|'); const m = TOON.mat(hex, flag === '2' ? { side: T.DoubleSide } : {}); this.mats[key] = m; this.allMats.push(m); }
    return this.mats[key];
  }
  // ---- aksesuarlar (eski 'extras' adlarıyla) ----
  addExtra(ex) {
    const type = typeof ex === 'string' ? ex : ex.t, c = ex.c || '#555';
    const parts = type === 'armor' ? ['pauldronL', 'pauldronR'] : type === 'belt' ? ['belt', 'buckle'] : type === 'sheath' ? ['sheath', 'hilt'] : type === 'trim' ? ['collar'] : type === 'necklace' ? ['necklace', 'gem'] : type === 'satchel' ? ['satchel', 'strap'] : [type];
    for (const p of parts) {
      let d, bone;
      if (p === 'pauldronL' || p === 'pauldronR') { d = VACC.geo('pauldron', this.B, ex); bone = this.raw[p === 'pauldronL' ? 'leftUpperArm' : 'rightUpperArm']; d.at = V3(p === 'pauldronL' ? 0.03 : -0.03, 0.035, 0); }
      else { d = VACC.geo(p, this.B, ex); if (!d) continue; bone = this.raw[d.bone]; }
      if (!bone) continue;
      const col = p === 'buckle' ? (ex.buckle || '#b89a5a') : p === 'hilt' ? '#c9a85a' : p === 'gem' ? '#7fd0ff' : p.startsWith('pauldron') ? (ex.c || '#b8bec8') : d.mat === 'hair' ? (this.V.hairColor || this.o.hair) : c;
      const mats = VMAT.make(this.B, col, { tex: d.mat === 'metal' ? 'metal' : d.mat === 'leather' ? 'leather' : d.mat === 'gem' ? null : d.mat === 'hair' ? 'wool' : 'linen', rim: d.mat === 'metal' || d.mat === 'gem' ? '#6a7080' : null, double: d.double, repeat: 1 });
      for (const m of mats) { this.allMats.push(m); if (m.isOutline) this.outlines.push(m); }
      const me = VMAT.mesh(d.g, mats, false); me.castShadow = true;
      // kemiğe göre yerleşim: konumlar model uzayında (dinlenme), kemik yerel uzayına çevir
      const g = new T.Group(); bone.add(g);
      const bw = this.B.scene.getObjectByName(bone.name);
      const bq = (bw ? bw : bone).getWorldQuaternion(new T.Quaternion());
      g.quaternion.copy(bq.invert());
      g.position.copy(V3(d.at.x * this.B.F, d.at.y, d.at.z * this.B.F).applyQuaternion(g.quaternion));
      if (this.B.F < 0) g.quaternion.multiply(new T.Quaternion().setFromAxisAngle(V3(0, 1, 0), Math.PI));
      g.add(me);
      if (this.headK !== 1 && d.bone === 'head') { /* kafa ölçeği kemikten miras alınır */ }
      this.meshes.push(me);
      if (type === 'bandage') this.bandage = g;
    }
  }
  setExpression(e) { this.expr = e || 'neutral'; }
  faceTexFor() { return null; }
  // ---- yüz: göz kırpma, konuşma, ifade ----
  updateFace(dt) {
    this.blinkT -= dt;
    const want = { happy: 0, angry: 0, sad: 0, surprised: 0, relaxed: 0 };
    switch (this.expr) {
      case 'smile': want.happy = 0.55; break;
      case 'happy': want.happy = 1; break;
      case 'angry': want.angry = 0.85; break;
      case 'sad': want.sad = 0.85; break;
      case 'pain': want.sad = 0.55; want.angry = 0.35; break;
      case 'surprised': want.surprised = 0.85; break;
      case 'relaxed': want.relaxed = 0.7; break;
    }
    for (const k in want) this.exprW[k] = damp(this.exprW[k] || 0, want[k], 8, dt);
    let blink = 0;
    if (this.closedEyes) blink = 1; else if (this.blinkT < 0.13 && this.blinkT > 0) blink = Math.sin((0.13 - this.blinkT) / 0.13 * Math.PI);
    if (this.blinkT < 0) this.blinkT = frand(2, 5.5);
    if (this.expr === 'pain') blink = Math.max(blink, 0.45);
    blink *= 1 - clamp((this.exprW.happy || 0) * 1.4, 0, 1) * (this.closedEyes ? 0 : 1);
    this.blinkW = this.closedEyes ? 1 : blink;
    let aa = 0, oh = 0, ih = 0;
    if (this.talking) { this.talkT += dt; const t = this.talkT; const v = Math.max(0, Math.sin(t * 13) * 0.6 + Math.sin(t * 7.3) * 0.4); aa = v * 0.75; oh = Math.max(0, Math.sin(t * 5.1)) * 0.3 * v; ih = Math.max(0, Math.sin(t * 3.7 + 1)) * 0.25; }
    this.mouthW = damp(this.mouthW, aa, 20, dt);
    // uygula
    const em = this.exprMap, touched = this._touched || (this._touched = new Set());
    for (const m of touched) m.morphTargetInfluences.fill(0);
    const put = (name, w) => { if (w <= 0.001) return; const l = em[name]; if (!l) return; for (const b of l) { b.mesh.morphTargetInfluences[b.index] += b.weight * w * (b.weight > 1.5 ? 0.01 : 1); touched.add(b.mesh); } };
    for (const k in want) put(k, this.exprW[k]);
    put('blink', this.blinkW); put('aa', this.mouthW); put('oh', oh); put('ih', ih * (this.talking ? 1 : 0));
    // uzakta kontur kapalı
    if (G.camera && (this._olT = (this._olT || 0) + dt) > 0.4) { this._olT = 0; const far = G.camera.position.distanceTo(this.root.getWorldPosition(_v3a)) > 30; if (far === this.olVis) { this.olVis = !far; for (const m of this.outlines) m.visible = !far; } }
  }
  flash(color = '#ffffff', t = 0.12) { this.flashT = t; for (const m of this.allMats) if (m.emissive) m.emissive.set(color).multiplyScalar(0.6); }
  // normalleştirilmiş kemiğe model uzayında (yüz +Z) dönüş ver
  // (three-vrm, VRM0 modellerinin normalize iskeletini de yüz +Z kuralına çevirir)
  setN(name, q) { const n = this.nb[name]; if (n) n.quaternion.copy(q); }
  apply(P, dt, speed) {
    const r = this.hipRatio;
    this.pivot.rotation.set(P.roll, 0, P.rollZ);
    this.pivot.position.y = this.PV + P.lift * r;
    this.body.position.y = -this.PV + P.bob * r;
    const E = (x, y, z) => _q1.setFromEuler(_e1.set(x, y, z, 'XYZ'));
    this.setN('hips', E(0, P.hipY, 0));
    const qs = E(P.spX, P.spY, P.spZ).clone();
    this.setN('spine', _q2.slerpQuaternions(_qI, qs, 0.42)); this.setN('chest', _q2.slerpQuaternions(_qI, qs, 0.3)); this.setN('upperChest', _q2.slerpQuaternions(_qI, qs, 0.28));
    const qh = E(P.hdX, P.hdY, P.hdZ).clone();
    this.setN('neck', _q2.slerpQuaternions(_qI, qh, 0.35)); this.setN('head', _q2.slerpQuaternions(_qI, qh, 0.65));
    // kollar: T-pozdan aşağı sarkan kola, sonra eski poz açıları
    this.setN('leftUpperArm', E(P.shLx, P.shLy, P.shLz).multiply(R2D_L));
    this.setN('rightUpperArm', E(P.shRx, P.shRy, P.shRz).multiply(R2D_R));
    this.setN('leftLowerArm', _q2.copy(R2D_Li).multiply(E(P.elL, 0, 0)).multiply(R2D_L));
    this.setN('rightLowerArm', _q2.copy(R2D_Ri).multiply(E(P.elR, 0, 0)).multiply(R2D_R));
    // bilekler hafif içe
    this.setN('leftHand', E(0, 0, -0.08)); this.setN('rightHand', E(0, 0, 0.08));
    // bacaklar
    this.setN('leftUpperLeg', E(P.lgLx, 0, P.lgLz)); this.setN('rightUpperLeg', E(P.lgRx, 0, P.lgRz));
    this.setN('leftLowerLeg', E(P.knL, 0, 0)); this.setN('rightLowerLeg', E(P.knR, 0, 0));
    // ayak: yere paralel kalmaya çalışsın (oturma/çömelmede)
    const fl = -(P.lgLx + P.knL) * 0.35, fr = -(P.lgRx + P.knR) * 0.35;
    this.setN('leftFoot', E(clamp(fl, -0.6, 0.6), 0, 0)); this.setN('rightFoot', E(clamp(fr, -0.6, 0.6), 0, 0));
    // parmaklar: gevşek / yumruk / tutuş
    const an = this.act ? this.act.name : '';
    const fistW = (this.stanceName === 'fight' || /^(jab|cross|hook)$/.test(an)) ? 1 : 0;
    this.fist = damp(this.fist, fistW, 10, dt);
    const gripR = this.weapon ? 1 : this.fist, gripL = this.fist;
    for (const side of ['left', 'right']) {
      const g = side === 'left' ? gripL : gripR, s = side === 'left' ? -1 : 1;
      const base = lerp(0.22, 1.35, g);
      for (const f of FINGERS) for (let i = 0; i < 3; i++) { const nm = side + f + PHAL[i]; if (this.nb[nm]) this.setN(nm, E(0, 0, s * base * (i === 0 ? 0.8 : 1) * (1 + FINGERS.indexOf(f) * 0.06))); }
      const th = side + 'ThumbProximal', thd = side + 'ThumbDistal', thm = side + 'ThumbMetacarpal';
      if (this.nb[thm]) this.setN(thm, E(0, -s * lerp(0.15, 0.55, g), s * lerp(0.05, 0.3, g)));
      if (this.nb[th]) this.setN(th, E(0, -s * lerp(0.1, 0.5, g), 0));
      if (this.nb[thd]) this.setN(thd, E(0, -s * lerp(0.1, 0.6, g), 0));
    }
    // gözler: bakış hedefine doğru
    if (this.nb.leftEye && this.lookTarget) {
      const lt = this.lookTarget.isVector3 ? this.lookTarget : this.lookTarget.getWorldPosition ? this.lookTarget.getWorldPosition(_v1) : null;
      if (lt) { const hp = this.raw.head.getWorldPosition(V3()); const lp = lt.clone(); if (!this.lookTarget.isVector3) lp.y += 1.4 * (this.lookTarget.scale ? this.lookTarget.scale.x : 1); const ya = Math.atan2(lp.x - hp.x, lp.z - hp.z) - this.root.rotation.y - this.lookYaw * 0.75 - P.hdY * 0; const dy = Math.atan2(lp.y - hp.y, Math.hypot(lp.x - hp.x, lp.z - hp.z)); this.eyeYaw = damp(this.eyeYaw, clamp(angDiff(0, ya) - P.hdY, -0.35, 0.35), 10, dt); this.eyePitch = damp(this.eyePitch, clamp(dy + P.hdX, -0.25, 0.25), 10, dt); }
    } else { this.eyeYaw = damp(this.eyeYaw, 0, 6, dt); this.eyePitch = damp(this.eyePitch, 0, 6, dt); }
    if (this.nb.leftEye) { const qe = E(-this.eyePitch * 0.6, this.eyeYaw * 0.7, 0); this.setN('leftEye', qe); this.setN('rightEye', qe); }
    this.hum.update();
    // pelerin
    if (this.capeBone) { this.capeSwing = damp(this.capeSwing, -Math.min(speed, 5) * 0.11 - 0.03, 4, dt); const a = -(this.capeSwing + Math.sin(G.t * 2.3) * 0.025) + P.spX * 0.6; this.capeBone.quaternion.copy(this.capeQ).multiply(_q2.setFromAxisAngle(_xAx, a)); }
    // yay fiziği: yalnızca kameraya yakınken
    if (this.springOn) {
      const near = !G.camera || G.camera.position.distanceTo(this.root.position) < 26;
      if (near) { if (!this._springWas) { this.sc.updateMatrixWorld(true); this.springs.reset(); } this.springs.update(Math.min(dt, 1 / 30)); }
      this._springWas = near;
    }
  }
  dispose() {
    for (const m of this.allMats) m.dispose();
    for (const m of this.garments) m.geometry.dispose();
    if (this.gSkel) this.gSkel.dispose();
    this.sc.traverse(m => { if (m.isSkinnedMesh && m.skeleton && m.skeleton !== this.gSkel) m.skeleton.dispose(); });
  }
}

// ---- Eski görünüm tanımından VRM tanımına çeviri ----
// o.vrm ile elle de verilebilir: { base, hair, hairColor, eyeColor, garments:[...], acc:[...] }
const VRM_HAIR = {
  m: ['messy', 'spiky', 'short', 'slick'], fa: ['bob', 'curly', 'bun'], fg: ['long', 'braid', 'ponytail', 'tied'], fb: ['twin'],
};
function vrmSpecFor(o) {
  const v = Object.assign({}, o.vrm || {});
  const fem = !!o.female;
  const hsh = hash2(((o.shirt || '') + (o.hair || '') + (o.pants || '') + (o.skin || '')).split('').reduce((a, c) => a + c.charCodeAt(0) * 31, 7) % 997, 3.7);
  if (!v.base) v.base = fem ? ['fa', 'fg'][Math.floor(hsh * 2) % 2] : 'm';
  if (v.hair === undefined) {
    const st = o.hairStyle || 'short';
    if (st === 'bald' || st === 'baldRing') v.hair = 'none';
    else if (!fem && (st === 'curly')) v.hair = 'fa';
    else if (!fem) v.hair = 'm';
    else { let d = 'fg'; for (const k in VRM_HAIR) if (VRM_HAIR[k].includes(st)) d = k; v.hair = d === 'm' ? 'fa' : d; }
  }
  // saç nakli yalnızca aynı tür modeller arasında (VRM0 <-> VRM0); VRM1 (ft) yalnızca kendi saçını kullanır
  if (v.hair && v.hair !== 'none' && VRMKit.bases[v.hair] && VRMKit.bases[v.base] && VRMKit.bases[v.hair].vrm0 !== VRMKit.bases[v.base].vrm0) v.hair = v.base;
  if (v.hairColor === undefined) v.hairColor = o.hair;
  if (v.eyeColor === undefined) v.eyeColor = o.eyes || '#4a3424';
  if (v.browColor === undefined) v.browColor = shade(o.hair || '#3a2a1c', 0.8);
  if (v.wide === undefined && o.wide) v.wide = o.wide;
  if (!v.garments) {
    const gs = [], ex = (o.extras || []).map(e => typeof e === 'string' ? { t: e } : e), has = t => ex.find(e => e.t === t);
    const longDress = has('dress') && (!has('dress').len || has('dress').len > 0.75) || has('robe');
    const sl = o.sleeves === 'none' ? 'none' : o.sleeves === 'long' ? 'long' : 'short';
    const armor = has('armor');
    if (!longDress || has('dress')) gs.push({ t: 'shirt', c: o.shirt, sleeves: sl });
    if (!fem && !longDress && !has('coat') && !armor) gs.push({ t: 'skirt', c: o.shirt, len: 'tunic', from: 'hips', flare: 0.035, follow: 0.85 });
    if (!longDress) gs.push({ t: 'pants', c: o.pants, boots: !!o.boots });
    gs.push({ t: o.boots ? 'boots' : 'shoes', c: o.shoes || '#3a2b20', high: !!armor });
    if (has('vest')) gs.push({ t: 'vest', c: has('vest').c, tex: 'leather' });
    if (armor) gs.push({ t: 'armor', c: armor.c || '#b8bec8', tex: 'metal' });
    if (has('dress')) { const d = has('dress'); gs.push({ t: 'skirt', c: d.c, len: d.len && d.len < 0.75 ? 'knee' : 'ankle', from: 'waist', flare: 0.09 }); }
    if (has('robe')) { gs.push({ t: 'shirt', c: has('robe').c, sleeves: 'long' }); gs.push({ t: 'skirt', c: has('robe').c, len: 'floor', from: 'waist', flare: 0.1 }); }
    if (has('skirtShort')) gs.push({ t: 'skirt', c: has('skirtShort').c, len: 'thigh', from: 'waist', flare: 0.06 });
    if (has('coat')) gs.push({ t: 'skirt', c: has('coat').c, len: 'knee', from: 'waist', open: 'front', flare: 0.07 }), gs.push({ t: 'vest', c: has('coat').c, open: true, tex: 'velvet', thick: 0.012 });
    if (has('apron')) gs.push({ t: 'skirt', c: has('apron').c, len: 'knee', from: 'waist', open: 'apron', flare: 0.02, loose: 0.02 });
    if (has('cape')) gs.push({ t: 'cape', c: has('cape').c, len: has('cape').len });
    v.garments = gs;
    const accMap = { belt: 1, trim: 1, hoodDown: 1, hood: 1, hat: 1, cap: 1, scarf: 1, satchel: 1, sheath: 1, quiver: 1, bowBack: 1, circlet: 1, necklace: 1, bandage: 1, sash: 1, armor: 1, helmet: 1, headscarf: 1 };
    v.acc = ex.filter(e => accMap[e.t]).map(e => Object.assign({}, e));
    if (o.hairStyle === 'baldRing') v.acc.push({ t: 'baldRing', c: o.hair });
    if (has('cape') && has('cape').collar) v.acc.push({ t: 'trim', c: has('cape').collar });
  }
  if (v.extraAcc) v.acc = (v.acc || []).concat(v.extraAcc);
  return v;
}
// Karakter üretici: VRM hazırsa anime model, değilse eski prosedürel model
function makeHumanoid(look) {
  if (VRMKit.ready && !(look && look.noVRM)) { try { return new VRMHumanoid(look || {}); } catch (e) { console.error('VRM karakter hatası', e); } }
  return new Humanoid(look || {});
}
