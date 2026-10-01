import {buildSocialExperienceCampaign} from '../../lib/strategy.js';
import {requireApiKey} from '../../lib/api-auth.js';

export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  const result=buildSocialExperienceCampaign(req.body||{});
  return res.status(result.validation?.ok?200:400).json(result);
}
