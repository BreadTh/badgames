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

var menuTypeBuffer = '';
window.addEventListener('keydown', function(e) {
  if (e.code === 'KeyQ' && !e.repeat) {
    fpsShowHistogram = !fpsShowHistogram;
  }
  if (e.code === 'KeyZ' && !e.repeat) {
    pathCurveUniform.value = pathCurveUniform.value ? 0 : PATH_CURVE;
  }
  if (e.code === 'KeyP' && !e.repeat && state === 'playing') {
    paused = !paused;
  }
  if (e.code === 'KeyR' && state !== 'menu') {
    cancelAnimationFrame(animId);
    clearAllRows();
    clearAllParticles();
    startLevel(currentLevel);
  }
  if (e.code === 'Escape' && state !== 'menu') {
    cancelAnimationFrame(animId);
    stopContinuousSounds();
    clearAllRows();
    clearAllParticles();
    clearShipDebris();
    showMenu();
  }
  // "debugme" detection — works in any state
  debugTypeBuffer += e.key.toLowerCase();
  if (debugTypeBuffer.length > 20) debugTypeBuffer = debugTypeBuffer.slice(-20);
  if (debugTypeBuffer.indexOf('debugme') !== -1) {
    debugMode = !debugMode;
    if (!debugMode) debugInvincible = false;
    debugTypeBuffer = '';
  }
  // Debug keys (only when debug is on and in-game)
  if (debugMode && state !== 'menu' && !e.repeat) {
    if (e.code === 'Digit1' && alive) { die('kill'); }
    if (e.code === 'Digit2') { debugInvincible = !debugInvincible; }
    if (e.code === 'Digit3' && !alive) {
      alive = true;
      state = 'playing';
      screenFade = 0;
      playerX = safeX;
      playerY = safeY + 0.1;
      playerZ = safeZ;
      playerVY = 0;
      playerVX = 0;
      grounded = false;
      padSustain = false;
      glideLockedIn = false;
      frozenKeys = null;
      shipMesh.visible = true;
      clearShipDebris();
    }
    if (e.code === 'Digit4') { playerSpeed = MAX_SPEED; }
    if (e.code === 'Digit5') { playerZ += 10; }
    if (e.code === 'Digit6') { fuel = 100; }
    if (e.code === 'Digit7') { oxygen = 100; }
    if (e.code === 'Digit8') { fuel = 0; }
    if (e.code === 'Digit9') { oxygen = 0; }
    if (e.code === 'Digit0') { playerSpeed = 0; }
  }
  // Menu shortcuts: number keys to start levels
  if (state === 'menu') {
    var num = parseInt(e.key);
    if (num >= 1 && num <= LEVELS.length && !debugMode) {
      startLevel(num - 1);
    }
    // Track typed keys for "deletealldata"
    menuTypeBuffer += e.key.toLowerCase();
    if (menuTypeBuffer.length > 20) menuTypeBuffer = menuTypeBuffer.slice(-20);
    if (menuTypeBuffer.indexOf('deletealldata') !== -1) {
      localStorage.removeItem('spaceRunnerCleared');
      localStorage.removeItem('spaceRunnerScores');
      clearedLevels = {};
      bestScores = {};
      menuTypeBuffer = '';
      buildMenu();
    }
  } else {
    menuTypeBuffer = '';
  }
});

// ---- LEVEL LOADING ----
function startLevel(idx) {
  currentLevel = idx;
  state = 'playing';
  paused = false;
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
  frozenKeys = null;
  glideLockedIn = false;

  if (animId) cancelAnimationFrame(animId);
  clearAllRows();
  initMergedChunks(idx);
  clearAllParticles();
  clearShipDebris();
  resetSoundState();
  shipMesh.visible = true;
  levelStartTime = performance.now();
  document.getElementById('menu').style.display = 'none';
  document.getElementById('game-canvas').style.display = 'block';
  document.getElementById('hud').style.display = 'block';
  document.body.style.cursor = 'none';

  clock.getDelta(); // reset clock
  gameLoop();
}

var scoreDist = 0;
var scoreTimeMult = 1;
var scoreFuelMult = 1;
var scoreOxyMult = 1;

function calcAndSaveScore() {
  scoreDist = Math.floor(Math.abs(playerZ));
  var won = (state === 'won' || state === 'winning');
  if (won) {
    var timeRemainPct = levelTimerMax > 0 ? levelTimer / levelTimerMax : 0;
    scoreTimeMult = 1 + timeRemainPct;
    scoreFuelMult = 1 + (fuel / 100) * 0.05;
    scoreOxyMult = 1 + (oxygen / 100) * 0.05;
  } else {
    scoreTimeMult = 1;
    scoreFuelMult = 1;
    scoreOxyMult = 1;
  }
  score = Math.floor(100 * scoreDist * scoreTimeMult * scoreFuelMult * scoreOxyMult);
  var key = '' + currentLevel;
  if (!bestScores[key] || score > bestScores[key]) {
    bestScores[key] = score;
    localStorage.setItem('spaceRunnerScores', JSON.stringify(bestScores));
  }
}

// ---- GAME LOOP ----
var animId;
var paused = false;
function gameLoop() {
  if (state === 'menu') return;

  animId = requestAnimationFrame(gameLoop);
  var dt = Math.min(clock.getDelta(), 0.05);

  if (paused) { renderer.render(scene, camera); drawPauseScreen(); return; }

  if (state === 'playing') {
    if (started) levelTimer = Math.max(0, levelTimer - dt);
    updatePlayer(dt);
    updateSounds(dt);
    updateCamera();
    updateShadow();
    updateChunks();
    updateEngineTrail(dt);
    updateSpeedLines(dt);
    updateSparks(dt);
    updateDust(dt);
  } else if (state === 'dead') {
    deathSpeed = Math.max(0, deathSpeed - DECEL_RATE * 0.5 * dt);
    playerZ -= deathSpeed * dt;
    updateCamera();
    updateShadow();
    updateChunks();
    screenFade = Math.min(0.6, screenFade + dt * 0.4);
    updateExplosion(dt);
    updateShipDebris(dt);
    updateSparks(dt);
    updateDust(dt);
  } else if (state === 'winning' || state === 'won') {
    screenFade = Math.min(0.5, screenFade + dt * 0.3);
    if (state === 'winning') winTimer -= dt;
    playerSpeed = Math.min(MAX_SPEED, playerSpeed + ACCEL_RATE * dt);
    playerY += 3 * dt;
    playerZ -= playerSpeed * dt;
    grounded = false;
    // Allow steering unless out of fuel/oxygen
    if (fuel > 0 && oxygen > 0) {
      var winLateral = 40;
      if (keys['ArrowLeft'] || keys['KeyA']) playerVX -= winLateral * dt;
      if (keys['ArrowRight'] || keys['KeyD']) playerVX += winLateral * dt;
    }
    playerVX *= Math.max(0, 1 - 2 * dt);
    playerX += playerVX * dt;
    updateCamera();
    updateChunks();
    updateEngineTrail(dt);
    updateSpeedLines(dt);
    if (state === 'winning' && winTimer <= 0) {
      state = 'won';
      calcAndSaveScore();
    }
  }

  renderer.render(scene, camera);
  drawHud(dt);
}

// ---- BOOT ----
init3D();
initHud();
showMenu();
