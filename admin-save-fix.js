(function(){
'use strict';
function byId(id){return document.getElementById(id);}
function status(msg,type){var e=byId('timesStatus');if(!e)return;e.className='status '+(type||'ok');e.textContent=msg;}
function val(id){var e=byId(id);return e?e.value:'';}
function headers(token){var sb=window.MOSQUEE_SUPABASE;return {apikey:sb.anonKey,Authorization:'Bearer '+token,'Content-Type':'application/json',Prefer:'return=representation'};}
function save(e){
 e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
 var token=sessionStorage.getItem('anasAdminToken')||'';var sb=window.MOSQUEE_SUPABASE;
 if(!token){status('Session expirée. Déconnectez-vous puis reconnectez-vous.','error');return false;}
 var prayers={Fajr:val('Fajr'),Dhuhr:val('Dhuhr'),Asr:val('Asr'),Isha:val('Isha')};
 var adhan={Fajr:val('AdhanFajr'),Dhuhr:val('AdhanDhuhr'),Asr:val('AdhanAsr'),Isha:val('AdhanIsha')};
 var jumua=val('Jumua');
 if(!confirm("Confirmez-vous l’enregistrement des horaires ?"))return false;
 var btn=byId('saveTimes');btn.disabled=true;status('Enregistrement en cours…','warn');
 fetch(sb.url+'/rest/v1/mosque_settings?id=eq.anas-ibn-malik',{method:'PATCH',headers:headers(token),body:JSON.stringify({prayers:prayers,adhan:adhan,jumua:jumua,updated_at:new Date().toISOString()})})
 .then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error('Enregistrement refusé ('+r.status+') '+t);});return r.json();})
 .then(function(rows){if(!rows||!rows.length)throw new Error('Aucune ligne modifiée dans Supabase.');status('✓ Horaires enregistrés avec succès. La modification a bien été envoyée aux écrans.','ok');var s=byId('syncState');if(s)s.textContent='Synchronisé • '+new Date().toLocaleString('fr-FR');})
 .catch(function(err){status('⛔ '+err.message,'error');})
 .then(function(){btn.disabled=false;});
 return false;
}
function init(){var b=byId('saveTimes');if(b)b.addEventListener('click',save,true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
