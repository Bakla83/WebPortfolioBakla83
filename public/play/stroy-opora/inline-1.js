
  // Apply any previously chosen theme before first paint to avoid a flash.
  (function(){
    try{
      var t = localStorage.getItem('opora-theme');
      if(t === 'light' || t === 'dark'){ document.documentElement.setAttribute('data-theme', t); }
    }catch(e){}
  })();
