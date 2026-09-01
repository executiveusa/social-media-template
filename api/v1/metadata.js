import {CONTENT_TYPES,PLATFORMS} from '../../engine.js';
import {requireApiKey} from '../../lib/api-auth.js';
export default function handler(req,res){if(req.method!=='GET')return res.status(405).json({error:'method_not_allowed'});if(!requireApiKey(req,res))return;res.status(200).json({contractVersion:'2.0',contentTypes:CONTENT_TYPES,platforms:PLATFORMS,humanApprovalRequired:true});}
