(()=>{
const $=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* principles: hover / focus swaps the round preview */
(()=>{const items=$('.ab-pr .item'),imgs=$('.ab-pv img');if(!items.length)return;
 const set=i=>{items.forEach((it,k)=>it.classList.toggle('act',k===i));imgs.forEach((im,k)=>im.classList.toggle('on',k===i))};
 items.forEach((it,i)=>{it.tabIndex=0;it.addEventListener('mouseenter',()=>set(i));it.addEventListener('focus',()=>set(i));it.addEventListener('click',()=>set(i))});set(0)})();
/* visit rhythm: tabs */
(()=>{const tabs=$('.ab-vs .tabs button'),pn=$('.ab-tp .pn'),im=$('.ab-tp .ph img');if(!tabs.length)return;
 const set=i=>{tabs.forEach((t,k)=>t.setAttribute('aria-selected',k===i));pn.forEach((p,k)=>p.classList.toggle('on',k===i));im.forEach((m,k)=>m.classList.toggle('on',k===i))};
 tabs.forEach((t,i)=>{t.addEventListener('click',()=>set(i));t.addEventListener('keydown',e=>{if(e.key==='ArrowRight')(tabs[(i+1)%tabs.length]).focus(),set((i+1)%tabs.length);if(e.key==='ArrowLeft')(tabs[(i+tabs.length-1)%tabs.length]).focus(),set((i+tabs.length-1)%tabs.length)})});set(0)})();
/* guest voice: rotating quote */
(()=>{const q=$('.ab-qw figure'),d=$('.ab-dots button');if(!q.length)return;let cur=0,tm;
 const go=i=>{cur=i;q.forEach((f,k)=>f.classList.toggle('on',k===i));d.forEach((b,k)=>{b.classList.remove('on');if(k===i){void b.offsetWidth;b.classList.add('on')}});clearTimeout(tm);if(!reduce)tm=setTimeout(()=>go((cur+1)%q.length),6000)};
 d.forEach((b,i)=>b.addEventListener('click',()=>go(i)));go(0)})();
/* scroll motion (same GSAP as the rest of the site) */
if(!window.gsap||!window.ScrollTrigger||reduce)return;
gsap.registerPlugin(ScrollTrigger);
const big=document.querySelector('.ab-big');
if(big){big.innerHTML=big.textContent.split(' ').map(w=>'<span>'+w+'</span>').join(' ');
 gsap.to($('span',big),{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:big,start:'top 80%',end:'bottom 50%',scrub:true}})}
gsap.from('.ab-in .txt p:not(.ab-big),.ab-sign',{y:36,opacity:0,stagger:.14,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.ab-in .txt',start:'top 70%'}});
gsap.from('.ab-pr .item',{x:-40,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.ab-pr .mn',start:'top 80%'}});
gsap.from('.ab-pv',{scale:.7,opacity:0,rotation:-12,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:'.ab-pv',start:'top 85%'}});
$('.ab-row').forEach(r=>{const ph=r.querySelector('.ph'),im=ph.querySelector('img'),tx=r.querySelector('.tx');
 gsap.from(ph,{clipPath:'inset(0 0 100% 0)',duration:1.4,ease:'expo.out',scrollTrigger:{trigger:r,start:'top 80%'}});
 gsap.fromTo(im,{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:r,scrub:true,start:'top bottom',end:'bottom top'}});
 gsap.from($('small,h3,p,li',tx),{y:40,opacity:0,stagger:.1,duration:1,ease:'power3.out',scrollTrigger:{trigger:r,start:'top 70%'}})});
gsap.from('.ab-nm .g>div',{y:50,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.ab-nm',start:'top 80%'}});
gsap.from('.ab-tp .ph',{scale:.88,opacity:0,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'.ab-tp',start:'top 80%'}});
gsap.from('.ab-card',{y:80,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.ab-card',start:'top 88%'}});
if(matchMedia('(pointer:fine)').matches&&document.querySelector('.cur')){const cu=document.querySelector('.cur');
 $('.ab-pr .item,.ab-dots button,.ab-vs .tabs button,.ab-row .ph').forEach(e=>{e.addEventListener('mouseenter',()=>gsap.to(cu,{scale:3.2,duration:.3}));e.addEventListener('mouseleave',()=>gsap.to(cu,{scale:1,duration:.3}))})}
addEventListener('load',()=>ScrollTrigger.refresh());
})();
