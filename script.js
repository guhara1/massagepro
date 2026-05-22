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
    var result=explorer.querySelector(".dong-result");
    var resultTitle=explorer.querySelector("[data-dong-title]");
    var resultDesc=explorer.querySelector("[data-dong-desc]");
    var resultList=explorer.querySelector("[data-dong-list]");
    if(!source||!actions||!result||!resultTitle||!resultDesc||!resultList){return;}

    var data;
    try{data=JSON.parse(source.textContent||"{}");}catch(e){return;}
    var districts=Object.keys(data);
    var prefix=explorer.getAttribute("data-link-prefix")||"";
    var itemLabel=explorer.getAttribute("data-item-label")||"통합 행정동";
    var titleTemplate=explorer.getAttribute("data-title-template")||"{name} 출장마사지 통합 행정동";
    var descTemplate=explorer.getAttribute("data-desc-template")||"숫자로 나뉜 1동, 2동, 3동은 하나의 동 이름으로 통합해 표시했습니다. 예약 상담 시에는 아래 동 이름과 가까운 기준 지점을 함께 알려주세요.";
    var pageLinkTemplate=explorer.getAttribute("data-page-link-label")||"{name} 지역 페이지 바로가기";

    function getItems(name){
      return Array.isArray(data[name])?data[name]:(data[name]&&data[name].dongs?data[name].dongs:[]);
    }

    function getSlug(name){
      return data[name]&&data[name].slug?data[name].slug:encodeURIComponent(name);
    }

    function getDongName(item){
      return typeof item==="string"?item:item.name;
    }

    function getDongSlug(item){
      return item&&typeof item==="object"&&item.slug?item.slug:"";
    }

    function render(name, shouldScroll){
      var dongs=getItems(name);
      var districtSlug=getSlug(name);
      resultTitle.textContent=titleTemplate.replace("{name}",name).replace("{label}",itemLabel);
      resultDesc.textContent=descTemplate.replace("{name}",name).replace("{label}",itemLabel);
      resultList.innerHTML="";
      dongs.forEach(function(dong){
        var dongName=getDongName(dong);
        var dongSlug=getDongSlug(dong);
        var chip=document.createElement(prefix&&dongSlug?"a":"span");
        chip.textContent=dongName;
        if(prefix&&dongSlug){
          chip.className="dong-chip-link";
          chip.href=prefix+districtSlug+"/"+dongSlug+"/";
          chip.setAttribute("aria-label",dongName+" 출장마사지 "+itemLabel+" 페이지로 이동");
        }
        resultList.appendChild(chip);
      });
      if(prefix){
        var pageLink=document.createElement("a");
        pageLink.className="dong-page-link";
        pageLink.href=prefix+districtSlug+"/";
        pageLink.textContent=pageLinkTemplate.replace("{name}",name).replace("{label}",itemLabel);
        resultList.appendChild(pageLink);
      }
      result.hidden=false;
      actions.querySelectorAll("button,a").forEach(function(btn){
        btn.classList.toggle("active",btn.getAttribute("data-district")===name);
      });
      if(shouldScroll){
        result.scrollIntoView({behavior:"smooth",block:"start"});
      }
    }

    function bindAction(el,name){
      el.setAttribute("data-district",name);
      el.addEventListener("click",function(event){
        event.preventDefault();
        render(name,true);
      });
    }

    actions.querySelectorAll("a").forEach(function(link){
      var href=link.getAttribute("href")||"";
      districts.forEach(function(name){
        if(href.indexOf("/"+getSlug(name)+"/")>-1){bindAction(link,name);}
      });
    });

    districts.forEach(function(name){
      if(actions.querySelector('[data-district="'+name+'"]')){return;}
      if(prefix){
        var link=document.createElement("a");
        link.textContent=name;
        link.href=prefix+getSlug(name)+"/";
        bindAction(link,name);
        actions.appendChild(link);
      }else{
        var btn=document.createElement("button");
        btn.type="button";
        btn.textContent=name;
        bindAction(btn,name);
        actions.appendChild(btn);
      }
    });

    if(districts.length){render(districts[0],false);}
  });
})();
