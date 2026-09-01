import {CONTENT_TYPES,PLATFORMS,validateDrop,variantsFor} from './engine.js';
import {platformCheck} from './platforms.js';
const $=selector=>document.querySelector(selector); const key='social-drop-factory:v2';
const seed={id:'editorial-drop',type:'post',message:'One strong source. Six native cuts. One accountable publishing path.',cta:{label:'Read more',url:''},platforms:['linkedin','x'],scheduledAt:'',hashtags:[]};
let state=JSON.parse(localStorage.getItem(key)||'null')||{drop:seed};
const save=()=>localStorage.setItem(key,JSON.stringify(state));
const esc=(value='')=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function render(){
  $('#type').innerHTML=CONTENT_TYPES.map(type=>`<option ${type===state.drop.type?'selected':''}>${type}</option>`).join('');
  $('#message').value=state.drop.message||''; $('#cta').value=state.drop.cta?.url||''; $('#schedule').value=state.drop.scheduledAt||'';
  $('#platforms').innerHTML=PLATFORMS.map(platform=>`<label><input type="checkbox" value="${platform}" ${state.drop.platforms?.includes(platform)?'checked':''}> ${platform}</label>`).join('');
  const validation=validateDrop(state.drop); const badge=$('#validation'); badge.textContent=validation.ok?'Ready to review':validation.errors[0]||'Needs work'; badge.className=`pill ${validation.ok?'good':'bad'}`;
  const variants=variantsFor(state.drop); $('#previewCount').textContent=`${variants.length} cut${variants.length===1?'':'s'}`;
  $('#previews').innerHTML=variants.length?variants.map(variant=>{const check=platformCheck(state.drop,variant.platform);return `<article class="preview"><small>${esc(variant.platform.toUpperCase())}<br>${check.ok?'READY':'BLOCKED'}</small><div><p>${esc(variant.text)}</p>${check.ok?'':`<em>${esc(check.error)}</em>`}</div></article>`}).join(''):'<p class="empty">Choose at least one platform.</p>';
}
function read(){
  state.drop.type=$('#type').value; state.drop.message=$('#message').value; state.drop.cta={label:'Read more',url:$('#cta').value}; state.drop.scheduledAt=$('#schedule').value; state.drop.platforms=[...document.querySelectorAll('#platforms input:checked')].map(input=>input.value); save(); render();
}
async function copyPayload(){
  read(); const payload=JSON.stringify({drop:state.drop},null,2); try{await navigator.clipboard.writeText(payload);$('#copyState').textContent='Agent payload copied. Validate, discover integrations, then stop for approval.';}catch{$('#copyState').textContent='Clipboard access was blocked. Copy the payload from browser storage or use the CLI.';}
}
document.addEventListener('input',event=>{if(event.target.matches('#type,#message,#cta,#schedule,#platforms input'))read()});
$('#copyBtn').addEventListener('click',copyPayload); $('#resetBtn').addEventListener('click',()=>{localStorage.removeItem(key);state={drop:{...seed,platforms:[...seed.platforms]}};save();render()}); render();
