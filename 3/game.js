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
  stopRecording();
  state = 'menu';
  document.getElementById('menu').style.display = 'flex';
  document.getElementById('game-canvas').style.display = 'none';
  document.getElementById('hud').style.display = 'none';
  document.body.style.cursor = '';
  buildMenu();
}

var menuTypeBuffer = '';
window.addEventListener('keydown', function(e) {
  // During playback, only ESC works
  if (isPlayback && e.code !== 'Escape') return;
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
    cancelAnimationFrame(animId);
    clearAllRows();
    clearAllParticles();
    startLevel(currentLevel);
  }
  if (e.code === 'Escape' && state !== 'menu') {
    if (isPlayback) { stopPlayback(); return; }
    cancelAnimationFrame(animId);
    stopContinuousSounds();
    clearAllRows();
    clearAllParticles();
    clearShipDebris();
    showMenu();
  }
  // Download recording on X key after death/win
  if (e.code === 'KeyX' && !e.repeat && !isPlayback && (state === 'dead' || state === 'won')) {
    downloadRecording(currentLevel);
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
      deathTimer = 0;
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
        if (planetMesh) planetMesh.visible = false;
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
        if (planetMesh) planetMesh.visible = true;
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
  levelTimerMax = LEVELS[idx].rows.length * 0.1;
  levelTimer = levelTimerMax;
  score = 0;
  screenFade = 0;
  deathDitherUniform.value = 0;
  deathTimer = 0;
  started = false;
  frozenKeys = null;
  glideLockedIn = false;
  padSustain = false;
  airDrainFuel = false;
  airDrainOxy = false;
  lastRecRow = -1;

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

  if (!isPlayback) startRecording();
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
  if (isPlayback) { isNewBest = false; return; }
  var key = '' + currentLevel;
  isNewBest = !bestScores[key] || score > bestScores[key];
  if (isNewBest) {
    bestScores[key] = score;
    localStorage.setItem('spaceRunnerScores', JSON.stringify(bestScores));
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

  // Smooth curvature toggle
  var cv = pathCurveUniform.value;
  if (cv !== curveTarget) {
    cv += (curveTarget - cv) * (1 - Math.exp(-CURVE_LERP_RATE * dt));
    if (Math.abs(cv - curveTarget) < 1e-12) cv = curveTarget;
    pathCurveUniform.value = cv;
  }

  if (isPlayback) processPlaybackFrame();

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
    screenFade = Math.min(0.15, screenFade + dt * 0.2);
    deathTimer += dt;
    if (deathTimer > DEATH_DITHER_DELAY) deathDitherUniform.value = Math.min(1, (deathTimer - DEATH_DITHER_DELAY) / DEATH_DITHER_DURATION);
    updateExplosion(dt);
    updateShipDebris(dt);
    updateSparks(dt);
    updateDust(dt);
  } else if (state === 'winning' || state === 'won') {
    screenFade = Math.min(0.125, screenFade + dt * 0.075);
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
      if (isRecording) recordScore();
    }
  }

  updateDebugWireframe();
  renderer.render(scene, camera);
  drawHud(dt);
}

// ---- BOOT ----
init3D();
initHud();
showMenu();
