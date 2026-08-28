#!/usr/bin/env node
import fs from 'node:fs';

const [,,cmd,...rest]=process.argv;
const base=(process.env.SOCIAL_DROP_API_URL||'https://social-drop-factory.vercel.app').replace(/\/$/,'');
const token=process.env.SOCIAL_DROP_API_KEY||'';
const flag=name=>{const i=rest.indexOf(name);return i>=0?rest[i+1]:null};
const json=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const call=async(path,body)=>{
  const r=await fetch(`${base}${path}`,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={raw:text}};
  if(!r.ok){console.error(JSON.stringify(data,null,2));process.exitCode=1;return data;}
  console.log(JSON.stringify(data,null,2));return data;
};

if(!cmd||cmd==='help'||cmd==='--help'){
  console.log(`social-drop <command>\n\nCommands:\n  metadata\n  validate --file drop.json\n  adapt --file drop.json\n  schedule --file drop.json --approval approval.json\n  mcp-info\n\nEnv:\n  SOCIAL_DROP_API_URL\n  SOCIAL_DROP_API_KEY`);
}else if(cmd==='metadata') await call('/api/v1/metadata');
else if(cmd==='validate') await call('/api/v1/validate',{drop:json(flag('--file'))});
else if(cmd==='adapt') await call('/api/v1/adapt',{drop:json(flag('--file'))});
else if(cmd==='schedule') await call('/api/v1/schedule',{drop:json(flag('--file')),approval:json(flag('--approval'))});
else if(cmd==='mcp-info') console.log(JSON.stringify({url:`${base}/api/mcp`,transport:'streamable-http/json-rpc',authorization:'Bearer SOCIAL_DROP_API_KEY'},null,2));
else {console.error(`Unknown command: ${cmd}`);process.exitCode=1;}
