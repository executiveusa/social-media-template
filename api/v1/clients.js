import {requireApiKey} from '../../lib/api-auth.js';

const clients=[
  {id:'asc3nd',name:'ASC3ND',industry:'nonprofit',roles:{monday:'belief',wednesday:'story',friday:'action'}},
  {id:'crown-and-core',name:'Crown & Core',industry:'medspa',roles:{monday:'learn',wednesday:'see',friday:'experience'}}
];

export default function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  return res.status(200).json({schemaVersion:'3.0',framework:['learn','see','experience'],clients});
}
