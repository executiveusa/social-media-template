export const EDITORIAL_ROLES={
  learn:{day:'monday',purpose:'Answer one useful customer question clearly.'},
  see:{day:'wednesday',purpose:'Show the real person, place, product, treatment, event, or process.'},
  experience:{day:'friday',purpose:'Show what engaging with the organization actually involves and what happens next.'}
};

export const DEFAULT_QUESTIONS=[
  'What is it?',
  'What does it feel like?',
  'Is it for me?',
  'Why here?'
];

const text=value=>String(value??'').trim();

export function validateStrategyInput(input={}){
  const errors=[];
  if(!text(input.clientId)) errors.push('clientId required');
  if(!text(input.objective)) errors.push('objective required');
  if(input.questions && (!Array.isArray(input.questions)||input.questions.length!==4)) errors.push('questions must contain exactly four items');
  return {ok:errors.length===0,errors};
}

export function buildSocialExperienceCampaign(input={}){
  const validation=validateStrategyInput(input);
  if(!validation.ok) return {schemaVersion:'3.0',kind:'social_campaign_strategy',validation};

  const questions=(input.questions||DEFAULT_QUESTIONS).map(text);
  const overrides=input.posts||{};
  const weeks=questions.map((question,index)=>{
    const week=index+1;
    const custom=overrides[String(week)]||overrides[week]||{};
    return {
      week,
      question,
      posts:[
        {
          day:'monday',
          role:'learn',
          topic:text(custom.learn)||`Answer: ${question}`,
          format:text(custom.learnFormat)||'carousel'
        },
        {
          day:'wednesday',
          role:'see',
          topic:text(custom.see)||`Show: ${question}`,
          format:text(custom.seeFormat)||'reel'
        },
        {
          day:'friday',
          role:'experience',
          topic:text(custom.experience)||`Experience: ${question}`,
          format:text(custom.experienceFormat)||'post'
        }
      ]
    };
  });

  return {
    schemaVersion:'3.0',
    kind:'social_campaign_strategy',
    clientId:text(input.clientId),
    campaignId:text(input.campaignId)||`${text(input.clientId)}-campaign`,
    objective:text(input.objective),
    framework:['learn','see','experience'],
    cadence:[
      {day:'monday',role:'learn'},
      {day:'wednesday',role:'see'},
      {day:'friday',role:'experience'}
    ],
    grid:{
      publishOrder:['monday','wednesday','friday'],
      displayOrder:['friday','wednesday','monday']
    },
    weeks,
    humanApprovalRequired:true,
    next:'review_strategy',
    validation
  };
}
