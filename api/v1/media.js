import {requireApiKey} from '../../lib/api-auth.js';
import {uploadPostizFromUrl} from '../../lib/postiz.js';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  const result=await uploadPostizFromUrl(req.body?.url);
  return res.status(result.ok?200:result.status).json(result.data);
}
