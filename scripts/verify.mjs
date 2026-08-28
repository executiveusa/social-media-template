import fs from 'node:fs';
const must=['index.html','styles.css','app.js','engine.js','platforms.js','api/publish.js','api/health.js','api/mcp.js','api/v1/metadata.js','api/v1/validate.js','api/v1/adapt.js','api/v1/schedule.js','lib/api-auth.js','lib/postiz.js','bin/social-drop.mjs','vercel.json','AGENTS.md','icm/CONTEXT.md'];
for(const f of must){if(!fs.existsSync(f))throw new Error(`missing ${f}`)}
const html=fs.readFileSync('index.html','utf8');if(!html.includes('Social Drop Factory')||!html.includes('app.js'))throw new Error('UI wiring failed');
const postiz=fs.readFileSync('lib/postiz.js','utf8');if(!postiz.includes('human_approval_required')||!postiz.includes('POSTIZ_API_KEY'))throw new Error('publish guard failed');
const mcp=fs.readFileSync('api/mcp.js','utf8');if(!mcp.includes("tools/list")||!mcp.includes('schedule_social_drop')||!mcp.includes('requireApiKey'))throw new Error('MCP wiring failed');
const cli=fs.readFileSync('bin/social-drop.mjs','utf8');if(!cli.includes('/api/v1/schedule')||!cli.includes('SOCIAL_DROP_API_KEY'))throw new Error('CLI wiring failed');
console.log('VERIFY PASS');
