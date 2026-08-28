export function requireApiKey(req,res){
  const expected=process.env.SOCIAL_DROP_API_KEY;
  if(!expected){res.status(503).json({error:'api_auth_not_configured'});return false;}
  const auth=req.headers?.authorization||'';
  const token=auth.startsWith('Bearer ')?auth.slice(7):req.headers?.['x-api-key'];
  if(token!==expected){res.status(401).json({error:'unauthorized'});return false;}
  return true;
}
