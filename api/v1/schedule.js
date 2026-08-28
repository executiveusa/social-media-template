import {validateDrop,variantsFor} from '../../engine.js';
import {platformCheck} from '../../platforms.js';
import {requireApiKey} from '../../lib/api-auth.js';
import {scheduleWithPostiz} from '../../lib/postiz.js';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  const {drop,approval}=req.body||{};
  const validation=validateDrop(drop);
  if(!validation.ok) return res.status(400).json(validation);
  const variants=variantsFor(drop).filter(v=>platformCheck(drop,v.platform).ok);
  const result=await scheduleWithPostiz({drop,variants,approval});
  return res.status(result.status).json(result.body);
}
