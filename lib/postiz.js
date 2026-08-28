export async function scheduleWithPostiz({drop,variants,approval}){
  if(!approval?.approved) return {status:409,body:{error:'human_approval_required'}};
  if(!drop?.scheduledAt) return {status:400,body:{error:'scheduledAt_required'}};
  const token=process.env.POSTIZ_API_KEY;
  const base=process.env.POSTIZ_API_URL||'https://api.postiz.com';
  if(!token) return {status:503,body:{error:'postiz_not_configured',dryRun:true,payload:{drop,variants}}};
  try{
    const upstream=await fetch(`${base.replace(/\/$/,'')}/public/v1/posts`,{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':token},
      body:JSON.stringify({type:'schedule',date:drop.scheduledAt,posts:variants})
    });
    const text=await upstream.text();let data;try{data=JSON.parse(text)}catch{data={raw:text}};
    return {status:upstream.ok?200:502,body:{ok:upstream.ok,provider:'postiz',status:upstream.status,data}};
  }catch(error){return {status:502,body:{error:'postiz_request_failed',message:error.message}};}
}
