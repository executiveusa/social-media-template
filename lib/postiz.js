import {randomUUID} from 'node:crypto';

const ALIASES={
  instagram:['instagram','instagram-standalone'],
  facebook:['facebook','facebook-page','facebook_page'],
  linkedin:['linkedin','linkedin-page','linkedin_page'],
  tiktok:['tiktok'],
  youtube:['youtube'],
  x:['x','twitter']
};

const baseUrl=()=>`${(process.env.POSTIZ_API_URL||'https://api.postiz.com').replace(/\/$/,'')}/public/v1`;
const token=()=>process.env.POSTIZ_API_KEY||'';

async function request(path,{method='GET',body}={}){
  if(!token()) return {ok:false,status:503,data:{error:'postiz_not_configured'}};
  try{
    const response=await fetch(`${baseUrl()}${path}`,{
      method,
      headers:{Authorization:token(),...(body?{'Content-Type':'application/json'}:{})},
      ...(body?{body:JSON.stringify(body)}:{})
    });
    const text=await response.text();
    let data; try{data=text?JSON.parse(text):null;}catch{data={raw:text};}
    return {ok:response.ok,status:response.status,data};
  }catch(error){
    return {ok:false,status:502,data:{error:'postiz_request_failed',message:error.message}};
  }
}

export async function listPostizIntegrations(){
  return request('/integrations');
}

export async function uploadPostizFromUrl(url){
  if(!/^https:\/\//i.test(String(url||''))) return {ok:false,status:400,data:{error:'https_url_required'}};
  return request('/upload-from-url',{method:'POST',body:{url}});
}

const identity=integration=>String(integration?.identifier||integration?.type||integration?.provider||integration?.service||'').toLowerCase();
const matchesPlatform=(integration,platform)=>ALIASES[platform]?.includes(identity(integration))||false;

export function resolveIntegration(integrations,platform,target={}){
  const list=Array.isArray(integrations)?integrations:[];
  if(target?.integrationId){
    const exact=list.find(item=>String(item?.id)===String(target.integrationId));
    if(!exact) return {ok:false,error:'integration_not_found',platform,integrationId:target.integrationId};
    if(!matchesPlatform(exact,platform)) return {ok:false,error:'integration_platform_mismatch',platform,integrationId:target.integrationId};
    return {ok:true,integration:exact};
  }
  const matches=list.filter(item=>matchesPlatform(item,platform));
  if(matches.length===0) return {ok:false,error:'no_connected_integration',platform};
  if(matches.length>1) return {ok:false,error:'multiple_integrations_require_target',platform,candidates:matches.map(item=>({id:item.id,name:item.name||item.displayName||null,identifier:identity(item)}))};
  return {ok:true,integration:matches[0]};
}

function mediaFor(drop,platform){
  const source=drop?.platformMedia?.[platform]??drop?.media;
  if(!source) return {ok:true,image:[]};
  const list=Array.isArray(source)?source:[source];
  const image=[];
  for(const item of list){
    if(typeof item==='string'){
      if(!/^https:\/\//i.test(item)) return {ok:false,error:'media_must_be_https_or_postiz_asset',platform,value:item};
      image.push({path:item});
    }else if(item&&typeof item==='object'&&item.path){
      image.push({...(item.id?{id:item.id}:{}),path:item.path});
    }else return {ok:false,error:'invalid_media',platform};
  }
  return {ok:true,image};
}

export function buildPostizPosts({drop,variants,integrations}){
  const posts=[]; const errors=[];
  for(const variant of variants){
    const resolved=resolveIntegration(integrations,variant.platform,drop?.targets?.[variant.platform]);
    if(!resolved.ok){errors.push(resolved);continue;}
    const media=mediaFor(drop,variant.platform);
    if(!media.ok){errors.push(media);continue;}
    const providerType=identity(resolved.integration)||variant.platform;
    posts.push({
      integration:{id:resolved.integration.id},
      value:[{content:variant.text,image:media.image}],
      settings:{__type:providerType,...(drop?.platformSettings?.[variant.platform]||{})}
    });
  }
  return {ok:errors.length===0,posts,errors};
}

export function validateApproval(approval){
  if(approval?.approved!==true) return {ok:false,error:'human_approval_required'};
  if(!String(approval?.approvedBy||'').trim()) return {ok:false,error:'approvedBy_required'};
  if(!approval?.approvedAt||Number.isNaN(Date.parse(approval.approvedAt))) return {ok:false,error:'approvedAt_required'};
  return {ok:true};
}

export async function scheduleWithPostiz({drop,variants,approval}){
  const approvalCheck=validateApproval(approval);
  if(!approvalCheck.ok) return {status:409,body:approvalCheck};
  if(!drop?.scheduledAt||Number.isNaN(Date.parse(drop.scheduledAt))) return {status:400,body:{error:'valid_scheduledAt_required'}};
  if(!token()) return {status:503,body:{error:'postiz_not_configured',dryRun:true,drop,variants}};
  const integrationsResult=await listPostizIntegrations();
  if(!integrationsResult.ok) return {status:502,body:{error:'integration_discovery_failed',provider:'postiz',upstreamStatus:integrationsResult.status,details:integrationsResult.data}};
  const built=buildPostizPosts({drop,variants,integrations:integrationsResult.data});
  if(!built.ok) return {status:409,body:{error:'provider_target_resolution_failed',details:built.errors}};
  const payload={type:'schedule',date:new Date(drop.scheduledAt).toISOString(),shortLink:false,tags:[],posts:built.posts};
  const result=await request('/posts',{method:'POST',body:payload});
  const receipt={
    receiptId:randomUUID(),
    createdAt:new Date().toISOString(),
    action:'schedule',
    provider:'postiz',
    dropId:drop.id,
    scheduledAt:payload.date,
    integrations:built.posts.map(post=>post.integration.id),
    providerStatus:result.status,
    ok:result.ok,
    data:result.data
  };
  return {status:result.ok?200:502,body:receipt};
}

export async function getPostAnalytics(postId,days=7){
  return request(`/analytics/post/${encodeURIComponent(postId)}?date=${encodeURIComponent(days)}`);
}

export async function getIntegrationAnalytics(integrationId,days=7){
  return request(`/analytics/${encodeURIComponent(integrationId)}?date=${encodeURIComponent(days)}`);
}
