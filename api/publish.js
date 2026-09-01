import {validateDrop,variantsFor} from '../engine.js';
import {platformCheck} from '../platforms.js';
import {requireApiKey} from '../lib/api-auth.js';
import {scheduleWithPostiz} from '../lib/postiz.js';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  const {drop,approval}=req.body||{};
  const validation=validateDrop(drop);
  if(!validation.ok) return res.status(400).json(validation);
  const checked=variantsFor(drop).map(variant=>({...variant,check:platformCheck(drop,variant.platform)}));
  const blocked=checked.filter(variant=>!variant.check.ok);
  if(blocked.length) return res.status(409).json({error:'platform_validation_failed',blocked:blocked.map(({platform,check})=>({platform,error:check.error}))});
  const result=await scheduleWithPostiz({drop,variants:checked.map(({check,...variant})=>variant),approval});
  return res.status(result.status).json(result.body);
}
