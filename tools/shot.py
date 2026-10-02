# Kullanım: python3 tools/shot.py <hash> <bekleme_sn> <çıktı.png> [js ...]
import sys, asyncio, subprocess, time, os
from playwright.async_api import async_playwright
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
async def main():
    h, wait, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
    js = sys.argv[4:]
    srv = subprocess.Popen(['python3', '-m', 'http.server', str(os.environ.get('PORT','8765'))], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(0.8)
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(executable_path=(os.environ.get('CHROME') or ('/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None)), args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
            pg = await b.new_page(viewport={'width': 1280, 'height': 800})
            logs = []
            pg.on('console', lambda m: logs.append(f'[{m.type}] {m.text}'))
            pg.on('pageerror', lambda e: logs.append(f'[pageerror] {e}'))
            await pg.goto(f'http://localhost:{os.environ.get("PORT","8765")}/index.html#{h}')
            t0 = 0
            for j in js:
                if j.startswith('wait:'):
                    await pg.wait_for_timeout(float(j[5:]) * 1000); continue
                if j.startswith('shot:'):
                    await pg.screenshot(path=j[5:]); continue
                r = await pg.evaluate(j)
                if r is not None: print('eval:', r)
            await pg.wait_for_timeout(wait * 1000)
            await pg.screenshot(path=out)
            fps = await pg.evaluate("(()=>{return window.__G? (window.__G.t.toFixed(2)) : 'noG'})()")
            print('G.t', fps)
            for l in logs[-25:]: print(l)
            await b.close()
    finally:
        srv.terminate()
asyncio.run(main())
