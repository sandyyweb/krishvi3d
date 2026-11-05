(()=>{
const $=(s,c=document)=>[...c.querySelectorAll(s)];
const nav=document.querySelector('.mn-nav'),links=$('.mn-nav a'),secs=links.map(a=>document.querySelector(a.getAttribute('href')));
/* scroll-spy */
if(nav&&'IntersectionObserver' in window){
 const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const i=secs.indexOf(e.target);links.forEach((l,k)=>l.classList.toggle('on',k===i));
  const on=links[i];if(on&&on.scrollIntoView&&nav.firstElementChild.scrollWidth>nav.firstElementChild.clientWidth)nav.firstElementChild.scrollTo({left:on.offsetLeft-20,behavior:'smooth'})}})},{rootMargin:'-40% 0px -55% 0px'});
 secs.forEach(s=>s&&io.observe(s))}
/* keep the bar exactly below the header, wherever the header is (it slides away on scroll down and back on scroll up) */
if(nav){const hd=document.querySelector('header');
 const place=()=>{const b=hd?hd.getBoundingClientRect().bottom:0;nav.style.top=Math.max(16,Math.round(b+12))+'px';requestAnimationFrame(place)};place()}
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!window.gsap||!window.ScrollTrigger||reduce)return;
gsap.registerPlugin(ScrollTrigger);
gsap.from('.mn-trio figure',{scale:.5,opacity:0,rotation:-20,stagger:.18,duration:1.4,ease:'expo.out',delay:.5});
gsap.from('.mn-nav .in',{y:20,opacity:0,duration:1,ease:'power3.out',delay:1});
$('.mn-sec').forEach(s=>{
 const ph=s.querySelector('.mn-arch,.mn-wide,.mn-bc .ph'),im=ph&&ph.querySelector('img'),tx=s.querySelectorAll('.mn-dish>*,.mn-lbl,.sub');
 if(ph&&!ph.classList.contains('ph'))gsap.from(ph,{clipPath:'inset(0 0 100% 0)',duration:1.4,ease:'expo.out',scrollTrigger:{trigger:s,start:'top 70%'}});
 if(im)gsap.fromTo(im,{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:s,scrub:true,start:'top bottom',end:'bottom top'}});
 if(tx.length)gsap.from(tx,{y:40,opacity:0,stagger:.1,duration:1,ease:'power3.out',scrollTrigger:{trigger:s,start:'top 65%'}})});
gsap.from('.mn-col',{y:70,opacity:0,rotate:-2,stagger:.18,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:'.mn-cols',start:'top 82%'}});
gsap.from('.mn-col li',{x:30,opacity:0,stagger:.1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.mn-cols',start:'top 70%'}});
gsap.from('.mn-nt .g>div',{y:50,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.mn-nt',start:'top 82%'}});
if(matchMedia('(pointer:fine)').matches&&document.querySelector('.cur')){const cu=document.querySelector('.cur');
 $('.mn-nav a,.mn-col li,.mn-arch,.mn-wide').forEach(e=>{e.addEventListener('mouseenter',()=>gsap.to(cu,{scale:3.2,duration:.3}));e.addEventListener('mouseleave',()=>gsap.to(cu,{scale:1,duration:.3}))})}
addEventListener('load',()=>ScrollTrigger.refresh());
})();
