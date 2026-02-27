// ---- REFUEL PROXIMITY ----
// Computes fuel/oxy efficiency (0-1) based on distance to nearest fuel/oxy block.
// 100% if player collision box overlaps block, tapers to 0% at half a block gap.
var _rpFuel = 0, _rpOxy = 0;
function refuelProximity(px, py, rowLo, rowHi) {
  var halfW = PLAYER_W / 2;
  var maxGap = LANE_WIDTH * 0.5;
  var reach = halfW + LANE_WIDTH;
  var laneL = xToLane(px - reach);
  var laneR = xToLane(px + reach);
  _rpFuel = 0; _rpOxy = 0;
  for (var ri = rowLo; ri <= rowHi; ri++) {
    for (var li = laneL; li <= laneR; li++) {
      var col = getColumn(ri, li);
      for (var bi = 0; bi < col.length; bi++) {
        if (Math.abs(blockTop(col[bi]) - py) < 0.2) {
          var lc = laneToX(li);
          var gap = Math.max(0, Math.abs(px - lc) - halfW - LANE_WIDTH / 2);
          var eff = gap <= 0 ? 1.0 : Math.max(0, 1.0 - gap / maxGap);
          if (col[bi].type === BLOCK.FUEL && eff > _rpFuel) _rpFuel = eff;
          if (col[bi].type === BLOCK.OXYGEN && eff > _rpOxy) _rpOxy = eff;
        }
      }
    }
  }
}

// ---- COLLISION HELPERS ----
// Player is 4 points: BL, BR, TL, TR of an upright rectangle
// BL = (playerX - PLAYER_W/2, playerY)
// BR = (playerX + PLAYER_W/2, playerY)
// TL = (playerX - PLAYER_W/2, playerY + PLAYER_H)
// TR = (playerX + PLAYER_W/2, playerY + PLAYER_H)

// Get all rows the player's Z extent overlaps
// Returns into _prLo/_prHi globals to avoid allocation. Callers use for(r=_prLo;r<=_prHi;r++)
var _prLo = 0, _prHi = 0;
function playerRowsRange() {
  var hd = PLAYER_D / 2;
  _prLo = zToRow(playerZ + hd);
  _prHi = zToRow(playerZ - hd);
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

var deathSpeed = 0;
var lastRecRow = -1;
var frozenKeys = null;
var glideLockedIn = false;
var padSustain = false;
var deathReason = '';
var deathVX = 0, deathVY = 0, deathVZ = 0;
var deathBloomX = 0, deathBloomY = 1, deathBloomZ = 0; // bloom direction (axis-aligned unit vec)
function die(reason) {
  if (!alive) return;
  if (isRecording) recordDeath(reason);
  alive = false;
  state = 'dead';
  deathReason = reason;
  deathSpeed = playerSpeed;
  if (frozenDist < 0) frozenDist = Math.abs(playerZ);
  stopContinuousSounds();
  if (reason === 'crash' || reason === 'kill') {
    createExplosion(playerX, playerY + 0.5, playerZ);
    SFX.explode();
    explodeShip();
  } else if (reason === 'stranded') {
    // Ship stays visible, no explosion
  } else {
    if (!sndFallingWas) SFX.falling();
    shipMesh.visible = false;
  }
  calcAndSaveScore();
  if (isRecording) { recordScore(); stopRecording(); }
}

function win() {
  if (isRecording) recordWin();
  state = 'winning';
  stopContinuousSounds();
  winTimer = 2.0;
  winShipVZ = 0;
  winShipZ = 0;
  if (!isPlayback) {
    clearedLevels[levelKey(currentLevel)] = true;
    localStorage.setItem('spaceRunnerCleared', JSON.stringify(clearedLevels));
  }
  SFX.win();
}

// Spend fuel, or oxygen at 2x if out of fuel
function spendFuel(cost) {
  if (debugInvincible) return;
  if (fuel > 0) fuel = Math.max(0, fuel - cost);
  else oxygen = Math.max(0, oxygen - cost * 2);
}

// ---- PLAYER UPDATE ----
function updatePlayer(dt) {
  if (!alive) return;

  var hw = PLAYER_W / 2;
  var noOxygen = oxygen <= 0;
  var noFuel = fuel <= 0;
  // Oxygen out: freeze controls as if player passed out holding whatever they held
  if (noOxygen && !frozenKeys) {
    frozenKeys = {};
    for (var k in keys) frozenKeys[k] = keys[k];
  }
  if (!noOxygen) frozenKeys = null;
  var inp = noOxygen ? (frozenKeys || {}) : keys;
  var hasPropellant = fuel > 0 || oxygen > 0;
  var noControl = !hasPropellant;

  // ---- INPUT: acceleration/deceleration ----
  var accel = false;
  if (!noControl) {
    // Only when grounded, except: slight wall-escape accel when airborne + stopped at a wall
    var canAccel = grounded;
    var wallEscape = false;
    if (!grounded && playerSpeed === 0) {
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
        canAccel = true;
        wallEscape = true;
      }
    }
    if (canAccel && (inp['ArrowUp'] || inp['KeyW'])) {
      if (hasPropellant) {
        if (!started) { started = true; startedTime = performance.now(); }
        var rate = wallEscape ? ACCEL_RATE * 0.6 : ACCEL_RATE;
        var boostMax = MAX_SPEED * (1 + BOOST_SPEED_PCT);
        playerSpeed = Math.min(boostMax, playerSpeed + rate * dt);
        accel = true;
      }
    }
    if (grounded && (inp['ArrowDown'] || inp['KeyS'])) {
      playerSpeed = Math.max(0, playerSpeed - DECEL_RATE * dt);
    }
    if (!grounded && !wallEscape) {
      var airSpdMult = AIR_SPEED_CONTROL * (2 - playerSpeed / MAX_SPEED);
      if ((inp['ArrowUp'] || inp['KeyW']) && hasPropellant) {
        var boostMaxAir = MAX_SPEED * (1 + BOOST_SPEED_PCT);
        playerSpeed = Math.min(boostMaxAir, playerSpeed + ACCEL_RATE * airSpdMult * dt);
        accel = true;
      }
      if (inp['ArrowDown'] || inp['KeyS']) {
        playerSpeed = Math.max(0, playerSpeed - DECEL_RATE * airSpdMult * dt);
      }
    }
  }

  // Boost decay: bleed speed back to MAX_SPEED when not accelerating
  if (!accel && playerSpeed > MAX_SPEED) {
    playerSpeed = Math.max(MAX_SPEED, playerSpeed - BOOST_DECAY_RATE * dt);
    if (playerSpeed < MAX_SPEED * 1.01) playerSpeed = MAX_SPEED;
  }

  // Fuel (or oxygen at 3x when out of fuel)
  if (accel && playerSpeed < MAX_SPEED) {
    spendFuel(FUEL_ACCEL_COST * playerSpeed * dt);
  } else if (accel && playerSpeed >= MAX_SPEED) {
    spendFuel(FUEL_ACCEL_COST * BOOST_FUEL_MULT * playerSpeed * dt);
  } else if (!accel && playerSpeed > MAX_SPEED) {
    // Decaying from boost — still burns boost fuel
    spendFuel(FUEL_ACCEL_COST * BOOST_FUEL_MULT * playerSpeed * dt);
  } else if (playerSpeed > 0) {
    spendFuel(FUEL_CRUISE_COST * playerSpeed * dt);
  }
  if (!hasPropellant && playerSpeed > 0) {
    playerSpeed = Math.max(0, playerSpeed - FUEL_EMPTY_DECEL * dt);
  }
  // No oxygen: gradually slow down
  if (noOxygen && playerSpeed > 0) {
    playerSpeed = Math.max(0, playerSpeed - FUEL_EMPTY_DECEL * dt);
  }

  // Oxygen (only drains after first acceleration)
  if (started && !debugInvincible) oxygen = Math.max(0, oxygen - OXY_DRAIN * dt);

  // ---- X INPUT (lateral) — computed before sub-step loop ----
  var sustainingX = !grounded && inp['Space'] && playerVY > 0 && hasPropellant;
  var speedPctA = playerSpeed / MAX_SPEED;
  var airMult = sustainingX ? AIR_CONTROL : AIR_CONTROL_FREE;
  // Slower = more air control (2x at standstill, 1x at max speed)
  var steerScale = 0.5 + 0.5 * Math.pow(speedPctA, 0.8);
  var lateralAccel = grounded ? 40 * steerScale : 40 * steerScale * airMult * (2 - speedPctA);
  if (!hasPropellant) lateralAccel *= 0.25;
  var lateralFriction = grounded ? 8 : 0.5;
  var steering = false;
  var canSteer = grounded || hasPropellant;
  if (canSteer && (inp['ArrowLeft'] || inp['KeyA'])) { playerVX -= lateralAccel * dt; steering = true; if (!started) { started = true; startedTime = performance.now(); } }
  if (canSteer && (inp['ArrowRight'] || inp['KeyD'])) { playerVX += lateralAccel * dt; steering = true; if (!started) { started = true; startedTime = performance.now(); } }
  if (steering && started) spendFuel(0.8 * dt);
  if (grounded && !(inp['ArrowLeft'] || inp['KeyA'] || inp['ArrowRight'] || inp['KeyD'])) {
    playerVX *= Math.max(0, 1 - lateralFriction * dt);
  }
  var maxLateral = 12 * steerScale;
  playerVX = Math.max(-maxLateral, Math.min(maxLateral, playerVX));

  // Coyote time (once per frame)
  if (grounded) {
    coyoteTimer = COYOTE_TIME;
  } else {
    coyoteTimer = Math.max(0, coyoteTimer - dt);
  }
  // Jump initiation (once per frame)
  var canJump = grounded || coyoteTimer > 0;
  if ((inp['Space']) && canJump && hasPropellant && !noControl) {
    if (!started) { started = true; startedTime = performance.now(); }
    // Liftoff bonus from fuel/oxy blocks
    if (grounded) {
      playerRowsRange();
      refuelProximity(playerX, playerY, _prLo, _prHi);
      if (_rpFuel > 0) fuel = Math.min(100, fuel + FUEL_BOUNCE * _rpFuel);
      if (_rpOxy > 0) oxygen = Math.min(100, oxygen + OXY_BOUNCE * _rpOxy);
    }
    var speedPctJ = playerSpeed === 0 ? 1 : playerSpeed / MAX_SPEED;
    playerVY = JUMP_FORCE * (0.75 + 0.25 * speedPctJ);
    grounded = false;
    coyoteTimer = 0;
    spendFuel(FUEL_JUMP_COST);
    spawnSparks(playerX, playerY + 0.1, playerZ, 0.6);
    spawnJumpSparks(playerX, playerY, playerZ);
    SFX.jump();
  }

  // ---- SUB-STEPPED MOVEMENT + COLLISION ----
  // Prevents tunneling through blocks at high speed / low framerate.
  // Each axis moves in small steps; collision cancels remaining movement on that axis.
  var MAX_STEP = BLOCK_SIZE * 0.5; // half the thinnest obstacle — prevents tunneling
  var moveEstZ = playerSpeed * dt;
  var moveEstX = Math.abs(playerVX * dt);
  var moveEstY = Math.abs(playerVY * dt) + Math.abs(GRAVITY) * dt * dt * 0.5;
  var maxMove = Math.max(moveEstZ, moveEstX, moveEstY);
  var subSteps = maxMove > MAX_STEP ? Math.ceil(maxMove / MAX_STEP) : 1;
  var subDt = dt / subSteps;
  var zBlocked = false;
  var xBlocked = false;

  for (var msi = 0; msi < subSteps; msi++) {
    // ---- SAVE ROWS BEFORE Z MOVE (for diagonal slip prevention) ----
    playerRowsRange();
    var prevLo = _prLo, prevHi = _prHi;

    // ---- Z MOVE ----
    var prevZ = playerZ;
    if (!zBlocked) {
      playerZ -= playerSpeed * subDt;
    }

    // ---- Z FRONT COLLISION (before Y move — prevents bonk-then-slip-under) ----
    if (!zBlocked && playerSpeed > 0) {
      var frontZ = playerZ - PLAYER_D / 2;
      var fCorners = [
        { x: playerX - hw, y: playerY },
        { x: playerX + hw, y: playerY },
        { x: playerX - hw, y: playerY + PLAYER_H * 0.5 },
        { x: playerX + hw, y: playerY + PLAYER_H * 0.5 },
        { x: playerX - hw, y: playerY + PLAYER_H },
        { x: playerX + hw, y: playerY + PLAYER_H },
      ];
      var baseFrontRow = zToRow(frontZ);
      for (var fri = 0; fri < 2; fri++) {
        var checkRow = baseFrontRow + fri;
        var wallBackFace = rowToZ(checkRow) + BLOCK_SIZE * 0.5;
        if (frontZ < wallBackFace + 0.1) {
          var blocked = false;
          var frontKill = false;
          for (var fci = 0; fci < fCorners.length; fci++) {
            var fb = pointInBlock(fCorners[fci].x, fCorners[fci].y, checkRow);
            if (fb) {
              blocked = true;
              if (fb.type === BLOCK.KILL) frontKill = true;
            }
          }
          if (blocked) {
            if (playerSpeed > KILL_SPEED_THRESHOLD && !debugInvincible) {
              deathVX = playerVX; deathVY = playerVY; deathVZ = -playerSpeed * 0.7;
              deathBloomX = 0; deathBloomY = 0; deathBloomZ = -1;
              die('crash'); return;
            }
            if (frontKill && !debugInvincible) {
              deathVX = playerVX; deathVY = playerVY; deathVZ = playerSpeed * 0.35;
              deathBloomX = 0; deathBloomY = 0; deathBloomZ = 1;
              die('kill'); return;
            }
            airDrainFuel = false; airDrainOxy = false;
            if (playerSpeed > 2) { SFX.collide(); recordEvent('BF'); }
            playerZ = Math.min(prevZ, wallBackFace + 0.1 + PLAYER_D / 2);
            playerSpeed = 0;
            zBlocked = true;
            break;
          }
        }
      }
    }

    // ---- Y MOVE (gravity/jump) ----
    if (!grounded && playerVY > JUMP_CUT_VY && !inp['Space'] && !padSustain) {
      playerVY = JUMP_CUT_VY;
    }
    if (!grounded) {
      var prevY = playerY;
      var nearGround = false;
      if (playerVY <= 0) {
        playerRowsRange();
        for (var ng = _prLo; ng <= _prHi && !nearGround; ng++) {
          var ngCol = getColumnAtX(ng, playerX);
          for (var nbi = 0; nbi < ngCol.length; nbi++) {
            var gTop = blockTop(ngCol[nbi]);
            if (gTop <= playerY && playerY - gTop < BLOCK_SIZE) { nearGround = true; break; }
          }
        }
      }
      if (!inp['Space']) glideLockedIn = false;
      else if (!nearGround && playerVY <= 0) glideLockedIn = true;
      var gliding = inp['Space'] && playerVY <= 0 && fuel > 0 && (!nearGround || glideLockedIn);
      var oxyGliding = inp['Space'] && playerVY <= 0 && fuel <= 0 && oxygen > 0 && (!nearGround || glideLockedIn);
      var sustaining = inp['Space'] && playerVY > 0 && hasPropellant;
      isSustaining = sustaining || padSustain;
      isGliding = gliding || oxyGliding;
      if (padSustain && (playerVY <= 0 || (fuel <= 0 && oxygen <= 0))) padSustain = false;
      if (gliding) {
        if (!debugInvincible) fuel = Math.max(0, fuel - FUEL_GLIDE_COST * subDt);
      } else if (sustaining) {
        spendFuel(FUEL_AIR_COST * subDt);
      } else if (padSustain) {
        spendFuel(FUEL_AIR_COST * subDt);
      }
      var grav = (sustaining || padSustain) ? GRAVITY * HOLD_GRAVITY : gliding ? GRAVITY * GLIDE_GRAVITY : GRAVITY;
      playerVY += grav * subDt;
      playerY += playerVY * subDt;

      // Landing check — all rows × both X edges
      // Use merged row range (current + pre-Z-move) so we detect surfaces
      // the player just flew past in Z — prevents false side collisions at step-downs
      if (playerVY <= 0) {
        playerRowsRange();
        var landLo = Math.min(prevLo, _prLo), landHi = Math.max(prevHi, _prHi);
        var landXL = playerX - hw, landXR = playerX + hw;
        var landSurface = null;
        for (var lri = landLo; lri <= landHi; lri++) {
          for (var lxi = 0; lxi < 2; lxi++) {
            var col = getColumnAtX(lri, lxi === 0 ? landXL : landXR);
            for (var lbi = 0; lbi < col.length; lbi++) {
              var surf = blockTop(col[lbi]);
              if (prevY >= surf - 0.1 && playerY <= surf) {
                if (landSurface === null || surf > landSurface) {
                  landSurface = surf;
                }
              }
            }
          }
        }
        if (landSurface !== null) {
          // Collect all block types at the landing surface
          var landHasKill = false, landHasJump = false;
          var landHasDrainFuel = false, landHasDrainOxy = false;
          for (var lri2 = landLo; lri2 <= landHi; lri2++) {
            for (var lxi2 = 0; lxi2 < 2; lxi2++) {
              var col2 = getColumnAtX(lri2, lxi2 === 0 ? landXL : landXR);
              for (var lbi2 = 0; lbi2 < col2.length; lbi2++) {
                if (Math.abs(blockTop(col2[lbi2]) - landSurface) < 0.01) {
                  switch (col2[lbi2].type) {
                    case BLOCK.KILL: landHasKill = true; break;
                    case BLOCK.JUMP: landHasJump = true; break;
                    case BLOCK.DRAIN_FUEL: landHasDrainFuel = true; break;
                    case BLOCK.DRAIN_OXY: landHasDrainOxy = true; break;
                  }
                }
              }
            }
          }
          // Fuel/oxy with proximity taper
          refuelProximity(playerX, landSurface, landLo, landHi);
          if (landHasKill && !debugInvincible) {
            deathVX = playerVX; deathVY = -playerVY; deathVZ = -playerSpeed * 0.7;
            deathBloomX = 0; deathBloomY = 1; deathBloomZ = 0;
            die('kill'); return;
          }
          airDrainFuel = false; airDrainOxy = false;
          playerY = landSurface;
          // Bounce refuel/drain effects
          var bounceVel = Math.abs(playerVY) * BOUNCE_REFUEL_SCALE;
          var bBoostMax = MAX_SPEED * (1 + BOOST_SPEED_PCT);
          var bRefillMult = playerSpeed <= KILL_SPEED_THRESHOLD
            ? 1 + playerSpeed / KILL_SPEED_THRESHOLD
            : playerSpeed <= MAX_SPEED
            ? 2 + (playerSpeed - KILL_SPEED_THRESHOLD) / (MAX_SPEED - KILL_SPEED_THRESHOLD)
            : 3 + 0.5 * (playerSpeed - MAX_SPEED) / (bBoostMax - MAX_SPEED);
          if (_rpFuel > 0) {
            fuel = Math.min(100, fuel + FUEL_BOUNCE * bounceVel * bRefillMult * _rpFuel);
            SFX.fuelPickup();
          }
          if (_rpOxy > 0) {
            oxygen = Math.min(100, oxygen + OXY_BOUNCE * bounceVel * bRefillMult * _rpOxy);
            SFX.oxyPickup();
          }
          if (landHasDrainFuel) airDrainFuel = true;
          if (landHasDrainOxy) airDrainOxy = true;
          // Jump pad (after refuel so landing on pad+fuel gives both)
          if (landHasJump && hasPropellant) {
            playerVY = JUMP_FORCE;
            grounded = false;
            padSustain = true;
            isSustaining = true;
            isGliding = false;
            spawnSparks(playerX, landSurface + 0.1, playerZ, 0.6);
            spawnJumpSparks(playerX, landSurface, playerZ);
            SFX.jumpPad();
            continue;
          }
          spawnSparks(playerX, landSurface, playerZ, Math.min(1, Math.abs(playerVY) / 15));
          SFX.bounce();
          var BOUNCE_ACCEL_IMPULSE = ACCEL_RATE * 0.032;
          var BOUNCE_DECEL_IMPULSE = DECEL_RATE * 0.032;
          if ((inp['ArrowUp'] || inp['KeyW']) && hasPropellant) {
            playerSpeed = Math.min(MAX_SPEED, playerSpeed + BOUNCE_ACCEL_IMPULSE);
            accel = true;
          }
          if (inp['ArrowDown'] || inp['KeyS']) {
            playerSpeed = Math.max(0, playerSpeed - BOUNCE_DECEL_IMPULSE);
          }
          if (inp['Space'] && hasPropellant) {
            var speedPctB = playerSpeed === 0 ? 1 : playerSpeed / MAX_SPEED;
            playerVY = JUMP_FORCE * (0.75 + 0.25 * speedPctB);
            spendFuel(FUEL_JUMP_COST);
            spawnSparks(playerX, landSurface + 0.1, playerZ, 0.6);
            spawnJumpSparks(playerX, landSurface, playerZ);
            SFX.jump();
          } else {
            var bounceV = -playerVY * BOUNCE_FACTOR;
            if (bounceV > 1.5) {
              playerVY = bounceV;
              coyoteTimer = COYOTE_TIME;
            } else {
              playerVY = 0;
              grounded = true;
              padSustain = false;
            }
          }
        }
      }

      // Head bonk check — all rows × both X edges
      if (playerVY > 0) {
        var topY = playerY + PLAYER_H;
        playerRowsRange();
        var bonkXL = playerX - hw, bonkXR = playerX + hw;
        var lowestBot = Infinity;
        var bonked = false;
        var bonkedKill = false;
        for (var bri = _prLo; bri <= _prHi; bri++) {
          for (var bxi = 0; bxi < 2; bxi++) {
            var col = getColumnAtX(bri, bxi === 0 ? bonkXL : bonkXR);
            for (var bbi = 0; bbi < col.length; bbi++) {
              var bot = blockBottom(col[bbi]);
              var top = blockTop(col[bbi]);
              if (topY >= bot && topY <= top) {
                bonked = true;
                if (col[bbi].type === BLOCK.KILL) bonkedKill = true;
                if (bot < lowestBot) lowestBot = bot;
              }
            }
          }
        }
        if (bonked) {
          if (bonkedKill && !debugInvincible) {
            deathVX = playerVX; deathVY = -playerVY; deathVZ = -playerSpeed * 0.7;
            deathBloomX = 0; deathBloomY = -1; deathBloomZ = 0;
            die('kill'); return;
          }
          airDrainFuel = false; airDrainOxy = false;
          if (!sndBonkWas) { SFX.bonk(); recordEvent('BH'); }
          sndBonkWas = true;
          playerSpeed *= 0.9;
          playerVY = 0;
          playerY = lowestBot - PLAYER_H - 0.01;
        } else {
          sndBonkWas = false;
        }
      }
    }

    // ---- X MOVE ----
    var prevX = playerX;
    if (!xBlocked) {
      playerX += playerVX * subDt;
    }

    // ---- SIDE COLLISION ----
    if (!xBlocked) {
      // Merge current rows with pre-Z-move rows to prevent diagonal corner-cutting
      playerRowsRange();
      var sLo = Math.min(prevLo, _prLo), sHi = Math.max(prevHi, _prHi);
      var hitLeft = false, hitRight = false;
      var killLeft = false, killRight = false;
      for (var ssi = sLo; ssi <= sHi; ssi++) {
        if (!hitLeft) {
          var lbBot = pointInBlock(playerX - hw, playerY, ssi);
          var lbTop = pointInBlock(playerX - hw, playerY + PLAYER_H, ssi);
          if (lbBot || lbTop) {
            hitLeft = true;
            if ((lbBot && lbBot.type === BLOCK.KILL) || (lbTop && lbTop.type === BLOCK.KILL)) killLeft = true;
          }
        }
        if (!hitRight) {
          var rbBot = pointInBlock(playerX + hw, playerY, ssi);
          var rbTop = pointInBlock(playerX + hw, playerY + PLAYER_H, ssi);
          if (rbBot || rbTop) {
            hitRight = true;
            if ((rbBot && rbBot.type === BLOCK.KILL) || (rbTop && rbTop.type === BLOCK.KILL)) killRight = true;
          }
        }
      }
      var WALL_BOUNCE_THRESHOLD = 4;
      var WALL_GRIND_DECEL = 24;
      if (hitLeft && playerVX <= 0) {
        if (killLeft && !debugInvincible) {
          deathVX = -playerVX; deathVY = playerVY; deathVZ = -playerSpeed * 0.7;
          deathBloomX = 1; deathBloomY = 0; deathBloomZ = 0;
          die('kill'); return;
        }
        airDrainFuel = false; airDrainOxy = false;
        if (!sndHitLeftWas) { SFX.wallTap(); recordEvent('BS'); }
        sndHitLeftWas = true;
        playerX = prevX;
        if (Math.abs(playerVX) > WALL_BOUNCE_THRESHOLD) {
          playerVX = Math.abs(playerVX) * 0.25;
          playerSpeed *= 0.9;
        } else {
          playerVX = 0;
          playerSpeed = Math.max(0, playerSpeed - WALL_GRIND_DECEL * dt);
        }
        xBlocked = true;
      } else if (!hitLeft) {
        sndHitLeftWas = false;
      }
      if (hitRight && playerVX >= 0) {
        if (killRight && !debugInvincible) {
          deathVX = -playerVX; deathVY = playerVY; deathVZ = -playerSpeed * 0.7;
          deathBloomX = -1; deathBloomY = 0; deathBloomZ = 0;
          die('kill'); return;
        }
        airDrainFuel = false; airDrainOxy = false;
        if (!sndHitRightWas) { SFX.wallTap(); recordEvent('BS'); }
        sndHitRightWas = true;
        playerX = prevX;
        if (Math.abs(playerVX) > WALL_BOUNCE_THRESHOLD) {
          playerVX = -Math.abs(playerVX) * 0.25;
          playerSpeed *= 0.9;
        } else {
          playerVX = 0;
          playerSpeed = Math.max(0, playerSpeed - WALL_GRIND_DECEL * dt);
        }
        xBlocked = true;
      } else if (!hitRight) {
        sndHitRightWas = false;
      }
    }
  } // end sub-step loop

  playerLane = xToLane(playerX);

  // Record sync on row crossing
  var curRecRow = zToRow(playerZ);
  if (isRecording && curRecRow !== lastRecRow) {
    lastRecRow = curRecRow;
    recordSync(playerX, playerY, playerZ, playerSpeed, playerVY, playerVX);
  }

  // ---- GROUND CHECKS ----
  playerRowsRange();
  var gLo = _prLo, gHi = _prHi;
  // Collect all block types the player is standing on
  var gHasKill = false, gHasJump = false, gHasWin = false;
  var gHasDrainFuel = false, gHasDrainOxy = false;
  var checkXs = [playerX - hw, playerX, playerX + hw];
  for (var ci = 0; ci < 3; ci++) {
    for (var gi = gLo; gi <= gHi; gi++) {
      var col = getColumnAtX(gi, checkXs[ci]);
      for (var bi = 0; bi < col.length; bi++) {
        if (Math.abs(blockTop(col[bi]) - playerY) < 0.2) {
          switch (col[bi].type) {
            case BLOCK.KILL: gHasKill = true; break;
            case BLOCK.JUMP: gHasJump = true; break;
            case BLOCK.DRAIN_FUEL: gHasDrainFuel = true; break;
            case BLOCK.DRAIN_OXY: gHasDrainOxy = true; break;
            case BLOCK.WIN_TUNNEL: gHasWin = true; break;
          }
        }
      }
    }
  }
  // Fuel/oxy with proximity taper
  refuelProximity(playerX, playerY, gLo, gHi);

  // Win check — standing on or passing over any WIN_TUNNEL block
  if (gHasWin) {
    win();
  } else {
    for (var wi = gLo; wi <= gHi && state === 'playing'; wi++) {
      var wCol = getColumnAtX(wi, playerX);
      for (var wbi = 0; wbi < wCol.length; wbi++) {
        if (wCol[wbi].type === BLOCK.WIN_TUNNEL && blockTop(wCol[wbi]) <= playerY) {
          win(); break;
        }
      }
    }
  }

  // Speed multiplier for refueling: 100% at 0, 200% at kill speed, 300% at max, 400% at boost max
  var BOOST_MAX = MAX_SPEED * (1 + BOOST_SPEED_PCT);
  var refillMult = playerSpeed <= KILL_SPEED_THRESHOLD
    ? 1 + playerSpeed / KILL_SPEED_THRESHOLD
    : playerSpeed <= MAX_SPEED
    ? 2 + (playerSpeed - KILL_SPEED_THRESHOLD) / (MAX_SPEED - KILL_SPEED_THRESHOLD)
    : 3 + (playerSpeed - MAX_SPEED) / (BOOST_MAX - MAX_SPEED);

  // Ground block effects (only when grounded)
  if (grounded && _rpOxy > 0) {
    oxygen = Math.min(100, oxygen + OXY_REFILL * _rpOxy * refillMult * dt);
    sndOxyPickupTimer -= dt;
    if (sndOxyPickupTimer <= 0) { SFX.oxyPickup(); sndOxyPickupTimer = 0.3; }
  }
  if (grounded && _rpFuel > 0) {
    fuel = Math.min(100, fuel + FUEL_REFILL * _rpFuel * refillMult * dt);
    sndFuelPickupTimer -= dt;
    if (sndFuelPickupTimer <= 0) { SFX.fuelPickup(); sndFuelPickupTimer = 0.3; }
  }
  if (grounded && !gHasDrainFuel && !gHasDrainOxy) {
    airDrainFuel = false; airDrainOxy = false;
  }
  if (grounded) {
    if (gHasKill && !debugInvincible) {
      deathVX = playerVX; deathVY = -playerVY; deathVZ = -playerSpeed * 0.7;
      deathBloomX = 0; deathBloomY = 1; deathBloomZ = 0;
      die('kill');
    }
    if (gHasJump && hasPropellant) {
      playerVY = JUMP_FORCE;
      grounded = false;
      padSustain = true;
      isSustaining = true;
      isGliding = false;
      spawnSparks(playerX, playerY + 0.1, playerZ, 0.6);
      spawnJumpSparks(playerX, playerY, playerZ);
      SFX.jumpPad();
    }
    if (gHasDrainFuel) {
      if (!debugInvincible) fuel = Math.max(0, fuel - FUEL_DRAIN_RATE * dt);
      airDrainFuel = true;
      sndDrainTimer -= dt;
      if (sndDrainTimer <= 0) { SFX.drain(); sndDrainTimer = 0.4; }
    }
    if (gHasDrainOxy) {
      if (!debugInvincible) oxygen = Math.max(0, oxygen - OXY_DRAIN_BLOCK_RATE * dt);
      airDrainOxy = true;
      sndDrainTimer -= dt;
      if (sndDrainTimer <= 0) { SFX.drain(); sndDrainTimer = 0.4; }
    }
  }

  // Airborne drain (persists from drain block until next contact)
  if (!grounded && (airDrainFuel || airDrainOxy)) {
    if (airDrainFuel && !debugInvincible) fuel = Math.max(0, fuel - FUEL_DRAIN_RATE * dt);
    if (airDrainOxy && !debugInvincible) oxygen = Math.max(0, oxygen - OXY_DRAIN_BLOCK_RATE * dt);
    sndDrainTimer -= dt;
    if (sndDrainTimer <= 0) { SFX.drain(); sndDrainTimer = 0.4; }
  }

  // Fall if no ground below — check all rows × both X edges
  if (grounded) {
    playerRowsRange();
    var grXL = playerX - hw, grXR = playerX + hw;
    var bestSurface = null;
    for (var gri = _prLo; gri <= _prHi; gri++) {
      for (var gxi = 0; gxi < 2; gxi++) {
        var col = getColumnAtX(gri, gxi === 0 ? grXL : grXR);
        for (var bi = 0; bi < col.length; bi++) {
          var gs = blockTop(col[bi]);
          if (Math.abs(playerY - gs) < 0.2 && (bestSurface === null || gs > bestSurface)) bestSurface = gs;
        }
      }
    }
    if (bestSurface === null) {
      grounded = false;
      playerVY = 0;
      if (!sndFallingWas) { SFX.falling(); sndFallingWas = true; }
    } else {
      sndFallingWas = false;
      // Track safe position for debug revive (not on kill/drain blocks)
      if (!gHasKill && !gHasDrainFuel && !gHasDrainOxy) {
        safeX = playerX; safeY = playerY; safeZ = playerZ;
      }
    }
  }

  // Freeze distance display when falling below all blocks
  if (!grounded && playerY < -1 && frozenDist < 0) frozenDist = Math.abs(playerZ);

  // Fell off map
  if (playerY < -20) die('fall');

  // Death conditions — stranded when out of resources and not making progress
  if ((noOxygen || !hasPropellant) && !debugInvincible) {
    var zProgress = Math.abs(playerZ - stuckZ);
    if (zProgress > 1) {
      stuckTimer = 0;
      stuckZ = playerZ;
    } else {
      stuckTimer += dt;
    }
    var strandedDelay = !hasPropellant ? 3 : 1;
    if (stuckTimer > strandedDelay) die('stranded');
  } else {
    stuckTimer = 0;
    stuckZ = playerZ;
  }
}

// ---- CAMERA ----
function updateCamera() {
  camera.position.set(0, 5, playerZ + 10);
  camera.lookAt(new THREE.Vector3(0, 0, playerZ - 20));

  var shipZOffset = (state === 'winning' || state === 'won') ? winShipZ : 0;
  shipMesh.position.set(playerX, playerY + 0.35, playerZ + shipZOffset);
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


  if (starField) starField.position.z = playerZ;
  if (debugPlane) debugPlane.position.z = playerZ;

  if (engineMatRef) {
    var speedPct = playerSpeed / MAX_SPEED;
    var r = 0.3 + speedPct * 0.7;
    var g = 0.15 + speedPct * 0.2;
    engineMatRef.color.setRGB(r, g, 0);
  }

  // Flame is now handled by particle system in updateEngineTrail()
}
