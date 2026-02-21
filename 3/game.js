// ---- MENU ----
function buildMenu() {
  var list = document.getElementById('level-list');
  list.innerHTML = '';
  var total = 0;
  for (var i = 0; i < LEVELS.length; i++) {
    var btn = document.createElement('button');
    btn.className = 'level-btn' + (clearedLevels[i] ? ' cleared' : '');
    var nameSpan = document.createElement('span');
    nameSpan.className = 'level-name';
    nameSpan.textContent = (i + 1) + '. ' + LEVELS[i].name;
    btn.appendChild(nameSpan);
    var best = bestScores['' + i];
    if (best) {
      total += best;
      var scoreSpan = document.createElement('span');
      scoreSpan.className = 'level-score';
      scoreSpan.textContent = best.toLocaleString();
      btn.appendChild(scoreSpan);
    }
    btn.onclick = (function(idx) { return function() { startLevel(idx); }; })(i);
    list.appendChild(btn);
  }
  var totalEl = document.getElementById('total-score');
  if (total > 0) {
    totalEl.textContent = 'TOTAL SCORE: ' + total.toLocaleString();
    totalEl.style.display = 'block';
  } else {
    totalEl.style.display = 'none';
  }
}

function showMenu() {
  state = 'menu';
  document.getElementById('menu').style.display = 'flex';
  document.getElementById('game-canvas').style.display = 'none';
  document.getElementById('hud').style.display = 'none';
  document.body.style.cursor = '';
  buildMenu();
}

window.addEventListener('keydown', function(e) {
  if (e.code === 'KeyR' && state !== 'menu') {
    cancelAnimationFrame(animId);
    clearAllRows();
    clearExplosion();
    startLevel(currentLevel);
  }
  if (e.code === 'Escape' && state !== 'menu') {
    cancelAnimationFrame(animId);
    clearAllRows();
    clearExplosion();
    showMenu();
  }
});

// ---- LEVEL LOADING ----
function startLevel(idx) {
  currentLevel = idx;
  state = 'playing';
  alive = true;
  playerLane = Math.floor(LANES / 2);
  playerX = 0;
  playerY = 0;
  playerVY = 0;
  playerVX = 0;
  playerSpeed = 0;
  playerZ = 0;
  fuel = 100;
  oxygen = 100;
  grounded = true;
  stuckTimer = 0;
  levelTimerMax = LEVELS[idx].rows.length * 0.1;
  levelTimer = levelTimerMax;
  score = 0;
  screenFade = 0;
  started = false;

  clearAllRows();
  clearExplosion();
  resetSoundState();
  shipMesh.visible = true;
  SFX.start();

  levelStartTime = performance.now();
  document.getElementById('menu').style.display = 'none';
  document.getElementById('game-canvas').style.display = 'block';
  document.getElementById('hud').style.display = 'block';
  document.body.style.cursor = 'none';

  clock.getDelta(); // reset clock
  gameLoop();
}

var scoreDist = 0;
var scoreTimePct = 0;
var scoreWinMult = 1;
var scoreFuelBonus = 0;
var scoreOxyBonus = 0;

function calcAndSaveScore() {
  scoreDist = Math.floor(Math.abs(playerZ));
  scoreTimePct = levelTimerMax > 0 ? levelTimer / levelTimerMax : 0;
  var won = (state === 'won' || state === 'winning');
  if (won) {
    scoreFuelBonus = (fuel / 100) * 0.25;
    scoreOxyBonus = (oxygen / 100) * 0.25;
    scoreWinMult = 1 + scoreFuelBonus + scoreOxyBonus;
  } else {
    scoreFuelBonus = 0;
    scoreOxyBonus = 0;
    scoreWinMult = 1;
  }
  score = Math.floor(100 * scoreDist * scoreTimePct * scoreWinMult);
  var key = '' + currentLevel;
  if (!bestScores[key] || score > bestScores[key]) {
    bestScores[key] = score;
    localStorage.setItem('spaceRunnerScores', JSON.stringify(bestScores));
  }
}

// ---- GAME LOOP ----
var animId;
function gameLoop() {
  if (state === 'menu') return;

  animId = requestAnimationFrame(gameLoop);
  var dt = Math.min(clock.getDelta(), 0.05);

  if (state === 'playing') {
    if (started) levelTimer = Math.max(0, levelTimer - dt);
    updatePlayer(dt);
    updateSounds(dt);
    updateCamera();
    updateChunks();
    updateEngineTrail(dt);
    updateSpeedLines(dt);
    updateSparks(dt);
    updateDust(dt);
  } else if (state === 'dead') {
    screenFade = Math.min(0.6, screenFade + dt * 0.4);
    updateExplosion(dt);
    updateSparks(dt);
    updateDust(dt);
  } else if (state === 'winning') {
    screenFade = Math.min(0.5, screenFade + dt * 0.3);
    winTimer -= dt;
    playerSpeed = Math.min(MAX_SPEED, playerSpeed + ACCEL_RATE * dt);
    playerY += 3 * dt;
    playerZ -= playerSpeed * dt;
    grounded = false;
    updateCamera();
    updateChunks();
    updateEngineTrail(dt);
    updateSpeedLines(dt);
    if (winTimer <= 0) {
      state = 'won';
      calcAndSaveScore();
    }
  } else if (state === 'won') {
    screenFade = Math.min(0.5, screenFade + dt * 0.3);
    playerSpeed = Math.min(MAX_SPEED, playerSpeed + ACCEL_RATE * dt);
    playerY += 3 * dt;
    playerZ -= playerSpeed * dt;
    updateCamera();
  }

  renderer.render(scene, camera);
  drawHud(dt);
}

// ---- BOOT ----
init3D();
initHud();
showMenu();
