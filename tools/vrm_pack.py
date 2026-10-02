# VRM paketleyici: orijinal kıyafetleri atar, dokuları küçültür (WebP), ikili veriyi sıkıştırır.
# Kullanım: python3 tools/vrm_pack.py girdi.vrm çıktı.vrm
import sys, json, struct, io, re
from PIL import Image

def read_glb(path):
    b = open(path, 'rb').read()
    assert b[:4] == b'glTF'
    jl = struct.unpack('<I', b[12:16])[0]
    j = json.loads(b[20:20 + jl])
    off = 20 + jl
    bl = struct.unpack('<I', b[off:off + 4])[0]
    return j, b[off + 8:off + 8 + bl]

def write_glb(path, j, binb):
    js = json.dumps(j, separators=(',', ':'), ensure_ascii=False).encode('utf8')
    js += b' ' * ((4 - len(js) % 4) % 4)
    binb += b'\0' * ((4 - len(binb) % 4) % 4)
    total = 12 + 8 + len(js) + 8 + len(binb)
    out = b'glTF' + struct.pack('<II', 2, total) + struct.pack('<I', len(js)) + b'JSON' + js + struct.pack('<I', len(binb)) + b'BIN\0' + binb
    open(path, 'wb').write(out)

CLOTH = re.compile(r'(Tops|Bottoms|Shoes|Accessory)', re.I)

def main(src, dst):
    j, binb = read_glb(src)
    mats = j['materials']
    cloth_mats = {i for i, m in enumerate(mats) if CLOTH.search(m.get('name', ''))}
    # 1) kıyafet primitive'lerini at; yalnızca kıyafetten oluşan mesh'leri düğümlerden ayır
    for mi, mesh in enumerate(j['meshes']):
        keep = [p for p in mesh['primitives'] if p.get('material') not in cloth_mats]
        if keep:
            mesh['primitives'] = keep
        else:
            mesh['primitives'] = mesh['primitives'][:1]
            mesh['_drop'] = True
    for n in j['nodes']:
        if 'mesh' in n and j['meshes'][n['mesh']].get('_drop'):
            del n['mesh']
            n.pop('skin', None)
    for mesh in j['meshes']:
        mesh.pop('_drop', None)
    # 1b) yalnızca ifadelerin kullandığı morph target'ları tut; morph normal/tangent ve TANGENT'ı at
    ext = j.get('extensions', {})
    used_t = {}  # mesh -> set(index)
    binds = []
    if 'VRM' in ext:
        for g in ext['VRM'].get('blendShapeMaster', {}).get('blendShapeGroups', []):
            for bd in g.get('binds', []): binds.append((bd, bd['mesh'], 'index')); used_t.setdefault(bd['mesh'], set()).add(bd['index'])
    if 'VRMC_vrm' in ext:
        ex = ext['VRMC_vrm'].get('expressions', {})
        for grp in ('preset', 'custom'):
            for name, e in ex.get(grp, {}).items():
                for bd in e.get('morphTargetBinds', []):
                    mi = j['nodes'][bd['node']]['mesh']
                    binds.append((bd, mi, 'index')); used_t.setdefault(mi, set()).add(bd['index'])
    tmap = {}
    for mi, mesh in enumerate(j['meshes']):
        keep = sorted(used_t.get(mi, set()))
        tmap[mi] = {o: n for n, o in enumerate(keep)}
        for p in mesh['primitives']:
            if 'targets' in p:
                p['targets'] = [{k: v for k, v in p['targets'][o].items() if k == 'POSITION'} for o in keep]
                if not p['targets']: del p['targets']
            p['attributes'].pop('TANGENT', None)
        ex_ = mesh.get('extras', {})
        if 'targetNames' in ex_: ex_['targetNames'] = [ex_['targetNames'][o] for o in keep if o < len(ex_['targetNames'])]
        if 'weights' in mesh: mesh['weights'] = [mesh['weights'][o] for o in keep if o < len(mesh['weights'])]
        for p in mesh['primitives']:
            if 'extras' in p and 'targetNames' in p['extras']: p['extras']['targetNames'] = [p['extras']['targetNames'][o] for o in keep if o < len(p['extras']['targetNames'])]
    for bd, mi, k in binds: bd[k] = tmap[mi][bd[k]]
    # 2) doku rollerini bul: hangi resim neye kullanılıyor
    tex_src = [t['source'] for t in j['textures']]
    role = {}
    def mark(ti, r):
        if ti is None: return
        im = tex_src[ti]
        prev = role.get(im)
        order = ['main', 'shade', 'emit', 'normal', 'outline', 'matcap', 'cloth', 'thumb']
        if prev is None or order.index(r) < order.index(prev): role[im] = r
    ext = j.get('extensions', {})
    if 'VRM' in ext:
        for mi, mp in enumerate(ext['VRM']['materialProperties']):
            tp = mp.get('textureProperties', {})
            isc = CLOTH.search(mp.get('name', '')) is not None
            for k, v in tp.items():
                r = {'_MainTex': 'main', '_ShadeTexture': 'shade', '_BumpMap': 'normal', '_SphereAdd': 'matcap', '_EmissionMap': 'emit', '_OutlineWidthTexture': 'outline'}.get(k, 'emit')
                mark(v, 'cloth' if isc else r)
        th = ext['VRM'].get('meta', {}).get('texture')
        if th is not None and th >= 0: role[tex_src[th]] = 'thumb'
    if 'VRMC_vrm' in ext:
        th = ext['VRMC_vrm'].get('meta', {}).get('thumbnailImage')
        if th is not None: role[th] = 'thumb'
    for mi, m in enumerate(mats):
        isc = mi in cloth_mats
        pbr = m.get('pbrMetallicRoughness', {})
        if 'baseColorTexture' in pbr: mark(pbr['baseColorTexture']['index'], 'cloth' if isc else 'main')
        if 'normalTexture' in m: mark(m['normalTexture']['index'], 'normal')
        if 'emissiveTexture' in m: mark(m['emissiveTexture']['index'], 'emit')
        for k, v in m.get('extensions', {}).get('VRMC_materials_mtoon', {}).items():
            if isinstance(v, dict) and 'index' in v:
                r = 'shade' if 'shade' in k else 'outline' if 'outline' in k else 'matcap' if 'matcap' in k or 'rim' in k.lower() else 'emit'
                mark(v['index'], 'cloth' if isc else r)
    # 3) resimleri yeniden kodla
    bvs = j['bufferViews']
    new_imgs = {}
    for ii, im in enumerate(j['images']):
        bv = bvs[im['bufferView']]
        data = binb[bv.get('byteOffset', 0):bv.get('byteOffset', 0) + bv['byteLength']]
        I = Image.open(io.BytesIO(data)).convert('RGBA')
        r = role.get(ii, 'emit')
        name = im.get('name', '')
        w = I.size[0]
        if r in ('thumb', 'cloth', 'normal'): tgt = 4
        elif r == 'matcap': tgt = min(w, 128)
        elif r == 'outline': tgt = min(w, 64)
        elif re.search(r'Body', name): tgt = min(w, 1024)
        elif re.search(r'Face_00|^Face$', name): tgt = min(w, 1024)
        elif re.search(r'Eye|Brow|Mouth|Lash', name): tgt = min(w, 512)
        elif re.search(r'Hair', name): tgt = min(w, 512)
        else: tgt = min(w, 512)
        if tgt != w: I = I.resize((tgt, max(1, round(I.size[1] * tgt / w))), Image.LANCZOS)
        if r == 'normal':
            I = Image.new('RGBA', (4, 4), (128, 128, 255, 255))
        elif r in ('thumb', 'cloth'):
            I = Image.new('RGBA', (4, 4), (200, 200, 200, 255))
        buf = io.BytesIO()
        alpha = I.getchannel('A').getextrema()[0] < 255
        I.save(buf, 'WEBP', quality=88 if re.search(r'Face|Eye|Brow|Lash|Mouth', name) else 82, method=6, exact=alpha)
        new_imgs[ii] = buf.getvalue()
    # 4) kullanılan accessor'ları topla
    used_acc = set()
    for mesh in j['meshes']:
        for p in mesh['primitives']:
            used_acc.update(p['attributes'].values())
            if 'indices' in p: used_acc.add(p['indices'])
            for t in p.get('targets', []): used_acc.update(t.values())
    for s in j.get('skins', []):
        if 'inverseBindMatrices' in s: used_acc.add(s['inverseBindMatrices'])
    for a in j.get('animations', []):
        for sm in a['samplers']: used_acc.update([sm['input'], sm['output']])
    acc_map = {}
    new_acc = []
    for i, a in enumerate(j['accessors']):
        if i in used_acc:
            acc_map[i] = len(new_acc); new_acc.append(a)
    # 5) yeni ikili veri
    out = bytearray(); new_bvs = []; bv_map = {}
    def push(data, extra):
        while len(out) % 4: out.append(0)
        o = len(out); out.extend(data)
        nb = {'buffer': 0, 'byteOffset': o, 'byteLength': len(data)}
        nb.update(extra); new_bvs.append(nb); return len(new_bvs) - 1
    def remap(bi):
        if bi not in bv_map:
            bv = bvs[bi]; o = bv.get('byteOffset', 0)
            extra = {k: v for k, v in bv.items() if k in ('byteStride', 'target')}
            bv_map[bi] = push(binb[o:o + bv['byteLength']], extra)
        return bv_map[bi]
    for a in new_acc:
        if 'bufferView' in a: a['bufferView'] = remap(a['bufferView'])
        if 'sparse' in a:
            a['sparse']['indices']['bufferView'] = remap(a['sparse']['indices']['bufferView'])
            a['sparse']['values']['bufferView'] = remap(a['sparse']['values']['bufferView'])
    for ii, im in enumerate(j['images']):
        im['bufferView'] = push(new_imgs[ii], {})
        im['mimeType'] = 'image/webp'
    j['accessors'] = new_acc
    j['bufferViews'] = new_bvs
    j['buffers'] = [{'byteLength': len(out)}]
    for mesh in j['meshes']:
        for p in mesh['primitives']:
            p['attributes'] = {k: acc_map[v] for k, v in p['attributes'].items()}
            if 'indices' in p: p['indices'] = acc_map[p['indices']]
            if 'targets' in p: p['targets'] = [{k: acc_map[v] for k, v in t.items()} for t in p['targets']]
    for s in j.get('skins', []):
        if 'inverseBindMatrices' in s: s['inverseBindMatrices'] = acc_map[s['inverseBindMatrices']]
    for a in j.get('animations', []):
        for sm in a['samplers']: sm['input'] = acc_map[sm['input']]; sm['output'] = acc_map[sm['output']]
    write_glb(dst, j, bytes(out))
    print(src, '->', dst, len(out) // 1024, 'KB')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
