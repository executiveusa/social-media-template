import {CONTENT_TYPES,PLATFORMS,validateDrop,variantsFor} from '../engine.js';
import {platformCheck} from '../platforms.js';
import {planEditorial} from '../lib/planner.js';
import {listPostizIntegrations,uploadPostizFromUrl,scheduleWithPostiz,getPostAnalytics,getIntegrationAnalytics} from '../lib/postiz.js';
import {requireApiKey} from '../lib/api-auth.js';

const tools=[
  {name:'social_metadata',description:'Return the canonical content types, platforms, contract version, and human approval rule.',inputSchema:{type:'object',properties:{}}},
  {name:'social_plan_editorial',description:'Turn a blog/article/source plus distribution intent into a canonical Social Drop plan. Does not publish.',inputSchema:{type:'object',properties:{source:{type:'object'},distribution:{type:'object'}}}},
  {name:'social_validate_drop',description:'Validate a canonical Social Drop.',inputSchema:{type:'object',required:['drop'],properties:{drop:{type:'object'}}}},
  {name:'social_adapt_drop',description:'Generate platform variants and compatibility checks. Does not publish.',inputSchema:{type:'object',required:['drop'],properties:{drop:{type:'object'}}}},
  {name:'social_media_from_url',description:'Import an approved public HTTPS media URL into Postiz and return the provider asset.',inputSchema:{type:'object',required:['url'],properties:{url:{type:'string'}}}},
  {name:'social_list_integrations',description:'List connected Postiz channels so an agent can select explicit integration IDs.',inputSchema:{type:'object',properties:{}}},
  {name:'social_schedule_drop',description:'Schedule an exact approved Social Drop. Requires approved=true, approvedBy, approvedAt, scheduledAt, and resolvable channel targets.',inputSchema:{type:'object',required:['drop','approval'],properties:{drop:{type:'object'},approval:{type:'object'}}}},
  {name:'social_post_analytics',description:'Read Postiz analytics for a published post.',inputSchema:{type:'object',required:['postId'],properties:{postId:{type:'string'},days:{type:'number'}}}},
  {name:'social_channel_analytics',description:'Read Postiz analytics for a connected channel.',inputSchema:{type:'object',required:['integrationId'],properties:{integrationId:{type:'string'},days:{type:'number'}}}}
];
const textResult=value=>({content:[{type:'text',text:JSON.stringify(value)}],structuredContent:value});
const err=(id,code,message,data)=>({jsonrpc:'2.0',id,error:{code,message,...(data?{data}:{})}});
const ok=(id,result)=>({jsonrpc:'2.0',id,result});

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method_not_allowed'});
  if(!requireApiKey(req,res)) return;
  const msg=req.body||{}; const id=msg.id??null;
  if(msg.jsonrpc!=='2.0') return res.status(400).json(err(id,-32600,'Invalid Request'));
  if(msg.method==='initialize') return res.status(200).json(ok(id,{protocolVersion:'2025-06-18',capabilities:{tools:{}},serverInfo:{name:'social-drop-factory',version:'2.0.0'}}));
  if(msg.method==='notifications/initialized') return res.status(204).end();
  if(msg.method==='ping') return res.status(200).json(ok(id,{}));
  if(msg.method==='tools/list') return res.status(200).json(ok(id,{tools}));
  if(msg.method!=='tools/call') return res.status(404).json(err(id,-32601,'Method not found'));
  const name=msg.params?.name; const args=msg.params?.arguments||{};
  try{
    if(name==='social_metadata') return res.status(200).json(ok(id,textResult({contractVersion:'2.0',contentTypes:CONTENT_TYPES,platforms:PLATFORMS,humanApprovalRequired:true})));
    if(name==='social_plan_editorial') return res.status(200).json(ok(id,textResult(planEditorial(args))));
    if(name==='social_validate_drop') return res.status(200).json(ok(id,textResult(validateDrop(args.drop))));
    if(name==='social_adapt_drop'){
      const validation=validateDrop(args.drop); if(!validation.ok) return res.status(200).json(ok(id,{...textResult(validation),isError:true}));
      const variants=variantsFor(args.drop).map(v=>({...v,check:platformCheck(args.drop,v.platform)}));
      return res.status(200).json(ok(id,textResult({ok:true,variants})));
    }
    if(name==='social_media_from_url'){
      const result=await uploadPostizFromUrl(args.url); return res.status(200).json(ok(id,{...textResult(result.data),isError:!result.ok}));
    }
    if(name==='social_list_integrations'){
      const result=await listPostizIntegrations();
      return res.status(200).json(ok(id,{...textResult(result.data),isError:!result.ok}));
    }
    if(name==='social_schedule_drop'){
      const validation=validateDrop(args.drop); if(!validation.ok) return res.status(200).json(ok(id,{...textResult(validation),isError:true}));
      const checked=variantsFor(args.drop).map(v=>({...v,check:platformCheck(args.drop,v.platform)}));
      const blocked=checked.filter(v=>!v.check.ok); if(blocked.length) return res.status(200).json(ok(id,{...textResult({error:'platform_validation_failed',blocked}),isError:true}));
      const result=await scheduleWithPostiz({drop:args.drop,variants:checked.map(({check,...v})=>v),approval:args.approval});
      return res.status(200).json(ok(id,{...textResult(result.body),isError:result.status>=400}));
    }
    if(name==='social_post_analytics'){
      const result=await getPostAnalytics(args.postId,args.days||7); return res.status(200).json(ok(id,{...textResult(result.data),isError:!result.ok}));
    }
    if(name==='social_channel_analytics'){
      const result=await getIntegrationAnalytics(args.integrationId,args.days||7); return res.status(200).json(ok(id,{...textResult(result.data),isError:!result.ok}));
    }
    return res.status(200).json(err(id,-32602,'Unknown tool'));
  }catch(error){return res.status(200).json(err(id,-32603,'Internal error',{message:error.message}));}
}
