(function(){
'use strict';
var config=window.MOSQUEE_CONFIG||{};
var sb=window.MOSQUEE_SUPABASE||{};
var calendar=[],settings={};
var corrections={subh_sadiq:-3,lever_soleil:-3,zohr:0,asr:0,maghreb:3,isha:3};
function $(id){return document.getElementById(id);}
function pad(n){return n<10?'0'+n:String(n);}
function reunionNow(){return new Date(Date.now()+4*60*60*1000);}
function parts(){var d=reunionNow();return {year:d.getUTCFullYear(),month:d.getUTCMonth()+1,day:d.getUTCDate(),hour:d.getUTCHours(),minute:d.getUTCMinutes(),second:d.getUTCSeconds(),weekday:d.getUTCDay()};}
function fmt(v,pm){if(!v)return'--:--';var a=v.split(':'),h=parseInt(a[0],10),m=parseInt(a[1],10);if(pm&&h<12)h+=12;if(!pm&&h===12)h=0;return pad(h)+':'+pad(m);}
function shift(v,n){if(!v||v==='--:--')return v;var a=v.split(':'),t=parseInt(a[0],10)*60+parseInt(a[1],10)+n;t=(t+1440)%1440;return pad(Math.floor(t/60))+':'+pad(t%60);}
function corrected(v,pm,key){return shift(fmt(v,pm),corrections[key]||0);}
function findDay(){var p=parts(),i,d;for(i=0;i<calendar.length;i++){d=calendar[i];if(parseInt(d.mois_numero,10)===p.month&&parseInt(d.jour,10)===p.day)return d;}return null;}
function cfgPrayer(name,fallback){var i,p;if(settings.prayers&&settings.prayers[name])return settings.prayers[name];for(i=0;i<(config.prayers||[]).length;i++){p=config.prayers[i];if(p.name===name)return p.iqama||p.time||fallback;}return fallback;}
function adhan(name,fallback){if(name==='Maghrib')return fallback;if(settings.adhan&&settings.adhan[name])return settings.adhan[name];return fallback;}
function hijriText(){var h=settings.hijri;if(!h)return'—';if(typeof h==='string')return h;if(h.text)return h.text;if(h.date)return h.date;if(h.label)return h.label;var hp=[];if(h.day)hp.push(h.day);if(h.month)hp.push(h.month);if(h.year)hp.push(h.year);return hp.length?hp.join(' '):'—';}
function mins(v){if(!v||v.indexOf(':')<0)return 9999;var a=v.split(':');return parseInt(a[0],10)*60+parseInt(a[1],10);}
function loadLocalSettings(){try{var s=localStorage.getItem('anas_mosquee_settings');if(s)settings=JSON.parse(s)||{};}catch(e){}}
function saveLocalSettings(){try{localStorage.setItem('anas_mosquee_settings',JSON.stringify(settings));}catch(e){}}
function loadLocalCalendar(){try{var s=localStorage.getItem('anas_mosquee_calendar');if(s){var data=JSON.parse(s);if(data&&data.length){calendar=data;return true;}}}catch(e){}return false;}
function saveLocalCalendar(){try{if(calendar&&calendar.length)localStorage.setItem('anas_mosquee_calendar',JSON.stringify(calendar));}catch(e){}}
function render(){var d=findDay();if(!d)return;var auto={Fajr:corrected(d.subh_sadiq,false,'subh_sadiq'),Dhuhr:corrected(d.zohr,true,'zohr'),Asr:corrected(d.asr,true,'asr'),Maghrib:corrected(d.maghreb,true,'maghreb'),Isha:corrected(d.isha,true,'isha')};var names=['Fajr','Dhuhr','Asr','Maghrib','Isha'],html='',starts='',i,n,a,q,times=[],p=parts(),now=p.hour*60+p.minute,next=-1;
$('sunrise').textContent=corrected(d.lever_soleil,false,'lever_soleil');$('jumua-time').textContent=settings.jumua||config.jumua||'—';if($('hijri-date'))$('hijri-date').textContent=hijriText();
for(i=0;i<names.length;i++){n=names[i];a=adhan(n,auto[n]);q=n==='Maghrib'?a:cfgPrayer(n,a);times.push({name:n,a:a,q:q});if(next<0&&mins(q)>now)next=i;}
if(next<0)next=0;
for(i=0;i<times.length;i++){n=times[i].name;a=times[i].a;q=times[i].q;html+='<article class="prayer'+(i===next?' active':'')+'"><h2>'+n+'</h2><div class="prayer-main"><time>'+q+'</time></div><p class="adhan-line"><span class="adhan-icon">🔊</span><strong>'+a+'</strong></p></article>';starts+='<span>'+n+' <b>'+auto[n]+'</b></span>';}
$('prayer-grid').innerHTML=html;if($('solar-times'))$('solar-times').innerHTML='<strong>DÉBUT DES PRIÈRES</strong> '+starts;
}
function tick(){var p=parts();if($('clock'))$('clock').textContent=pad(p.hour)+':'+pad(p.minute)+':'+pad(p.second);var days=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],months=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];if($('today'))$('today').textContent=days[p.weekday]+' '+p.day+' '+months[p.month-1]+' '+p.year;}
function xhr(url,headers,cb){var x=new XMLHttpRequest();x.open('GET',url,true);var k;for(k in headers)if(headers.hasOwnProperty(k))x.setRequestHeader(k,headers[k]);x.onreadystatechange=function(){if(x.readyState===4)cb(x.status,x.responseText);};x.onerror=function(){cb(0,'');};x.send();}
function acceptCalendar(text){try{var data=JSON.parse(text);if(data&&data.horaires&&data.horaires.length){calendar=data.horaires;saveLocalCalendar();render();return true;}}catch(e){}return false;}
function loadCalendar(){var urls=['./horaires_priere_zone_sud_reunion_complet.json?v=20260831offline1','./horaires_priere_zone_sud_reunion_complet.json'];var i=0;function attempt(){if(i>=urls.length){if(loadLocalCalendar()){render();return;}showError();return;}var u=urls[i++];xhr(u,{},function(status,text){if(status>=200&&status<300&&acceptCalendar(text))return;attempt();});}attempt();}
function loadSettings(done){if(!sb.enabled||!sb.url||!sb.anonKey){done();return;}var url=sb.url+'/rest/v1/mosque_settings?id=eq.anas-ibn-malik&select=prayers,adhan,jumua,hijri,announcements,updated_at&_t='+Date.now();xhr(url,{apikey:sb.anonKey,Accept:'application/json','Cache-Control':'no-cache'},function(status,text){if(status>=200&&status<300){try{var rows=JSON.parse(text);if(rows&&rows.length){settings=rows[0]||{};saveLocalSettings();}}catch(e){}}done();});}
function showError(){if($('prayer-grid'))$('prayer-grid').innerHTML='<article class="prayer"><h2>Horaires indisponibles</h2></article>';}
document.title=(config.mosqueName||'Mosquée Anas Ibn Malik')+' — Horaires de prière';loadLocalSettings();loadLocalCalendar();tick();setInterval(tick,1000);if(calendar.length)render();loadSettings(loadCalendar);setInterval(function(){render();},30000);setInterval(function(){loadSettings(function(){render();});},10000);
})();