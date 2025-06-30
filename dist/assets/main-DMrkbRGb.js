(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))B(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const b of c.addedNodes)b.tagName==="LINK"&&b.rel==="modulepreload"&&B(b)}).observe(document,{childList:!0,subtree:!0});function d(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function B(a){if(a.ep)return;a.ep=!0;const c=d(a);fetch(a.href,c)}})();const u=document.querySelector(".pingpong-main"),g={START:"start",PLAYING:"playing",GAMEOVER:"gameover"};let m=g.START,f=0,y=0,h=!1,l,t,i,r,o,e,p=null,v={ArrowUp:!1,ArrowDown:!1};const N=7;function w(n){u?u.innerHTML=`<div class="pingpong-error">${E(n)}</div>`:alert(n)}function E(n){return String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function A(){if(!u){w("Fehler: Hauptbereich nicht gefunden.");return}u.innerHTML=`
    <div class="pingpong-wrapper">
      <div class="pingpong-card">
        <div class="pingpong-card-header">
          <span class="pingpong-title">Ping-Pong</span>
        </div>
        <div class="pingpong-card-content">
          <h2>Bereit?</h2>
          <p>Bewege deinen Schläger mit der Maus und besiege den Computer!</p>
          <input id="playerNameInput" maxlength="20" placeholder="Dein Name (optional)" />
          <div id="nameError" style="color:red;"></div>
          <button class="pingpong-btn" id="startBtn">▶ Spiel starten</button>
        </div>
      </div>
    </div>
  `,document.getElementById("startBtn").onclick=function(){const n=document.getElementById("playerNameInput"),s=document.getElementById("nameError"),d=n.value.trim();if(d.length>0&&!/^[a-zA-Z0-9äöüÄÖÜß _-]+$/.test(d)){s.textContent="Name darf nur Buchstaben, Zahlen, Leerzeichen und -_ enthalten.";return}if(d.length>20){s.textContent="Name darf maximal 20 Zeichen lang sein.";return}window.pingpongPlayerName=d,T()},f=0,y=0,m=g.START,l&&cancelAnimationFrame(l),t&&p&&t.removeEventListener("mousemove",p)}function C(){if(!u){w("Fehler: Hauptbereich nicht gefunden.");return}const n=E(window.pingpongPlayerName&&window.pingpongPlayerName.length>0?window.pingpongPlayerName:"Spieler");u.innerHTML=`
    <div class="pingpong-wrapper">
      <div class="pingpong-card">
        <div class="pingpong-scoreboard">
          <span class="score-label">${n}</span>
          <span class="score-value" id="playerScore">${f}</span>
          <span class="score-sep">:</span>
          <span class="score-value" id="aiScore">${y}</span>
          <span class="score-label">Computer</span>
        </div>
        <canvas id="pingpong-canvas" width="500" height="300"></canvas>
        <div class="pingpong-controls">
          <button class="pingpong-btn" id="pauseBtn">⏸ Pause</button>
          <button class="pingpong-btn" id="quitBtn">Beenden</button>
        </div>
      </div>
    </div>
  `,document.getElementById("quitBtn").onclick=F,document.getElementById("pauseBtn").onclick=G}function T(){if(m===g.START){if(m=g.PLAYING,C(),t=document.getElementById("pingpong-canvas"),!t){w("Fehler: Canvas nicht gefunden.");return}if(i=t.getContext("2d"),!i){w("Fehler: Canvas-Kontext nicht verfügbar.");return}p=D,t.addEventListener("mousemove",p),window.addEventListener("keydown",L),window.addEventListener("keyup",P),x(),l=requestAnimationFrame(S)}}function F(){l&&cancelAnimationFrame(l),t&&p&&t.removeEventListener("mousemove",p),window.removeEventListener("keydown",L),window.removeEventListener("keyup",P),A()}function G(){if(m!==g.PLAYING)return;h=!h;const n=document.getElementById("pauseBtn");h?(n.textContent="▶ Fortsetzen",cancelAnimationFrame(l)):(n.textContent="⏸ Pause",l=requestAnimationFrame(S))}function x(){r={x:20,y:120,w:10,h:60,color:"#00bfff"},o={x:470,y:120,w:10,h:60,color:"#00bfff"};const n=Math.random()<.5?1:-1,s=Math.random()<.5?1:-1;e={x:250,y:150,r:8,vx:4*n,vy:4*s,color:"#fff"}}function D(n){if(!t||!r||!n||typeof n.clientY!="number")return;const s=t.getBoundingClientRect();let d=n.clientY-s.top;r.y=Math.max(0,Math.min(t.height-r.h,d-r.h/2))}function L(n){(n.code==="ArrowUp"||n.code==="ArrowDown")&&(v[n.code]=!0,n.preventDefault())}function P(n){(n.code==="ArrowUp"||n.code==="ArrowDown")&&(v[n.code]=!1,n.preventDefault())}function k(){v.ArrowUp&&(r.y=Math.max(0,r.y-6)),v.ArrowDown&&(r.y=Math.min(t.height-r.h,r.y+6))}function R(){const n=e.y-o.h/2;o.y+=(n-o.y)*.08,o.y=Math.max(0,Math.min(t.height-o.h,o.y))}function H(){!t||!r||!o||!e||(e.x+=e.vx,e.y+=e.vy,(e.y-e.r<0||e.y+e.r>t.height)&&(e.vy*=-1),e.x-e.r<r.x+r.w&&e.y>r.y&&e.y<r.y+r.h&&e.vx<0&&(e.vx=Math.abs(e.vx)),e.x+e.r>o.x&&e.y>o.y&&e.y<o.y+o.h&&e.vx>0&&(e.vx=-Math.abs(e.vx)),e.x-e.r<0?(y++,M(),y>=N?I(!1):x()):e.x+e.r>t.width&&(f++,M(),f>=N?I(!0):x()))}function I(n){if(m!==g.PLAYING)return;l&&cancelAnimationFrame(l),t&&p&&t.removeEventListener("mousemove",p),window.removeEventListener("keydown",L),window.removeEventListener("keyup",P),m=g.GAMEOVER;const s=E(window.pingpongPlayerName&&window.pingpongPlayerName.length>0?window.pingpongPlayerName:"Spieler");u.innerHTML=`
    <div class="pingpong-wrapper">
      <div class="pingpong-card">
        <div class="pingpong-card-header">
          <span class="pingpong-title">Ping-Pong</span>
        </div>
        <div class="pingpong-card-content">
          <h2>${n?`Glückwunsch, ${s}! Du hast gewonnen!`:"Der Computer gewinnt!"}</h2>
          <p>Endstand: <b>${s}</b> <b>${f}</b> : <b>${y}</b> <b>Computer</b></p>
          <button class="pingpong-btn" id="restartBtn">Nochmal spielen</button>
        </div>
      </div>
    </div>
  `,document.getElementById("restartBtn").onclick=A}function M(){document.getElementById("playerScore").textContent=f,document.getElementById("aiScore").textContent=y}function $(){!i||!t||!r||!o||!e||(i.clearRect(0,0,t.width,t.height),i.strokeStyle="#00bfff",i.setLineDash([8,8]),i.beginPath(),i.moveTo(t.width/2,0),i.lineTo(t.width/2,t.height),i.stroke(),i.setLineDash([]),i.fillStyle=r.color,i.fillRect(r.x,r.y,r.w,r.h),i.fillStyle=o.color,i.fillRect(o.x,o.y,o.w,o.h),i.beginPath(),i.arc(e.x,e.y,e.r,0,2*Math.PI),i.fillStyle=e.color,i.fill())}function S(){h||(R(),k(),H(),$(),l=requestAnimationFrame(S))}A();
