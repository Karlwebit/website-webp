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

// Startbildschirm
function renderStartScreen() {
  main.innerHTML = `
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
  `;
  document.getElementById("startBtn").onclick = startGame;

  playerScore = 0;
  aiScore = 0;
  state = GameState.START;

  if (animationId) cancelAnimationFrame(animationId);
  if (canvas && mouseMoveHandler)
    canvas.removeEventListener("mousemove", mouseMoveHandler);
}

// Spielbildschirm
function renderGameScreen() {
  main.innerHTML = `
    <div class="pingpong-wrapper">
      <div class="pingpong-card">
        <div class="pingpong-scoreboard">
          <span class="score-label">Spieler</span>
          <span class="score-value" id="playerScore">${playerScore}</span>
          <span class="score-sep">:</span>
          <span class="score-value" id="aiScore">${aiScore}</span>
          <span class="score-label">Gegner</span>
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
function startGame() {
  if (state !== GameState.START) return;

  state = GameState.PLAYING;
  renderGameScreen();
  canvas = document.getElementById("pingpong-canvas");
  ctx = canvas.getContext("2d");

  mouseMoveHandler = movePlayer;
  canvas.addEventListener("mousemove", mouseMoveHandler);
  window.addEventListener("keydown", keyDownHandler);
  window.addEventListener("keyup", keyUpHandler);

  resetGame();
  animationId = requestAnimationFrame(gameLoop);
}

// Spiel beenden
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
function movePlayer(e) {
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
function updateBall() {
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
function endGame(playerWon) {
  if (state !== GameState.PLAYING) return;

  if (animationId) cancelAnimationFrame(animationId);
  if (canvas && mouseMoveHandler)
    canvas.removeEventListener("mousemove", mouseMoveHandler);
  window.removeEventListener("keydown", keyDownHandler);
  window.removeEventListener("keyup", keyUpHandler);

  state = GameState.GAMEOVER;

  main.innerHTML = `
    <div class="pingpong-wrapper">
      <div class="pingpong-card">
        <div class="pingpong-card-header">
          <span class="pingpong-title">Ping-Pong</span>
        </div>
        <div class="pingpong-card-content">
          <h2>${playerWon ? "Du hast gewonnen!" : "Der Computer gewinnt!"}</h2>
          <p>Endstand: <b>${playerScore}</b> : <b>${aiScore}</b></p>
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
