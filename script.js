(function(){
  var toggle=document.querySelector(".menu-toggle");
  var menu=document.querySelector("#primary-menu");
  if(toggle&&menu){
    toggle.addEventListener("click",function(){
      var open=menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded",String(open));
    });
    menu.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click",function(){
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded","false");
      });
    });
  }

  function ready(fn){
    if("requestIdleCallback" in window){requestIdleCallback(fn,{timeout:1200});}
    else{setTimeout(fn,1);}
  }
  ready(function(){
    if(!("IntersectionObserver" in window)){
      document.querySelectorAll(".reveal").forEach(function(el){el.classList.add("in");});
      return;
    }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:"80px"});
    document.querySelectorAll(".reveal").forEach(function(el){io.observe(el);});
  });
})();
