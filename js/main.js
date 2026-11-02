(()=>{
const $=(s,c=document)=>[...c.querySelectorAll(s)],body=document.body;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
const pre=document.getElementById('pre');
const unlock=()=>{pre&&pre.remove();body.classList.remove('lock')};
/* mobile menu */
const bg=document.querySelector('.burger');if(bg)bg.onclick=()=>{const o=body.classList.toggle('menu');bg.setAttribute('aria-expanded',o)};
if(!window.gsap||!window.ScrollTrigger||reduce){document.documentElement.classList.remove('ptn');unlock();return}
gsap.registerPlugin(ScrollTrigger);
/* words for scrubbed text */
$('.scr,#rv').forEach(el=>el.innerHTML=el.textContent.split(' ').map(w=>'<span>'+w+'</span>').join(' '));
/* preloader (first visit per session) + page curtain */
const ss=k=>{try{return sessionStorage.getItem(k)}catch(e){return 0}},sv=(k,v)=>{try{v?sessionStorage.setItem(k,1):sessionStorage.removeItem(k)}catch(e){}};
const seen=ss('kv'),arr=ss('ptn');sv('kv',1);
if(arr){sv('ptn',0);gsap.fromTo('.pt',{clipPath:'inset(0% 0 0 0)'},{clipPath:'inset(0 0 100% 0)',duration:.9,ease:'expo.inOut',delay:.1})}
addEventListener('pageshow',e=>{if(e.persisted)gsap.set('.pt',{clipPath:'inset(100% 0 0 0)'})});
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target||a.hasAttribute('download'))return;
 const h=a.getAttribute('href');if(!h||h[0]=='#'||/^(https?:|mailto:|tel:)/.test(h))return;e.preventDefault();sv('ptn',1);
 gsap.fromTo('.pt',{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:.7,ease:'expo.inOut',onComplete:()=>{location.href=a.href}})});
const c={v:0},pc=document.getElementById('pc'),hero=document.querySelector('.hero');
if(hero){gsap.set('.hero h1 .ln>span',{yPercent:110});gsap.set('.hero .fade,.hphoto',{opacity:0,y:40})}
const tl=gsap.timeline({delay:arr?.5:0,onComplete:unlock});
if(pre&&!seen){tl.to(c,{v:100,duration:1.4,ease:'power2.inOut',onUpdate:()=>pc.textContent=Math.round(c.v)}).to('#pw',{yPercent:-120,opacity:0,duration:.6,ease:'power3.in'},'+=.1').to(pre,{yPercent:-100,duration:.9,ease:'expo.inOut'},'-=.2')}else if(pre){pre.remove()}
if(hero){const o=tl.duration()?'-=.3':0;tl.to('.hero h1 .ln>span',{yPercent:0,duration:1.2,stagger:.12,ease:'expo.out'},o).to('.hero .fade',{opacity:1,y:0,stagger:.12,duration:.9,ease:'power3.out'},'-=.8').to('.hphoto',{opacity:1,y:0,duration:1.2,ease:'expo.out'},'-=1')}
/* progress + cursor */
gsap.to('.bar',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});
if(fine){const cu=document.querySelector('.cur'),x=gsap.quickTo(cu,'x',{duration:.3}),y=gsap.quickTo(cu,'y',{duration:.3});
 addEventListener('mousemove',e=>{cu.style.opacity=1;x(e.clientX);y(e.clientY)});
 $('a,button,.item,.tc,.sc,.vc,.gf,.cs').forEach(e=>{e.addEventListener('mouseenter',()=>gsap.to(cu,{scale:3.2,duration:.3}));e.addEventListener('mouseleave',()=>gsap.to(cu,{scale:1,duration:.3}))});
 $('.mag').forEach(b=>{const bx=gsap.quickTo(b,'x',{duration:.5,ease:'power3'}),by=gsap.quickTo(b,'y',{duration:.5,ease:'power3'});
  b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();bx((e.clientX-r.left-r.width/2)*.3);by((e.clientY-r.top-r.height/2)*.4)});
  b.addEventListener('mouseleave',()=>{bx(0);by(0)})})}
/* header hides on scroll down */
let ly=0;ScrollTrigger.create({start:0,end:'max',onUpdate:()=>{const y=scrollY;gsap.to('header',{yPercent:y>600&&y>ly?-140:0,duration:.5,ease:'power3.out',overwrite:'auto'});ly=y}});
/* heading line reveals */
$('section:not(.hero) h2').forEach(h=>gsap.from($('.ln>span',h),{yPercent:110,duration:1.2,stagger:.12,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 85%'}}));
$('#story .fade').forEach(e=>gsap.from(e,{y:30,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:e,start:'top 90%'}}));
/* parallax */
gsap.to('.hero .bg',{yPercent:18,ease:'none',scrollTrigger:{trigger:'.hero',scrub:true,start:'top top',end:'bottom top'}});
gsap.to('.hphoto img',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.hero',scrub:true,start:'top top',end:'bottom top'}});
gsap.to('.simg img',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.simg',scrub:true,start:'top bottom',end:'bottom top'}});
gsap.to('.exp .bg',{yPercent:14,ease:'none',scrollTrigger:{trigger:'.exp',scrub:true,start:'top bottom',end:'bottom top'}});
$('.g2 figure').forEach(f=>{gsap.fromTo(f,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.4,ease:'expo.out',scrollTrigger:{trigger:f,start:'top 88%'}});
 gsap.fromTo($('img',f),{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:f,scrub:true,start:'top bottom',end:'bottom top'}})});
gsap.from('.simg',{clipPath:'inset(0 0 100% 0)',duration:1.4,ease:'expo.out',scrollTrigger:{trigger:'.simg',start:'top 85%'}});
/* counters */
$('.cnt').forEach(e=>{const to=+e.dataset.to,d=to%1?1:0,o={v:0};ScrollTrigger.create({trigger:e,start:'top 90%',once:true,onEnter:()=>gsap.to(o,{v:to,duration:2,ease:'power2.out',onUpdate:()=>e.textContent=o.v.toFixed(d)})})});
/* scrubbed words */
$('.scr,#rv').forEach(el=>gsap.to($('span',el),{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:el,start:'top 80%',end:'bottom 45%',scrub:true}}));
/* marquees: auto scroll, speed reacts to scroll */
$('.mq').forEach((m,i)=>{const t=$('.t',m)[0];t.innerHTML+=t.innerHTML;const d=m.dataset.d?+m.dataset.d:-1;
 const tw=gsap.fromTo(t,{xPercent:d<0?0:-50},{xPercent:d<0?-50:0,duration:i?38:28,ease:'none',repeat:-1});
 ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{gsap.to(tw,{timeScale:1+Math.abs(s.getVelocity())/350,duration:.3,overwrite:true});gsap.to(tw,{timeScale:1,duration:1.2,delay:.2})}});
 m.addEventListener('mouseenter',()=>gsap.to(tw,{timeScale:0,duration:.5}));m.addEventListener('mouseleave',()=>gsap.to(tw,{timeScale:1,duration:.8}))});
/* horizontal dishes */
ScrollTrigger.matchMedia({'(min-width:901px)':()=>{
 const tr=document.querySelector('.trk'),len=()=>tr.scrollWidth-innerWidth;
 gsap.to(tr,{x:()=>-len(),ease:'none',scrollTrigger:{trigger:'.pin',pin:true,scrub:.6,end:()=>'+='+len(),invalidateOnRefresh:true,onUpdate:s=>gsap.set('.hp i',{scaleX:s.progress})}});
 $('.dc').forEach(c=>gsap.from(c,{y:60,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.pin',start:'top 60%'}}))},
 '(max-width:900px)':()=>{document.querySelector('.pin').style.cssText='height:auto;padding:5rem 0';document.querySelector('.trk').style.cssText='display:flex;overflow-x:auto;gap:1.5rem;padding:0 5vw;width:auto';document.querySelector('.hp').style.display='none'}});
/* footer + form */
gsap.from('#fb',{yPercent:60,opacity:0,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:'#fb',start:'top 98%'}});

/* ===== v2 animations ===== */
const fx=document.getElementById('fx'),cx=fx.getContext('2d');let W,H;const P=[];
const rs=()=>{W=fx.width=innerWidth;H=fx.height=innerHeight};rs();addEventListener('resize',rs);
for(let i=0;i<34;i++)P.push({x:Math.random()*W,y:Math.random()*H,r:2+Math.random()*4,s:.2+Math.random()*.6,a:Math.random()*6,o:.2+Math.random()*.5});
(function loop(){cx.clearRect(0,0,W,H);P.forEach(p=>{p.y-=p.s;p.a+=.01;p.x+=Math.sin(p.a)*.5;if(p.y<-10){p.y=H+10;p.x=Math.random()*W}
 cx.globalAlpha=p.o;cx.fillStyle='#f0a030';cx.beginPath();cx.ellipse(p.x,p.y,p.r,p.r*1.7,p.a,0,7);cx.fill()});requestAnimationFrame(loop)})();
const dl=document.getElementById('dl');if(dl){const L=dl.getTotalLength?dl.getTotalLength():0}
gsap.from('.cs',{y:80,opacity:0,rotate:3,stagger:.18,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:'.cr',start:'top 80%'}});
gsap.from('#dl',{opacity:0,duration:1.5,scrollTrigger:{trigger:'.cr',start:'top 80%'}});
gsap.to('.ban .im',{scale:1,ease:'none',scrollTrigger:{trigger:'.ban',scrub:true,start:'top bottom',end:'center center'}});
gsap.from('.ban .ring',{scale:.3,opacity:0,ease:'none',scrollTrigger:{trigger:'.ban',scrub:true,start:'top 80%',end:'center center'}});
$('.dc').forEach((c,i)=>gsap.to(c,{y:i%2?18:-18,ease:'sine.inOut',repeat:-1,yoyo:true,duration:3+i*.4}));
$('.stats b').forEach(b=>gsap.from(b,{scale:.6,opacity:0,duration:1,ease:'back.out(2)',scrollTrigger:{trigger:b,start:'top 92%'}}));
gsap.from('.tc',{scale:.85,opacity:0,stagger:.1,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.tm .mq',start:'top 90%'}});
$('.kick').forEach(k=>gsap.from(k,{scale:.5,opacity:0,duration:.8,ease:'back.out(2)',scrollTrigger:{trigger:k,start:'top 92%'}}));
addEventListener('click',e=>{for(let i=0;i<10;i++){const d=document.createElement('i');d.className='rp';document.body.appendChild(d);
 gsap.fromTo(d,{x:e.clientX,y:e.clientY,scale:1},{x:e.clientX+(Math.random()-.5)*140,y:e.clientY+(Math.random()-.5)*140,scale:0,opacity:0,duration:.8,ease:'power2.out',onComplete:()=>d.remove()})}});

/* ===== v3 scroll-reveal sections ===== */
ScrollTrigger.matchMedia({'(min-width:901px)':()=>{const cs=$('.sc');cs.forEach((c,i)=>{const n=cs[i+1];if(!n)return;
 gsap.to(c,{scale:.93,filter:'brightness(.65)',ease:'none',scrollTrigger:{trigger:n,start:'top 85%',end:'top 18%',scrub:true}})})}});
$('.sc').forEach(c=>{gsap.from($('.pic',c),{clipPath:'inset(0 0 0 100%)',duration:1.3,ease:'expo.out',scrollTrigger:{trigger:c,start:'top 75%'}});
 gsap.from($('.no,h3,p,li',c),{y:40,opacity:0,stagger:.08,duration:.9,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 75%'}})});
const day=document.querySelector('.day');if(day){const o={t:11},ck=document.getElementById('ck'),dp=$('.dps>div');
 const fmt=()=>{const h=Math.floor(o.t),m=Math.floor((o.t-h)*6)*10;ck.textContent=(((h+11)%12)+1)+':'+String(m).padStart(2,'0')+' '+(h>=12?'PM':'AM')};
 gsap.set(dp,{opacity:0,y:24});gsap.set(dp[0],{opacity:1,y:0});gsap.set('.moon',{opacity:0});gsap.set('.orb',{x:'4vw',y:'52vh'});
 gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:day,pin:true,scrub:.6,start:'top top',end:'+=260%'}})
  .to('.orb',{x:'72vw',duration:2},0).to('.orb',{y:'8vh',duration:1,ease:'sine.out'},0).to('.orb',{y:'60vh',duration:1,ease:'sine.in'},1)
  .to(o,{t:23,duration:2,onUpdate:fmt},0)
  .to(dp[0],{opacity:0,y:-24,duration:.3},.6).to(dp[1],{opacity:1,y:0,duration:.3},.7).to(dp[1],{opacity:0,y:-24,duration:.3},1.3).to(dp[2],{opacity:1,y:0,duration:.3},1.5)
  .to(day,{backgroundColor:'#e9873a',duration:.8},.5).to(day,{backgroundColor:'#0e2118',color:'#f5efe2',duration:.7},1.3)
  .to('.sun',{opacity:0,duration:.4},1.4).to('.moon',{opacity:1,duration:.4},1.4)}
$('.gcol').forEach((c,i)=>gsap.to(c,{yPercent:[-10,8,-18][i],ease:'none',scrollTrigger:{trigger:'.gcols',scrub:true,start:'top bottom',end:'bottom top'}}));
$('.gf').forEach((f,i)=>gsap.from(f,{clipPath:i%2?'inset(0 0 100% 0)':'inset(100% 0 0 0)',scale:.9,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:f,start:'top 90%'}}));
const rs2=document.querySelector('.rsv');if(rs2){gsap.set(rs2,{backgroundColor:'#0e2118',color:'#f5efe2'});gsap.set('.disc',{clipPath:'circle(0% at 50% 50%)',scale:1.12});gsap.set('.rsv .bt',{opacity:0,y:30});
 gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:rs2,pin:true,scrub:.6,start:'top top',end:'+=150%'}})
  .to('.disc',{clipPath:'circle(75% at 50% 50%)',scale:1,duration:1},0).to('.rsv .bt',{opacity:1,y:0,stagger:.1,duration:.4},.8)}
gsap.from('.vc',{y:80,opacity:0,rotate:-3,stagger:.15,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:'.vg',start:'top 85%'}});
gsap.from('.fg>div',{y:50,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.fg',start:'top 90%'}});
/* ===== v4: 3D scroll sections ===== */
const q1=s=>document.querySelector(s);
/* extend the custom cursor to the new interactive bits */
if(fine){const cu=q1('.cur');$('.pc,.q button,.occ li').forEach(e=>{e.addEventListener('mouseenter',()=>gsap.to(cu,{scale:3.2,duration:.3}));e.addEventListener('mouseleave',()=>gsap.to(cu,{scale:1,duration:.3}))})}
/* hero photo: gentle 3D tilt that follows the pointer */
if(fine&&q1('.hrel')){const h=q1('.hrel'),rx=gsap.quickTo(h,'rotationX',{duration:.8,ease:'power3'}),ry=gsap.quickTo(h,'rotationY',{duration:.8,ease:'power3'});
 gsap.set(h,{transformPerspective:1100});
 q1('.hero').addEventListener('mousemove',e=>{ry((e.clientX/innerWidth-.5)*14);rx(-(e.clientY/innerHeight-.5)*10)});
 q1('.hero').addEventListener('mouseleave',()=>{ry(0);rx(0)})}
/* promise: cards tip up out of the table, then flip on hover/tap */
gsap.from('.pc',{rotationX:-70,y:90,opacity:0,transformOrigin:'50% 100%',stagger:.14,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'.pg',start:'top 82%'}});
$('.pc').forEach(c=>{c.addEventListener('click',()=>c.classList.toggle('flip'));c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.classList.toggle('flip')}})});
/* celebrations: panels swing in and separate into layers; the whole stack follows the pointer */
if(q1('.ep')){
 gsap.fromTo('.ep',{rotationY:-34,rotationX:10,y:70,opacity:.25},{rotationY:0,rotationX:0,y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.e3d',scrub:true,start:'top 92%',end:'top 28%'}});
 gsap.fromTo('.ep2',{z:0,y:40},{z:90,y:0,ease:'none',scrollTrigger:{trigger:'.e3d',scrub:true,start:'top 85%',end:'top 20%'}});
 gsap.fromTo('.ep3',{z:0,y:80},{z:170,y:0,ease:'none',scrollTrigger:{trigger:'.e3d',scrub:true,start:'top 85%',end:'top 20%'}});
 gsap.from('.occ li',{x:50,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.occ',start:'top 85%'}});
 if(fine){const em=q1('.em'),mx=gsap.quickTo(em,'rotationY',{duration:.9,ease:'power3'}),my=gsap.quickTo(em,'rotationX',{duration:.9,ease:'power3'});
  q1('.e3d').addEventListener('mousemove',e=>{const r=e.currentTarget.getBoundingClientRect();mx(((e.clientX-r.left)/r.width-.5)*16);my(-((e.clientY-r.top)/r.height-.5)*12)});
  q1('.e3d').addEventListener('mouseleave',()=>{mx(0);my(0)})}}
/* faq accordion */
$('.q button').forEach(b=>b.addEventListener('click',()=>{const q=b.parentElement,o=!q.classList.contains('open');
 $('.q.open').forEach(x=>{x.classList.remove('open');x.querySelector('button').setAttribute('aria-expanded','false')});
 if(o){q.classList.add('open');b.setAttribute('aria-expanded','true')}}));
gsap.from('.q',{y:40,opacity:0,stagger:.1,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.fa',start:'top 85%'}});
gsap.from('.fql p,.fqi',{y:30,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.fql',start:'top 80%'}});
/* desktop only: pinned 3D fly-through tunnel + rotating dish cylinder */
ScrollTrigger.matchMedia({'(min-width:901px)':()=>{
 const tun=q1('.tun');
 if(tun){tun.classList.add('is3d');
  const fr=$('.tf',tun);
  gsap.set(fr,{xPercent:-50,yPercent:-50,x:i=>fr[i].dataset.x+'vw',y:i=>fr[i].dataset.y+'vh',z:-2600,opacity:0});
  const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'.tpin',pin:true,start:'top top',end:'+=340%',scrub:.6,onUpdate:s=>gsap.set('.tun .hp i',{scaleX:s.progress})}});
  tl.fromTo('.tcenter',{scale:1,opacity:1},{scale:2.4,opacity:0,duration:1.1},0);
  fr.forEach((f,i)=>{const t=.4+i*.6;tl.fromTo(f,{z:-2600},{z:560,duration:2.4},t).fromTo(f,{opacity:0},{opacity:1,duration:.5},t).to(f,{opacity:0,duration:.5},t+1.9)});
  tl.to({},{duration:.3});
 }
 const cy=q1('.cyl');
 if(cy){cy.classList.add('is3d');
  const ring=q1('.cring'),fc=$('.cf',cy),n=fc.length,cn=q1('#cn'),cd=q1('#cd');let cur=0;
  const show=i=>{if(i===cur)return;cur=i;fc.forEach((f,k)=>f.classList.toggle('act',k===i));
   gsap.fromTo('.ccap',{y:14,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'});
   cn.textContent=fc[i].querySelector('b').textContent;cd.textContent=fc[i].dataset.d};
  gsap.set(ring,{rotationX:-4,rotationY:0});
  gsap.to(ring,{rotationY:-(n-1)*360/n,ease:'none',scrollTrigger:{trigger:'.cpin',pin:true,start:'top top',end:'+='+(n*60)+'%',scrub:.8,onUpdate:s=>{show(Math.round(s.progress*(n-1)));gsap.set('.cyl .hp i',{scaleX:s.progress})}}});
 }
 return()=>{tun&&tun.classList.remove('is3d');cy&&cy.classList.remove('is3d')}
}});
addEventListener('load',()=>{ScrollTrigger.sort();ScrollTrigger.refresh()});
setTimeout(()=>{if(document.getElementById('pre'))unlock()},8000);
})();
