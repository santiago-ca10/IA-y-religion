(function(){
  var track=document.getElementById('track');
  var slides=[].slice.call(track.children);
  var dots=document.getElementById('dots'), count=document.getElementById('count'), prog=document.getElementById('prog');
  var prev=document.getElementById('prev'), next=document.getElementById('next');
  var cur=0;

  slides.forEach(function(s,i){
    var d=document.createElement('i'); d.title='Diapositiva '+(i+1); d.onclick=function(){go(i)}; dots.appendChild(d);
    s.addEventListener('click',function(){ if(i!==cur) go(i); });
  });

  function place(){
    var w=slides[0].offsetWidth;
    var gap=parseFloat(getComputedStyle(track).columnGap)||28;
    var vw=document.getElementById('viewport').clientWidth;
    var x=(vw-w)/2 - cur*(w+gap);
    track.style.transform='translateX('+x+'px)';
  }
  function go(n){
    cur=Math.max(0,Math.min(slides.length-1,n));
    slides.forEach(function(s,i){ s.classList.toggle('active',i===cur); if(i===cur) s.scrollTop=0; });
    [].forEach.call(dots.children,function(d,i){ d.classList.toggle('on',i===cur); });
    count.textContent=(cur+1)+' / '+slides.length;
    prog.style.width=((cur+1)/slides.length*100)+'%';
    prev.disabled=(cur===0); next.disabled=(cur===slides.length-1);
    place();
    try{ history.replaceState(null,'','#'+(cur+1)); }catch(e){}
  }
  prev.onclick=function(){go(cur-1)};
  next.onclick=function(){go(cur+1)};
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();go(cur+1)}
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){go(cur-1)}
    else if(e.key==='Home'){go(0)} else if(e.key==='End'){go(slides.length-1)}
  });
  var sx=null;
  document.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  document.addEventListener('touchend',function(e){
    if(sx===null)return; var dx=e.changedTouches[0].clientX-sx;
    if(Math.abs(dx)>60) go(cur+(dx<0?1:-1)); sx=null;
  });
  window.addEventListener('resize',place);

  // tarjetas que voltean
  [].forEach.call(document.querySelectorAll('.flip'),function(b){ b.onclick=function(){b.classList.toggle('on')}; });
  // antes / con IA
  var rows=document.getElementById('rows');
  [].forEach.call(document.querySelectorAll('#seg button'),function(b){
    b.onclick=function(){
      [].forEach.call(document.querySelectorAll('#seg button'),function(x){x.classList.remove('on')});
      b.classList.add('on'); rows.classList.toggle('ai',b.dataset.m==='ai');
    };
  });
  // pestañas
  [].forEach.call(document.querySelectorAll('#tabs button'),function(b){
    b.onclick=function(){
      [].forEach.call(document.querySelectorAll('#tabs button'),function(x){x.classList.remove('on')});
      [].forEach.call(document.querySelectorAll('.panel'),function(p){p.classList.remove('on')});
      b.classList.add('on'); document.getElementById(b.dataset.p).classList.add('on');
    };
  });
  // reflexión
  document.getElementById('revBtn').onclick=function(){document.getElementById('rev').classList.toggle('open')};

  // inicio sin animación
  var h=parseInt(location.hash.replace('#',''),10);
  track.style.transition='none';
  go(isNaN(h)?0:h-1);
  requestAnimationFrame(function(){requestAnimationFrame(function(){track.style.transition='';place();})});
})();
