import {validateDrop,variantsFor} from '../engine.js';
import {platformCheck} from '../platforms.js';

const slugify=value=>String(value||'untitled').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||'untitled';

export function planEditorial(input={}){
  const source=input.source||{};
  const distribution=input.distribution||{};
  const id=distribution.id||source.id||slugify(source.slug||source.title);
  const message=distribution.message||source.excerpt||source.summary||source.title||'';
  const cta=distribution.cta||(source.url?{label:distribution.ctaLabel||'Read more',url:source.url}:undefined);
  const drop={
    id,
    type:distribution.type||'post',
    message,
    ...(cta?{cta}:{}),
    platforms:distribution.platforms||['linkedin','x'],
    ...(distribution.platformCopy?{platformCopy:distribution.platformCopy}:{}),
    ...(distribution.hashtags?{hashtags:distribution.hashtags}:{}),
    ...(distribution.platformHashtags?{platformHashtags:distribution.platformHashtags}:{}),
    ...(distribution.media?{media:distribution.media}:{}),
    ...(distribution.targets?{targets:distribution.targets}:{}),
    ...(distribution.platformSettings?{platformSettings:distribution.platformSettings}:{}),
    ...(distribution.scheduledAt?{scheduledAt:distribution.scheduledAt}:{}),
    source:{id:source.id||id,type:source.type||'article',title:source.title||null,url:source.url||null}
  };
  const validation=validateDrop(drop);
  const variants=variantsFor(drop).map(variant=>({...variant,check:platformCheck(drop,variant.platform)}));
  return {
    schemaVersion:'2.0',
    kind:'social_distribution_plan',
    source:drop.source,
    drop,
    validation,
    variants,
    humanApprovalRequired:true,
    next:validation.ok?'review_exact_plan':'fix_validation_errors'
  };
}
