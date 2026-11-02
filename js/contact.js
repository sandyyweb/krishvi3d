(()=>{
const $=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- live open/closed status (India time) + today in the hours list ---------- */
try{
 const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',weekday:'long',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
 const g=t=>p.find(x=>x.type===t).value,day=g('weekday'),h=+g('hour')%24;
 const open=(h>=12&&h<16)||(h>=19&&h<23);
 const txt=open?'Open now · until '+(h<16?'4 PM':'11 PM'):(h<12?'Closed · opens today at 12 PM':(h<19?'Closed · reopens today at 7 PM':'Closed · opens tomorrow at 12 PM'));
 $('[data-live]').forEach(el=>{el.textContent=txt;const w=el.closest('.ct-live');if(w)w.classList.toggle('off',!open)});
 $('.ct-hrs li').forEach(li=>li.classList.toggle('today',li.dataset.d===day));
}catch(e){}

/* ---------- enquiry form ---------- */
const form=document.getElementById('ctf');
if(form){
 const thanks=document.getElementById('ctt'),f=n=>form.elements[n];
 const setErr=(name,msg)=>{const w=form.querySelector('[data-f="'+name+'"]');if(!w)return;w.classList.toggle('bad',!!msg);
  const e=w.querySelector('.ct-err');if(e)e.textContent=msg||'';const i=w.querySelector('input,textarea');if(i)i.setAttribute('aria-invalid',msg?'true':'false')};
 const validate=()=>{
  const name=f('name').value.trim(),ph=f('phone').value.trim(),em=f('email').value.trim(),msg=f('message').value.trim(),digits=ph.replace(/\D/g,'');
  const er={};
  if(name.length<2)er.name='Please tell us your name.';
  if(!ph)er.phone='Please enter your phone number.';else if(digits.length<10||digits.length>13)er.phone='Enter a valid phone number.';
  if(!em)er.email='Please enter your email address.';else if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em))er.email='Enter a valid email address.';
  if(msg.length<10)er.message='A few words more, please (at least 10 characters).';
  ['name','phone','email','message'].forEach(k=>setErr(k,er[k]));
  return Object.keys(er).length?er:null;
 };
 ['name','phone','email','message'].forEach(k=>f(k).addEventListener('input',()=>{if(form.querySelector('[data-f="'+k+'"].bad'))validate()}));
 form.addEventListener('submit',e=>{
  e.preventDefault();
  if(f('company').value)return; /* honeypot */
  const er=validate();
  if(er){const first=['name','phone','email','message'].find(k=>er[k]);f(first).focus();return}
  const name=f('name').value.trim(),btn=form.querySelector('button[type=submit]'),se=document.getElementById('cte');
  se.textContent='';btn.disabled=true;btn.style.opacity='.6';
  fetch(form.action,{method:'POST',body:new FormData(form),headers:{'X-Requested-With':'XMLHttpRequest','Accept':'application/json'}})
   .then(r=>r.json().catch(()=>({ok:false,errors:{_server:'Something went wrong. Please try again or call +91 81473 51117.'}})))
   .then(d=>{
    if(d.ok){document.getElementById('ctn').textContent=name.split(' ')[0];form.style.display='none';thanks.classList.add('on');thanks.focus();return}
    const e=d.errors||{};['name','phone','email','message'].forEach(k=>setErr(k,e[k]||''));
    if(e._server)se.textContent=e._server;
    const first=['name','phone','email','message'].find(k=>e[k]);if(first)f(first).focus()})
   .catch(()=>{se.textContent='Could not reach the server. Please check your connection or call +91 81473 51117.'})
   .finally(()=>{btn.disabled=false;btn.style.opacity=''});
 });
 document.getElementById('ctr').addEventListener('click',()=>{form.reset();['name','phone','email','message'].forEach(k=>setErr(k,''));thanks.classList.remove('on');form.style.display='';f('name').focus()});
}

/* ---------- scroll motion (same GSAP as the rest of the site) ---------- */
if(!window.gsap||!window.ScrollTrigger||reduce)return;
gsap.registerPlugin(ScrollTrigger);
gsap.from('.ct-c',{y:70,opacity:0,rotate:-2,stagger:.12,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:'.ct-ch .g',start:'top 85%'}});
gsap.from('.ct-fm .lead>*:not(.kick)',{y:40,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.ct-fm',start:'top 70%'}});
gsap.from('.hr-li',{x:-30,opacity:0,stagger:.07,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.ct-hrs',start:'top 85%'}});
gsap.from('.ct-card',{y:80,opacity:0,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'.ct-card',start:'top 88%'}});
gsap.from('.ct-mp',{clipPath:'inset(0 0 100% 0)',duration:1.5,ease:'expo.out',scrollTrigger:{trigger:'.ct-mp',start:'top 85%'}});
gsap.from('.ct-pin',{y:50,opacity:0,duration:1,delay:.5,ease:'power3.out',scrollTrigger:{trigger:'.ct-mp',start:'top 75%'}});
gsap.from('.ct-fq .lead>*:not(.kick)',{y:40,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.ct-fq',start:'top 70%'}});
gsap.from('.ct-q',{y:40,opacity:0,stagger:.1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.ct-fq .list',start:'top 85%'}});
gsap.from('.ct-end p,.ct-end .acts',{y:40,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.ct-end',start:'top 70%'}});
if(matchMedia('(pointer:fine)').matches&&document.querySelector('.cur')){const cu=document.querySelector('.cur');
 $('.ct-c,.ct-q summary').forEach(e=>{e.addEventListener('mouseenter',()=>gsap.to(cu,{scale:3.2,duration:.3}));e.addEventListener('mouseleave',()=>gsap.to(cu,{scale:1,duration:.3}))})}
addEventListener('load',()=>ScrollTrigger.refresh());
})();
