(()=>{
const sc=document.querySelector('.scene');
if(!sc||!window.gsap||!window.ScrollTrigger)return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
gsap.registerPlugin(ScrollTrigger);
const $=(s,c=sc)=>[...c.querySelectorAll(s)],q=s=>sc.querySelector(s);
const plate=q('.sc-plate'),shadow=q('.sc-shadow'),tilt=q('.sc-tilt'),glow=q('.glow'),leaf=q('.leafmark');
const imgs=$('.sc-disc img'),ings=$('.ing'),ch=[q('.sc-c1'),q('.sc-c2'),q('.sc-c3')],foot=q('.sc-foot'),cta=q('.sc-cta'),dots=$('.sc-dots i'),cue=q('.sc-cue');
const lerp=gsap.utils.interpolate,cl=gsap.utils.clamp(0,1),
 ease=t=>{t=cl(t);return t*t*(3-2*t)},
 win=(p,a,b,c,d)=>ease((p-a)/(b-a))*(1-ease((p-c)/(d-c)));
const cream='#FFEEC3',moss='#1E5012',deep='#0c2a06',inkc='#16430D',pale='#FFEEC3';
/* ingredient orbits: angle, radius multipliers, size, spin */
const cfg=ings.map((el,i)=>({a:i/ings.length*Math.PI*2+(i%2?.4:0),rx:.95+(i%3)*.16,ry:.9+(i%4)*.1,s:.8+(i%3)*.25,r:(i%2?1:-1)*(180+i*40),lab:el.querySelector('b')}));
const st={p:0};
function render(p){
 const desk=innerWidth>900,W=innerWidth,H=innerHeight,ps=plate.offsetWidth;
 /* explode amount: 0 → 1 → 0 */
 const e=ease(p/.3)*(1-ease((p-.72)/.22));
 /* palette */
 const bg=p<.34?lerp(cream,moss,ease(p/.34)):p<.7?moss:lerp(moss,deep,ease((p-.7)/.25));
 const fg=p<.3?lerp(inkc,pale,ease((p-.1)/.2)):pale;
 sc.style.setProperty('--bgc',bg);sc.style.setProperty('--fg',fg);
 /* plate */
 /* the dish FALLS (speeds up like gravity) towards each next slide; its text fades in as the dish nears it */
 const t1=cl((p-.06)/.2),g1=t1*t1,t2=cl((p-.52)/.22),w3f=t2*t2;
 const px=W*(desk?.17:.07)*g1*(1-w3f);
  /* text drifts slowly upward for the whole time its slide is on screen */
 const mix=(a,b,t)=>a+(b-a)*cl(t);
 const y2=mix(desk?24:50,desk?-24:-20,(p-.1)/.62),y3=mix(desk?50:36,desk?-24:-4,(p-.66)/.34);
 /* desktop: on slide 2 the dish and its text both sit on the vertical middle of the viewport */
 const midY=sc.offsetHeight/2-(plate.offsetTop+ps/2);
 const py=(desk?(midY+y2)*g1:H*.11*g1)*(1-w3f);
 const scl=1-.12*e-ease((p-.8)/.15)*.16;
 const lift=ease((p-.8)/.15)*H*.02;
 /* last chapter: fit the dish in the gap between the text and the buttons so nothing overlaps */
 let fy=0,fs=1;
 if(w3f>0){const tb=ch[2].offsetTop+ch[2].offsetHeight+y3+(desk?14:8),ct=cta.offsetTop-(desk?14:8),av=ct-tb,nat=plate.offsetTop+ps/2;
  const ts=Math.max(.5,Math.min(desk?.85:1/scl,av/(ps*scl))),dh=ps*scl*ts;
  /* the dish lands low in the gap, just above the buttons */
  const cy=ct-dh/2,ty=cy-nat+lift;fs=1+(ts-1)*w3f;fy=ty*w3f}
 gsap.set(plate,{x:px,y:py-lift+fy,rotation:p*70,scale:scl*fs});
 gsap.set(shadow,{x:px,y:py+fy-ps*.5*(1-fs)*scl,opacity:1-.5*e,scaleX:(1-.2*e)*fs});
 gsap.set(glow,{x:px,y:py+fy,scale:(1+e*.25)*fs});
 if(leaf)gsap.set(leaf,{y:p*-120,rotation:p*40});
 /* dishes cross-fade as the plate turns */
 const o1=1-ease((p-.22)/.1),o3=ease((p-.6)/.1),o2=ease((p-.22)/.1)*(1-o3);
 imgs[0].style.opacity=o1;imgs[1].style.opacity=o2;imgs[2].style.opacity=o3;
 /* ingredients orbit in 3D-ish ellipses around the plate */
 const base=ps*.78;
 ings.forEach((el,i)=>{const c=cfg[i],a=c.a+p*Math.PI*2.6,d=Math.sin(a),R=base*e;
  const x=px+Math.cos(a)*R*c.rx*(desk?1.25:.95),y=py+d*R*c.ry*.5-e*ps*.06*Math.cos(a*1.3);
  const s=c.s*(.62+.5*(d+1)/2)*(.2+.8*e);
  gsap.set(el,{x,y,xPercent:-50,yPercent:-50,scale:s,rotation:p*c.r,opacity:(e>.03?1:0)*(1-o1),zIndex:d>0?5:1});
  if(c.lab)c.lab.style.opacity=win(p,.34,.44,.6,.68)*(d>-.3?1:.2)});
 /* chapters */
 const w1=1-ease((p-.07)/.12),w2=win(p,.07,.19,.56,.66),w3=ease((p-.56)/.1);
 gsap.set(ch[0],{opacity:w1,y:-60*(1-w1),pointerEvents:w1>.5?'auto':'none'});
 gsap.set(ch[1],{opacity:w2});
 gsap.set(ch[2],{opacity:w3,y:y3});
 ch[1].style.transform=desk?`translateY(calc(-50% + ${y2}px))`:`translateY(${y2}px)`;
 foot.style.opacity=w1;foot.style.pointerEvents=w1>.5?'auto':'none';
 cta.style.opacity=w3;cta.classList.toggle('on',w3>.5);
 cue.style.opacity=.5*w1;
 const act=p<.22?0:p<.66?1:2;dots.forEach((d,i)=>d.classList.toggle('on',i===act));
}
render(0);
ScrollTrigger.create({trigger:sc,start:'top top',end:()=>'+='+Math.round(innerHeight*8),pin:true,anticipatePin:1,invalidateOnRefresh:true,
 onUpdate:s=>gsap.to(st,{p:s.progress,duration:.7,ease:'power2.out',overwrite:true,onUpdate:()=>render(st.p)})});
addEventListener('resize',()=>render(st.p));
/* intro once the preloader is gone */
const intro=()=>{gsap.from('.sc-c1 h1 span>i',{yPercent:115,duration:1.3,stagger:.14,ease:'expo.out'});
 gsap.from('.sc-plate',{scale:.6,opacity:0,rotation:-40,duration:1.6,ease:'expo.out',delay:.1});
 gsap.from('.sc-foot > *',{y:30,opacity:0,duration:1,stagger:.12,ease:'power3.out',delay:.6})};
const wait=setInterval(()=>{if(!document.getElementById('pre')){clearInterval(wait);intro()}},80);
/* pointer tilt */
if(matchMedia('(pointer:fine)').matches){const rx=gsap.quickTo(tilt,'rotationX',{duration:.8,ease:'power3'}),ry=gsap.quickTo(tilt,'rotationY',{duration:.8,ease:'power3'});
 gsap.set(tilt,{transformPerspective:1000});
 sc.addEventListener('mousemove',e=>{ry((e.clientX/innerWidth-.5)*16);rx(-(e.clientY/innerHeight-.5)*12)});
 sc.addEventListener('mouseleave',()=>{ry(0);rx(0)})}
})();
