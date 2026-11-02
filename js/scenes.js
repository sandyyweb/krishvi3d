(()=>{
const secs=[...document.querySelectorAll('.scn')];
if(!secs.length||!window.gsap||!window.ScrollTrigger)return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches){secs.forEach(s=>{s.style.height='auto';s.querySelectorAll('.scn-ch').forEach(c=>{c.style.cssText='position:static;opacity:1;transform:none;margin-bottom:2rem'});s.querySelector('.scn-txt').style.cssText='position:static;width:auto;transform:none;padding:4rem 6vw'});return}
gsap.registerPlugin(ScrollTrigger);
const lerp=gsap.utils.interpolate,cl=gsap.utils.clamp(0,1),ease=t=>{t=cl(t);return t*t*(3-2*t)};
secs.forEach(sc=>{
 const q=s=>sc.querySelector(s),$=s=>[...sc.querySelectorAll(s)];
 const pal=JSON.parse(sc.dataset.pal),N=pal.length;
 const plate=q('.sc-plate'),shadow=q('.sc-shadow'),tilt=q('.sc-tilt'),glow=q('.glow');
 const imgs=$('.sc-disc img'),ings=$('.ing'),chs=$('.scn-ch'),steps=$('.scn-steps i');
 imgs.forEach((im,i)=>im.style.opacity=i?0:1);
 const cfg=ings.map((el,i)=>({a:i/ings.length*Math.PI*2+(i%2?.4:0),rx:.95+(i%3)*.16,ry:.9+(i%4)*.1,s:.75+(i%3)*.25,r:(i%2?1:-1)*(180+i*40)}));
 const st={p:0};
 const render=p=>{
  const desk=innerWidth>900,W=innerWidth,H=innerHeight,ps=plate.offsetWidth;
  const t=Math.min(p*N,N-.0001),idx=Math.floor(t),frac=t-idx;
  const u=idx<N-1?ease((frac-.82)/.18):0;
  const e=.3+.7*Math.pow(Math.sin(Math.PI*frac),.6);
  const bg=idx<N-1?lerp(pal[idx][0],pal[idx+1][0],u):pal[idx][0],fg=idx<N-1?lerp(pal[idx][1],pal[idx+1][1],u):pal[idx][1];
  sc.style.setProperty('--bgc',bg);sc.style.setProperty('--fg',fg);const em=(a,b)=>pal[a][2]||'#f0a030';sc.style.setProperty('--em',idx<N-1?lerp(em(idx),em(idx+1),u):em(idx));
  const px=desk?W*.2:0;
  gsap.set(plate,{x:px,rotation:p*N*55,scale:1-.1*e+(p>.97?.04:0)});
  gsap.set(shadow,{x:px,opacity:1-.4*e});gsap.set(glow,{x:px,scale:1+e*.25});
  imgs.forEach((im,i)=>{im.style.opacity=i===idx?1-u:i===idx+1?u:0});
  const base=ps*.82;
  ings.forEach((el,i)=>{const c=cfg[i],a=c.a+t*2.2,d=Math.sin(a),R=base*e;
   gsap.set(el,{x:px+Math.cos(a)*R*c.rx*(desk?1.2:.9),y:d*R*c.ry*.5,xPercent:-50,yPercent:-50,scale:c.s*(.62+.5*(d+1)/2)*(.3+.7*e),rotation:t*c.r*.4,opacity:.95,zIndex:d>0?5:1})});
  chs.forEach((c,i)=>{let o=0;if(i===idx){o=(idx===0&&frac<.18)?1:ease(frac/.18);if(idx<N-1)o*=1-u}
   gsap.set(c,{opacity:o,y:(desk?0:0)+(1-o)*(i===idx?30:0)});
   if(desk)c.style.transform=`translateY(calc(-50% + ${(1-o)*30}px))`;c.classList.toggle('on',o>.5)});
  steps.forEach((s,i)=>s.classList.toggle('on',i===(u>.5?idx+1:idx)));
 };
 render(0);
 ScrollTrigger.create({trigger:sc,start:'top top',end:()=>'+='+Math.round(innerHeight*N*.85),pin:true,anticipatePin:1,invalidateOnRefresh:true,
  onUpdate:s=>gsap.to(st,{p:s.progress,duration:.7,ease:'power2.out',overwrite:true,onUpdate:()=>render(st.p)})});
 addEventListener('resize',()=>render(st.p));
 if(matchMedia('(pointer:fine)').matches){const rx=gsap.quickTo(tilt,'rotationX',{duration:.8,ease:'power3'}),ry=gsap.quickTo(tilt,'rotationY',{duration:.8,ease:'power3'});
  gsap.set(tilt,{transformPerspective:1000});
  sc.addEventListener('mousemove',e=>{ry((e.clientX/innerWidth-.5)*16);rx(-(e.clientY/innerHeight-.5)*12)});
  sc.addEventListener('mouseleave',()=>{ry(0);rx(0)})}
});
})();
