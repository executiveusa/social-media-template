import {requireApiKey} from '../../lib/api-auth.js';
import {getPostAnalytics,getIntegrationAnalytics} from '../../lib/postiz.js';
export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  const {postId,integrationId,days='7'}=req.query||{};
  const lookback=String(Math.min(90,Math.max(1,Number(days)||7)));
  if(!postId&&!integrationId) return res.status(400).json({error:'postId_or_integrationId_required'});
  const result=postId?await getPostAnalytics(postId,lookback):await getIntegrationAnalytics(integrationId,lookback);
  return res.status(result.ok?200:result.status).json(result.data);
}
