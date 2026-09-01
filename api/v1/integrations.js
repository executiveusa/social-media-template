import {requireApiKey} from '../../lib/api-auth.js';
import {listPostizIntegrations} from '../../lib/postiz.js';
export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  const result=await listPostizIntegrations();
  return res.status(result.ok?200:result.status).json(result.data);
}
