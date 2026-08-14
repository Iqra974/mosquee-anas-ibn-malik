const CACHE='anas-mosquee-display-v2';
const CORE=[
  './index.html','./style.css','./app.js','./config.js',
  './horaires_priere_zone_sud_reunion_complet.json',
  './images/IMG_20260809_195313.png','./images/minbar.png','./manifest.webmanifest'
];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await Promise.all(CORE.map(async asset=>{try{const r=await fetch(asset,{cache:'reload'});if(r.ok)await cache.put(asset,r)}catch(e){}}));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
async function cachedPage(){
  const cache=await caches.open(CACHE);
  return (await cache.match('./index.html')) || (await cache.match('index.html'));
}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      const fallback=await cachedPage();
      try{
        const response=await fetch(event.request);
        if(response&&response.ok){const cache=await caches.open(CACHE);await cache.put('./index.html',response.clone())}
        return response;
      }catch(e){
        return fallback || new Response('<!doctype html><meta charset="utf-8"><title>Hors connexion</title><body style="background:#243238;color:white;font-family:serif;text-align:center;padding:15vh 2rem"><h1>Mosquée Anas Ibn Malik</h1><p>Affichage hors connexion en cours de préparation.</p></body>',{headers:{'Content-Type':'text/html; charset=utf-8'}});
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(event.request,{ignoreSearch:true});
    if(cached)return cached;
    try{
      const response=await fetch(event.request);
      if(response&&response.ok)await cache.put(event.request,response.clone());
      return response;
    }catch(e){
      return new Response('',{status:503,statusText:'Offline'});
    }
  })());
});