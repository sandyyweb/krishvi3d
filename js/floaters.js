(()=>{
if(!window.gsap||!window.ScrollTrigger)return;
gsap.registerPlugin(ScrollTrigger);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* [symbol, left%, top%, size(vmin), depth, spin, extra(hidden on phones)] */
const map={
 '#story':[['i-tomato',3,8,11,.8,160],['i-mint',90,70,10,1.1,-120],['i-paneer',88,6,9,.6,90,1],['i-chilli',6,78,9,1,-90,1]],
 '#promise':[['i-mint',2,6,10,.9,140],['i-onion',93,12,9,.7,-180],['i-paneer',95,82,10,1.1,120,1],['i-tomato',1,88,8,.6,-100,1]],
 '.exp':[['i-chilli',6,14,10,.9,-140],['i-paneer',88,64,11,1.1,150],['i-mint',80,8,8,.6,-110,1],['i-tomato',10,76,8,.8,130,1]],
 '.ban':[['i-tomato',8,20,11,1,180],['i-mint',86,14,10,.7,-160],['i-onion',82,74,9,1.1,140,1],['i-paneer',10,76,9,.8,-120,1]],
 '#events':[['i-saffron',3,6,10,.7,80],['i-mint',92,10,9,1,-120],['i-tomato',94,84,9,.8,160,1],['i-chilli',2,86,8,1.1,-100,1]],
 '#gallery':[['i-paneer',2,3,9,1,120],['i-tomato',94,4,9,.7,-170],['i-mint',3,92,9,.9,150,1],['i-onion',93,90,8,1.1,-140,1]],
 '#voices':[['i-onion',4,10,9,.8,140],['i-chilli',92,12,9,1,-130],['i-tomato',90,86,8,.7,160,1],['i-mint',6,84,9,1.1,-120,1]],
 '#visit':[['i-mint',3,10,10,.9,-130],['i-paneer',92,16,9,.8,140],['i-saffron',90,84,9,1,90,1],['i-tomato',4,86,8,.7,-160,1]],
 '#faq':[['i-tomato',48,4,8,.8,170,1],['i-mint',93,88,9,1,-130],['i-onion',3,90,8,.8,120,1]]
};
const make=(sec,[id,l,t,s,d,sp,x])=>{const el=document.createElement('div');el.className='fl'+(x?' x':'');el.setAttribute('aria-hidden','true');
 el.style.cssText=`left:${l}%;top:${t}%;--w:${s}vmin;--ws:${s}vmin;--t:${5+Math.random()*3}s;--dl:-${(Math.random()*5).toFixed(1)}s;margin:calc(${s}vmin/-2) 0 0 calc(${s}vmin/-2)`;
 el.innerHTML=`<span><svg viewBox="0 0 100 100"><use href="#${id}"/></svg></span>`;sec.appendChild(el);return el};
Object.entries(map).forEach(([sel,items])=>{const sec=document.querySelector(sel);if(!sec)return;
 sec.classList.add('flx');
 items.forEach(it=>{const el=make(sec,it);if(reduce)return;
  const [,,,s,d,sp]=it;
  /* drift + spin as the section scrolls past */
  gsap.fromTo(el,{y:()=>innerHeight*.35*d,rotation:-sp/2},{y:()=>-innerHeight*.35*d,rotation:sp/2,ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:.8,invalidateOnRefresh:true}});
  /* pop in when the section arrives */
  gsap.from(el.firstChild,{scale:0,duration:1.1,ease:'back.out(1.6)',scrollTrigger:{trigger:sec,start:'top 75%',once:true}})})});
/* reservation: ingredients gather around the headline as you arrive */
const rsv=document.querySelector('#reserve');
if(rsv&&!reduce){rsv.classList.add('flx');
 const g=[['i-tomato',-1,-1,12],['i-mint',1,-1,11],['i-paneer',-1,1,11],['i-onion',1,1,10],['i-chilli',1.35,-.1,9],['i-saffron',-1.35,.1,9]];
 const els=g.map(([id,sx,sy,s],i)=>{const el=make(rsv,[id,50,50,s,0,0,i>3?1:0]);
  const tx=sx*(innerWidth>900?30:22),ty=sy*(innerWidth>900?30:34);
  gsap.fromTo(el,{xPercent:0,x:()=>sx*innerWidth*.7,y:()=>sy*innerHeight*.7,rotation:sx*200,opacity:0},
   {x:()=>tx*innerWidth/100,y:()=>ty*innerHeight/100*(sy?1:1),rotation:-sx*14,opacity:1,ease:'power2.out',scrollTrigger:{trigger:rsv,start:'top 85%',end:'top 15%',scrub:.9,invalidateOnRefresh:true}});
  return el})}
})();
/* pinned sections were registered by several scripts: put them back in page order, then measure (prevents blank gaps) */
(()=>{if(!window.ScrollTrigger)return;
 const el=t=>t.pin||(typeof t.trigger==='string'?document.querySelector(t.trigger):t.trigger);
 const fix=()=>{ScrollTrigger.sort((a,b)=>{const x=el(a),y=el(b);if(!x||!y||x===y)return 0;const c=x.compareDocumentPosition(y);return c&4?-1:c&2?1:0});ScrollTrigger.refresh()};
 fix();addEventListener('load',()=>setTimeout(fix,300));setTimeout(fix,1500)})();
