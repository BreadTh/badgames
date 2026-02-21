// ---- DEBUG ----
var debugOpen = false;
window.addEventListener('keydown', function(e) {
  if (e.code === 'KeyQ' && state !== 'menu') {
    debugOpen = !debugOpen;
    debugMode = debugOpen;
  }
});

// Project a 3D world point to 2D screen coords
function worldToScreen(wx, wy, wz) {
  var v = new THREE.Vector3(wx, wy, wz);
  v.project(camera);
  return {
    x: (v.x * 0.5 + 0.5) * hudCanvas.width,
    y: (-v.y * 0.5 + 0.5) * hudCanvas.height
  };
}

function drawDebug() {
  if (!debugOpen) return;
  var hw = PLAYER_W / 2;
  var hd = PLAYER_D / 2;
  var frontZ = playerZ - hd;
  var backZ = playerZ + hd;

  // Draw 8 collision corners (cube)
  var corners = [
    { wx: playerX - hw, wy: playerY,            wz: frontZ, label: 'FBL' },
    { wx: playerX + hw, wy: playerY,            wz: frontZ, label: 'FBR' },
    { wx: playerX - hw, wy: playerY + PLAYER_H, wz: frontZ, label: 'FTL' },
    { wx: playerX + hw, wy: playerY + PLAYER_H, wz: frontZ, label: 'FTR' },
    { wx: playerX - hw, wy: playerY,            wz: backZ,  label: 'BBL' },
    { wx: playerX + hw, wy: playerY,            wz: backZ,  label: 'BBR' },
    { wx: playerX - hw, wy: playerY + PLAYER_H, wz: backZ,  label: 'BTL' },
    { wx: playerX + hw, wy: playerY + PLAYER_H, wz: backZ,  label: 'BTR' }
  ];
  for (var i = 0; i < corners.length; i++) {
    var c = corners[i];
    var sp = worldToScreen(c.wx, c.wy, c.wz);
    hudCtx.fillStyle = '#0f0';
    hudCtx.beginPath();
    hudCtx.arc(sp.x, sp.y, 4, 0, Math.PI * 2);
    hudCtx.fill();
    hudCtx.font = '10px monospace';
    hudCtx.fillText(c.label, sp.x + 6, sp.y + 3);
  }

  // Show where each bottom corner's row actually resolves (red dot at row center Z)
  var botChecks = [
    { x: playerX - hw, z: frontZ, row: zToRow(frontZ), label: 'FL' },
    { x: playerX + hw, z: frontZ, row: zToRow(frontZ), label: 'FR' },
    { x: playerX - hw, z: backZ,  row: zToRow(backZ),  label: 'BL' },
    { x: playerX + hw, z: backZ,  row: zToRow(backZ),  label: 'BR' },
  ];
  for (var bc = 0; bc < 4; bc++) {
    var rowCenterZ = rowToZ(botChecks[bc].row);
    var sp4 = worldToScreen(botChecks[bc].x, playerY, rowCenterZ);
    hudCtx.fillStyle = '#f00';
    hudCtx.beginPath();
    hudCtx.arc(sp4.x, sp4.y, 5, 0, Math.PI * 2);
    hudCtx.fill();
    hudCtx.font = '10px monospace';
    hudCtx.fillText('r' + botChecks[bc].row, sp4.x + 8, sp4.y - 5);
    // Line from green corner to red resolved position
    var sp5 = worldToScreen(botChecks[bc].x, playerY, botChecks[bc].z);
    hudCtx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    hudCtx.lineWidth = 1;
    hudCtx.beginPath();
    hudCtx.moveTo(sp5.x, sp5.y);
    hudCtx.lineTo(sp4.x, sp4.y);
    hudCtx.stroke();
  }

  // Draw cube wireframe: front face, back face, connecting edges
  hudCtx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
  hudCtx.lineWidth = 1;
  // Front face: 0-1-3-2-0
  var fOrder = [0, 1, 3, 2, 0];
  hudCtx.beginPath();
  for (var j = 0; j < fOrder.length; j++) {
    var sp2 = worldToScreen(corners[fOrder[j]].wx, corners[fOrder[j]].wy, corners[fOrder[j]].wz);
    if (j === 0) hudCtx.moveTo(sp2.x, sp2.y); else hudCtx.lineTo(sp2.x, sp2.y);
  }
  hudCtx.stroke();
  // Back face: 4-5-7-6-4
  var bOrder = [4, 5, 7, 6, 4];
  hudCtx.beginPath();
  for (var j2 = 0; j2 < bOrder.length; j2++) {
    var sp3 = worldToScreen(corners[bOrder[j2]].wx, corners[bOrder[j2]].wy, corners[bOrder[j2]].wz);
    if (j2 === 0) hudCtx.moveTo(sp3.x, sp3.y); else hudCtx.lineTo(sp3.x, sp3.y);
  }
  hudCtx.stroke();
  // Connecting edges (front to back)
  for (var k = 0; k < 4; k++) {
    var a = worldToScreen(corners[k].wx, corners[k].wy, corners[k].wz);
    var b = worldToScreen(corners[k + 4].wx, corners[k + 4].wy, corners[k + 4].wz);
    hudCtx.beginPath();
    hudCtx.moveTo(a.x, a.y);
    hudCtx.lineTo(b.x, b.y);
    hudCtx.stroke();
  }
  hudCtx.lineWidth = 1;

  // Draw collider faces for all rows the player overlaps + the front row ahead
  var pRows = playerRows();
  var frontRow = pRows[pRows.length - 1] + 1; // row ahead of player's front edge

  // Helper to draw a line between two 3D points
  function debugLine(x1, y1, z1, x2, y2, z2, color) {
    var a = worldToScreen(x1, y1, z1);
    var b = worldToScreen(x2, y2, z2);
    hudCtx.strokeStyle = color;
    hudCtx.lineWidth = 2;
    hudCtx.beginPath();
    hudCtx.moveTo(a.x, a.y);
    hudCtx.lineTo(b.x, b.y);
    hudCtx.stroke();
    hudCtx.fillStyle = color;
    hudCtx.beginPath();
    hudCtx.arc(a.x, a.y, 3, 0, Math.PI * 2);
    hudCtx.fill();
    hudCtx.beginPath();
    hudCtx.arc(b.x, b.y, 3, 0, Math.PI * 2);
    hudCtx.fill();
  }

  // Draw full collider boxes for each overlapping row
  var lhw = LANE_WIDTH / 2;
  for (var ri = 0; ri < pRows.length; ri++) {
    var rowData = getRow(currentLevel, pRows[ri]);
    if (!rowData) continue;
    var rz = rowToZ(pRows[ri]);
    var rzFront = rz - BLOCK_SIZE * 0.5;
    var rzBack = rz + BLOCK_SIZE * 0.5;
    for (var lane = 0; lane < LANES; lane++) {
      var cell = rowData[lane];
      if (!cell) continue;
      var top = cell.h || 0;
      var bot = top - BLOCK_SIZE * 0.5;
      var lx = laneToX(lane);

      // Floor (top surface) - CYAN
      debugLine(lx - lhw, top, rzFront, lx + lhw, top, rzFront, 'rgba(0, 255, 255, 0.8)');
      debugLine(lx - lhw, top, rzBack, lx + lhw, top, rzBack, 'rgba(0, 255, 255, 0.8)');
      debugLine(lx - lhw, top, rzFront, lx - lhw, top, rzBack, 'rgba(0, 255, 255, 0.4)');
      debugLine(lx + lhw, top, rzFront, lx + lhw, top, rzBack, 'rgba(0, 255, 255, 0.4)');

      // Ceiling (bottom surface) - MAGENTA
      debugLine(lx - lhw, bot, rzFront, lx + lhw, bot, rzFront, 'rgba(255, 0, 255, 0.8)');
      debugLine(lx - lhw, bot, rzBack, lx + lhw, bot, rzBack, 'rgba(255, 0, 255, 0.8)');
      debugLine(lx - lhw, bot, rzFront, lx - lhw, bot, rzBack, 'rgba(255, 0, 255, 0.4)');
      debugLine(lx + lhw, bot, rzFront, lx + lhw, bot, rzBack, 'rgba(255, 0, 255, 0.4)');

      // Left wall - RED
      debugLine(lx - lhw, bot, rzFront, lx - lhw, top, rzFront, 'rgba(255, 80, 80, 0.8)');
      debugLine(lx - lhw, bot, rzBack, lx - lhw, top, rzBack, 'rgba(255, 80, 80, 0.8)');
      debugLine(lx - lhw, top, rzFront, lx - lhw, top, rzBack, 'rgba(255, 80, 80, 0.4)');
      debugLine(lx - lhw, bot, rzFront, lx - lhw, bot, rzBack, 'rgba(255, 80, 80, 0.4)');

      // Right wall - ORANGE
      debugLine(lx + lhw, bot, rzFront, lx + lhw, top, rzFront, 'rgba(255, 165, 0, 0.8)');
      debugLine(lx + lhw, bot, rzBack, lx + lhw, top, rzBack, 'rgba(255, 165, 0, 0.8)');
      debugLine(lx + lhw, top, rzFront, lx + lhw, top, rzBack, 'rgba(255, 165, 0, 0.4)');
      debugLine(lx + lhw, bot, rzFront, lx + lhw, bot, rzBack, 'rgba(255, 165, 0, 0.4)');
    }
  }

  // Front row ahead: front face colliders only - YELLOW
  var frontRowData = getRow(currentLevel, frontRow);
  if (frontRowData) {
    var nfz = rowToZ(frontRow) + BLOCK_SIZE * 0.5;
    for (var lane2 = 0; lane2 < LANES; lane2++) {
      var cell2 = frontRowData[lane2];
      if (!cell2) continue;
      var top2 = cell2.h || 0;
      var bot2 = top2 - BLOCK_SIZE * 0.5;
      var lx2 = laneToX(lane2);
      debugLine(lx2 - lhw, bot2, nfz, lx2 + lhw, bot2, nfz, 'rgba(255, 255, 0, 0.7)');
      debugLine(lx2 + lhw, bot2, nfz, lx2 + lhw, top2, nfz, 'rgba(255, 255, 0, 0.7)');
      debugLine(lx2 + lhw, top2, nfz, lx2 - lhw, top2, nfz, 'rgba(255, 255, 0, 0.7)');
      debugLine(lx2 - lhw, top2, nfz, lx2 - lhw, bot2, nfz, 'rgba(255, 255, 0, 0.7)');
    }
  }
  hudCtx.lineWidth = 1;

  // Debug text panel
  var centerRow = zToRow(playerZ);
  var frontBlock = getBlockAtX(frontRow, playerX);

  var lines = [
    'DEBUG (Q to close)',
    '',
    'pos: X=' + playerX.toFixed(2) + ' Y=' + playerY.toFixed(2) + ' Z=' + playerZ.toFixed(2),
    'vel: VX=' + playerVX.toFixed(2) + ' VY=' + playerVY.toFixed(2) + ' spd=' + playerSpeed.toFixed(2),
    'lane: ' + playerLane + ' rows: [' + pRows.join(',') + '] front: ' + frontRow,
    'depth: frontZ=' + frontZ.toFixed(2) + ' backZ=' + backZ.toFixed(2),
    'grounded: ' + grounded,
    'fuel: ' + fuel.toFixed(1) + ' O2: ' + oxygen.toFixed(1),
    '',
    'block front: ' + (frontBlock ? 'type=' + frontBlock.type + ' h=' + (frontBlock.h || 0) : 'none'),
  ];

  // Show blocks in each overlapping row
  for (var ri2 = 0; ri2 < pRows.length; ri2++) {
    var cb = getBlockAtX(pRows[ri2], playerX);
    lines.push('row ' + pRows[ri2] + ': ' + (cb ? 'type=' + cb.type + ' h=' + (cb.h || 0) : 'none'));
  }

  lines.push('');
  lines.push('cube corners:');
  for (var ci = 0; ci < corners.length; ci++) {
    var lbl = corners[ci].label;
    var inAny = false;
    for (var ri3 = 0; ri3 < pRows.length; ri3++) {
      if (pointInBlock(corners[ci].wx, corners[ci].wy, pRows[ri3])) { inAny = true; break; }
    }
    var inFront2 = pointInBlock(corners[ci].wx, corners[ci].wy, frontRow);
    lines.push('  ' + lbl + ' (' + corners[ci].wx.toFixed(2) + ',' + corners[ci].wy.toFixed(2) + ',' + corners[ci].wz.toFixed(2) + ') cur:' + (inAny ? 'YES' : 'no') + ' fwd:' + (inFront2 ? 'YES' : 'no'));
  }

  // Draw panel background
  var px = hudCanvas.width - 360;
  var py = 10;
  var lineH = 14;
  var panelH = lines.length * lineH + 10;
  hudCtx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  hudCtx.fillRect(px - 5, py - 5, 355, panelH);
  hudCtx.strokeStyle = '#0a0';
  hudCtx.strokeRect(px - 5, py - 5, 355, panelH);

  // Draw text
  hudCtx.fillStyle = '#0f0';
  hudCtx.font = '12px monospace';
  for (var li = 0; li < lines.length; li++) {
    hudCtx.fillText(lines[li], px, py + li * lineH + 11);
  }
}

// ---- HUD ----
var hudCanvas, hudCtx;
function initHud() {
  hudCanvas = document.getElementById('hud-canvas');
  hudCanvas.width = window.innerWidth;
  hudCanvas.height = window.innerHeight;
  hudCtx = hudCanvas.getContext('2d');
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
  drawBar(rx, ry, bw, bh, timerPct, 'rgba(255, 200, 0, 0.85)', '#fc0', 'TIME', Math.ceil(levelTimer) + 's', true);
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
    hudCtx.fillStyle = 'rgba(255, 0, 0, ' + (ta * 0.9) + ')';
    hudCtx.font = 'bold 48px monospace';
    hudCtx.textAlign = 'center';
    hudCtx.fillText('GAME OVER', hudCanvas.width / 2, hudCanvas.height / 2);
    hudCtx.fillStyle = 'rgba(255, 255, 255, ' + (ta * 0.5) + ')';
    hudCtx.font = '14px monospace';
    hudCtx.fillText('100 x ' + scoreDist + ' dist x ' + Math.floor(scoreTimePct * 100) + '% time', hudCanvas.width / 2, hudCanvas.height / 2 + 32);
    hudCtx.fillStyle = 'rgba(255, 200, 0, ' + (ta * 0.9) + ')';
    hudCtx.font = 'bold 20px monospace';
    hudCtx.fillText('SCORE: ' + score, hudCanvas.width / 2, hudCanvas.height / 2 + 56);
    hudCtx.fillStyle = 'rgba(255, 255, 255, ' + (ta * 0.7) + ')';
    hudCtx.font = '16px monospace';
    hudCtx.fillText('R to restart | ESC for menu', hudCanvas.width / 2, hudCanvas.height / 2 + 80);
    hudCtx.textAlign = 'left';
  } else if ((state === 'winning' || state === 'won') && ta > 0) {
    hudCtx.fillStyle = 'rgba(0, 255, 100, ' + (ta * 0.9) + ')';
    hudCtx.font = 'bold 48px monospace';
    hudCtx.textAlign = 'center';
    hudCtx.fillText('LEVEL CLEAR', hudCanvas.width / 2, hudCanvas.height / 2);
    if (state === 'won') {
      hudCtx.fillStyle = 'rgba(255, 255, 255, ' + (ta * 0.5) + ')';
      hudCtx.font = '14px monospace';
      hudCtx.fillText('100 x ' + scoreDist + ' dist x ' + Math.floor(scoreTimePct * 100) + '% time', hudCanvas.width / 2, hudCanvas.height / 2 + 32);
      hudCtx.fillStyle = 'rgba(0, 200, 255, ' + (ta * 0.5) + ')';
      hudCtx.fillText('CLEAR BONUS: +' + Math.floor(scoreFuelBonus * 100) + '% fuel +' + Math.floor(scoreOxyBonus * 100) + '% O2 = x' + scoreWinMult.toFixed(2), hudCanvas.width / 2, hudCanvas.height / 2 + 50);
      hudCtx.fillStyle = 'rgba(255, 200, 0, ' + (ta * 0.9) + ')';
      hudCtx.font = 'bold 20px monospace';
      var best = bestScores['' + currentLevel];
      var scoreText = 'SCORE: ' + score;
      if (best && best > score) scoreText += '  BEST: ' + best;
      else scoreText += '  NEW BEST!';
      hudCtx.fillText(scoreText, hudCanvas.width / 2, hudCanvas.height / 2 + 74);
      hudCtx.fillStyle = 'rgba(255, 255, 255, ' + (ta * 0.7) + ')';
      hudCtx.font = '16px monospace';
      hudCtx.fillText('R to restart | ESC for menu', hudCanvas.width / 2, hudCanvas.height / 2 + 98);
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
      hudCtx.fillText('WASD/Arrows: move | SPACE: jump | R: restart | ESC: menu', hudCanvas.width / 2, 30);
      hudCtx.textAlign = 'left';
    }
  }

  drawDebug();
}
