import fs from 'node:fs';
const required=['AGENTS.md','icm/CONTEXT.md','icm/_system/agents/registry.json','icm/_system/social-drop.schema.json','icm/_system/approval.schema.json','icm/_system/receipt.schema.json','icm/_templates/campaign/CONTEXT.md'];
let ok=true;
for(const path of required){if(!fs.existsSync(path)){console.error('FAIL missing',path);ok=false}else console.log('PASS',path)}
const entry=fs.existsSync('AGENTS.md')?fs.readFileSync('AGENTS.md','utf8'):'';
if(entry.split(/\r?\n/).length>60){console.error('FAIL AGENTS.md exceeds 60 lines');ok=false}
const registry=fs.existsSync('icm/_system/agents/registry.json')?JSON.parse(fs.readFileSync('icm/_system/agents/registry.json','utf8')):{agents:[]};
for(const agent of registry.agents||[]){if(!agent.id||!agent.stage||!agent.input||!agent.output||!agent.humanGate){console.error('FAIL agent contract',agent);ok=false}else console.log('PASS agent',agent.id)}
const stages=['01_intake','02_strategy','03_create','04_adapt','05_review','06_schedule','07_publish','08_measure'];
for(const stage of stages){const path=`icm/_templates/campaign/${stage}/CONTEXT.md`;if(!fs.existsSync(path)){console.error('FAIL missing',path);ok=false;continue}const text=fs.readFileSync(path,'utf8');for(const heading of ['## Inputs','## Job','## Outputs','## Human check'])if(!text.includes(heading)){console.error('FAIL contract',path,heading);ok=false}}
if(!ok) process.exit(1); console.log('WALK TEST PASS');
