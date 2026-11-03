(()=>{
const $=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- wall: reveal on scroll ---------- */
const items=$('.gl-g li');
if('IntersectionObserver' in window&&!reduce){
 const io=new IntersectionObserver(es=>{let n=0;es.forEach(e=>{if(!e.isIntersecting)return;
  e.target.style.transitionDelay=(n++*.09)+'s';e.target.classList.add('in');io.unobserve(e.target)})},{rootMargin:'0px 0px -6% 0px',threshold:.04});
 items.forEach(li=>io.observe(li));
}else items.forEach(li=>li.classList.add('in'));

/* ---------- wall: filters ---------- */
let vis=items.slice();
const fb=$('.gl-f button'),cnt=document.getElementById('glc');
const apply=f=>{
 fb.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.f===f)));
 vis=[];
 items.forEach(li=>{const m=f==='all'||li.dataset.c===f;li.hidden=!m;li.classList.remove('in');li.style.transitionDelay='';if(m)vis.push(li)});
 if(cnt)cnt.textContent=vis.length+(vis.length===1?' photograph':' photographs');
 vis.forEach((li,i)=>{li.style.transitionDelay=(i*.07)+'s';requestAnimationFrame(()=>requestAnimationFrame(()=>li.classList.add('in')))});
 if(window.ScrollTrigger)setTimeout(()=>ScrollTrigger.refresh(),700);
};
fb.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.f)));

/* ---------- lightbox ---------- */
const lb=document.querySelector('.gl-lb');
if(lb){
 const img=lb.querySelector('.stage img'),cap=lb.querySelector('.cp'),ct=lb.querySelector('.ct'),
  bClose=lb.querySelector('.x'),bPrev=lb.querySelector('.gl-prev'),bNext=lb.querySelector('.gl-next'),stage=lb.querySelector('.stage');
 let cur=0,last=null;
 const pad=n=>String(n).padStart(2,'0');
 const src=li=>li.querySelector('img').currentSrc||li.querySelector('img').src;
 const show=i=>{
  cur=(i+vis.length)%vis.length;const li=vis[cur],t=li.querySelector('.gl-t');
  img.classList.remove('on');
  const n=new Image();n.onload=()=>{img.src=n.src;img.alt=t.dataset.cap;requestAnimationFrame(()=>img.classList.add('on'))};n.src=src(li);
  cap.textContent=t.dataset.cap;ct.textContent=pad(cur+1)+' / '+pad(vis.length);
  [1,-1].forEach(d=>{const p=new Image();p.src=src(vis[(cur+d+vis.length)%vis.length])});
 };
 const open=i=>{last=document.activeElement;lb.classList.add('open');document.body.classList.add('lbo');show(i);setTimeout(()=>bClose.focus(),50)};
 const close=()=>{lb.classList.remove('open');document.body.classList.remove('lbo');if(last)last.focus()};
 items.forEach(li=>li.querySelector('.gl-t').addEventListener('click',()=>open(vis.indexOf(li))));
 bClose.addEventListener('click',close);bPrev.addEventListener('click',()=>show(cur-1));bNext.addEventListener('click',()=>show(cur+1));
 lb.addEventListener('click',e=>{if(e.target===lb||e.target===stage)close()});
 addEventListener('keydown',e=>{
  if(!lb.classList.contains('open'))return;
  if(e.key==='Escape')close();
  else if(e.key==='ArrowRight')show(cur+1);
  else if(e.key==='ArrowLeft')show(cur-1);
  else if(e.key==='Tab'){const f=[bClose,bPrev,bNext],i=f.indexOf(document.activeElement);
   if(e.shiftKey&&i<=0){e.preventDefault();f[2].focus()}else if(!e.shiftKey&&i===2){e.preventDefault();f[0].focus()}else if(i<0){e.preventDefault();f[0].focus()}}
 });
 /* swipe */
 let sx=null;
 stage.addEventListener('pointerdown',e=>{sx=e.clientX});
 stage.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1))});
 stage.addEventListener('pointercancel',()=>{sx=null});
}

/* ---------- story strip ---------- */
(()=>{
 const tr=document.querySelector('.gl-tr');if(!tr)return;
 const bar=document.querySelector('.gl-pg i'),pv=document.querySelector('.gl-ar .gl-prev'),nx=document.querySelector('.gl-ar .gl-next');
 const upd=()=>{const m=tr.scrollWidth-tr.clientWidth,p=m>0?tr.scrollLeft/m:1;
  bar.style.transform='scaleX('+Math.max(.08,Math.min(1,p))+')';pv.disabled=tr.scrollLeft<4;nx.disabled=tr.scrollLeft>m-4};
 tr.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
 const step=()=>{const c=tr.querySelector('.gl-c');return c.getBoundingClientRect().width+(parseFloat(getComputedStyle(tr).columnGap)||22)};
 pv.addEventListener('click',()=>tr.scrollBy({left:-step(),behavior:'smooth'}));
 nx.addEventListener('click',()=>tr.scrollBy({left:step(),behavior:'smooth'}));
 /* mouse drag (touch already swipes natively) */
 let d=null;
 tr.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;d={x:e.clientX,l:tr.scrollLeft,m:false}});
 tr.addEventListener('pointermove',e=>{if(!d)return;const dx=e.clientX-d.x;if(!d.m&&Math.abs(dx)>4){d.m=true;tr.classList.add('drag');tr.setPointerCapture(e.pointerId)}if(d.m)tr.scrollLeft=d.l-dx});
 const end=()=>{if(!d)return;d=null;tr.classList.remove('drag')};
 tr.addEventListener('pointerup',end);tr.addEventListener('pointercancel',end);
})();

/* ---------- scroll motion (same GSAP as the rest of the site) ---------- */
if(!window.gsap||!window.ScrollTrigger||reduce)return;
gsap.registerPlugin(ScrollTrigger);
gsap.from('.gl-fan',{y:70,opacity:0,scale:.86,duration:1.5,ease:'expo.out',delay:.6});
gsap.from('.gl-count,.gl-f button',{y:20,opacity:0,stagger:.06,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.gl-main',start:'top 75%'}});
gsap.from('.gl-c',{y:70,opacity:0,stagger:.12,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.gl-tr',start:'top 85%'}});
$('.gl-c img').forEach(im=>gsap.fromTo(im,{scale:1.18},{scale:1,ease:'none',scrollTrigger:{trigger:im.parentNode,scrub:true,start:'top bottom',end:'bottom 30%'}}));
gsap.from('.gl-end .circ img',{scale:0,rotation:-90,stagger:.12,duration:1.1,ease:'back.out(1.7)',scrollTrigger:{trigger:'.gl-end',start:'top 75%'}});
gsap.from('.gl-handle,.gl-end p,.gl-end .acts',{y:50,opacity:0,stagger:.14,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'.gl-end',start:'top 70%'}});
if(matchMedia('(pointer:fine)').matches&&document.querySelector('.cur')){const cu=document.querySelector('.cur');
 $('.gl-c,.gl-tr').forEach(e=>{e.addEventListener('mouseenter',()=>gsap.to(cu,{scale:3.2,duration:.3}));e.addEventListener('mouseleave',()=>gsap.to(cu,{scale:1,duration:.3}))})}
addEventListener('load',()=>ScrollTrigger.refresh());
})();
