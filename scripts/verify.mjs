import fs from 'node:fs';
const must=['index.html','styles.css','app.js','engine.js','platforms.js','api/publish.js','api/health.js','vercel.json','AGENTS.md','icm/CONTEXT.md'];
for(const f of must){if(!fs.existsSync(f))throw new Error(`missing ${f}`)}
const html=fs.readFileSync('index.html','utf8');if(!html.includes('Social Drop Factory')||!html.includes('app.js'))throw new Error('UI wiring failed');
const pub=fs.readFileSync('api/publish.js','utf8');if(!pub.includes('human_approval_required')||!pub.includes('POSTIZ_API_KEY'))throw new Error('publish guard failed');
console.log('VERIFY PASS');
