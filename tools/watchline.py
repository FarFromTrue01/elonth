# Bir sahneyi otomatik oynatır, belirli bir diyalog/bildirim metni görününce ekran görüntüsü alır.
# Kullanım: python3 tools/watchline.py <sahne> "<metin parçası>" <çıktı.png> [maks_sn] [gecikme_sn]
import sys, asyncio, subprocess, time, os
from playwright.async_api import async_playwright
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AP = open(os.path.join(root, 'tools/autopilot.js')).read()
async def main():
    scene, needle, out = sys.argv[1], sys.argv[2], sys.argv[3]
    maxs = float(sys.argv[4]) if len(sys.argv) > 4 else 400
    delay = float(sys.argv[5]) if len(sys.argv) > 5 else 0.0
    port = os.environ.get('PORT', '8766')
    srv = subprocess.Popen(['python3', '-m', 'http.server', port], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(0.7)
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(executable_path=(os.environ.get('CHROME') or ('/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None)), args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
            pg = await b.new_page(viewport={'width': 1024, 'height': 640})
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'CERT' not in m.text else None)
            await pg.add_init_script("try{localStorage.setItem('elonth.save.v1', JSON.stringify({last:null,unlocked:[],settings:{quality:'low',textSpeed:3,music:0,sfx:0}}))}catch(e){}")
            await pg.goto(f'http://localhost:{port}/index.html#{scene}&auto')
            await pg.wait_for_function('window.__vrmReady !== undefined', timeout=120000)
            await pg.evaluate(f"__G.timeScale = {os.environ.get('TS', '5')}")
            await pg.evaluate(AP)
            t0 = time.time(); hit = False
            while time.time() - t0 < maxs:
                await pg.wait_for_timeout(250)
                txt = await pg.evaluate("(()=>{const d=document.querySelector('#dialog');const t=document.querySelector('#toast');return (d.hidden?'':d.textContent)+' | '+(t&&!t.hidden?t.textContent:'')})()")
                if needle in txt:
                    if delay: await pg.wait_for_timeout(delay * 1000)
                    await pg.screenshot(path=out); hit = True
                    print('BULUNDU', round(time.time() - t0), 's:', txt[:120]); break
            if not hit: print('bulunamadı; sahne:', await pg.evaluate('__Story.current'))
            for e in errs[-8:]: print('[hata]', e[:300])
            await b.close()
    finally:
        srv.terminate()
asyncio.run(main())
