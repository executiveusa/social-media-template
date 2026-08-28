import fs from 'node:fs';
const req=['AGENTS.md','icm/CONTEXT.md','icm/_system/agents/registry.json','icm/campaigns/asc3nd-first-12-event/CONTEXT.md','icm/campaigns/asc3nd-first-12-event/campaign.json','icm/campaigns/asc3nd-first-12-event/05_review/output/approval.json'];
let ok=true;
for(const p of req){if(!fs.existsSync(p)){console.error('FAIL missing',p);ok=false}else console.log('PASS',p)}
const reg=JSON.parse(fs.readFileSync('icm/_system/agents/registry.json','utf8'));
for(const a of reg.agents){if(!a.id||!a.input||!a.output){console.error('FAIL agent',a);ok=false}else console.log('PASS agent',a.id)}
if(fs.existsSync('icm/campaigns/asc3nd-first-12-event/05_review/output/approval.json')){const approval=JSON.parse(fs.readFileSync('icm/campaigns/asc3nd-first-12-event/05_review/output/approval.json','utf8'));if(typeof approval.approved!=='boolean'){console.error('FAIL approval schema');ok=false}}
if(!ok) process.exit(1); console.log('WALK TEST PASS');
