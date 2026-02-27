// ---- FADE SYSTEM ----
var fadeOverlay = document.getElementById('fade-overlay');
var fadeLoadingEl = document.getElementById('fade-loading');
var fading = false;
var fadeAnimId = null;

function fadeToBlack(duration, callback) {
  if (fadeAnimId) cancelAnimationFrame(fadeAnimId);
  fading = true;
  fadeOverlay.style.opacity = 0;
  var start = performance.now();
  function tick() {
    var t = Math.min(1, (performance.now() - start) / duration);
    fadeOverlay.style.opacity = t;
    if (t < 1) { fadeAnimId = requestAnimationFrame(tick); }
    else { fadeAnimId = null; if (callback) callback(); }
  }
  fadeAnimId = requestAnimationFrame(tick);
}

function fadeFromBlack(duration, callback) {
  if (fadeAnimId) cancelAnimationFrame(fadeAnimId);
  fadeOverlay.style.opacity = 1;
  var start = performance.now();
  function tick() {
    var t = Math.min(1, (performance.now() - start) / duration);
    fadeOverlay.style.opacity = 1 - t;
    if (t < 1) { fadeAnimId = requestAnimationFrame(tick); }
    else { fadeAnimId = null; fading = false; if (callback) callback(); }
  }
  fadeAnimId = requestAnimationFrame(tick);
}

// ---- CUSTOM CURSOR ----
var customCursor = document.getElementById('custom-cursor');
var cursorIdleTimer = null;
var cursorHidden = true;

window.addEventListener('mousemove', function(e) {
  if (document.body.style.cursor !== 'none') return;
  customCursor.style.left = e.clientX + 'px';
  customCursor.style.top = e.clientY + 'px';
  if (cursorHidden) {
    customCursor.style.display = 'block';
    // Force reflow so the transition triggers from 0
    customCursor.offsetHeight;
    cursorHidden = false;
  }
  customCursor.style.opacity = '1';
  customCursor.style.transition = 'opacity 0.05s';
  clearTimeout(cursorIdleTimer);
  cursorIdleTimer = setTimeout(function() {
    customCursor.style.transition = 'opacity 1s';
    customCursor.style.opacity = '0';
  }, 1000);
});

function hideCustomCursor() {
  clearTimeout(cursorIdleTimer);
  customCursor.style.display = 'none';
  customCursor.style.opacity = '0';
  cursorHidden = true;
}

// ---- PLAYER NAME ----
var playerNameInput = document.getElementById('player-name');



function generateRandomName() {
  var syl = ['da','ri','to','na','lu','me','shi','zo','ne','ve','do','fi','ra','ki','mu','no','se','ta','li','bo'];
  function word() {
    var n = 2 + Math.floor(Math.random() * 2);
    var s = '';
    for (var i = 0; i < n; i++) s += syl[Math.floor(Math.random() * syl.length)];
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  return word() + word();
}

function ensurePlayerName() {
  if (playerNameInput.value.trim()) return;
  var saved = (localStorage.getItem('spacerunner-player-name') || '').trim();
  if (saved) {
    playerNameInput.value = saved;
  } else {
    var name = generateRandomName();
    playerNameInput.value = name;
    localStorage.setItem('spacerunner-player-name', name);
  }
}

playerNameInput.addEventListener('input', function() {
  var val = playerNameInput.value.trim();
  if (val) localStorage.setItem('spacerunner-player-name', val);
  else localStorage.removeItem('spacerunner-player-name');
});

// ---- MENU ----
function buildMenu() {
  ensurePlayerName();
  var list = document.getElementById('level-list');
  list.innerHTML = '';
  var total = 0;
  for (var i = 0; i < LEVELS.length; i++) {
    var btn = document.createElement('button');
    var lid = levelKey(i);
    btn.className = 'level-btn' + (clearedLevels[lid] ? ' cleared' : '');
    var nameSpan = document.createElement('span');
    nameSpan.className = 'level-name';
    nameSpan.textContent = (i + 1) + '. ' + LEVELS[i].name;
    btn.appendChild(nameSpan);
    var best = bestScores[lid];
    if (best) {
      total += best;
      var scoreSpan = document.createElement('span');
      scoreSpan.className = 'level-score';
      scoreSpan.textContent = best.toLocaleString();
      btn.appendChild(scoreSpan);
    }
    btn.onclick = (function(idx) { return function() { startLevel(idx); }; })(i);
    var row = document.createElement('div');
    row.className = 'level-row';
    row.appendChild(btn);
    // Add play/download buttons if a best-score recording exists
    if (localStorage.getItem('spaceRunnerRec-' + lid)) {
      var recBtns = document.createElement('span');
      recBtns.className = 'rec-btns';
      var playBtn = document.createElement('span');
      playBtn.className = 'rec-btn rec-play';
      playBtn.title = 'Play best recording';
      playBtn.onclick = (function(idx) { return function(e) {
        var text = localStorage.getItem('spaceRunnerRec-' + levelKey(idx));
        if (!text) return;
        var data = parseRecording(text);
        if (data) { playbackRecText = text; startPlayback(data); }
      }; })(i);
      var dlBtn = document.createElement('span');
      dlBtn.className = 'rec-btn rec-dl';
      dlBtn.title = 'Download best recording';
      dlBtn.onclick = (function(idx) { return function(e) {
        var text = localStorage.getItem('spaceRunnerRec-' + levelKey(idx));
        if (!text) return;
        var blob = new Blob([text], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        var ts = (localStorage.getItem('spaceRunnerRecDate-' + levelKey(idx)) || new Date().toISOString()).replace(/[:.]/g, '-').slice(0, 19);
        var name = LEVELS[idx].name.replace(/[^a-zA-Z0-9]/g, '_');
        var player = (playerNameInput.value || 'Unknown').replace(/[^a-zA-Z0-9]/g, '_');
        a.download = ts + '-' + name + '-' + player + '.run';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }; })(i);
      recBtns.appendChild(playBtn);
      recBtns.appendChild(dlBtn);
      row.appendChild(recBtns);
    }
    list.appendChild(row);
  }
  var totalEl = document.getElementById('total-score');
  if (total > 0) {
    totalEl.textContent = 'TOTAL SCORE: ' + total.toLocaleString();
    totalEl.style.display = 'block';
  } else {
    totalEl.style.display = 'none';
  }
}

function showMenuImmediate() {
  if (animId) cancelAnimationFrame(animId);
  stopRecording();
  stopContinuousSounds();
  clearAllRows();
  clearAllParticles();
  clearShipDebris();
  disposeMergedChunks();
  state = 'menu';
  document.body.classList.remove('in-game');
  document.getElementById('menu').style.display = 'flex';
  document.getElementById('game-canvas').style.display = 'none';
  document.getElementById('hud').style.display = 'none';
  document.body.style.cursor = '';
  hideCustomCursor();
  buildMenu();
}

function showMenu() {
  if (fading) return;
  fadeToBlack(FADE_TO_MENU_OUT, function() {
    showMenuImmediate();
    fadeFromBlack(FADE_TO_MENU_IN);
  });
}

var menuTypeBuffer = '';
window.addEventListener('keydown', function(e) {
  // During playback: up/down=speed, left/right=skip, space=pause, R=restart, ESC=exit
  if (isPlayback) {
    if (e.code === 'KeyR') {
      restartPlayback();
      return;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      playbackSpeed = Math.max(0.05, +(playbackSpeed - 0.05).toFixed(2));
      return;
    }
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      playbackSpeed = Math.min(3.0, +(playbackSpeed + 0.05).toFixed(2));
      return;
    }
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      seekPlayback(playbackElapsed - 1000 * playbackSpeed);
      return;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      seekPlayback(playbackElapsed + 1000 * playbackSpeed);
      return;
    }
    if (e.code === 'Space' && !e.repeat) {
      paused = !paused;
      if (paused) stopContinuousSounds();
      return;
    }
    if (e.code === 'KeyX' && !e.repeat) {
      downloadPlaybackRecording();
      return;
    }
    if (e.code !== 'Escape') return;
  }
  if (e.code === 'KeyQ' && !e.repeat) {
    fpsShowHistogram = !fpsShowHistogram;
  }
  if (e.code === 'KeyZ' && !e.repeat) {
    curveTarget = curveTarget ? 0 : PATH_CURVE;
  }
  if (e.code === 'KeyP' && !e.repeat && state === 'playing') {
    paused = !paused;
    if (isRecording) { if (paused) recordPause(); else recordResume(); }
  }
  if (e.code === 'KeyR' && state !== 'menu') {
    restartLevel();
  }
  if (e.code === 'Escape' && state !== 'menu') {
    if (isPlayback) { stopPlayback(); return; }
    showMenu();
  }
  // Download recording on X key after death/win
  if (e.code === 'KeyX' && !e.repeat && !isPlayback && (state === 'dead' || state === 'won')) {
    downloadRecording(currentLevel);
  }
  // Replay recording on K key after death/win
  if (e.code === 'KeyK' && !e.repeat && !isPlayback && (state === 'dead' || state === 'won')) {
    stopRecording();
    var recText = serializeRecording(currentLevel);
    var recData = parseRecording(recText);
    if (recData) { playbackRecText = recText; startPlayback(recData); }
  }
  // cheat code detection — works in any state
  debugTypeBuffer += e.key.toLowerCase();
  if (debugTypeBuffer.length > 20) debugTypeBuffer = debugTypeBuffer.slice(-20);
  var _dt = debugTypeBuffer, _h = 0;
  for (var _i = Math.max(0, _dt.length - 11); _i < _dt.length; _i++)
    _h = ((_h << 5) - _h + _dt.charCodeAt(_i)) | 0;
  if (_h === -1483198775) {
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
      deathDitherUniform.value = 0;
      shipDitherUniform.value = 0;
      deathTimer = 0;
      deathStoppedTimer = 0;
      deathFade = 0;
      frozenDist = -1;
      playerX = safeX;
      playerY = safeY + 0.1;
      playerZ = safeZ;
      playerVY = 0;
      playerVX = 0;
      grounded = false;
      padSustain = false;
      glideLockedIn = false;
      frozenKeys = null;
      if (deathReason === 'crash') playerSpeed = 0;
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
    if (e.code === 'KeyI') {
      debugInspect = !debugInspect;
      if (debugInspect) {
        // Hide cosmetics
        if (starField) starField.visible = false;
        scene.background = new THREE.Color(0x331133);
        scene.fog = null;
        // Add big pink ground plane
        var planeGeo = new THREE.PlaneGeometry(2000, 2000);
        var planeMat = new THREE.MeshBasicMaterial({ color: 0xff69b4, side: THREE.DoubleSide });
        debugPlane = new THREE.Mesh(planeGeo, planeMat);
        debugPlane.rotation.x = -Math.PI / 2;
        debugPlane.position.set(0, -1.05, playerZ);
        scene.add(debugPlane);
      } else {
        // Restore cosmetics
        if (starField) starField.visible = true;
        scene.background = new THREE.Color(0x000011);
        scene.fog = new THREE.Fog(0x000011, VIEW_DISTANCE - FOG_START, VIEW_DISTANCE);
        if (debugPlane) { scene.remove(debugPlane); debugPlane = null; }
      }
    }
    if (e.code === 'KeyO') {
      debugWireframe = !debugWireframe;
      if (!debugWireframe && debugWireMesh) {
        scene.remove(debugWireMesh);
        debugWireMesh.geometry.dispose();
        debugWireMesh = null;
      }
    }
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
      for (var ri = 0; ri < LEVELS.length; ri++) { var rk = levelKey(ri); localStorage.removeItem('spaceRunnerRec-' + rk); localStorage.removeItem('spaceRunnerRecDate-' + rk); }
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
function startLevelImmediate(idx) {
  currentLevel = idx;
  state = 'playing';
  paused = false;
  alive = true;
  playerLane = Math.floor(LANES / 2);
  playerX = 0;
  playerY = 0;
  // Spawn on top of the highest block at start position
  var spawnRow = getRow(idx, 0);
  if (spawnRow) {
    var spawnCol = spawnRow[Math.floor(LANES / 2)];
    if (spawnCol) {
      for (var si = 0; si < spawnCol.length; si++) {
        var st = blockTop(spawnCol[si]);
        if (st > playerY) playerY = st;
      }
    }
  }
  playerVY = 0;
  playerVX = 0;
  playerSpeed = 0;
  playerZ = 0;
  fuel = 100;
  oxygen = 100;
  grounded = true;
  stuckTimer = 0;
  stuckZ = 0;
  levelTimerMax = LEVELS[idx].rows.length * 0.1;
  levelTimer = levelTimerMax;
  score = 0;
  screenFade = 0;
  deathDitherUniform.value = 0;
  shipDitherUniform.value = 0;
  flameLifeScale = 1;
  winStarSpeed = 1;
  if (accelFlame) { accelFlame.points.material.opacity = 0.9; accelFlame.points.material.size = 0.55; }
  if (oxyAccelFlame) { oxyAccelFlame.points.material.opacity = 0.9; oxyAccelFlame.points.material.size = 0.55; }
  if (cruiseFlame) { cruiseFlame.points.material.opacity = 0.65; cruiseFlame.points.material.size = 0.4; }
  if (sustainFlame) { sustainFlame.points.material.opacity = 0.7; sustainFlame.points.material.size = 0.3; }
  if (glideFlame) { glideFlame.points.material.opacity = 0.8; glideFlame.points.material.size = 0.45; }
  if (oxyGlideFlame) { oxyGlideFlame.points.material.opacity = 0.8; oxyGlideFlame.points.material.size = 0.45; }
  deathTimer = 0;
  deathStoppedTimer = 0;
  deathFade = 0;
  frozenDist = -1;
  wonTime = 0;
  started = false;
  frozenKeys = null;
  glideLockedIn = false;
  isGliding = false;
  isSustaining = false;
  padSustain = false;
  airDrainFuel = false;
  airDrainOxy = false;
  lastRecRow = -1;

  if (animId) cancelAnimationFrame(animId);
  stopContinuousSounds();
  clearAllRows();
  initMergedChunks(idx);
  clearAllParticles();
  clearShipDebris();
  resetSoundState();
  shipMesh.visible = true;
  lastStarZ = 0;
  levelStartTime = performance.now();
  document.body.classList.add('in-game');
  document.getElementById('menu').style.display = 'none';
  document.getElementById('game-canvas').style.display = 'block';
  document.getElementById('hud').style.display = 'block';
  if (!isPlayback) document.body.style.cursor = 'none';

  if (!isPlayback) startRecording();
  clock.getDelta(); // reset clock
  gameLoop();
}

function startLevel(idx) {
  if (fading) return;
  fadeToBlack(FADE_START_LEVEL_OUT, function() {
    startLevelImmediate(idx);
    fadeFromBlack(FADE_START_LEVEL_IN);
  });
}

function restartLevel() {
  if (fading) return;
  fadeToBlack(FADE_RESTART_OUT, function() {
    startLevelImmediate(currentLevel);
    fadeFromBlack(FADE_RESTART_IN);
  });
}

var scoreDist = 0;
var scoreTimeMult = 1;
var scoreFuelMult = 1;
var scoreOxyMult = 1;

function calcAndSaveScore() {
  scoreDist = Math.floor(frozenDist >= 0 ? frozenDist : Math.abs(playerZ));
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
  if (isPlayback) { isNewBest = false; return; }
  var key = levelKey(currentLevel);
  prevBest = bestScores[key] || 0;
  isNewBest = !bestScores[key] || score > bestScores[key];
  if (isNewBest) {
    bestScores[key] = score;
    localStorage.setItem('spaceRunnerScores', JSON.stringify(bestScores));
  }
  // Save recording if it beats the previous recording's score (or no recording exists)
  var recKey = 'spaceRunnerRec-' + key;
  var prevRec = localStorage.getItem(recKey);
  var prevRecScore = 0;
  if (prevRec) {
    var m = prevRec.match(/\n(\d+) \$ (\d+)/);
    if (m) prevRecScore = parseInt(m[2], 10);
  }
  if (score > prevRecScore) {
    try {
      localStorage.setItem(recKey, serializeRecording(currentLevel));
      localStorage.setItem('spaceRunnerRecDate-' + key, new Date().toISOString());
    } catch (e) { /* storage full — silently skip */ }
  }
}

// ---- GAME LOOP ----
var animId;
var paused = false;
function updateDebugWireframe() {
  if (!debugWireframe) return;
  if (debugWireMesh) {
    scene.remove(debugWireMesh);
    debugWireMesh.geometry.dispose();
    debugWireMesh = null;
  }
  var curRow = zToRow(playerZ);
  var verts = [];
  var colors = [];
  var hw = LANE_WIDTH / 2;
  var hb = BLOCK_SIZE / 2;
  for (var ri = curRow - 1; ri <= curRow + 1; ri++) {
    var row = getRow(currentLevel, ri);
    if (!row) continue;
    var rz = rowToZ(ri);
    for (var lane = 0; lane < LANES; lane++) {
      var col = row[lane];
      if (!col) continue;
      for (var bi = 0; bi < col.length; bi++) {
        var h = col[bi].h || 0;
        // Color gradient by height: green(0) -> yellow(2) -> red(4+)
        var t = Math.min(1, Math.max(0, h / 4));
        var r, g, b;
        if (t < 0.5) {
          var s = t * 2;
          r = s; g = 1; b = 0;
        } else {
          var s = (t - 0.5) * 2;
          r = 1; g = 1 - s; b = 0;
        }
        var bx = laneToX(lane);
        var by = h - hb;
        var x0 = bx - hw, x1 = bx + hw;
        var y0 = by - hb, y1 = by + hb;
        var z0 = rz - hb, z1 = rz + hb;
        // 12 edges = 24 vertices
        verts.push(x0,y0,z0, x1,y0,z0, x1,y0,z0, x1,y0,z1,
                   x1,y0,z1, x0,y0,z1, x0,y0,z1, x0,y0,z0);
        verts.push(x0,y1,z0, x1,y1,z0, x1,y1,z0, x1,y1,z1,
                   x1,y1,z1, x0,y1,z1, x0,y1,z1, x0,y1,z0);
        verts.push(x0,y0,z0, x0,y1,z0, x1,y0,z0, x1,y1,z0,
                   x1,y0,z1, x1,y1,z1, x0,y0,z1, x0,y1,z1);
        for (var ci = 0; ci < 24; ci++) colors.push(r, g, b);
      }
    }
  }
  if (verts.length === 0) return;
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  var mat = new THREE.LineBasicMaterial({ vertexColors: true, depthTest: false });
  debugWireMesh = new THREE.LineSegments(geo, mat);
  debugWireMesh.renderOrder = 999;
  scene.add(debugWireMesh);
}

function gameLoop() {
  if (state === 'menu') return;

  animId = requestAnimationFrame(gameLoop);
  var dt = Math.min(clock.getDelta(), 0.05);
  if (isPlayback) dt *= playbackSpeed;

  // Smooth curvature toggle
  var cv = pathCurveUniform.value;
  if (cv !== curveTarget) {
    cv += (curveTarget - cv) * (1 - Math.exp(-CURVE_LERP_RATE * dt));
    if (Math.abs(cv - curveTarget) < 1e-12) cv = curveTarget;
    pathCurveUniform.value = cv;
  }

  if (isPlayback) processPlaybackFrame();

  if (paused) {
    stopContinuousSounds();
    renderer.render(scene, camera);
    if (isPlayback && playbackShowPause) {
      drawHud(0);
      // Overlay pause text on top of HUD
      hudCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      hudCtx.fillRect(0, 0, hudCanvas.width, hudCanvas.height);
      hudCtx.textAlign = 'center';
      hudCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      hudCtx.font = 'bold 48px monospace';
      hudCtx.fillText('PAUSED', hudCanvas.width / 2, hudCanvas.height / 2);
      hudCtx.textAlign = 'left';
    } else if (isPlayback) {
      drawHud(0);
    } else {
      drawPauseScreen();
    }
    return;
  }

  if (state === 'playing') {
    if (started) levelTimer = Math.max(0, levelTimer - dt);
    updatePlayer(dt);
    updateSounds(dt);
    updateCamera();
    updateShadow();
    updateChunks();
    updateEngineTrail(dt);
    updateSparks(dt);
    updateDust(dt);
    updateStars(dt);
  } else if (state === 'dead') {
    deathSpeed = Math.max(0, deathSpeed - DECEL_RATE * 0.5 * dt);
    playerZ -= deathSpeed * dt;
    updateCamera();
    updateShadow();
    updateChunks();
    screenFade = Math.min(0.15, screenFade + dt * 0.2);
    deathTimer += dt;
    var deathFadeDelay = (deathReason === 'crash' || deathReason === 'kill') ? 0.25 : 0;
    var deathFadeElapsed = deathTimer - deathFadeDelay;
    deathFade = deathFadeElapsed > 0 ? Math.min(1, deathFadeElapsed / 0.25) : 0;
    if (deathSpeed < 2) deathStoppedTimer += dt;
    if (deathStoppedTimer > DEATH_DITHER_DELAY) deathDitherUniform.value = Math.min(1, (deathStoppedTimer - DEATH_DITHER_DELAY) / DEATH_DITHER_DURATION);
    // Dither out ship/debris after level dither completes
    if (deathDitherUniform.value >= 1) {
      var shipDitherStart = DEATH_DITHER_DELAY + DEATH_DITHER_DURATION;
      var shipT = (deathStoppedTimer - shipDitherStart) / SHIP_DITHER_DURATION;
      shipDitherUniform.value = Math.min(1, Math.max(0, shipT));
    }
    updateExplosion(dt);
    updateShipDebris(dt);
    updateEngineTrail(dt);
    updateSparks(dt);
    updateDust(dt);
    updateStars(dt);
  } else if (state === 'winning' || state === 'won') {
    screenFade = Math.min(0.125, screenFade + dt * 0.075);
    if (state === 'winning') winTimer -= dt;
    playerSpeed = Math.min(MAX_SPEED, playerSpeed + ACCEL_RATE * dt);
    var winLift = 0.375;
    if (keys['Space'] || keys['KeySpace']) {
      winLiftBoost = Math.min(winLift, (winLiftBoost || 0) + winLift * dt);
    } else {
      winLiftBoost = Math.max(0, (winLiftBoost || 0) - winLift * dt);
    }
    playerY += (winLift + winLiftBoost) * dt;
    playerZ -= playerSpeed * dt;
    // Ship pulls forward when holding accel
    var winAccel = 3;
    if (keys['ArrowUp'] || keys['KeyW']) {
      winShipVZ += winAccel * dt;
    } else {
      winShipVZ = Math.max(0, winShipVZ - winAccel * 0.5 * dt);
    }
    winShipZ -= winShipVZ * dt;
    grounded = false;
    // Allow steering unless out of fuel/oxygen
    if (fuel > 0 && oxygen > 0) {
      var winLateral = 40;
      if (keys['ArrowLeft'] || keys['KeyA']) playerVX -= winLateral * dt;
      if (keys['ArrowRight'] || keys['KeyD']) playerVX += winLateral * dt;
    }
    playerVX *= Math.max(0, 1 - 2 * dt);
    playerX += playerVX * dt;
    var winElapsedTotal = (2.0 - winTimer) + wonTime;
    if (winElapsedTotal > 5) {
      shipDitherUniform.value = Math.min(1, shipDitherUniform.value + dt / (SHIP_DITHER_DURATION * 5));
      var flameFade = 1 - shipDitherUniform.value;
      flameLifeScale = 1 + shipDitherUniform.value * 3;
      if (accelFlame) { accelFlame.points.material.opacity = 0.9 * flameFade; accelFlame.points.material.size = 0.55 * flameFade; }
      if (oxyAccelFlame) { oxyAccelFlame.points.material.opacity = 0.9 * flameFade; oxyAccelFlame.points.material.size = 0.55 * flameFade; }
      if (cruiseFlame) { cruiseFlame.points.material.opacity = 0.65 * flameFade; cruiseFlame.points.material.size = 0.4 * flameFade; }
      if (sustainFlame) { sustainFlame.points.material.opacity = 0.7 * flameFade; sustainFlame.points.material.size = 0.3 * flameFade; }
      if (glideFlame) { glideFlame.points.material.opacity = 0.8 * flameFade; glideFlame.points.material.size = 0.45 * flameFade; }
      if (oxyGlideFlame) { oxyGlideFlame.points.material.opacity = 0.8 * flameFade; oxyGlideFlame.points.material.size = 0.45 * flameFade; }
    }
    updateCamera();
    updateChunks();
    updateEngineTrail(dt);
    updateStars(dt);
    if (state === 'winning' && winTimer <= 0) {
      state = 'won';
      wonTime = 0;
      calcAndSaveScore();
      if (isRecording) { recordScore(); stopRecording(); }
    }
    if (state === 'won') wonTime += dt;
  }

  updateDebugWireframe();
  renderer.render(scene, camera);
  drawHud(dt);
}

// ---- BOOT ----
window.bootGame = function() {
  // Verify host
  var _hn = location.hostname, _hh = 0;
  for (var _hi = 0; _hi < _hn.length; _hi++) _hh = ((_hh << 5) - _hh + _hn.charCodeAt(_hi)) | 0;
  if (_hh !== 1504408847) {
    UNOFFICIAL = true;
    var _wm = document.createElement('div');
    _wm.id = 'unofficial-watermark';
    _wm.textContent = 'Piracy >:D';
    document.body.appendChild(_wm);
  }
  init3D();
  initHud();
  // Menu starts hidden (HTML has display:none), show it now behind the overlay
  showMenuImmediate();
  // Fade out loading text from current opacity, then reveal menu
  var startOpacity = parseFloat(fadeLoadingEl.style.opacity) || 0;
  if (startOpacity === 0) {
    fadeLoadingEl.style.display = 'none';
    fadeFromBlack(FADE_BOOT_IN);
  } else {
    var start = performance.now();
    function fadeOut() {
      var t = Math.min(1, (performance.now() - start) / FADE_BOOT_OUT);
      fadeLoadingEl.style.opacity = startOpacity * (1 - t);
      if (t < 1) requestAnimationFrame(fadeOut);
      else {
        fadeLoadingEl.style.display = 'none';
        fadeFromBlack(FADE_BOOT_IN);
      }
    }
    requestAnimationFrame(fadeOut);
  }
};
