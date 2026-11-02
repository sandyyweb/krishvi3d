(()=>{
const $=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- India time helpers (the restaurant's clock, not the visitor's) ---------- */
const ist=()=>{
 const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
 const g=t=>p.find(x=>x.type===t).value;
 return{date:g('year')+'-'+g('month')+'-'+g('day'),mins:(+g('hour')%24)*60+(+g('minute')),h:+g('hour')%24};
};
const addDays=(iso,n)=>{const [y,m,d]=iso.split('-').map(Number),t=new Date(Date.UTC(y,m-1,d+n));return t.toISOString().slice(0,10)};
const nice=iso=>{const [y,m,d]=iso.split('-').map(Number);return new Date(Date.UTC(y,m-1,d)).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'})};

/* ---------- live open/closed status ---------- */
try{
 const n=ist(),open=(n.h>=12&&n.h<16)||(n.h>=19&&n.h<23);
 const txt=open?'Open now · until '+(n.h<16?'4 PM':'11 PM'):(n.h<12?'Closed · opens today at 12 PM':(n.h<19?'Closed · reopens today at 7 PM':'Closed · opens tomorrow at 12 PM'));
 $('[data-live]').forEach(el=>{el.textContent=txt;const w=el.closest('.rs-live');if(w)w.classList.toggle('off',!open)});
}catch(e){}

/* ---------- booking form ---------- */
const form=document.getElementById('rsf');
if(form){
 const f=n=>form.elements[n],thanks=document.getElementById('rst');
 const dateEl=f('date'),gEl=f('guests'),gOut=document.getElementById('rg-o'),gm=document.getElementById('rg-m'),gp=document.getElementById('rg-p'),gh=document.getElementById('rg-h');
 const slots=$('input[name=time]',form),none=document.getElementById('rsn'),recap=document.getElementById('rsr');
 const S={date:document.getElementById('s-date'),time:document.getElementById('s-time'),guests:document.getElementById('s-guests'),occ:document.getElementById('s-occ')};
 const MIN=1,MAX=20;

 /* date limits + today/tomorrow shortcuts */
 const today=()=>ist().date;
 const setLimits=()=>{dateEl.min=today();dateEl.max=addDays(today(),120)};
 setLimits();
 /* ---------- modern date picker ---------- */
 const dv=document.getElementById('r-datev'),dp=document.getElementById('dp');
 const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
 let vy,vm,open=false;
 const pad=n=>String(n).padStart(2,'0'),iso=(y,m,d)=>y+'-'+pad(m+1)+'-'+pad(d);
 const showVal=()=>{dv.value=dateEl.value?nice(dateEl.value):''};
 const build=()=>{
  const mn=dateEl.min,mx=dateEl.max,first=new Date(Date.UTC(vy,vm,1)).getUTCDay(),days=new Date(Date.UTC(vy,vm+1,0)).getUTCDate();
  const [my,mm]=mn.split('-').map(Number),[xy,xm]=mx.split('-').map(Number);
  let h='<div class="dp-h"><button type="button" data-n="-1" aria-label="Previous month"'+((vy<my||(vy===my&&vm<=mm-1))?' disabled':'')+'>&#8249;</button><b>'+MN[vm]+' '+vy+'</b><button type="button" data-n="1" aria-label="Next month"'+((vy>xy||(vy===xy&&vm>=xm-1))?' disabled':'')+'>&#8250;</button></div><div class="dp-g">';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d=>h+='<span>'+d+'</span>');
  for(let i=0;i<first;i++)h+='<i></i>';
  for(let d=1;d<=days;d++){const v=iso(vy,vm,d),dis=v<mn||v>mx;
   h+='<button type="button" data-d="'+v+'"'+(dis?' disabled':'')+(v===dateEl.value?' class="sel" aria-pressed="true"':v===mn?' class="td"':'')+'>'+d+'</button>'}
  dp.innerHTML=h+'</div>';
 };
 const openDp=()=>{const b=dateEl.value||dateEl.min,[y,m]=b.split('-').map(Number);vy=y;vm=m-1;build();dp.hidden=false;requestAnimationFrame(()=>dp.classList.add('on'));open=true;dv.setAttribute('aria-expanded','true');
  const t=dp.querySelector('.sel')||dp.querySelector('.dp-g button:not(:disabled)');if(t&&document.activeElement!==dv)t.focus()};
 const closeDp=(ret)=>{if(!open)return;open=false;dp.classList.remove('on');dp.hidden=true;dv.setAttribute('aria-expanded','false');if(ret)dv.focus()};
 const pick=v=>{dateEl.value=v;showVal();setErr('date','');closeDp(true);onDate()};
 dv.addEventListener('click',()=>open?closeDp():openDp());
 dv.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '||e.key==='ArrowDown'){e.preventDefault();open?closeDp():openDp();if(open){const t=dp.querySelector('.sel')||dp.querySelector('.dp-g button:not(:disabled)');t&&t.focus()}}else if(e.key==='Escape')closeDp()});
 dp.addEventListener('click',e=>{const n=e.target.closest('[data-n]'),d=e.target.closest('[data-d]');
  if(n&&!n.disabled){vm+=+n.dataset.n;if(vm<0){vm=11;vy--}if(vm>11){vm=0;vy++}build();const nb=dp.querySelector('[data-n="'+n.dataset.n+'"]');nb&&!nb.disabled?nb.focus():dp.querySelector('.dp-g button:not(:disabled)')&&dp.querySelector('.dp-g button:not(:disabled)').focus()}
  else if(d&&!d.disabled)pick(d.dataset.d)});
 dp.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.stopPropagation();closeDp(true);return}
  const b=e.target.closest('[data-d]');if(!b)return;
  const all=[...dp.querySelectorAll('[data-d]')],i=all.indexOf(b),step={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key];
  if(step){e.preventDefault();const t=all[i+step];if(t&&!t.disabled)t.focus()}});
 document.addEventListener('mousedown',e=>{if(open&&!e.target.closest('.dp-w'))closeDp()});
 document.addEventListener('touchstart',e=>{if(open&&!e.target.closest('.dp-w'))closeDp()},{passive:true});
 dateEl.addEventListener('input',showVal);
 const qk=$('.rs-qk button',form);
 const syncQk=()=>qk.forEach(b=>b.setAttribute('aria-pressed',String(dateEl.value===addDays(today(),+b.dataset.q))));
 qk.forEach(b=>b.addEventListener('click',()=>{dateEl.value=addDays(today(),+b.dataset.q);setErr('date','');onDate()}));

 /* slots that have already passed (or are less than 30 minutes away) are switched off for today */
 const refreshSlots=()=>{
  const isToday=dateEl.value&&dateEl.value===today(),now=ist().mins;let anyOn=false;
  slots.forEach(s=>{const [h,m]=s.value.split(':').map(Number),off=isToday&&(h*60+m)<now+30;
   s.disabled=off;if(off&&s.checked)s.checked=false;if(!off)anyOn=true});
  $('.rs-sl',form).forEach(g=>g.hidden=!$('input:not(:disabled)',g).length&&isToday);
  none.hidden=!(isToday&&!anyOn);
 };

 /* summary + mobile recap */
 const val=(name)=>(form.querySelector('input[name='+name+']:checked')||{}).value||'';
 const plural=n=>n+(n===1?' guest':' guests');
 const put=(el,txt)=>{const on=!!txt;el.textContent=on?txt:el.dataset.e||'';el.classList.toggle('on',on)};
 const render=()=>{
  const n=+gEl.value,t=form.querySelector('input[name=time]:checked');
  put(S.date,dateEl.value?nice(dateEl.value):'');
  put(S.time,t?t.dataset.l:'');
  S.guests.textContent=plural(n);S.guests.classList.add('on');
  S.occ.textContent=val('occasion');S.occ.classList.add('on');
  const bits=[plural(n),dateEl.value?nice(dateEl.value):null,t?t.dataset.l:null].filter(Boolean);
  recap.textContent='Your table: '+bits.join(' · ');
  gm.disabled=n<=MIN;gp.disabled=n>=MAX;gOut.textContent=n;gh.hidden=n<=8;
 };

 /* validation */
 const setErr=(name,msg)=>{const w=form.querySelector('[data-f="'+name+'"]');if(!w)return;w.classList.toggle('bad',!!msg);
  const e=w.querySelector('.rs-err');if(e)e.textContent=msg||'';const i=w.querySelector('input,textarea');if(i&&i.type!=='radio')i.setAttribute('aria-invalid',msg?'true':'false')};
 const validate=()=>{
  const er={},d=dateEl.value,tm=form.querySelector('input[name=time]:checked'),name=f('name').value.trim(),ph=f('phone').value.trim(),em=f('email').value.trim(),digits=ph.replace(/\D/g,'');
  if(!d)er.date='Please choose a date.';
  else if(d<today())er.date='That date has passed. Please pick today or later.';
  if(!tm)er.time=d&&d===today()&&none.hidden===false?'No more tables today. Please pick another date.':'Please pick a time.';
  if(name.length<2)er.name='Please tell us your name.';
  if(digits.length<10||digits.length>13)er.phone=ph?'Enter a valid phone number.':'We need a phone number to confirm your table.';
  if(em&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em))er.email='Enter a valid email address.';
  ['date','time','name','phone','email'].forEach(k=>setErr(k,er[k]));
  return Object.keys(er).length?er:null;
 };
 const revalidate=k=>{if(form.querySelector('[data-f="'+k+'"].bad'))validate()};

 const onDate=()=>{showVal();refreshSlots();syncQk();render();revalidate('date');revalidate('time')};
 dateEl.addEventListener('input',()=>{setErr('date','');onDate()});
 dateEl.addEventListener('change',onDate);
 form.addEventListener('change',e=>{if(e.target.name==='time'){setErr('time','')}render()});
 ['name','phone','email'].forEach(k=>f(k).addEventListener('input',()=>revalidate(k)));
 gm.addEventListener('click',()=>{gEl.value=Math.max(MIN,+gEl.value-1);render()});
 gp.addEventListener('click',()=>{gEl.value=Math.min(MAX,+gEl.value+1);render()});

  /* submit */
 form.addEventListener('submit',e=>{
  e.preventDefault();
  if(f('company').value)return; /* honeypot */
  setLimits();refreshSlots();
  const er=validate();
  if(er){
   const first=['date','time','name','phone','email'].find(k=>er[k]);
   const w=form.querySelector('[data-f="'+first+'"]'),t=w&&w.querySelector('input:not(:disabled),textarea');
   if(w)w.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
   if(t)t.focus({preventScroll:true});return;
  }
  const tm=form.querySelector('input[name=time]:checked'),name=f('name').value.trim(),n=+gEl.value,occ=val('occasion'),when=nice(dateEl.value)+', '+tm.dataset.l;
  /* No server here, so the request opens in the visitor's email app.
     To send from the page instead, replace this block with a fetch() to your form endpoint (Formspree, Getform, your own API). */
  const body='Reservation request\n\nName: '+name+'\nPhone: '+f('phone').value.trim()+'\nEmail: '+(f('email').value.trim()||'-')+
   '\n\nDate: '+nice(dateEl.value)+' ('+dateEl.value+')\nTime: '+tm.dataset.l+'\nGuests: '+n+'\nOccasion: '+occ+
   '\n\nNotes: '+(f('notes').value.trim()||'-');
  location.href='mailto:krishvicoin@gmail.com?subject='+encodeURIComponent('Table request: '+plural(n)+', '+when+' ('+name+')')+'&body='+encodeURIComponent(body);
  document.getElementById('rsn2').textContent=name.split(' ')[0];
  document.getElementById('rsy').textContent=plural(n)+' · '+when;
  form.style.display='none';thanks.classList.add('on');thanks.focus();
  thanks.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
 });
 document.getElementById('rsx').addEventListener('click',()=>{
  form.reset();dateEl.value='';showVal();gEl.value=2;['date','time','name','phone','email'].forEach(k=>setErr(k,''));
  thanks.classList.remove('on');form.style.display='';refreshSlots();syncQk();render();dv.focus();
 });

 /* keep "today" honest if the tab stays open past midnight or slots tick over */
 setInterval(()=>{setLimits();refreshSlots()},60000);
 refreshSlots();render();
}

/* ---------- scroll motion (same GSAP as the rest of the site) ---------- */
if(!window.gsap||!window.ScrollTrigger||reduce)return;
gsap.registerPlugin(ScrollTrigger);
gsap.from('.rs-lead>*:not(.kick)',{y:40,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.rs-bk',start:'top 70%'}});
$('.rs-st').forEach(s=>gsap.from(s,{y:60,opacity:0,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:s,start:'top 90%'}}));
gsap.from('.rs-sum',{y:80,opacity:0,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'.rs-sum',start:'top 88%'}});
gsap.from('.rs-sp li',{y:70,opacity:0,rotate:-2,stagger:.14,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:'.rs-sp',start:'top 85%'}});
gsap.from('.rs-sc',{y:80,opacity:0,stagger:.14,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.rs-sg',start:'top 85%'}});
$('.rs-sc img').forEach(im=>gsap.fromTo(im,{scale:1.18},{scale:1,ease:'none',scrollTrigger:{trigger:im.parentNode,scrub:true,start:'top bottom',end:'bottom 30%'}}));
gsap.from('.rs-kn .lead>*:not(.kick)',{y:40,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.rs-kn',start:'top 70%'}});
gsap.from('.rs-nt>div',{y:50,opacity:0,stagger:.1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.rs-nt',start:'top 85%'}});
gsap.from('.rs-tel,.rs-end p,.rs-end .acts',{y:40,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.rs-end',start:'top 70%'}});
if(matchMedia('(pointer:fine)').matches&&document.querySelector('.cur')){const cu=document.querySelector('.cur');
 $('.rs-sp li,.rs-sc,.rs-nt>div,.rs-tp label,.rs-stp button,.rs-qk button,.rs-tel').forEach(e=>{e.addEventListener('mouseenter',()=>gsap.to(cu,{scale:3.2,duration:.3}));e.addEventListener('mouseleave',()=>gsap.to(cu,{scale:1,duration:.3}))})}
addEventListener('load',()=>ScrollTrigger.refresh());
})();
