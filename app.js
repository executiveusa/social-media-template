const state={clients:[],client:null,campaign:null,shoot:null};

const $=s=>document.querySelector(s);
const esc=(value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const workflow=[
  ['01','Intake','Facts, source material, audience, offer, constraints, assets, baseline.','ready'],
  ['02','Strategy','Four customer questions, Learn / See / Experience, 12-post month.','ready'],
  ['03','Create','Shot list, reels, carousels, copy, asset requests.','waiting'],
  ['04','Adapt','Convert approved canonical posts into platform-ready variants.','waiting'],
  ['05','Review','Exact human approval for the artifact being scheduled.','blocked'],
  ['06','Schedule','Validate, discover integrations, select explicit targets.','blocked'],
  ['07','Publish','Postiz executes and Social Drops preserves provider receipts.','blocked'],
  ['08','Measure','Read analytics, write learning, feed the next campaign.','waiting']
];

async function json(url){
  const res=await fetch(url,{cache:'no-store'});
  if(!res.ok) throw new Error('Failed to load '+url);
  return res.json();
}

async function boot(){
  const registry=await json('/clients/index.json');
  state.clients=registry.clients;
  $('#clientSelect').innerHTML=state.clients.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>').join('');
  const preferred=state.clients.find(c=>c.id==='crown-and-core')||state.clients[0];
  $('#clientSelect').value=preferred.id;
  $('#clientSelect').addEventListener('change',e=>loadClient(e.target.value));
  wireTabs();
  wireCopy();
  renderWorkflow();
  await loadClient(preferred.id);
}

async function loadClient(id){
  const registry=state.clients.find(c=>c.id===id);
  state.client=await json('/clients/'+id+'/manifest.json');
  $('#clientName').textContent=registry?.name||state.client.name||id;

  if(id==='crown-and-core'){
    state.campaign=await json('/icm/campaigns/crown-core-tshape-month-01/campaign.json');
    state.shoot=await json('/icm/campaigns/crown-core-tshape-month-01/03_create/shoot-plan.json');
    $('#campaignName').textContent='T-Shape 2 · Month 1';
    $('#claimsState').textContent='Verified wording + provider approval required';
  }else{
    state.campaign=buildAsc3ndDemo(state.client);
    state.shoot={captureGroups:[
      {name:'community',shots:['real participants','program moments','mentor interactions']},
      {name:'story',shots:['one human story','one event sequence','one proof moment']},
      {name:'action',shots:['participation path','event details','clear next step']}
    ]};
    $('#campaignName').textContent='ASC3ND · community mentorship';
    $('#claimsState').textContent='No regulated treatment claim ledger';
  }
  renderCampaign();
}

function buildAsc3ndDemo(client){
  const questions=['What is ASC3ND?','What does the work look like?','Who is it for?','How can someone take part?'];
  return {
    id:'asc3nd-community-month',
    objective:'Help people understand the mission, see real community work, and know how to participate.',
    weeks:questions.map((q,i)=>({week:i+1,question:q,posts:[
      {day:'monday',role:'learn',topic:['Why ASC3ND exists','What the program does','Who the community serves','What participation means'][i],format:'post'},
      {day:'wednesday',role:'see',topic:['Meet the people','See the program','Hear a real story','Inside the event'][i],format:'reel'},
      {day:'friday',role:'experience',topic:['What happens next','What joining looks like','What support looks like','How to take part'][i],format:'cta'}
    ]}))
  };
}

function wireTabs(){
  document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===btn));
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+btn.dataset.view));
  }));
}

function renderWorkflow(){
  $('#workflow').innerHTML=workflow.map(([n,title,desc,status])=>
    '<div class="workflow-row"><span class="num">'+n+'</span><strong>'+esc(title)+'</strong><p>'+esc(desc)+'</p><span class="status '+status+'">'+
    (status==='ready'?'Ready':status==='blocked'?'Human gate':'Next')+'</span></div>'
  ).join('');
}

function renderCampaign(){
  if(!state.campaign)return;
  $('#strategyObjective').textContent=state.campaign.objective||'';
  $('#weeks').innerHTML=(state.campaign.weeks||[]).map(week=>
    '<article class="week"><div class="week-head"><span>WEEK '+String(week.week).padStart(2,'0')+'</span><h3>'+esc(week.question)+'</h3></div><div class="posts">'+
    week.posts.map(post=>'<div class="post"><small>'+esc(post.day.toUpperCase())+' · '+esc(post.role.toUpperCase())+'</small><b>'+esc(post.topic)+'</b><em>'+esc(post.format||'post')+'</em></div>').join('')+
    '</div></article>'
  ).join('');

  const rows=[...(state.campaign.weeks||[])].reverse();
  $('#instagramGrid').innerHTML=rows.flatMap(week=>{
    const byDay=Object.fromEntries(week.posts.map(p=>[p.day,p]));
    return ['friday','wednesday','monday'].map(day=>{
      const p=byDay[day];
      return '<div class="grid-tile '+esc(p.role)+'"><small>'+esc(p.role)+'</small><b>'+esc(p.topic)+'</b></div>';
    });
  }).join('');

  $('#productionPlan').innerHTML=(state.shoot?.captureGroups||[]).map(group=>
    '<article class="capture"><h3>'+esc(titleCase(group.name))+'</h3><ul>'+group.shots.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></article>'
  ).join('');
}

function titleCase(v){return String(v).replace(/[-_]/g,' ').replace(/\b\w/g,m=>m.toUpperCase())}

function wireCopy(){
  $('#copyCampaign').addEventListener('click',async()=>{
    await copy(JSON.stringify(state.campaign,null,2),'#copyStatus','Campaign JSON copied.');
  });
  $('#copyApproval').addEventListener('click',async()=>{
    const approval={
      campaignId:state.campaign?.id||'campaign',
      artifactHash:'replace-with-final-artifact-hash',
      approved:false,
      approvedBy:'',
      approvedAt:'',
      scope:'campaign-final'
    };
    await copy(JSON.stringify(approval,null,2),'#approvalStatus','Approval template copied.');
  });
}

async function copy(value,target,message){
  try{await navigator.clipboard.writeText(value);$(target).textContent=message}
  catch{$(target).textContent='Clipboard access was blocked by the browser.'}
}

boot().catch(error=>{
  console.error(error);
  $('#clientName').textContent='Load failed';
  $('#campaignName').textContent=error.message;
});
