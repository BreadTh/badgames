// ---- COLLISION HELPERS ----
// Player is 4 points: BL, BR, TL, TR of an upright rectangle
// BL = (playerX - PLAYER_W/2, playerY)
// BR = (playerX + PLAYER_W/2, playerY)
// TL = (playerX - PLAYER_W/2, playerY + PLAYER_H)
// TR = (playerX + PLAYER_W/2, playerY + PLAYER_H)

// Get all rows the player's Z extent overlaps
function playerRows() {
  var hd = PLAYER_D / 2;
  var frontRow = zToRow(playerZ - hd);
  var backRow = zToRow(playerZ + hd);
  // backRow <= frontRow since more-negative Z = higher row index
  var rows = [];
  for (var r = backRow; r <= frontRow; r++) rows.push(r);
  return rows;
}

// Check if a point (x, y) is inside any block's solid region at a given row
function pointInBlock(x, y, rowIdx) {
  var col = getColumnAtX(rowIdx, x);
  for (var i = 0; i < col.length; i++) {
    var top = blockTop(col[i]);
    var bot = blockBottom(col[i]);
    if (y >= bot && y < top) return col[i];
  }
  return null;
}

function die(reason) {
  if (!alive) return;
  alive = false;
  state = 'dead';
  stopContinuousSounds();
  if (reason === 'crash' || reason === 'kill') {
    createExplosion(playerX, playerY + 0.5, playerZ);
    SFX.explode();
  } else {
    SFX.falling();
  }
  shipMesh.visible = false;
  calcAndSaveScore();
}

function win() {
  state = 'winning';
  stopContinuousSounds();
  winTimer = 2.0;
  clearedLevels[currentLevel] = true;
  SFX.win();
}

// ---- PLAYER UPDATE ----
function updatePlayer(dt) {
  if (!alive) return;

  var hw = PLAYER_W / 2;

  // ---- INPUT: acceleration/deceleration ----
  // Only when grounded, except: slight wall-escape accel when airborne + stopped at a wall
  var canAccel = grounded;
  var wallEscape = false;
  if (!grounded && playerSpeed === 0) {
    // Check if there's a wall directly ahead we jumped over
    var feHw = PLAYER_W / 2;
    var feZ = playerZ - PLAYER_D / 2;
    var feRow = zToRow(feZ);
    var feBlocked = false;
    for (var fei = 0; fei < 2; fei++) {
      var feCheckRow = feRow + fei;
      if (pointInBlock(playerX - feHw, playerY, feCheckRow) ||
          pointInBlock(playerX + feHw, playerY, feCheckRow)) {
        feBlocked = true; break;
      }
    }
    if (!feBlocked) {
      // Wall below us but not at our height — we jumped above it
      canAccel = true;
      wallEscape = true;
    }
  }
  var accel = false;
  if (canAccel && (keys['ArrowUp'] || keys['KeyW'])) {
    if (fuel > 0) {
      if (!started) started = true;
      var rate = wallEscape ? ACCEL_RATE * 0.6 : ACCEL_RATE;
      playerSpeed = Math.min(MAX_SPEED, playerSpeed + rate * dt);
      accel = true;
    }
  }
  if (grounded && (keys['ArrowDown'] || keys['KeyS'])) {
    playerSpeed = Math.max(0, playerSpeed - DECEL_RATE * dt);
  }
  // Slight air speed control — more effective at lower speeds
  if (!grounded && !wallEscape) {
    var airSpdMult = AIR_SPEED_CONTROL * (2 - playerSpeed / MAX_SPEED);
    if ((keys['ArrowUp'] || keys['KeyW']) && fuel > 0) {
      playerSpeed = Math.min(MAX_SPEED, playerSpeed + ACCEL_RATE * airSpdMult * dt);
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
      playerSpeed = Math.max(0, playerSpeed - DECEL_RATE * airSpdMult * dt);
    }
  }

  // Fuel
  if (accel && playerSpeed < MAX_SPEED) {
    fuel = Math.max(0, fuel - FUEL_ACCEL_COST * playerSpeed * dt);
  } else if (playerSpeed > 0) {
    fuel = Math.max(0, fuel - FUEL_CRUISE_COST * playerSpeed * dt);
  }
  if (fuel <= 0 && playerSpeed > 0) {
    playerSpeed = Math.max(0, playerSpeed - FUEL_EMPTY_DECEL * dt);
  }

  // Oxygen (only drains after first acceleration)
  if (started) oxygen = Math.max(0, oxygen - OXY_DRAIN * dt);

  // ---- MOVE Z (position only, collision checked after Y) ----
  var prevZ = playerZ;
  playerZ -= playerSpeed * dt;

  // ---- MOVE Y (jump/gravity) — uses updated Z so landing checks correct rows ----
  // Coyote time: brief window after leaving ground where jump still works
  if (grounded) {
    coyoteTimer = COYOTE_TIME;
  } else {
    coyoteTimer = Math.max(0, coyoteTimer - dt);
  }
  var canJump = grounded || coyoteTimer > 0;
  if ((keys['Space']) && canJump && fuel > 0) {
    var speedPctJ = playerSpeed / MAX_SPEED;
    playerVY = JUMP_FORCE * (0.75 + 0.25 * speedPctJ);
    grounded = false;
    coyoteTimer = 0;
    fuel = Math.max(0, fuel - FUEL_JUMP_COST);
    SFX.jump();
  }

  // Variable-height jump: release space early for half height
  if (!grounded && playerVY > JUMP_CUT_VY && !keys['Space']) {
    playerVY = JUMP_CUT_VY;
  }
  // Sustained jump fuel drain while holding space airborne
  if (!grounded && keys['Space'] && fuel > 0) {
    fuel = Math.max(0, fuel - FUEL_AIR_COST * dt);
  }

  if (!grounded) {
    var prevY = playerY;
    var grav = (keys['Space'] && playerVY > 0 && fuel > 0) ? GRAVITY * HOLD_GRAVITY : GRAVITY;
    playerVY += grav * dt;
    playerY += playerVY * dt;

    // Landing check — all 4 bottom corners of the cube, each at its own Z row
    if (playerVY <= 0) {
      var hd = PLAYER_D / 2;
      var botCorners = [
        { x: playerX - hw, r: zToRow(playerZ - hd) }, // front-left
        { x: playerX + hw, r: zToRow(playerZ - hd) }, // front-right
        { x: playerX - hw, r: zToRow(playerZ + hd) }, // back-left
        { x: playerX + hw, r: zToRow(playerZ + hd) }, // back-right
      ];
      var landSurface = null;
      var landBlock = null;
      for (var ci = 0; ci < 4; ci++) {
        var col = getColumnAtX(botCorners[ci].r, botCorners[ci].x);
        for (var bi = 0; bi < col.length; bi++) {
          var surf = blockTop(col[bi]);
          if (prevY >= surf - 0.1 && playerY <= surf) {
            if (landSurface === null || surf > landSurface) {
              landSurface = surf;
              landBlock = col[bi];
            }
          }
        }
      }
      if (landSurface !== null) {
        if (landBlock.type === BLOCK.KILL) {
          die('kill'); return;
        }
        playerY = landSurface;
        spawnSparks(playerX, landSurface, playerZ, Math.min(1, Math.abs(playerVY) / 15));
        SFX.bounce();
        if (keys['Space']) {
          playerVY = JUMP_FORCE;
          SFX.jump();
        } else {
          var bounceV = -playerVY * BOUNCE_FACTOR;
          if (bounceV > 1.5) {
            playerVY = bounceV;
            coyoteTimer = COYOTE_TIME;
          } else {
            playerVY = 0;
            grounded = true;
          }
        }
      }
    }

    // Head bonk check — all 4 top corners, each at its own Z row
    // Only pushes player DOWN, never affects X or Z
    if (playerVY > 0) {
      var hd2 = PLAYER_D / 2;
      var topY = playerY + PLAYER_H;
      var topCorners = [
        { x: playerX - hw, r: zToRow(playerZ - hd2) },
        { x: playerX + hw, r: zToRow(playerZ - hd2) },
        { x: playerX - hw, r: zToRow(playerZ + hd2) },
        { x: playerX + hw, r: zToRow(playerZ + hd2) },
      ];
      var lowestBot = Infinity;
      var bonked = false;
      for (var ci2 = 0; ci2 < 4; ci2++) {
        var col = getColumnAtX(topCorners[ci2].r, topCorners[ci2].x);
        for (var bi = 0; bi < col.length; bi++) {
          var bot = blockBottom(col[bi]);
          var top = blockTop(col[bi]);
          if (topY >= bot && topY <= top) {
            bonked = true;
            if (bot < lowestBot) lowestBot = bot;
          }
        }
      }
      if (bonked) {
        if (!sndBonkWas) SFX.bonk();
        sndBonkWas = true;
        playerVY = 0;
        playerY = lowestBot - PLAYER_H;
      } else {
        sndBonkWas = false;
      }
    }
  }

  // ---- Z front collision (after Y, so jump height is accounted for) ----
  if (playerSpeed > 0) {
    var frontZ = playerZ - PLAYER_D / 2;
    var fCorners = [
      { x: playerX - hw, y: playerY },
      { x: playerX + hw, y: playerY },
      { x: playerX - hw, y: playerY + PLAYER_H },
      { x: playerX + hw, y: playerY + PLAYER_H }
    ];
    // Check current row and next row (handles zone boundary cases)
    var baseFrontRow = zToRow(frontZ);
    for (var fri = 0; fri < 2; fri++) {
      var checkRow = baseFrontRow + fri;
      var wallBackFace = rowToZ(checkRow) + BLOCK_SIZE * 0.5;
      if (frontZ < wallBackFace + 0.1) {
        var blocked = false;
        for (var ci = 0; ci < 4; ci++) {
          if (pointInBlock(fCorners[ci].x, fCorners[ci].y, checkRow)) {
            blocked = true; break;
          }
        }
        if (blocked) {
          if (playerSpeed > KILL_SPEED_THRESHOLD) {
            die('crash'); return;
          }
          if (playerSpeed > 2) SFX.collide();
          playerZ = Math.min(prevZ, wallBackFace + 0.1 + PLAYER_D / 2);
          playerSpeed = 0;
          break;
        }
      }
    }
  }

  // ---- MOVE X (lateral), then resolve side collision ----
  var sustaining = !grounded && keys['Space'] && playerVY > 0 && fuel > 0;
  var speedPctA = playerSpeed / MAX_SPEED;
  var airMult = sustaining ? AIR_CONTROL : AIR_CONTROL_FREE;
  // Slower = more air control (2x at standstill, 1x at max speed)
  var lateralAccel = grounded ? 40 : 40 * airMult * (2 - speedPctA);
  var lateralFriction = grounded ? 8 : 0.5;
  var steering = false;
  if (keys['ArrowLeft'] || keys['KeyA']) { playerVX -= lateralAccel * dt; steering = true; }
  if (keys['ArrowRight'] || keys['KeyD']) { playerVX += lateralAccel * dt; steering = true; }
  if (steering && started) fuel = Math.max(0, fuel - 0.8 * dt);
  if (grounded && !(keys['ArrowLeft'] || keys['KeyA'] || keys['ArrowRight'] || keys['KeyD'])) {
    playerVX *= Math.max(0, 1 - lateralFriction * dt);
  }
  var maxLateral = 12;
  playerVX = Math.max(-maxLateral, Math.min(maxLateral, playerVX));

  var prevX = playerX;
  playerX += playerVX * dt;


  // Side collision — check left and right independently across all Z rows
  var sRows = playerRows();
  var hitLeft = false, hitRight = false;
  for (var si = 0; si < sRows.length; si++) {
    // Left edge corners
    if (!hitLeft) {
      if (pointInBlock(playerX - hw, playerY, sRows[si]) ||
          pointInBlock(playerX - hw, playerY + PLAYER_H, sRows[si])) {
        hitLeft = true;
      }
    }
    // Right edge corners
    if (!hitRight) {
      if (pointInBlock(playerX + hw, playerY, sRows[si]) ||
          pointInBlock(playerX + hw, playerY + PLAYER_H, sRows[si])) {
        hitRight = true;
      }
    }
  }
  if (hitLeft && playerVX <= 0) {
    if (!sndHitLeftWas) SFX.wallTap();
    sndHitLeftWas = true;
    playerX = prevX;
    playerVX = 0;
  } else {
    sndHitLeftWas = false;
  }
  if (hitRight && playerVX >= 0) {
    if (!sndHitRightWas) SFX.wallTap();
    sndHitRightWas = true;
    playerX = prevX;
    playerVX = 0;
  } else {
    sndHitRightWas = false;
  }

  playerLane = xToLane(playerX);

  // ---- GROUND CHECKS ----
  var gRows = playerRows();
  // Pick the block the player is standing on for ground effects
  var block = null;
  for (var gi = 0; gi < gRows.length; gi++) {
    var col = getColumnAtX(gRows[gi], playerX);
    for (var bi = 0; bi < col.length; bi++) {
      if (Math.abs(blockTop(col[bi]) - playerY) < 0.2) {
        block = col[bi]; break;
      }
    }
    if (block) break;
  }

  // Win check — player must be standing on or overlapping a WIN_TUNNEL block
  if (block && block.type === BLOCK.WIN_TUNNEL) {
    win();
  }

  // Ground block effects (only when grounded)
  if (block && grounded) {
    switch (block.type) {
      case BLOCK.OXYGEN:
        oxygen = Math.min(100, oxygen + OXY_REFILL * dt);
        sndOxyPickupTimer -= dt;
        if (sndOxyPickupTimer <= 0) { SFX.oxyPickup(); sndOxyPickupTimer = 0.3; }
        break;
      case BLOCK.FUEL:
        fuel = Math.min(100, fuel + FUEL_REFILL * dt);
        sndFuelPickupTimer -= dt;
        if (sndFuelPickupTimer <= 0) { SFX.fuelPickup(); sndFuelPickupTimer = 0.3; }
        break;
      case BLOCK.KILL:
        die('kill');
        break;
      case BLOCK.JUMP:
        playerVY = JUMP_FORCE;
        grounded = false;
        SFX.jumpPad();
        break;
      case BLOCK.DRAIN_FUEL:
        fuel = Math.max(0, fuel - FUEL_DRAIN_RATE * dt);
        sndDrainTimer -= dt;
        if (sndDrainTimer <= 0) { SFX.drain(); sndDrainTimer = 0.4; }
        break;
      case BLOCK.DRAIN_OXY:
        oxygen = Math.max(0, oxygen - OXY_DRAIN_BLOCK_RATE * dt);
        sndDrainTimer -= dt;
        if (sndDrainTimer <= 0) { SFX.drain(); sndDrainTimer = 0.4; }
        break;
    }

  }

  // Fall if no ground below — check all 4 bottom corners
  if (grounded) {
    var hd3 = PLAYER_D / 2;
    var groundCorners = [
      { x: playerX - hw, r: zToRow(playerZ - hd3) },
      { x: playerX + hw, r: zToRow(playerZ - hd3) },
      { x: playerX - hw, r: zToRow(playerZ + hd3) },
      { x: playerX + hw, r: zToRow(playerZ + hd3) },
    ];
    var bestSurface = null;
    for (var fi = 0; fi < 4; fi++) {
      var col = getColumnAtX(groundCorners[fi].r, groundCorners[fi].x);
      for (var bi = 0; bi < col.length; bi++) {
        var gs = blockTop(col[bi]);
        if (Math.abs(playerY - gs) < 0.2 && (bestSurface === null || gs > bestSurface)) bestSurface = gs;
      }
    }
    if (bestSurface === null) {
      grounded = false;
      playerVY = 0;
      if (!sndFallingWas) { SFX.falling(); sndFallingWas = true; }
    } else {
      sndFallingWas = false;
    }
  }

  // Fell off map
  if (playerY < -20) die('fall');

  // Death conditions
  if (oxygen <= 0) die('suffocate');
  if (fuel <= 0 && playerSpeed <= 0) {
    stuckTimer += dt;
    if (stuckTimer > 3) die('stranded');
  } else {
    stuckTimer = 0;
  }
}

// ---- CAMERA ----
function updateCamera() {
  camera.position.set(0, 5, playerZ + 10);
  camera.lookAt(new THREE.Vector3(0, 0, playerZ - 20));

  shipMesh.position.set(playerX, playerY + 0.5, playerZ);
  var tilt = -playerVX / 12 * 0.4;
  shipMesh.rotation.z = Math.max(-0.4, Math.min(0.4, tilt));
  var pitchTarget = 0;
  if (state === 'winning' || state === 'won') {
    pitchTarget = Math.min(Math.PI / 4, screenFade * (Math.PI / 4) / 0.5);
  } else if (!grounded) {
    // Nose tilts based on vertical velocity — clamp to ~30 degrees
    pitchTarget = Math.max(-0.5, Math.min(0.5, playerVY * 0.04));
  }
  shipMesh.rotation.x = pitchTarget;

  headlight.position.set(playerX, playerY + 2, playerZ - 3);
  underglow.position.set(playerX, playerY + 0.2, playerZ);

  if (debugCollider) {
    debugCollider.position.set(playerX, playerY + PLAYER_H / 2, playerZ);
    debugCollider.visible = debugMode;
  }

  // Debug row planes — show which rows the cube currently overlaps
  if (debugRowPlanes.length) {
    var dRows = playerRows();
    for (var dp = 0; dp < debugRowPlanes.length; dp++) {
      if (debugMode && dp < dRows.length) {
        debugRowPlanes[dp].position.set(0, 0, rowToZ(dRows[dp]) + BLOCK_SIZE * 0.5);
        debugRowPlanes[dp].visible = true;
      } else {
        debugRowPlanes[dp].visible = false;
      }
    }
  }

  if (starField) starField.position.z = playerZ;
  if (planetMesh) {
    planetMesh.position.z = playerZ;
    planetMesh.rotation.y += 0.00005;
  }
  if (cloudMesh) cloudMesh.rotation.y += 0.0003;

  if (engineMatRef) {
    var speedPct = playerSpeed / MAX_SPEED;
    var r = 0.3 + speedPct * 0.7;
    var g = 0.15 + speedPct * 0.2;
    engineMatRef.color.setRGB(r, g, 0);
  }

  // Engine flames
  var accelHeld = keys['ArrowUp'] || keys['KeyW'];
  var brakeHeld = keys['ArrowDown'] || keys['KeyS'];
  var flameL = shipMesh._flameL;
  var flameR = shipMesh._flameR;
  var fmat = shipMesh._flameMat;
  if (accelHeld && fuel > 0 && !brakeHeld) {
    flameL.visible = true;
    flameR.visible = true;
    var s = 1.0 + Math.random() * 0.3;
    flameL.scale.set(1, 1, s);
    flameR.scale.set(1, 1, s);
    fmat.opacity = 0.8;
    fmat.color.setHex(0xff4400);
  } else if (playerSpeed > 0.5 && !brakeHeld) {
    flameL.visible = true;
    flameR.visible = true;
    flameL.scale.set(0.4, 0.4, 0.3 + Math.random() * 0.1);
    flameR.scale.set(0.4, 0.4, 0.3 + Math.random() * 0.1);
    fmat.opacity = 0.5;
    fmat.color.setHex(0xff6622);
  } else {
    flameL.visible = false;
    flameR.visible = false;
  }
}
