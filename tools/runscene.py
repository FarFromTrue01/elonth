# Bir sahneyi otomatik oynatır: python3 tools/runscene.py <sahne> <maks_sn> <çıktı_önek> [aralık_sn]
import sys, asyncio, subprocess, time, os
from playwright.async_api import async_playwright
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AP = open(os.path.join(root, 'tools/autopilot.js')).read()
async def main():
    scene, maxs, pref = sys.argv[1], float(sys.argv[2]), sys.argv[3]
    every = float(sys.argv[4]) if len(sys.argv) > 4 else 8
    port = os.environ.get('PORT', '8765')
    srv = subprocess.Popen(['python3', '-m', 'http.server', port], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(0.7)
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(executable_path=(os.environ.get('CHROME') or ('/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None)), args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
            pg = await b.new_page(viewport={'width': 1024, 'height': 640})
            logs = []
            pg.on('console', lambda m: logs.append(f'[{m.type}] {m.text}') if m.type in ('error', 'warning', 'log') and 'TUNNEL' not in m.text and 'AudioContext' not in m.text else None)
            pg.on('pageerror', lambda e: logs.append(f'[pageerror] {e}'))
            await pg.add_init_script("try{localStorage.setItem('elonth.save.v1', JSON.stringify({last:null,unlocked:[],settings:{sens:1,music:0.7,sfx:0.9,quality:'low',invertY:false,textSpeed:3}}))}catch(e){}")
            await pg.goto(f'http://localhost:{port}/index.html#{scene}&auto')
            await pg.wait_for_timeout(1500)
            await pg.evaluate(f"__G.timeScale = {os.environ.get('TS', '2')}")
            await pg.evaluate(AP)
            t0 = time.time(); n = 0; last = None
            while time.time() - t0 < maxs:
                await pg.wait_for_timeout(every * 1000)
                n += 1
                cur = await pg.evaluate("__Story.current")
                info = await pg.evaluate("(()=>{const d=document.querySelector('#dialog .dtext');const ri=__G.renderer.info.render;return (document.querySelector('#dialog').hidden?'':d.textContent.slice(0,60))+' | obj:'+document.querySelector('#obj-text').textContent+' | calls '+ri.calls+' tris '+ri.triangles+' actors '+__G.actors.length})()")
                await pg.screenshot(path=f'{pref}{n}.png')
                print(f'{n} t={time.time()-t0:.0f}s scene={cur} {info}')
                if cur != scene: break
            for l in logs[-30:]: print(l)
            await b.close()
    finally:
        srv.terminate()
asyncio.run(main())
