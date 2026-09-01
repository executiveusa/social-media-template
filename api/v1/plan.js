import {planEditorial} from '../../lib/planner.js';
import {requireApiKey} from '../../lib/api-auth.js';
export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  const plan=planEditorial(req.body||{});
  return res.status(plan.validation.ok?200:400).json(plan);
}
