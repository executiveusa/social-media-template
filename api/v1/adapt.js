import {validateDrop,variantsFor} from '../../engine.js';
import {platformCheck} from '../../platforms.js';
import {requireApiKey} from '../../lib/api-auth.js';
export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  const drop=req.body?.drop||req.body;
  const validation=validateDrop(drop);
  if(!validation.ok) return res.status(400).json(validation);
  const variants=variantsFor(drop).map(v=>({...v,check:platformCheck(drop,v.platform)}));
  return res.status(200).json({ok:true,dropId:drop.id,variants});
}
