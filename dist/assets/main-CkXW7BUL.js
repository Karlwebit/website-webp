(function(){const d=document.createElement("link").relList;if(d&&d.supports&&d.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))L(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const h of s.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&L(h)}).observe(document,{childList:!0,subtree:!0});function y(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function L(a){if(a.ep)return;a.ep=!0;const s=y(a);fetch(a.href,s)}})();const b=document.querySelector(".pingpong-main"),p={START:"start",PLAYING:"playing",GAMEOVER:"gameover"};let u=p.START,f=0,m=0,g=!1,c,t,i,o,r,e,l=null,v={ArrowUp:!1,ArrowDown:!1};const B=7;function x(){b.innerHTML=`
    <div class="pingpong-wrapper">
      <div class="pingpong-card">
        <div class="pingpong-card-header">
          <span class="pingpong-title">Ping-Pong</span>
        </div>
        <div class="pingpong-card-content">
          <h2>Bereit?</h2>
          <p>Bewege deinen Schläger mit der Maus und besiege den Computer!</p>
          <button class="pingpong-btn" id="startBtn">▶ Spiel starten</button>
        </div>
      </div>
    </div>
  `,document.getElementById("startBtn").onclick=G,f=0,m=0,u=p.START,c&&cancelAnimationFrame(c),t&&l&&t.removeEventListener("mousemove",l)}function I(){b.innerHTML=`
    <div class="pingpong-wrapper">
      <div class="pingpong-card">
        <div class="pingpong-scoreboard">
          <span class="score-label">Spieler</span>
          <span class="score-value" id="playerScore">${f}</span>
          <span class="score-sep">:</span>
          <span class="score-value" id="aiScore">${m}</span>
          <span class="score-label">Gegner</span>
        </div>
        <canvas id="pingpong-canvas" width="500" height="300"></canvas>
        <div class="pingpong-controls">
          <button class="pingpong-btn" id="pauseBtn">⏸ Pause</button>
          <button class="pingpong-btn" id="quitBtn">Beenden</button>
        </div>
      </div>
    </div>
  `,document.getElementById("quitBtn").onclick=T,document.getElementById("pauseBtn").onclick=D}function G(){u===p.START&&(u=p.PLAYING,I(),t=document.getElementById("pingpong-canvas"),i=t.getContext("2d"),l=R,t.addEventListener("mousemove",l),window.addEventListener("keydown",A),window.addEventListener("keyup",S),w(),c=requestAnimationFrame(E))}function T(){c&&cancelAnimationFrame(c),t&&l&&t.removeEventListener("mousemove",l),window.removeEventListener("keydown",A),window.removeEventListener("keyup",S),x()}function D(){if(u!==p.PLAYING)return;g=!g;const n=document.getElementById("pauseBtn");g?(n.textContent="▶ Fortsetzen",cancelAnimationFrame(c)):(n.textContent="⏸ Pause",c=requestAnimationFrame(E))}function w(){o={x:20,y:120,w:10,h:60,color:"#00bfff"},r={x:470,y:120,w:10,h:60,color:"#00bfff"};const n=Math.random()<.5?1:-1,d=Math.random()<.5?1:-1;e={x:250,y:150,r:8,vx:4*n,vy:4*d,color:"#fff"}}function R(n){const d=t.getBoundingClientRect();let y=n.clientY-d.top;o.y=Math.max(0,Math.min(t.height-o.h,y-o.h/2))}function A(n){(n.code==="ArrowUp"||n.code==="ArrowDown")&&(v[n.code]=!0,n.preventDefault())}function S(n){(n.code==="ArrowUp"||n.code==="ArrowDown")&&(v[n.code]=!1,n.preventDefault())}function k(){v.ArrowUp&&(o.y=Math.max(0,o.y-6)),v.ArrowDown&&(o.y=Math.min(t.height-o.h,o.y+6))}function C(){const n=e.y-r.h/2;r.y+=(n-r.y)*.08,r.y=Math.max(0,Math.min(t.height-r.h,r.y))}function F(){e.x+=e.vx,e.y+=e.vy,(e.y-e.r<0||e.y+e.r>t.height)&&(e.vy*=-1),e.x-e.r<o.x+o.w&&e.y>o.y&&e.y<o.y+o.h&&e.vx<0&&(e.vx=Math.abs(e.vx)),e.x+e.r>r.x&&e.y>r.y&&e.y<r.y+r.h&&e.vx>0&&(e.vx=-Math.abs(e.vx)),e.x-e.r<0?(m++,M(),m>=B?P(!1):w()):e.x+e.r>t.width&&(f++,M(),f>=B?P(!0):w())}function P(n){u===p.PLAYING&&(c&&cancelAnimationFrame(c),t&&l&&t.removeEventListener("mousemove",l),window.removeEventListener("keydown",A),window.removeEventListener("keyup",S),u=p.GAMEOVER,b.innerHTML=`
    <div class="pingpong-wrapper">
      <div class="pingpong-card">
        <div class="pingpong-card-header">
          <span class="pingpong-title">Ping-Pong</span>
        </div>
        <div class="pingpong-card-content">
          <h2>${n?"Du hast gewonnen!":"Der Computer gewinnt!"}</h2>
          <p>Endstand: <b>${f}</b> : <b>${m}</b></p>
          <button class="pingpong-btn" id="restartBtn">Nochmal spielen</button>
        </div>
      </div>
    </div>
  `,document.getElementById("restartBtn").onclick=x)}function M(){document.getElementById("playerScore").textContent=f,document.getElementById("aiScore").textContent=m}function N(){i.clearRect(0,0,t.width,t.height),i.strokeStyle="#00bfff",i.setLineDash([8,8]),i.beginPath(),i.moveTo(t.width/2,0),i.lineTo(t.width/2,t.height),i.stroke(),i.setLineDash([]),i.fillStyle=o.color,i.fillRect(o.x,o.y,o.w,o.h),i.fillStyle=r.color,i.fillRect(r.x,r.y,r.w,r.h),i.beginPath(),i.arc(e.x,e.y,e.r,0,2*Math.PI),i.fillStyle=e.color,i.fill()}function E(){g||(C(),k(),F(),N(),c=requestAnimationFrame(E))}x();
