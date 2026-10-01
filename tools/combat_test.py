# Dövüş testi: Arka Sokak sahnesine atlar, gerçek girdilerle saldırır.
import asyncio, subprocess, time, os
from playwright.async_api import async_playwright
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
async def main():
    port = os.environ.get('PORT', '8799')
    srv = subprocess.Popen(['python3', '-m', 'http.server', port], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(0.7)
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
            pg = await b.new_page(viewport={'width': 1024, 'height': 640})
            logs = []
            pg.on('pageerror', lambda e: logs.append(f'[pageerror] {e}'))
            await pg.add_init_script("try{localStorage.setItem('elonth.save.v1', JSON.stringify({settings:{quality:'low',textSpeed:3,sens:1,music:0,sfx:0}}))}catch(e){}")
            await pg.goto(f'http://localhost:{port}/index.html#c1_alley')
            # diyalogları geç
            for i in range(200):
                await pg.wait_for_timeout(500)
                st = await pg.evaluate("(()=>({c:__G.combat, d:!document.querySelector('#dialog').hidden}))()")
                if st['c']: break
                await pg.evaluate("(()=>{const U=document.querySelector('#dlgcatch'); if(!U.hidden){U.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))}})()")
            print('combat started', st)
            for k in range(40):
                r = await pg.evaluate("""(()=>{const G=__G,p=G.player;let e=null,bd=1e9;for(const x of G.enemies){if(x.alive&&x.active){const d=Math.hypot(x.pos.x-p.pos.x,x.pos.z-p.pos.z);if(d<bd){bd=d;e=x}}}
                  if(e){ const dx=e.pos.x-p.pos.x,dz=e.pos.z-p.pos.z; const yaw=window.__Cam.yaw; const fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw); const l=Math.hypot(dx,dz)||1; let my=(dx*fx+dz*fz)/l, mx=(dx*rx+dz*rz)/l; window.__tm = bd>1.3?{x:mx,y:my}:null; }
                  return {php:p.hp.toFixed(0), st:p.state, e:G.enemies.map(x=>x.name+':'+x.hp.toFixed(0)+':'+x.state).join(' '), bd:bd.toFixed(1)} })()""")
                await pg.evaluate("(()=>{const I=window.__inp; })()")
                await pg.evaluate("(()=>{ if(window.__tm){ __Input().tmove=window.__tm } else { __Input().tmove=null; __Input().press('attack'); } })()")
                if k % 5 == 0: print(k, r)
                await pg.wait_for_timeout(450)
                if not r['e'] or (await pg.evaluate("!__G.combat")): print('combat ended'); break
            print(await pg.evaluate("__Story.current"))
            await pg.screenshot(path='/tmp/claude-0/shots/combat.png')
            for l in logs[-10:]: print(l)
            await b.close()
    finally: srv.terminate()
asyncio.run(main())
