#!/usr/bin/env node
import fs from 'node:fs';

const [,,cmd,...rest]=process.argv;
const base=(process.env.SOCIAL_DROP_API_URL||'https://social-drop-factory.vercel.app').replace(/\/$/,'');
const token=process.env.SOCIAL_DROP_API_KEY||'';
const flag=name=>{const i=rest.indexOf(name);return i>=0?rest[i+1]:null};
const readJson=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const requireFlag=name=>{const value=flag(name);if(!value)throw new Error(`${name} required`);return value;};
const call=async(path,{method='GET',body}={})=>{
  const response=await fetch(`${base}${path}`,{method,headers:{Accept:'application/json',...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const text=await response.text(); let data; try{data=text?JSON.parse(text):null;}catch{data={raw:text};}
  process.stdout.write(`${JSON.stringify(data,null,2)}\n`);
  if(!response.ok) process.exitCode=1;
  return data;
};

const help=`social-drop <command>\n\nAgent-safe commands:\n  doctor\n  metadata\n  integrations\n  media-from-url --url https://...\n  plan --file editorial.json\n  validate --file drop.json\n  adapt --file drop.json\n  schedule --file drop.json --approval approval.json\n  analytics-post --id POST_ID [--days 7]\n  analytics-channel --id INTEGRATION_ID [--days 7]\n  mcp-info\n\nSafety:\n  plan/validate/adapt never publish.\n  schedule requires an API key plus exact human approval metadata.\n\nEnv:\n  SOCIAL_DROP_API_URL\n  SOCIAL_DROP_API_KEY`;

try{
  if(!cmd||['help','--help','-h'].includes(cmd)) console.log(help);
  else if(cmd==='doctor') await call('/api/v1/doctor');
  else if(cmd==='metadata') await call('/api/v1/metadata');
  else if(cmd==='integrations') await call('/api/v1/integrations');
  else if(cmd==='media-from-url') await call('/api/v1/media',{method:'POST',body:{url:requireFlag('--url')}});
  else if(cmd==='plan') await call('/api/v1/plan',{method:'POST',body:readJson(requireFlag('--file'))});
  else if(cmd==='validate') await call('/api/v1/validate',{method:'POST',body:{drop:readJson(requireFlag('--file'))}});
  else if(cmd==='adapt') await call('/api/v1/adapt',{method:'POST',body:{drop:readJson(requireFlag('--file'))}});
  else if(cmd==='schedule') await call('/api/v1/schedule',{method:'POST',body:{drop:readJson(requireFlag('--file')),approval:readJson(requireFlag('--approval'))}});
  else if(cmd==='analytics-post') await call(`/api/v1/analytics?postId=${encodeURIComponent(requireFlag('--id'))}&days=${encodeURIComponent(flag('--days')||'7')}`);
  else if(cmd==='analytics-channel') await call(`/api/v1/analytics?integrationId=${encodeURIComponent(requireFlag('--id'))}&days=${encodeURIComponent(flag('--days')||'7')}`);
  else if(cmd==='mcp-info') console.log(JSON.stringify({url:`${base}/api/mcp`,transport:'streamable-http/json-rpc',authorization:'Bearer SOCIAL_DROP_API_KEY'},null,2));
  else {console.error(`Unknown command: ${cmd}\n\n${help}`);process.exitCode=1;}
}catch(error){console.error(JSON.stringify({error:'cli_error',message:error.message},null,2));process.exitCode=1;}
