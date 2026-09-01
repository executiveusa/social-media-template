export const CONTENT_TYPES=['post','reel','story','carousel','sales_pitch','event','fundraiser','testimonial','call_to_action'];
export const PLATFORMS=['instagram','facebook','linkedin','tiktok','youtube','x'];
export const PLATFORM_LIMITS={instagram:2200,facebook:63206,linkedin:3000,tiktok:2200,youtube:5000,x:280};

const tags=value=>Array.isArray(value)?value.filter(Boolean).map(tag=>String(tag).startsWith('#')?String(tag):`#${tag}`):[];
const validDate=value=>!value||!Number.isNaN(Date.parse(value));

export function validateDrop(drop){
  const errors=[];
  if(!drop||typeof drop!=='object') return {ok:false,errors:['drop required']};
  if(!String(drop.id||'').trim()) errors.push('id required');
  if(!CONTENT_TYPES.includes(drop.type)) errors.push('unsupported type');
  if(!String(drop.message||'').trim()) errors.push('message required');
  if(!Array.isArray(drop.platforms)||drop.platforms.length===0) errors.push('platform required');
  else {
    const unknown=drop.platforms.filter(p=>!PLATFORMS.includes(p));
    if(unknown.length) errors.push(`unsupported platforms: ${[...new Set(unknown)].join(', ')}`);
    if(new Set(drop.platforms).size!==drop.platforms.length) errors.push('duplicate platforms');
  }
  if(!validDate(drop.scheduledAt)) errors.push('scheduledAt must be ISO-8601 compatible');
  if(drop.targets&&typeof drop.targets!=='object') errors.push('targets must be an object');
  return {ok:errors.length===0,errors};
}

export function adaptDrop(drop,platform){
  const base=String(drop?.platformCopy?.[platform]??drop?.message??'').trim();
  const cta=drop?.cta?.url?` ${drop.cta.label||'Learn more'}: ${drop.cta.url}`:'';
  const platformTags=tags(drop?.platformHashtags?.[platform]);
  const sharedTags=tags(drop?.hashtags);
  const suffix=(platformTags.length?platformTags:sharedTags).join(' ');
  let text=[`${base}${cta}`.trim(),suffix].filter(Boolean).join(' ').trim();
  const max=PLATFORM_LIMITS[platform]||2200;
  if(text.length>max) text=`${text.slice(0,Math.max(0,max-1))}…`;
  return {platform,text,contentType:drop?.type,media:drop?.media??null,scheduledAt:drop?.scheduledAt??null};
}

export function variantsFor(drop){
  return Array.isArray(drop?.platforms)?drop.platforms.map(platform=>adaptDrop(drop,platform)):[];
}
