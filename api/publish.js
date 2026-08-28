export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'});
  const {drop,variants,approval}=req.body||{};
  if(!approval?.approved) return res.status(409).json({error:'human_approval_required'});
  if(!drop?.scheduledAt) return res.status(400).json({error:'scheduledAt_required'});
  const token=process.env.POSTIZ_API_KEY; const base=process.env.POSTIZ_API_URL||'https://api.postiz.com';
  if(!token) return res.status(503).json({error:'postiz_not_configured',dryRun:true,payload:{drop,variants}});
  try{
    const upstream=await fetch(`${base.replace(/\/$/,'')}/public/v1/posts`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':token},body:JSON.stringify({type:'schedule',date:drop.scheduledAt,posts:variants})});
    const text=await upstream.text(); let data; try{data=JSON.parse(text)}catch{data={raw:text}};
    return res.status(upstream.ok?200:502).json({ok:upstream.ok,provider:'postiz',status:upstream.status,data});
  }catch(error){return res.status(502).json({error:'postiz_request_failed',message:error.message});}
}
