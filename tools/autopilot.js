(()=>{ if (window.__ap) return 'ap already'; window.__ap = setInterval(()=>{ try {
  const G=__G, S=__Story; const p=G.player; if(!p) return;
  const m=S.markerTarget; if(m && !G.inCine && G.controlEnabled){ const v=m.isVector3?m:m.pos; if(Math.hypot(p.pos.x-v.x,p.pos.z-v.z)>1.0) p.place(v.x+0.3, v.z+0.3, p.facing); }
  if(G.combat) for(const e of G.enemies){ if(e.alive && e.active && !e.untargetable) e.takeHit(e.maxHp*0.34, p, {heavy:true, knock:2}); }
  if(p.dummy){ p.dummy.combos=1; p.dummy.kicks=1; }
} catch(e){ console.log('ap err '+e); } }, 900); return 'ap on'; })()
