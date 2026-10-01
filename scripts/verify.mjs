import fs from 'node:fs';

const must=[
  'index.html','styles.css','app.js','engine.js','platforms.js',
  'api/publish.js','api/health.js','api/mcp.js',
  'api/v1/metadata.js','api/v1/validate.js','api/v1/adapt.js','api/v1/plan.js',
  'api/v1/clients.js','api/v1/strategy.js','api/v1/integrations.js','api/v1/doctor.js',
  'api/v1/media.js','api/v1/analytics.js','api/v1/schedule.js',
  'lib/api-auth.js','lib/planner.js','lib/strategy.js','lib/postiz.js',
  'bin/social-drop.mjs','vercel.json','AGENTS.md','icm/CONTEXT.md',
  'clients/index.json','clients/asc3nd/manifest.json','clients/crown-and-core/manifest.json',
  'icm/_system/client.schema.json','icm/_system/strategy.schema.json',
  'icm/_system/campaign.schema.json','icm/_system/asset.schema.json',
  'icm/campaigns/crown-core-tshape-month-01/campaign.json'
];

for(const file of must){
  if(!fs.existsSync(file)) throw new Error(`missing ${file}`);
}

const html=fs.readFileSync('index.html','utf8');
if(!html.includes('Social Drops')||!html.includes('app.js')) throw new Error('UI wiring failed');

const app=fs.readFileSync('app.js','utf8');
if(app.includes('/api/publish')||app.includes('SOCIAL_DROP_API_KEY')) throw new Error('browser crossed privileged publish boundary');
for(const marker of ['Learn','See','Experience','copyCampaign']){
  if(!html.includes(marker)&&!app.includes(marker)) throw new Error(`UI missing ${marker}`);
}

const publish=fs.readFileSync('api/publish.js','utf8');
if(!publish.includes('requireApiKey')) throw new Error('compat publish route is not authenticated');

const strategy=fs.readFileSync('lib/strategy.js','utf8');
for(const marker of ['buildSocialExperienceCampaign','learn','see','experience']){
  if(!strategy.includes(marker)) throw new Error(`strategy engine missing ${marker}`);
}

const postiz=fs.readFileSync('lib/postiz.js','utf8');
for(const marker of ['integration:{id:resolved.integration.id}','value:[{content:variant.text','settings:{__type:providerType','multiple_integrations_require_target','human_approval_required']){
  if(!postiz.includes(marker)) throw new Error(`Postiz adapter missing ${marker}`);
}

const mcp=fs.readFileSync('api/mcp.js','utf8');
for(const marker of ['tools/list','social_build_campaign_strategy','social_plan_editorial','social_list_integrations','social_schedule_drop','social_post_analytics','requireApiKey']){
  if(!mcp.includes(marker)) throw new Error(`MCP wiring missing ${marker}`);
}

const cli=fs.readFileSync('bin/social-drop.mjs','utf8');
for(const marker of ['doctor','integrations','media-from-url','/api/v1/plan','/api/v1/schedule','analytics-post','SOCIAL_DROP_API_KEY']){
  if(!cli.includes(marker)) throw new Error(`CLI wiring missing ${marker}`);
}

console.log('VERIFY PASS');
