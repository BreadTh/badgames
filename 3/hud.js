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

function lerpColor(liveStyle, deadR, deadG, deadB, deadA, df) {
  // Parse rgba from live style string, lerp toward dead color
  var m = liveStyle.match(/[\d.]+/g);
  var r = Math.round(+m[0] + (deadR - m[0]) * df);
  var g = Math.round(+m[1] + (deadG - m[1]) * df);
  var b = Math.round(+m[2] + (deadB - m[2]) * df);
  var a = (+m[3] + (deadA - m[3]) * df).toFixed(2);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function drawBar(x, y, bw, bh, pct, color, strokeColor, label, value, warn) {
  var t = performance.now();
  var df = deathFade; // 0 = alive, 1 = fully dead
  if (isPlayback && paused) warn = false;

  hudCtx.fillStyle = '#222';
  hudCtx.fillRect(x, y, bw, bh);

  if (df >= 1) {
    hudCtx.fillStyle = 'rgba(80, 80, 80, 0.5)';
    hudCtx.fillRect(x, y, bw * pct, bh);
  } else if (df > 0) {
    // Lerp from live color to dead gray
    hudCtx.fillStyle = lerpColor(color, 80, 80, 80, 0.5, df);
    hudCtx.fillRect(x, y, bw * pct, bh);
  } else if (warn && pct < 0.15 && state !== 'winning' && state !== 'won') {
    // Critical: blink + breathe
    var blink = Math.sin(t * 0.03) > 0;
    if (blink) {
      hudCtx.fillStyle = color;
      hudCtx.fillRect(x, y, bw * pct, bh);
    }
    var breathe = Math.sin(t * 0.008) * 4;
    hudCtx.fillStyle = color;
    hudCtx.fillRect(x, y - breathe, bw * pct, bh + breathe * 2);
  } else if (warn && pct < 0.5 && state !== 'winning' && state !== 'won') {
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

  // Lerp stroke color
  var sR = parseInt(strokeColor.slice(1,2), 16) * 17;
  var sG = parseInt(strokeColor.slice(2,3), 16) * 17;
  var sB = parseInt(strokeColor.slice(3,4), 16) * 17;
  var dStroke = 'rgb(' + Math.round(sR + (68 - sR) * df) + ',' + Math.round(sG + (68 - sG) * df) + ',' + Math.round(sB + (68 - sB) * df) + ')';
  hudCtx.strokeStyle = dStroke;
  hudCtx.lineWidth = df >= 1 ? 1 : (warn && pct < 0.15 ? 2 : 1);
  hudCtx.strokeRect(x, y, bw, bh);
  hudCtx.lineWidth = 1;

  // Lerp label color: #fff -> #666
  var lv = Math.round(255 + (102 - 255) * df);
  hudCtx.fillStyle = 'rgb(' + lv + ',' + lv + ',' + lv + ')';
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
  if (dangerPct > 0 && alive && state !== 'winning' && state !== 'won' && !(isPlayback && paused)) {
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
  var spdAnimating = dangerPct > 0 && alive && state !== 'winning' && state !== 'won';
  var safeX = spdX + (spdAnimating ? (bw + (Math.sin(performance.now() * 0.006) * dangerPct * 4) * 2) : bw) * (KILL_SPEED_THRESHOLD / MAX_SPEED);
  hudCtx.strokeStyle = playerSpeed > KILL_SPEED_THRESHOLD ? 'rgba(255, 60, 60, 0.9)' : 'rgba(255, 200, 0, 0.7)';
  hudCtx.lineWidth = 2;
  hudCtx.beginPath();
  hudCtx.moveTo(safeX, spdY);
  hudCtx.lineTo(safeX, spdY + (spdAnimating ? bh + (Math.sin(performance.now() * 0.006) * dangerPct * 4) * 2 : bh));
  hudCtx.stroke();
  hudCtx.lineWidth = 1;

  // Right side bars: timer + distance
  var rx = hudCanvas.width - margin - bw;
  var ry = margin;
  var timerPct = levelTimerMax > 0 ? levelTimer / levelTimerMax : 0;
  drawBar(rx, ry, bw, bh, timerPct, 'rgba(255, 200, 0, 0.85)', '#fc0', 'TIME', Math.ceil(levelTimer) + 's', false);
  ry += bh + 8;
  var totalDist = LEVELS[currentLevel] ? LEVELS[currentLevel].rows.length : 1;
  var traveled = Math.min(totalDist, frozenDist >= 0 ? frozenDist : Math.abs(playerZ));
  drawBar(rx, ry, bw, bh, traveled / totalDist, 'rgba(0, 220, 130, 0.85)', '#0d8', 'DIST', Math.floor(traveled) + '/' + totalDist);


  // Screen tint overlay
  if (screenFade > 0) {
    hudCtx.fillStyle = 'rgba(0, 0, 0, ' + screenFade + ')';
    hudCtx.fillRect(0, 0, hudCanvas.width, hudCanvas.height);
  }

  // Playback bar at bottom
  if (isPlayback) {
    drawPlaybackBar();
  }

  // Death/win message
  if (state === 'dead' && deathFade > 0) {
    var ta = deathFade;
    var cx = hudCanvas.width / 2;
    var cy = hudCanvas.height * 0.45 - 15;
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
    var deathScoreText = 'SCORE: ' + score.toLocaleString();
    if (isNewBest) deathScoreText += '  NEW BEST!';
    hudCtx.fillText(deathScoreText, cx, cy + 56);
    hudCtx.fillStyle = 'rgba(255, 255, 255, ' + (ta * 0.7) + ')';
    hudCtx.font = '16px monospace';
    if (!isPlayback) {
      hudCtx.fillText('R restart | ESC menu | X download', cx, cy + 80);
    } else {
      hudCtx.fillText('R restart recording | ESC exit', cx, cy + 80);
    }
    hudCtx.textAlign = 'left';
  } else if ((state === 'winning' || state === 'won') && screenFade > 0) {
    var ta = Math.min(1, screenFade / 0.3);
    var cx = hudCanvas.width / 2;
    var cy = hudCanvas.height * 0.45 - 35;
    hudCtx.textAlign = 'center';
    hudCtx.fillStyle = 'rgba(0, 255, 100, ' + (ta * 0.9) + ')';
    hudCtx.font = 'bold 48px monospace';
    hudCtx.fillText('LEVEL CLEAR', cx, cy);
    if (state === 'won') {
      var wt = wonTime;
      var lineDelay = 0.15; // seconds between score lines
      var lineIdx = 0;
      hudCtx.font = '14px monospace';
      var ly = cy + 30;
      var eqX = cx;
      var running = 100 * scoreDist;
      // Line 0: dist
      if (wt >= lineIdx * lineDelay) {
        hudCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        hudCtx.textAlign = 'right';
        hudCtx.fillText(scoreDist + ' dist x 100 ', eqX, ly);
        hudCtx.textAlign = 'left';
        hudCtx.fillText('= ' + running.toLocaleString(), eqX, ly);
      }
      ly += 18; lineIdx++;
      // Line 1: time%
      running = Math.floor(running * scoreTimeMult);
      if (wt >= lineIdx * lineDelay) {
        hudCtx.fillStyle = 'rgba(255, 200, 0, 0.5)';
        hudCtx.textAlign = 'right';
        hudCtx.fillText('+' + Math.floor((scoreTimeMult - 1) * 100) + '% time ', eqX, ly);
        hudCtx.textAlign = 'left';
        hudCtx.fillText('= ' + running.toLocaleString(), eqX, ly);
      }
      ly += 18; lineIdx++;
      // Line 2: fuel%
      running = Math.floor(running * scoreFuelMult);
      if (wt >= lineIdx * lineDelay) {
        hudCtx.fillStyle = 'rgba(0, 200, 255, 0.5)';
        hudCtx.textAlign = 'right';
        hudCtx.fillText('+' + Math.floor((scoreFuelMult - 1) * 100) + '% fuel ', eqX, ly);
        hudCtx.textAlign = 'left';
        hudCtx.fillText('= ' + running.toLocaleString(), eqX, ly);
      }
      ly += 18; lineIdx++;
      // Line 3: oxy%
      running = Math.floor(running * scoreOxyMult);
      if (wt >= lineIdx * lineDelay) {
        hudCtx.textAlign = 'right';
        hudCtx.fillText('+' + Math.floor((scoreOxyMult - 1) * 100) + '% O2 ', eqX, ly);
        hudCtx.textAlign = 'left';
        hudCtx.fillText('= ' + running.toLocaleString(), eqX, ly);
      }
      ly += 24;
      // Line 4: SCORE (double delay)
      var scoreTime = (lineIdx + 1) * lineDelay + lineDelay; // extra lineDelay gap
      if (wt >= scoreTime) {
        hudCtx.textAlign = 'center';
        hudCtx.fillStyle = 'rgba(255, 200, 0, 0.9)';
        hudCtx.font = 'bold 20px monospace';
        var scoreText = 'SCORE: ' + score.toLocaleString();
        if (isNewBest) scoreText += '  NEW BEST!';
        else { var best = bestScores['' + currentLevel]; if (best) scoreText += '  BEST: ' + best.toLocaleString(); }
        hudCtx.fillText(scoreText, cx, ly);
        ly += 24;
        // Controls hint: slow fade in after score appears
        var hintFade = Math.min(1, (wt - scoreTime) / 0.5);
        if (hintFade > 0) {
          hudCtx.fillStyle = 'rgba(255, 255, 255, ' + (hintFade * 0.7) + ')';
          hudCtx.font = '16px monospace';
          if (!isPlayback) {
            hudCtx.fillText('R restart | ESC menu | X download', cx, ly);
          } else {
            hudCtx.fillText('R restart recording | ESC exit', cx, ly);
          }
        }
      }
    }
    hudCtx.textAlign = 'left';
  }

  // Controls hint (bottom center, fades out after a few seconds)
  if (state === 'playing' && alive && !isPlayback) {
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
  // Playback controls hint (fades out like normal controls)
  if (isPlayback && state === 'playing' && alive) {
    var elapsed = performance.now() - levelStartTime;
    var hintAlpha = elapsed < 5000 ? 0.5 : Math.max(0, 0.5 - (elapsed - 5000) / 2000);
    if (hintAlpha > 0) {
      hudCtx.fillStyle = 'rgba(255, 255, 255, ' + hintAlpha + ')';
      hudCtx.font = '14px monospace';
      hudCtx.textAlign = 'center';
      hudCtx.fillText('\u2191\u2193/WS: speed | \u2190\u2192/AD: skip | SPACE: pause | R: restart | ESC: exit', hudCanvas.width / 2, 30);
      hudCtx.textAlign = 'left';
    }
  }

  // Debug hint (permanent bottom bar)
  if (debugMode && !isPlayback) {
    var dbgY = hudCanvas.height - 12;
    hudCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    hudCtx.fillRect(0, dbgY - 14, hudCanvas.width, 20);
    hudCtx.fillStyle = '#ff0';
    hudCtx.font = '12px monospace';
    hudCtx.textAlign = 'center';
    var hint = '1:kill  2:invincible' + (debugInvincible ? ' [ON]' : '') +
      '  3:revive  4:max spd  5:warp back  6:fuel  7:oxy  8:no fuel  9:no oxy  0:stop' +
      '  I:pink' +
      '  O:colliders' + (debugWireframe ? ' [ON]' : '');
    hudCtx.fillText(hint, hudCanvas.width / 2, dbgY);
    hudCtx.textAlign = 'left';
  }

  drawFpsHistogram();
}

// ---- PLAYBACK BAR ----
var pbBarY = 0, pbBarH = 32;
var pbScrubX = 0, pbScrubW = 0, pbScrubY = 0, pbScrubH = 0;
var pbPlayBtnX = 0, pbPlayBtnW = 30;
var pbSlowBtnX = 0, pbSlowBtnW = 0;
var pbFastBtnX = 0, pbFastBtnW = 0;

function formatTime(ms) {
  var s = Math.max(0, Math.floor(ms / 1000));
  var m = Math.floor(s / 60);
  s = s % 60;
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

function drawPlaybackBar() {
  var w = hudCanvas.width;
  var h = hudCanvas.height;
  var barH = 48;
  var barY = h - barH;
  pbBarY = barY;
  pbBarH = barH;
  var inset = 6; // vertical padding inside bar

  // Background
  hudCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  hudCtx.fillRect(0, barY, w, barH);

  var cx = 0;
  var pad = 8;
  var midY = barY + barH / 2;
  var iconH = barH - inset * 2; // icon/button fill height

  // Play/Pause button
  pbPlayBtnX = pad;
  pbPlayBtnW = 28;
  cx = pbPlayBtnX;
  var iconHalf = iconH / 2;
  hudCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  if (paused) {
    // Play triangle
    hudCtx.beginPath();
    hudCtx.moveTo(cx + 4, midY - iconHalf);
    hudCtx.lineTo(cx + 4 + iconH * 0.7, midY);
    hudCtx.lineTo(cx + 4, midY + iconHalf);
    hudCtx.closePath();
    hudCtx.fill();
  } else {
    // Pause bars
    var barW2 = Math.max(4, iconH * 0.2);
    var gap = Math.max(3, iconH * 0.15);
    hudCtx.fillRect(cx + 4, midY - iconHalf, barW2, iconH);
    hudCtx.fillRect(cx + 4 + barW2 + gap, midY - iconHalf, barW2, iconH);
  }
  cx += pbPlayBtnW + pad;

  // << slow down button
  var btnH = barH - inset * 2, btnW = 32, btnR = 4;
  var btnY = midY - btnH / 2;
  pbSlowBtnX = cx;
  pbSlowBtnW = btnW;
  hudCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  hudCtx.beginPath();
  hudCtx.roundRect(cx, btnY, btnW, btnH, btnR);
  hudCtx.fill();
  hudCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  hudCtx.lineWidth = 1;
  hudCtx.stroke();
  hudCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  hudCtx.font = 'bold 16px monospace';
  hudCtx.textAlign = 'center';
  hudCtx.fillText('\u00AB', cx + btnW / 2, midY + 5);
  hudCtx.textAlign = 'left';
  cx += btnW + 4;

  // Speed display
  var speedStr = playbackSpeed.toFixed(2) + 'x';
  hudCtx.fillStyle = playbackSpeed === 1.0 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 200, 0, 0.9)';
  hudCtx.font = 'bold 13px monospace';
  var speedW = hudCtx.measureText(speedStr).width;
  hudCtx.fillText(speedStr, cx, midY + 4);
  cx += speedW + 4;

  // >> speed up button
  pbFastBtnX = cx;
  pbFastBtnW = btnW;
  hudCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  hudCtx.beginPath();
  hudCtx.roundRect(cx, btnY, btnW, btnH, btnR);
  hudCtx.fill();
  hudCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  hudCtx.lineWidth = 1;
  hudCtx.stroke();
  hudCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  hudCtx.font = 'bold 16px monospace';
  hudCtx.textAlign = 'center';
  hudCtx.fillText('\u00BB', cx + btnW / 2, midY + 5);
  hudCtx.textAlign = 'left';
  cx += btnW + pad;

  // Time display
  var curMs = Math.max(0, Math.min(playbackElapsed, playbackTotalMs));
  var totalMs = playbackTotalMs;
  var timeStr = formatTime(curMs) + ' / ' + formatTime(totalMs);
  hudCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  hudCtx.font = '13px monospace';
  hudCtx.fillText(timeStr, cx, midY + 4);
  var timeW = hudCtx.measureText(timeStr).width;
  cx += timeW + pad;

  // Scrub bar (remaining space, fills bar height)
  var scrubX = cx + 4;
  var scrubW = w - scrubX - pad;
  var scrubH = barH - inset * 2;
  var scrubY = barY + inset;
  pbScrubX = scrubX;
  pbScrubW = scrubW;
  pbScrubY = scrubY;
  pbScrubH = scrubH;

  // Track background
  hudCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  hudCtx.beginPath();
  hudCtx.roundRect(scrubX, scrubY, scrubW, scrubH, 4);
  hudCtx.fill();

  // Event markers
  if (totalMs > 0) {
    for (var mi = 0; mi < playbackMarkers.length; mi++) {
      var mk = playbackMarkers[mi];
      var mx = scrubX + (mk.ms / totalMs) * scrubW;
      var mt = mk.type;
      if (mt === 'death') {
        hudCtx.fillStyle = 'rgba(255, 40, 40, 0.9)';
        hudCtx.fillRect(mx - 2, scrubY, 4, scrubH);
      } else if (mt === 'win') {
        hudCtx.fillStyle = 'rgba(40, 255, 80, 0.9)';
        hudCtx.fillRect(mx - 2, scrubY, 4, scrubH);
      } else if (mt === 'fuel') {
        hudCtx.fillStyle = 'rgba(255, 136, 0, 0.7)';
        hudCtx.fillRect(mx - 1, scrubY, 3, scrubH);
      } else if (mt === 'oxy') {
        hudCtx.fillStyle = 'rgba(0, 130, 255, 0.7)';
        hudCtx.fillRect(mx - 1, scrubY, 3, scrubH);
      } else if (mt === 'fueloxy') {
        hudCtx.fillStyle = 'rgba(200, 255, 100, 0.8)';
        hudCtx.fillRect(mx - 1, scrubY, 3, scrubH);
      } else if (mt === 'jump') {
        hudCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        hudCtx.fillRect(mx, scrubY, 1, scrubH);
      } else if (mt === 'bonkfront') {
        hudCtx.fillStyle = 'rgba(200, 80, 255, 0.7)';
        hudCtx.fillRect(mx, scrubY, 1, scrubH);
      } else if (mt === 'bonkside' || mt === 'bonkhead') {
        hudCtx.fillStyle = 'rgba(160, 60, 220, 0.6)';
        hudCtx.fillRect(mx, scrubY, 1, scrubH);
      }
    }
  }

  // Progress fill
  var pct = totalMs > 0 ? Math.max(0, Math.min(1, curMs / totalMs)) : 0;
  if (pct > 0) {
    hudCtx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    hudCtx.beginPath();
    hudCtx.roundRect(scrubX, scrubY, scrubW * pct, scrubH, 4);
    hudCtx.fill();
  }

  // Playhead
  var headX = scrubX + scrubW * pct;
  var headR = scrubH / 2 - 2;
  hudCtx.fillStyle = '#fff';
  hudCtx.beginPath();
  hudCtx.arc(headX, midY, headR, 0, Math.PI * 2);
  hudCtx.fill();

  // Debug tag (top-left of bar)
  if (playbackDebug) {
    hudCtx.fillStyle = 'rgba(255, 80, 80, 0.8)';
    hudCtx.font = '10px monospace';
    hudCtx.fillText('DEBUG', pad, barY - 4);
  }

  hudCtx.textAlign = 'left';
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
