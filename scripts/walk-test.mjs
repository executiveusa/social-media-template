import fs from 'node:fs';
const req=['AGENTS.md','icm/CONTEXT.md','icm/_system/agents/registry.json'];
let ok=true;
for(const p of req){if(!fs.existsSync(p)){console.error('FAIL missing',p);ok=false}else console.log('PASS',p)}
const reg=JSON.parse(fs.readFileSync('icm/_system/agents/registry.json','utf8'));
for(const a of reg.agents){if(!a.id||!a.input||!a.output){console.error('FAIL agent',a);ok=false}else console.log('PASS agent',a.id)}
const campaign='icm/campaigns/asc3nd-final-event-week';
if(fs.existsSync(campaign)){
 for(const p of [`${campaign}/CONTEXT.md`,`${campaign}/campaign.json`,`${campaign}/05_review/output/approval.json`]){if(!fs.existsSync(p)){console.error('FAIL missing',p);ok=false}else console.log('PASS',p)}
 if(fs.existsSync(`${campaign}/05_review/output/approval.json`)){const a=JSON.parse(fs.readFileSync(`${campaign}/05_review/output/approval.json`,'utf8'));if(typeof a.approved!=='boolean'){console.error('FAIL approval schema');ok=false}}
}
if(!ok) process.exit(1); console.log('WALK TEST PASS');
