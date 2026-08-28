import {CONTENT_TYPES,PLATFORMS,validateDrop,variantsFor} from '../engine.js';
import {platformCheck} from '../platforms.js';
import {scheduleWithPostiz} from '../lib/postiz.js';
import {requireApiKey} from '../lib/api-auth.js';

const tools=[
  {name:'social_drop_metadata',description:'Return supported Social Drop content types and platforms.',inputSchema:{type:'object',properties:{}}},
  {name:'validate_social_drop',description:'Validate a canonical Social Drop.',inputSchema:{type:'object',required:['drop'],properties:{drop:{type:'object'}}}},
  {name:'adapt_social_drop',description:'Generate platform variants for a canonical Social Drop and report platform compatibility.',inputSchema:{type:'object',required:['drop'],properties:{drop:{type:'object'}}}},
  {name:'schedule_social_drop',description:'Schedule an approved Social Drop through Postiz. Requires approval.approved=true and scheduledAt.',inputSchema:{type:'object',required:['drop','approval'],properties:{drop:{type:'object'},approval:{type:'object',required:['approved'],properties:{approved:{type:'boolean'},approvedBy:{type:['string','null']},approvedAt:{type:['string','null']}}}}}}
];

const textResult=value=>({content:[{type:'text',text:JSON.stringify(value)}],structuredContent:value});
const err=(id,code,message,data)=>({jsonrpc:'2.0',id,error:{code,message,...(data?{data}: {})}});
const ok=(id,result)=>({jsonrpc:'2.0',id,result});

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  const msg=req.body||{}; const id=msg.id??null;
  if(msg.jsonrpc!=='2.0') return res.status(400).json(err(id,-32600,'Invalid Request'));
  if(msg.method==='initialize') return res.status(200).json(ok(id,{protocolVersion:'2025-06-18',capabilities:{tools:{}},serverInfo:{name:'social-drop-factory',version:'1.0.0'}}));
  if(msg.method==='notifications/initialized') return res.status(204).end();
  if(msg.method==='ping') return res.status(200).json(ok(id,{}));
  if(msg.method==='tools/list') return res.status(200).json(ok(id,{tools}));
  if(msg.method!=='tools/call') return res.status(404).json(err(id,-32601,'Method not found'));
  const name=msg.params?.name; const args=msg.params?.arguments||{};
  try{
    if(name==='social_drop_metadata') return res.status(200).json(ok(id,textResult({contentTypes:CONTENT_TYPES,platforms:PLATFORMS})));
    if(name==='validate_social_drop') return res.status(200).json(ok(id,textResult(validateDrop(args.drop))));
    if(name==='adapt_social_drop'){
      const validation=validateDrop(args.drop); if(!validation.ok) return res.status(200).json(ok(id,{...textResult(validation),isError:true}));
      const variants=variantsFor(args.drop).map(v=>({...v,check:platformCheck(args.drop,v.platform)}));
      return res.status(200).json(ok(id,textResult({ok:true,variants})));
    }
    if(name==='schedule_social_drop'){
      const validation=validateDrop(args.drop); if(!validation.ok) return res.status(200).json(ok(id,{...textResult(validation),isError:true}));
      const variants=variantsFor(args.drop).filter(v=>platformCheck(args.drop,v.platform).ok);
      const result=await scheduleWithPostiz({drop:args.drop,variants,approval:args.approval});
      return res.status(200).json(ok(id,{...textResult(result.body),isError:result.status>=400}));
    }
    return res.status(200).json(err(id,-32602,'Unknown tool'));
  }catch(error){return res.status(200).json(err(id,-32603,'Internal error',{message:error.message}));}
}
