export default function handler(req,res){res.status(200).json({ok:true,service:'social-drop-factory',postizConfigured:Boolean(process.env.POSTIZ_API_KEY)});}
