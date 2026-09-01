window.MOSQUEE_SUPABASE={
  url:'https://volmqjjvcytkojbfvvfz.supabase.co',
  anonKey:'sb_publishable_diSeRgkeYT7DAvDZnWSNmQ_BbgOYgvj',
  enabled:true
};
(function(){
  function add(id,src){if(document.getElementById(id))return;var s=document.createElement('script');s.id=id;s.src=src;s.async=false;(document.head||document.documentElement).appendChild(s)}
  function loadFix(){var p=location.pathname;if(/\/admin\.html$/i.test(p))add('admin-save-fix-loader','admin-save-fix.js?v=20260901save3');if(/\/modifier-horaires\.html$/i.test(p))add('public-times-save-fix-loader','public-times-save-fix.js?v=20260901save1')}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadFix);else loadFix();
})();
