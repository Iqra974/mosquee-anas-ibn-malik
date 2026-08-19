const CACHE='anas-mosquee-display-v6';
const CORE=[
  './index.html','./style.css','./mobile.css','./app.js','./config.js','./supabase-config.js',
  './horaires_priere_zone_sud_reunion_complet.json',
  './images/IMG_20260809_195313.png','./images/minbar.png','./manifest.webmanifest'
];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.all(CORE.map(async asset=>{try{const r=await fetch(asset,{cache:'no-store'});if(r.ok)await cache.put(asset,r.clone())}catch(e){}}));await self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
async function offlinePage(){const cache=await caches.open(CACHE);return await cache.match('./index.html')}
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){
  event.respondWith((async()=>{try{const r=await fetch(event.request,{cache:'no-store'});if(r&&r.ok){const c=await caches.open(CACHE);await c.put('./index.html',r.clone())}return r}catch(e){return await offlinePage()||Response.error()}})());return;
 }
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const r=await fetch(event.request,{cache:'no-store'});
   if(r&&r.ok)await cache.put(url.pathname.replace('/mosquee-anas-ibn-malik/','./'),r.clone());
   return r;
  }catch(e){
   return await cache.match(event.request,{ignoreSearch:true})||await cache.match(url.pathname.replace('/mosquee-anas-ibn-malik/','./'))||new Response('',{status:503});
  }
 })());
});