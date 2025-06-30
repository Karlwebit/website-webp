// Ping-Pong Game: Mit robustem State-Handling

const main = document.querySelector(".pingpong-main");

// --- Robuster Spielstatus ---
const GameState = {
  START: "start",
  PLAYING: "playing",
  GAMEOVER: "gameover",
};

let state = GameState.START;
let playerScore = 0;
let aiScore = 0;
let isPaused = false;

let animationId;
let canvas, ctx;
let player, ai, ball;
let mouseMoveHandler = null;
let keyState = { ArrowUp: false, ArrowDown: false };

const WIN_SCORE = 7;

/**
 * Zeigt eine Fehlermeldung im Hauptbereich an.
 * @param {string} message - Die anzuzeigende Fehlermeldung.
 */
function showError(message) {
  if (main) {
    main.innerHTML = `<div class="pingpong-error">${escapeHTML(message)}</div>`;
  } else {
    alert(message);
  }
}

/**
 * Wandelt einen String in eine HTML-sichere Zeichenkette um (gegen XSS).
 * @param {string} str - Der zu escapende String.
 * @returns {string} Die HTML-sichere Zeichenkette.
 */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Rendert den Startbildschirm des Ping-Pong-Spiels.
 * Setzt die Spielstände zurück und entfernt Event-Listener.
 * Wird beim Spielstart und nach Spielende aufgerufen.
 * @returns {void} Es wird kein Wert zurückgegeben.
 * @example
 * renderStartScreen();
 */
function renderStartScreen() {
  if (!main) {
    showError("Fehler: Hauptbereich nicht gefunden.");
    return;
  }

  main.innerHTML = `
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
  `;
  document.getElementById("startBtn").onclick = function () {
    const nameInput = document.getElementById("playerNameInput");
    const nameError = document.getElementById("nameError");
    const name = nameInput.value.trim();
    if (name.length > 0 && !/^[a-zA-Z0-9äöüÄÖÜß _-]+$/.test(name)) {
      nameError.textContent =
        "Name darf nur Buchstaben, Zahlen, Leerzeichen und -_ enthalten.";
      return;
    }
    if (name.length > 20) {
      nameError.textContent = "Name darf maximal 20 Zeichen lang sein.";
      return;
    }
    // Name ist gültig, speichern (optional)
    window.pingpongPlayerName = name;
    startGame();
  };

  playerScore = 0;
  aiScore = 0;
  state = GameState.START;

  if (animationId) cancelAnimationFrame(animationId);
  if (canvas && mouseMoveHandler)
    canvas.removeEventListener("mousemove", mouseMoveHandler);
}

/**
 * Rendert den Spielbildschirm mit Punktestand und Steuerungselementen.
 * @returns {void} Es wird kein Wert zurückgegeben.
 * @example
 * renderGameScreen();
 */
function renderGameScreen() {
  if (!main) {
    showError("Fehler: Hauptbereich nicht gefunden.");
    return;
  }
  // Spielername prüfen, falls leer, dann 'Spieler' anzeigen
  const playerName = escapeHTML(
    window.pingpongPlayerName && window.pingpongPlayerName.length > 0
      ? window.pingpongPlayerName
      : "Spieler",
  );
  main.innerHTML = `
    <div class="pingpong-wrapper">
      <div class="pingpong-card">
        <div class="pingpong-scoreboard">
          <span class="score-label">${playerName}</span>
          <span class="score-value" id="playerScore">${playerScore}</span>
          <span class="score-sep">:</span>
          <span class="score-value" id="aiScore">${aiScore}</span>
          <span class="score-label">Computer</span>
        </div>
        <canvas id="pingpong-canvas" width="500" height="300"></canvas>
        <div class="pingpong-controls">
          <button class="pingpong-btn" id="pauseBtn">⏸ Pause</button>
          <button class="pingpong-btn" id="quitBtn">Beenden</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("quitBtn").onclick = quitGame;
  document.getElementById("pauseBtn").onclick = togglePause;
}

// Start
/**
 * Startet das Spiel, initialisiert Spielfeld und Event-Listener.
 * Nur im Status "START" möglich. Setzt das Spiel in den Status "PLAYING".
 * @returns {void} Es wird kein Wert zurückgegeben.
 * @example
 * startGame();
 */
function startGame() {
  if (state !== GameState.START) return;

  state = GameState.PLAYING;
  renderGameScreen();
  canvas = document.getElementById("pingpong-canvas");
  if (!canvas) {
    showError("Fehler: Canvas nicht gefunden.");
    return;
  }
  ctx = canvas.getContext("2d");
  if (!ctx) {
    showError("Fehler: Canvas-Kontext nicht verfügbar.");
    return;
  }

  mouseMoveHandler = movePlayer;
  canvas.addEventListener("mousemove", mouseMoveHandler);
  window.addEventListener("keydown", keyDownHandler);
  window.addEventListener("keyup", keyUpHandler);

  resetGame();
  animationId = requestAnimationFrame(gameLoop);
}

// Spiel beenden
/**
 * Beendet das aktuelle Spiel, entfernt Event-Listener und zeigt den Startbildschirm an.
 * @returns {void} Es wird kein Wert zurückgegeben.
 * @example
 * quitGame();
 */
function quitGame() {
  if (animationId) cancelAnimationFrame(animationId);
  if (canvas && mouseMoveHandler)
    canvas.removeEventListener("mousemove", mouseMoveHandler);
  window.removeEventListener("keydown", keyDownHandler);
  window.removeEventListener("keyup", keyUpHandler);
  renderStartScreen();
}

// Pause
function togglePause() {
  if (state !== GameState.PLAYING) return;

  isPaused = !isPaused;
  const pauseBtn = document.getElementById("pauseBtn");
  if (isPaused) {
    pauseBtn.textContent = "▶ Fortsetzen";
    cancelAnimationFrame(animationId);
  } else {
    pauseBtn.textContent = "⏸ Pause";
    animationId = requestAnimationFrame(gameLoop);
  }
}

// Spielobjekte zurücksetzen
function resetGame() {
  player = { x: 20, y: 120, w: 10, h: 60, color: "#00bfff" };
  ai = { x: 470, y: 120, w: 10, h: 60, color: "#00bfff" };
  const dir = Math.random() < 0.5 ? 1 : -1;
  const up = Math.random() < 0.5 ? 1 : -1;
  ball = {
    x: 250,
    y: 150,
    r: 8,
    vx: 4 * dir,
    vy: 4 * up,
    color: "#fff",
  };
}

// Spieler mit Maus
/**
 * Bewegt den Spieler-Schläger entsprechend der Mausposition.
 * @param {MouseEvent} e - Das Maus-Event mit Positionsdaten.
 * @returns {void} Es wird kein Wert zurückgegeben.
 * @example
 * canvas.addEventListener('mousemove', movePlayer);
 */
function movePlayer(e) {
  if (!canvas || !player) return;
  if (!e || typeof e.clientY !== "number") return;

  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  player.y = Math.max(
    0,
    Math.min(canvas.height - player.h, mouseY - player.h / 2),
  );
}

// Tastatursteuerung
function keyDownHandler(e) {
  if (e.code === "ArrowUp" || e.code === "ArrowDown") {
    keyState[e.code] = true;
    e.preventDefault();
  }
}

function keyUpHandler(e) {
  if (e.code === "ArrowUp" || e.code === "ArrowDown") {
    keyState[e.code] = false;
    e.preventDefault();
  }
}

function movePlayerByKeys() {
  const speed = 6;
  if (keyState["ArrowUp"]) {
    player.y = Math.max(0, player.y - speed);
  }
  if (keyState["ArrowDown"]) {
    player.y = Math.min(canvas.height - player.h, player.y + speed);
  }
}

// Gegner-KI
function moveAI() {
  const target = ball.y - ai.h / 2;
  ai.y += (target - ai.y) * 0.08;
  ai.y = Math.max(0, Math.min(canvas.height - ai.h, ai.y));
}

// Ballverhalten
/**
 * Aktualisiert die Ballposition, prüft Kollisionen und Tore.
 * Erhöht die Punktzahl und setzt das Spiel ggf. zurück oder beendet es.
 * @returns {void} Es wird kein Wert zurückgegeben.
 * @example
 * updateBall();
 */
function updateBall() {
  if (!canvas || !player || !ai || !ball) return;

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) {
    ball.vy *= -1;
  }

  if (
    ball.x - ball.r < player.x + player.w &&
    ball.y > player.y &&
    ball.y < player.y + player.h &&
    ball.vx < 0
  ) {
    ball.vx = Math.abs(ball.vx);
  }

  if (
    ball.x + ball.r > ai.x &&
    ball.y > ai.y &&
    ball.y < ai.y + ai.h &&
    ball.vx > 0
  ) {
    ball.vx = -Math.abs(ball.vx);
  }

  if (ball.x - ball.r < 0) {
    aiScore++;
    updateScoreboard();
    if (aiScore >= WIN_SCORE) {
      endGame(false);
    } else {
      resetGame();
    }
  } else if (ball.x + ball.r > canvas.width) {
    playerScore++;
    updateScoreboard();
    if (playerScore >= WIN_SCORE) {
      endGame(true);
    } else {
      resetGame();
    }
  }
}

// Spielende
/**
 * Beendet das Spiel und zeigt das Endergebnis an.
 * Entfernt Event-Listener und stoppt die Animation.
 * @param {boolean} playerWon - true, wenn der Spieler gewonnen hat, sonst false.
 * @returns {void} Es wird kein Wert zurückgegeben.
 * @example
 * endGame(true); // Spieler gewinnt
 */
function endGame(playerWon) {
  if (state !== GameState.PLAYING) return;

  if (animationId) cancelAnimationFrame(animationId);
  if (canvas && mouseMoveHandler)
    canvas.removeEventListener("mousemove", mouseMoveHandler);
  window.removeEventListener("keydown", keyDownHandler);
  window.removeEventListener("keyup", keyUpHandler);

  state = GameState.GAMEOVER;
  const playerName = escapeHTML(
    window.pingpongPlayerName && window.pingpongPlayerName.length > 0
      ? window.pingpongPlayerName
      : "Spieler",
  );
  main.innerHTML = `
    <div class="pingpong-wrapper">
      <div class="pingpong-card">
        <div class="pingpong-card-header">
          <span class="pingpong-title">Ping-Pong</span>
        </div>
        <div class="pingpong-card-content">
          <h2>${playerWon ? `Glückwunsch, ${playerName}! Du hast gewonnen!` : "Der Computer gewinnt!"}</h2>
          <p>Endstand: <b>${playerName}</b> <b>${playerScore}</b> : <b>${aiScore}</b> <b>Computer</b></p>
          <button class="pingpong-btn" id="restartBtn">Nochmal spielen</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("restartBtn").onclick = renderStartScreen;
}

// Scoreboard aktualisieren
function updateScoreboard() {
  document.getElementById("playerScore").textContent = playerScore;
  document.getElementById("aiScore").textContent = aiScore;
}

// Zeichnen
function draw() {
  if (!ctx || !canvas || !player || !ai || !ball) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#00bfff";
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = ai.color;
  ctx.fillRect(ai.x, ai.y, ai.w, ai.h);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
  ctx.fillStyle = ball.color;
  ctx.fill();
}

// Hauptspielschleife
function gameLoop() {
  if (!isPaused) {
    moveAI();
    movePlayerByKeys();
    updateBall();
    draw();
    animationId = requestAnimationFrame(gameLoop);
  }
}
// Initialstart
renderStartScreen();
