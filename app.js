import {CONTENT_TYPES,PLATFORMS,validateDrop,variantsFor} from './engine.js';
import {platformCheck} from './platforms.js';
const $=s=>document.querySelector(s); const key='social-drop-factory:v1';
const seed={id:'final-invite-reel',type:'reel',message:'We shared the story. Now come be part of it.',cta:{label:'Join us',url:'https://asc3nd.org'},platforms:['instagram','facebook'],scheduledAt:'',media:'event-reel.mp4'};
let state=JSON.parse(localStorage.getItem(key)||'null')||{drop:seed,approved:false,receipt:null};
function save(){localStorage.setItem(key,JSON.stringify(state));}
function esc(s=''){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function render(){
 $('#type').innerHTML=CONTENT_TYPES.map(x=>`<option ${x===state.drop.type?'selected':''}>${x}</option>`).join('');
 $('#message').value=state.drop.message; $('#cta').value=state.drop.cta?.url||''; $('#schedule').value=state.drop.scheduledAt||'';
 $('#platforms').innerHTML=PLATFORMS.map(p=>`<label><input type="checkbox" value="${p}" ${state.drop.platforms.includes(p)?'checked':''}> ${p}</label>`).join('');
 $('#approved').checked=state.approved;
 const validation=validateDrop(state.drop); $('#validation').textContent=validation.ok?'DROP VALID':validation.errors.join(' · ');
 $('#previews').innerHTML=variantsFor(state.drop).map(v=>{const c=platformCheck(state.drop,v.platform);return `<article class="preview"><small>${v.platform.toUpperCase()} · ${c.ok?'READY':'BLOCKED'}</small><p>${esc(v.text)}</p>${c.ok?'':`<em>${esc(c.error)}</em>`}</article>`}).join('');
 $('#receipt').textContent=state.receipt?JSON.stringify(state.receipt,null,2):'No publish receipt yet.';
}
function read(){state.drop.type=$('#type').value;state.drop.message=$('#message').value;state.drop.cta={label:'Join us',url:$('#cta').value};state.drop.scheduledAt=$('#schedule').value;state.drop.platforms=[...document.querySelectorAll('#platforms input:checked')].map(x=>x.value);state.approved=$('#approved').checked;save();render();}
async function schedule(){read();const variants=variantsFor(state.drop).filter(v=>platformCheck(state.drop,v.platform).ok);try{const r=await fetch('/api/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({drop:state.drop,variants,approval:{approved:state.approved}})});state.receipt=await r.json();}catch(e){state.receipt={error:'network_error',message:e.message};}save();render();}
document.addEventListener('input',e=>{if(e.target.matches('#type,#message,#cta,#schedule,#platforms input,#approved'))read()});
$('#scheduleBtn').addEventListener('click',schedule); $('#resetBtn').addEventListener('click',()=>{localStorage.removeItem(key);location.reload()}); render();
