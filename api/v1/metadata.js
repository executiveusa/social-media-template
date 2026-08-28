import {CONTENT_TYPES,PLATFORMS} from '../../engine.js';
export default function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'method_not_allowed'});
  return res.status(200).json({service:'social-drop-factory',version:'1.0.0',contentTypes:CONTENT_TYPES,platforms:PLATFORMS,mcp:'/api/mcp'});
}
