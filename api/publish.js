import {scheduleWithPostiz} from '../lib/postiz.js';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'});
  const result=await scheduleWithPostiz(req.body||{});
  return res.status(result.status).json(result.body);
}
