(function(){
var c=document.getElementById('door'),x=c.getContext('2d'),ov=document.getElementById('ov'),gate=document.querySelector('.gate');
var P=[],W=0,H=0,dpr=1,gap=8,m={x:-999,y:-999},t0=null,G={};
var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
function cl(v){return v<0?0:v>1?1:v}
function build(){
 var r=c.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;
 c.width=W*dpr;c.height=H*dpr;
 var mob=W<640;gap=mob?5.5:7.5;
 var dh=Math.min(H*(mob?.58:.74),W*1.2),dw=dh*.5,ox=(W-dw)/2,oy=H*(mob?.24:.09);
 var lw=Math.max(5,dw*.04);
 G={ox:ox,oy:oy,dw:dw,dh:dh,cx:W/2,cy:oy+dh/2,ix:ox+lw/2,iy:oy+lw/2,iw:dw-lw,ih:dh-lw};
 var o=document.createElement('canvas');o.width=W;o.height=H;var g=o.getContext('2d');
 g.fillStyle='#000';g.fillRect(0,0,W,H);
 g.fillStyle='rgb(0,70,0)';g.fillRect(ox,oy,dw,dh);
 var pw=dw*.34,ph=dh*.4,cols=[ox+dw*.1,ox+dw*.54],rows=[oy+dh*.06,oy+dh*.54];
 g.lineWidth=Math.max(2.5,dw*.014);
 cols.forEach(function(cx){rows.forEach(function(cy){
  g.fillStyle='rgb(0,125,0)';g.fillRect(cx,cy,pw,ph);g.strokeStyle='rgb(0,255,0)';g.strokeRect(cx,cy,pw,ph);
  g.strokeStyle='rgb(0,170,0)';g.strokeRect(cx+pw*.16,cy+ph*.12,pw*.68,ph*.76);
 })});
 g.fillStyle='rgb(0,255,0)';g.beginPath();g.arc(ox+dw*.94,oy+dh*.5,dw*.03,0,7);g.fill();
 g.strokeStyle='rgb(255,0,0)';g.lineWidth=lw;g.strokeRect(ox,oy,dw,dh);
 g.fillStyle='rgb(90,0,0)';g.beginPath();g.ellipse(W/2,oy+dh+lw,dw*.75,dh*.025,0,0,7);g.fill();
 var d=g.getImageData(0,0,W|0,H|0).data,asm=still||t0!==null;P=[];
 for(var yy=gap/2;yy<H;yy+=gap)for(var xx=gap/2;xx<W;xx+=gap){
  var i=((yy|0)*(W|0)+(xx|0))*4,rr=d[i],gg=d[i+1];
  if(rr>25||gg>25){
   var fr=rr>25,v=fr?Math.max(rr,120)/255:gg/255,a=Math.random()*6.28,s=Math.max(W,H)*(.4+Math.random()*.6);
   P.push({hx:xx,hy:yy,v:v,fr:fr,x:asm?xx:W/2+Math.cos(a)*s,y:asm?yy:H/2+Math.sin(a)*s,vx:0,vy:0,del:yy/H*450+Math.random()*350});
  }
 }
}
function tick(now){
 requestAnimationFrame(tick);
 x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
 var gh=gate.offsetHeight-innerHeight,p=gh>0?cl(-gate.getBoundingClientRect().top/gh):0;
 if(p>=1){return}
 var op=cl(p/.42),th=op*op*(3-2*op)*1.3,p2=cl((p-.38)/.62),zm=Math.max(W/G.iw,H/G.ih)*1.12,z=1+(zm-1)*p2*p2*p2;
 ov.style.opacity=1-cl(p/.18);
 if(t0===null)return;
 var el=now-t0,R=85,R2=R*R,mx=p<.02?m.x:-999,my=m.y;
 x.translate(G.cx,G.cy);x.scale(z,z);x.translate(-G.cx,-G.cy);
 if(op>0){var gr=x.createLinearGradient(0,G.iy,0,G.iy+G.ih);gr.addColorStop(0,'#f8f2e7');gr.addColorStop(1,'#e2d6c0');
  x.globalAlpha=op;x.fillStyle=gr;x.fillRect(G.ix,G.iy,G.iw,G.ih);}
 var cs=Math.cos(th),sn=Math.sin(th),fade=1-p2;
 for(var i=0;i<P.length;i++){
  var q=P[i];
  if(el>q.del){
   q.vx+=(q.hx-q.x)*.06;q.vy+=(q.hy-q.y)*.06;
   var dx=q.x-mx,dy=q.y-my,s2=dx*dx+dy*dy;
   if(s2<R2&&s2>1){var f=(1-s2/R2)*5,s=Math.sqrt(s2);q.vx+=dx/s*f;q.vy+=dy/s*f}
   q.vx*=.8;q.vy*=.8;q.x+=q.vx;q.y+=q.vy;
  }else if(!still)continue;
  var px=q.x,py=q.y;
  if(!q.fr&&th>0){var u=cl((px-G.ox)/G.dw);px=G.ox+(px-G.ox)*cs;py=G.cy+(py-G.cy)*(1+sn*u*.28)}
  x.globalAlpha=(.3+q.v*.7)*fade;
  x.fillStyle=q.v>.92?'#ff5a4f':'#e5322d';
  x.beginPath();x.arc(px,py,gap*(.1+q.v*.28),0,6.283);x.fill();
 }
 x.setTransform(dpr,0,0,dpr,0,0);
 if(p2>.82){x.globalAlpha=cl((p2-.82)/.18);x.fillStyle='#efe9df';x.fillRect(0,0,W,H)}
}
addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top});
document.addEventListener('mouseleave',function(){m.x=m.y=-999});
var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(build,150)});
build();requestAnimationFrame(tick);

/* cursor */
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 var cur=document.getElementById('cur'),lab=cur.querySelector('b'),pv=document.getElementById('pv');
 document.documentElement.classList.add('cc');
 var tx=innerWidth/2,ty=innerHeight/2,cx=tx,cy=ty,vx=tx,vy=ty,seen=false,k1=still?1:.16,k2=still?1:.09;
 addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;if(!seen){seen=true;cx=vx=tx;cy=vy=ty}cur.style.opacity=1});
 document.addEventListener('mouseleave',function(){cur.style.opacity=0});
 addEventListener('mouseover',function(e){
  var t=e.target,k='',a=null;
  if(!t.closest)return;
  if(t.closest('[data-pv]'))k='proj';
  else if((a=t.closest('a,button')))k='link';
  else if(t.closest('h1,h2,h3,p,b,span,footer'))k='text';
  cur.className=k;pv.classList.toggle('on',k==='proj');
  if(k==='link')lab.textContent=a.getAttribute('data-cur')||'Open';
 });
 (function loop(){
  cx+=(tx-cx)*k1;cy+=(ty-cy)*k1;vx+=(tx-vx)*k2;vy+=(ty-vy)*k2;
  cur.style.transform='translate3d('+cx+'px,'+cy+'px,0)';
  pv.style.transform='translate3d('+vx+'px,'+vy+'px,0)';
  requestAnimationFrame(loop);
 })();
}

/* loader */
var ld=document.getElementById('ld'),bar=ld.querySelector('u'),pct=ld.querySelector('.pct'),ready=false,st=performance.now(),dur=still?200:1700,fin=false;
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){ready=true});
setTimeout(function(){ready=true},3500);
function lp(now){
 var k=cl((now-st)/dur),e=1-Math.pow(1-k,3);
 bar.style.transform='scaleX('+e+')';pct.textContent=Math.round(e*100);
 if(k<1||!ready){requestAnimationFrame(lp);return}
 if(fin)return;fin=true;
 ld.classList.add('done');document.body.classList.remove('lock');
 t0=performance.now()+(still?0:550);
 setTimeout(function(){ld.style.display='none'},1200);
}
requestAnimationFrame(lp);
})();
