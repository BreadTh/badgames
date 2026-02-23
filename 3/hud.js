// ---- HUD ----
var controlsHint = 'WASD/Arrows: move | SPACE: jump | Z: disable curve | P: pause | R: restart | ESC: menu';
var hudCanvas, hudCtx;
function initHud() {
  hudCanvas = document.getElementById('hud-canvas');
  hudCanvas.width = window.innerWidth;
  hudCanvas.height = window.innerHeight;
  hudCtx = hudCanvas.getContext('2d');
}

// ---- FPS HISTOGRAM ----
var fpsShowHistogram = false;
var fpsFrameTimes = []; // timestamps of recent frames (last 10s)

function fpsRecordFrame() {
  var now = performance.now();
  fpsFrameTimes.push(now);
  // trim older than 10s
  var cutoff = now - 10000;
  while (fpsFrameTimes.length > 0 && fpsFrameTimes[0] < cutoff) {
    fpsFrameTimes.shift();
  }
}

function drawFpsHistogram() {
  if (!fpsShowHistogram || fpsFrameTimes.length < 2) return;

  var now = performance.now();
  var histW = 320, histH = 120;
  var x0 = hudCanvas.width - histW - 20;
  var y0 = hudCanvas.height - histH - 20;
  var bins = 100; // each bin = 100ms
  var counts = new Array(bins);
  for (var i = 0; i < bins; i++) counts[i] = 0;

  for (var i = 0; i < fpsFrameTimes.length; i++) {
    var age = now - fpsFrameTimes[i]; // ms ago
    var bin = Math.floor((10000 - age) / 100);
    if (bin >= 0 && bin < bins) counts[bin]++;
  }

  // convert counts to FPS (count per 100ms * 10)
  var fpsBins = new Array(bins);
  var maxFps = 0;
  for (var i = 0; i < bins; i++) {
    fpsBins[i] = counts[i] * 10;
    if (fpsBins[i] > maxFps) maxFps = fpsBins[i];
  }
  if (maxFps < 10) maxFps = 10;
  // round up to nearest 10
  maxFps = Math.ceil(maxFps / 10) * 10;

  var barW = histW / bins;

  // background
  hudCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  hudCtx.fillRect(x0, y0, histW, histH);
  hudCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  hudCtx.strokeRect(x0, y0, histW, histH);

  // 60fps reference line
  var y60 = y0 + histH - (60 / maxFps) * histH;
  if (y60 > y0) {
    hudCtx.strokeStyle = 'rgba(0, 255, 100, 0.3)';
    hudCtx.beginPath();
    hudCtx.moveTo(x0, y60);
    hudCtx.lineTo(x0 + histW, y60);
    hudCtx.stroke();
  }

  // bars
  for (var i = 0; i < bins; i++) {
    var fps = fpsBins[i];
    var barH = (fps / maxFps) * histH;
    var bx = x0 + i * barW;
    var by = y0 + histH - barH;
    // color: green >= 55, yellow 30-55, red < 30
    if (fps >= 55) hudCtx.fillStyle = 'rgba(0, 220, 100, 0.7)';
    else if (fps >= 30) hudCtx.fillStyle = 'rgba(255, 200, 0, 0.7)';
    else hudCtx.fillStyle = 'rgba(255, 50, 50, 0.7)';
    hudCtx.fillRect(bx, by, barW - 0.5, barH);
  }

  // labels
  hudCtx.fillStyle = '#fff';
  hudCtx.font = '11px monospace';
  hudCtx.textAlign = 'left';
  // current fps (last bin)
  var curFps = fpsBins[bins - 1];
  hudCtx.fillText('FPS: ' + curFps, x0 + 4, y0 + 12);
  hudCtx.fillText(maxFps, x0 + 4, y0 + 24);
  // time labels
  hudCtx.textAlign = 'right';
  hudCtx.fillStyle = 'rgba(255,255,255,0.5)';
  hudCtx.fillText('-10s', x0 + 30, y0 + histH - 3);
  hudCtx.fillText('now', x0 + histW - 2, y0 + histH - 3);
  hudCtx.textAlign = 'left';
}

function drawBar(x, y, bw, bh, pct, color, strokeColor, label, value, warn) {
  var t = performance.now();
  var dead = !alive;

  hudCtx.fillStyle = '#222';
  hudCtx.fillRect(x, y, bw, bh);

  if (dead) {
    hudCtx.fillStyle = 'rgba(80, 80, 80, 0.5)';
    hudCtx.fillRect(x, y, bw * pct, bh);
  } else if (warn && pct < 0.15) {
    // Critical: blink + breathe
    var blink = Math.sin(t * 0.03) > 0;
    if (blink) {
      hudCtx.fillStyle = color;
      hudCtx.fillRect(x, y, bw * pct, bh);
    }
    var breathe = Math.sin(t * 0.008) * 4;
    hudCtx.fillStyle = color;
    hudCtx.fillRect(x, y - breathe, bw * pct, bh + breathe * 2);
  } else if (warn && pct < 0.5) {
    // Warning: pulse opacity, stronger as pct drops
    var speed = 0.005 + (0.5 - pct) * 0.02;
    var pulse = Math.sin(t * speed);
    var alpha = 0.6 + pulse * 0.3;
    hudCtx.globalAlpha = alpha;
    hudCtx.fillStyle = color;
    hudCtx.fillRect(x, y, bw * pct, bh);
    hudCtx.globalAlpha = 1;
  } else {
    hudCtx.fillStyle = color;
    hudCtx.fillRect(x, y, bw * pct, bh);
  }

  hudCtx.strokeStyle = dead ? '#444' : strokeColor;
  hudCtx.lineWidth = dead ? 1 : (warn && pct < 0.15 ? 2 : 1);
  hudCtx.strokeRect(x, y, bw, bh);
  hudCtx.lineWidth = 1;

  hudCtx.fillStyle = dead ? '#666' : '#fff';
  hudCtx.font = '12px monospace';
  hudCtx.fillText(label, x + 5, y + 15);
  if (value !== undefined) {
    hudCtx.textAlign = 'right';
    hudCtx.fillText('' + value, x + bw - 5, y + 15);
    hudCtx.textAlign = 'left';
  }
}

function drawHud(dt) {
  fpsRecordFrame();
  hudCtx.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
  var bw = 200, bh = 20, margin = 20;
  var x = margin, y = margin;

  drawBar(x, y, bw, bh, oxygen / 100, 'rgba(0, 100, 255, 0.85)', '#0af', 'O2', Math.ceil(oxygen), true);
  y += bh + 8;
  drawBar(x, y, bw, bh, fuel / 100, 'rgba(255, 136, 0, 0.85)', '#f80', 'FUEL', Math.ceil(fuel), true);
  y += bh + 8;
  // Speed bar — danger effects above kill threshold
  var dangerPct = playerSpeed > KILL_SPEED_THRESHOLD
    ? (playerSpeed - KILL_SPEED_THRESHOLD) / (MAX_SPEED - KILL_SPEED_THRESHOLD) : 0;
  var spdX = x, spdY = y;
  if (dangerPct > 0 && alive) {
    var t = performance.now();
    // Shake: intensity scales with danger
    var shakeAmt = dangerPct * 3;
    spdX += (Math.random() - 0.5) * shakeAmt * 2;
    spdY += (Math.random() - 0.5) * shakeAmt * 2;
    // Breathe: bar expands/contracts
    var breathe = Math.sin(t * 0.006 * (1 + dangerPct * 2)) * dangerPct * 4;
    spdX -= breathe;
    spdY -= breathe;
    var spdBw = bw + breathe * 2;
    var spdBh = bh + breathe * 2;
    // Pulse opacity
    var pulse = 0.7 + Math.sin(t * 0.008 * (1 + dangerPct * 3)) * 0.3 * dangerPct;
    // Lerp color from blue to red based on danger
    var r = Math.round(180 + 75 * dangerPct);
    var g = Math.round(220 * (1 - dangerPct));
    var b = Math.round(255 * (1 - dangerPct * 0.7));
    var spdColor = 'rgba(' + r + ',' + g + ',' + b + ',' + (0.85 * pulse).toFixed(2) + ')';
    var spdStroke = dangerPct > 0.5 ? '#f44' : '#fa4';
    drawBar(spdX, spdY, spdBw, spdBh, playerSpeed / MAX_SPEED, spdColor, spdStroke, 'SPD');
  } else {
    drawBar(x, y, bw, bh, playerSpeed / MAX_SPEED, 'rgba(180, 220, 255, 0.85)', '#8cf', 'SPD');
  }
  // Safe speed indicator on speed bar
  var safeX = spdX + (dangerPct > 0 && alive ? (bw + (Math.sin(performance.now() * 0.006) * dangerPct * 4) * 2) : bw) * (KILL_SPEED_THRESHOLD / MAX_SPEED);
  hudCtx.strokeStyle = playerSpeed > KILL_SPEED_THRESHOLD ? 'rgba(255, 60, 60, 0.9)' : 'rgba(255, 200, 0, 0.7)';
  hudCtx.lineWidth = 2;
  hudCtx.beginPath();
  hudCtx.moveTo(safeX, spdY);
  hudCtx.lineTo(safeX, spdY + (dangerPct > 0 && alive ? bh + (Math.sin(performance.now() * 0.006) * dangerPct * 4) * 2 : bh));
  hudCtx.stroke();
  hudCtx.lineWidth = 1;

  // Right side bars: timer + distance
  var rx = hudCanvas.width - margin - bw;
  var ry = margin;
  var timerPct = levelTimerMax > 0 ? levelTimer / levelTimerMax : 0;
  drawBar(rx, ry, bw, bh, timerPct, 'rgba(255, 200, 0, 0.85)', '#fc0', 'TIME', Math.ceil(levelTimer) + 's', false);
  ry += bh + 8;
  var totalDist = LEVELS[currentLevel] ? LEVELS[currentLevel].rows.length : 1;
  var traveled = Math.min(totalDist, Math.abs(playerZ));
  drawBar(rx, ry, bw, bh, traveled / totalDist, 'rgba(0, 220, 130, 0.85)', '#0d8', 'DIST', Math.floor(traveled) + '/' + totalDist);

  // Camera shake when critical (only while alive)
  if (alive) {
    var oxyPct = oxygen / 100;
    var fuelPct = fuel / 100;
    if (oxyPct < 0.15 || fuelPct < 0.15) {
      var severity = Math.min(1, Math.max(1 - oxyPct, 1 - fuelPct));
      camera.position.x += (Math.random() - 0.5) * severity * 0.15;
      camera.position.y += (Math.random() - 0.5) * severity * 0.08;
    }
  }

  // Screen tint overlay
  if (screenFade > 0) {
    if (state === 'dead') {
      hudCtx.fillStyle = 'rgba(80, 0, 0, ' + screenFade + ')';
    } else {
      hudCtx.fillStyle = 'rgba(0, 0, 0, ' + screenFade + ')';
    }
    hudCtx.fillRect(0, 0, hudCanvas.width, hudCanvas.height);
  }

  // Death/win message (fades in with screenFade)
  var ta = Math.min(1, screenFade / 0.3); // text alpha: 0→1 as fade goes 0→0.3
  if (state === 'dead' && ta > 0) {
    var cx = hudCanvas.width / 2;
    var cy = hudCanvas.height / 2;
    hudCtx.textAlign = 'center';
    hudCtx.fillStyle = 'rgba(255, 0, 0, ' + (ta * 0.9) + ')';
    hudCtx.font = 'bold 48px monospace';
    hudCtx.fillText('GAME OVER', cx, cy);
    hudCtx.font = '14px monospace';
    var running = 100 * scoreDist;
    hudCtx.fillStyle = 'rgba(255, 255, 255, ' + (ta * 0.5) + ')';
    hudCtx.fillText(scoreDist + ' dist x 100 = ' + running.toLocaleString(), cx, cy + 32);
    hudCtx.fillStyle = 'rgba(255, 200, 0, ' + (ta * 0.9) + ')';
    hudCtx.font = 'bold 20px monospace';
    hudCtx.fillText('SCORE: ' + score.toLocaleString(), cx, cy + 56);
    hudCtx.fillStyle = 'rgba(255, 255, 255, ' + (ta * 0.7) + ')';
    hudCtx.font = '16px monospace';
    hudCtx.fillText('R to restart | ESC for menu', cx, cy + 80);
    hudCtx.textAlign = 'left';
  } else if ((state === 'winning' || state === 'won') && ta > 0) {
    var cx = hudCanvas.width / 2;
    var cy = hudCanvas.height / 2;
    hudCtx.textAlign = 'center';
    hudCtx.fillStyle = 'rgba(0, 255, 100, ' + (ta * 0.9) + ')';
    hudCtx.font = 'bold 48px monospace';
    hudCtx.fillText('LEVEL CLEAR', cx, cy);
    if (state === 'won') {
      hudCtx.font = '14px monospace';
      var ly = cy + 30;
      var eqX = cx; // = sign centered here
      var running = 100 * scoreDist;
      hudCtx.fillStyle = 'rgba(255, 255, 255, ' + (ta * 0.5) + ')';
      hudCtx.textAlign = 'right';
      hudCtx.fillText(scoreDist + ' dist x 100 ', eqX, ly);
      hudCtx.textAlign = 'left';
      hudCtx.fillText('= ' + running.toLocaleString(), eqX, ly);
      ly += 18;
      running = Math.floor(running * scoreTimeMult);
      hudCtx.fillStyle = 'rgba(255, 200, 0, ' + (ta * 0.5) + ')';
      hudCtx.textAlign = 'right';
      hudCtx.fillText('+' + Math.floor((scoreTimeMult - 1) * 100) + '% time ', eqX, ly);
      hudCtx.textAlign = 'left';
      hudCtx.fillText('= ' + running.toLocaleString(), eqX, ly);
      ly += 18;
      running = Math.floor(running * scoreFuelMult);
      hudCtx.fillStyle = 'rgba(0, 200, 255, ' + (ta * 0.5) + ')';
      hudCtx.textAlign = 'right';
      hudCtx.fillText('+' + Math.floor((scoreFuelMult - 1) * 100) + '% fuel ', eqX, ly);
      hudCtx.textAlign = 'left';
      hudCtx.fillText('= ' + running.toLocaleString(), eqX, ly);
      ly += 18;
      running = Math.floor(running * scoreOxyMult);
      hudCtx.textAlign = 'right';
      hudCtx.fillText('+' + Math.floor((scoreOxyMult - 1) * 100) + '% O2 ', eqX, ly);
      hudCtx.textAlign = 'left';
      hudCtx.fillText('= ' + running.toLocaleString(), eqX, ly);
      ly += 24;
      hudCtx.textAlign = 'center';
      hudCtx.fillStyle = 'rgba(255, 200, 0, ' + (ta * 0.9) + ')';
      hudCtx.font = 'bold 20px monospace';
      var best = bestScores['' + currentLevel];
      var scoreText = 'SCORE: ' + score.toLocaleString();
      if (best && best > score) scoreText += '  BEST: ' + best.toLocaleString();
      else scoreText += '  NEW BEST!';
      hudCtx.fillText(scoreText, cx, ly);
      ly += 24;
      hudCtx.fillStyle = 'rgba(255, 255, 255, ' + (ta * 0.7) + ')';
      hudCtx.font = '16px monospace';
      hudCtx.fillText('R to restart | ESC for menu', cx, ly);
    }
    hudCtx.textAlign = 'left';
  }

  // Controls hint (bottom center, fades out after a few seconds)
  if (state === 'playing' && alive) {
    var elapsed = performance.now() - levelStartTime;
    var hintAlpha = elapsed < 5000 ? 0.5 : Math.max(0, 0.5 - (elapsed - 5000) / 2000);
    if (hintAlpha > 0) {
      hudCtx.fillStyle = 'rgba(255, 255, 255, ' + hintAlpha + ')';
      hudCtx.font = '14px monospace';
      hudCtx.textAlign = 'center';
      hudCtx.fillText(controlsHint, hudCanvas.width / 2, 30);
      hudCtx.textAlign = 'left';
    }
  }

  // Debug hint (permanent bottom bar)
  if (debugMode) {
    var dbgY = hudCanvas.height - 12;
    hudCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    hudCtx.fillRect(0, dbgY - 14, hudCanvas.width, 20);
    hudCtx.fillStyle = '#ff0';
    hudCtx.font = '12px monospace';
    hudCtx.textAlign = 'center';
    var hint = '1:kill  2:invincible' + (debugInvincible ? ' [ON]' : '') +
      '  3:revive  4:max spd  5:warp back  6:fuel  7:oxy  8:no fuel  9:no oxy  0:stop';
    hudCtx.fillText(hint, hudCanvas.width / 2, dbgY);
    hudCtx.textAlign = 'left';
  }

  drawFpsHistogram();
}

function drawPauseScreen() {
  hudCtx.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
  var cx = hudCanvas.width / 2;
  var cy = hudCanvas.height / 2;

  // Dim overlay
  hudCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  hudCtx.fillRect(0, 0, hudCanvas.width, hudCanvas.height);

  hudCtx.textAlign = 'center';
  hudCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  hudCtx.font = 'bold 48px monospace';
  hudCtx.fillText('PAUSED', cx, cy);

  hudCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  hudCtx.font = '16px monospace';
  hudCtx.fillText(controlsHint, cx, cy + 40);
  hudCtx.textAlign = 'left';
}
