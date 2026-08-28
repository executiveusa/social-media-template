import {validateDrop} from '../../engine.js';
import {requireApiKey} from '../../lib/api-auth.js';
export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  return res.status(200).json(validateDrop(req.body?.drop||req.body));
}
