import {requireApiKey} from '../../lib/api-auth.js';
export default function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  const postizConfigured=Boolean(process.env.POSTIZ_API_KEY);
  return res.status(200).json({
    ok:postizConfigured,
    service:'social-drop-factory',
    contractVersion:'2.0',
    apiAuthConfigured:Boolean(process.env.SOCIAL_DROP_API_KEY),
    provider:{name:'postiz',configured:postizConfigured,baseUrl:(process.env.POSTIZ_API_URL||'https://api.postiz.com').replace(/\/$/,'')},
    publishBoundary:'server-only',
    humanApprovalRequired:true
  });
}
