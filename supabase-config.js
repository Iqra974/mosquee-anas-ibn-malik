window.MOSQUEE_SUPABASE={
  url:'https://volmqjjvcytkojbfvvfz.supabase.co',
  anonKey:'sb_publishable_diSeRgkeYT7DAvDZnWSNmQ_BbgOYgvj',
  enabled:true
};
(function(){
  if(!/admin\.html(?:$|[?#])/i.test(location.pathname+location.search+location.hash))return;
  function loadFix(){
    if(document.getElementById('admin-save-fix-loader'))return;
    var s=document.createElement('script');
    s.id='admin-save-fix-loader';
    s.src='admin-save-fix.js?v=20260901save3';
    s.async=false;
    (document.head||document.documentElement).appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadFix);else loadFix();
})();
