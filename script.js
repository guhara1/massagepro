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

  document.querySelectorAll("[data-dong-explorer]").forEach(function(explorer){
    var dataId=explorer.getAttribute("data-source");
    var source=document.getElementById(dataId);
    var actions=explorer.querySelector("[data-dong-actions]");
    var resultTitle=explorer.querySelector("[data-dong-title]");
    var resultDesc=explorer.querySelector("[data-dong-desc]");
    var resultList=explorer.querySelector("[data-dong-list]");
    if(!source||!actions||!resultTitle||!resultDesc||!resultList){return;}
    var data;
    try{data=JSON.parse(source.textContent||"{}");}catch(e){return;}
    var districts=Object.keys(data);
    function render(name){
      var dongs=data[name]||[];
      resultTitle.textContent=name+" 출장마사지 행정동";
      resultDesc.textContent="숫자 분동은 한 묶음으로 통합해 표시했습니다. 예약 상담 시에는 아래 동 이름과 가까운 기준 지점을 함께 알려주세요.";
      resultList.innerHTML="";
      dongs.forEach(function(dong){
        var chip=document.createElement("span");
        chip.textContent=dong;
        resultList.appendChild(chip);
      });
      actions.querySelectorAll("button").forEach(function(btn){
        btn.classList.toggle("active",btn.getAttribute("data-district")===name);
      });
    }
    districts.forEach(function(name){
      var btn=document.createElement("button");
      btn.type="button";
      btn.textContent=name;
      btn.setAttribute("data-district",name);
      btn.addEventListener("click",function(){render(name);});
      actions.appendChild(btn);
    });
    if(districts.length){render(districts[0]);}
  });
})();
