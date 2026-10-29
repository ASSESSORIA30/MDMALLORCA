// Supabase Edge Function (Deno). Invoke from a scheduled job with NOTIFICATION_JOB_TOKEN.
// Configure server-side secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// RESEND_API_KEY, ENQUIRIES_FROM, ENQUIRIES_TO, NOTIFICATION_JOB_TOKEN.
// @ts-nocheck
Deno.serve(async(request)=>{
 if(request.method!=='POST'||request.headers.get('Authorization')!==`Bearer ${Deno.env.get('NOTIFICATION_JOB_TOKEN')}`||!Deno.env.get('NOTIFICATION_JOB_TOKEN'))return new Response('Forbidden',{status:403});
 const base=Deno.env.get('SUPABASE_URL');const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 const headers={apikey:service,Authorization:`Bearer ${service}`,'Content-Type':'application/json'};
 const key=Deno.env.get('RESEND_API_KEY'),from=Deno.env.get('ENQUIRIES_FROM'),to=Deno.env.get('ENQUIRIES_TO');
 if(!key||!from||!to)return new Response('Notification delivery not configured',{status:503});
 const result=await fetch(`${base}/rest/v1/notification_outbox?delivered_at=is.null&select=id,enquiry_id&limit=20`,{headers});
 if(!result.ok)return new Response('Outbox unavailable',{status:503});
 let delivered=0;
 for(const item of await result.json()){
  const leadResult=await fetch(`${base}/rest/v1/enquiries?id=eq.${item.enquiry_id}&select=*`,{headers});
  if(!leadResult.ok)continue;const [lead]=await leadResult.json();if(!lead)continue;
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':`enquiry-${item.id}`},body:JSON.stringify({from,to:[to],subject:'ModularDom — Private enquiry',text:`New private enquiry\n\n${lead.name}\n${lead.email}\n${lead.phone}\n${lead.country||''}\nResidence: ${lead.property}\n\n${lead.message}`})});
  if(response.ok){const saved=await fetch(`${base}/rest/v1/notification_outbox?id=eq.${item.id}`,{method:'PATCH',headers,body:JSON.stringify({delivered_at:new Date().toISOString()})});if(saved.ok)delivered++}
 }
 return Response.json({delivered});
});
