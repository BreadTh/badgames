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

var deathSpeed = 0;
var frozenKeys = null;
var glideLockedIn = false;
var padSustain = false;
var deathReason = '';
function die(reason) {
  if (!alive) return;
  alive = false;
  state = 'dead';
  deathReason = reason;
  deathSpeed = playerSpeed;
  stopContinuousSounds();
  if (reason === 'crash' || reason === 'kill') {
    createExplosion(playerX, playerY + 0.5, playerZ);
    SFX.explode();
    explodeShip();
  } else if (reason === 'stranded') {
    // Ship stays visible, no explosion
  } else {
    SFX.falling();
    shipMesh.visible = false;
  }
  calcAndSaveScore();
}

function win() {
  state = 'winning';
  stopContinuousSounds();
  winTimer = 2.0;
  clearedLevels[currentLevel] = true;
  localStorage.setItem('spaceRunnerCleared', JSON.stringify(clearedLevels));
  SFX.win();
}

// Spend fuel, or oxygen at 2x if out of fuel
function spendFuel(cost) {
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
        if (!started) started = true;
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
  if (started) oxygen = Math.max(0, oxygen - OXY_DRAIN * dt);

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
  if (canSteer && (inp['ArrowLeft'] || inp['KeyA'])) { playerVX -= lateralAccel * dt; steering = true; }
  if (canSteer && (inp['ArrowRight'] || inp['KeyD'])) { playerVX += lateralAccel * dt; steering = true; }
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
    // ---- Z MOVE ----
    var prevZ = playerZ;
    if (!zBlocked) {
      playerZ -= playerSpeed * subDt;
    }

    // ---- Y MOVE (gravity/jump) ----
    if (!grounded && playerVY > JUMP_CUT_VY && !inp['Space']) {
      playerVY = JUMP_CUT_VY;
    }
    if (!grounded) {
      var prevY = playerY;
      var nearGround = false;
      if (playerVY <= 0) {
        var gRows2 = playerRows();
        for (var ng = 0; ng < gRows2.length && !nearGround; ng++) {
          var ngCol = getColumnAtX(gRows2[ng], playerX);
          for (var nbi = 0; nbi < ngCol.length; nbi++) {
            var gTop = blockTop(ngCol[nbi]);
            if (gTop <= playerY && playerY - gTop < BLOCK_SIZE) { nearGround = true; break; }
          }
        }
      }
      if (!inp['Space']) glideLockedIn = false;
      else if (!nearGround && playerVY <= 0) glideLockedIn = true;
      var gliding = inp['Space'] && playerVY <= 0 && fuel > 0 && (!nearGround || glideLockedIn);
      var sustaining = inp['Space'] && playerVY > 0 && hasPropellant;
      if (padSustain && (playerVY <= 0 || fuel <= 0)) padSustain = false;
      if (gliding) {
        fuel = Math.max(0, fuel - FUEL_GLIDE_COST * subDt);
      } else if (sustaining) {
        spendFuel(FUEL_AIR_COST * subDt);
      }
      var grav = (sustaining || padSustain) ? GRAVITY * HOLD_GRAVITY : gliding ? GRAVITY * GLIDE_GRAVITY : GRAVITY;
      playerVY += grav * subDt;
      playerY += playerVY * subDt;

      // Landing check — all 4 bottom corners
      if (playerVY <= 0) {
        var hd = PLAYER_D / 2;
        var botCorners = [
          { x: playerX - hw, r: zToRow(playerZ - hd) },
          { x: playerX + hw, r: zToRow(playerZ - hd) },
          { x: playerX - hw, r: zToRow(playerZ + hd) },
          { x: playerX + hw, r: zToRow(playerZ + hd) },
        ];
        var landSurface = null;
        var landBlock = null;
        for (var lci = 0; lci < 4; lci++) {
          var col = getColumnAtX(botCorners[lci].r, botCorners[lci].x);
          for (var lbi = 0; lbi < col.length; lbi++) {
            var surf = blockTop(col[lbi]);
            if (prevY >= surf - 0.1 && playerY <= surf) {
              if (landSurface === null || surf > landSurface) {
                landSurface = surf;
                landBlock = col[lbi];
              }
            }
          }
        }
        if (landSurface !== null) {
          if (landBlock.type === BLOCK.KILL && !debugInvincible) {
            die('kill'); return;
          }
          airDrainFuel = false; airDrainOxy = false;
          var landIsDrain = landBlock.type === BLOCK.DRAIN_FUEL || landBlock.type === BLOCK.DRAIN_OXY;
          playerY = landSurface;
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
            if (landIsDrain) {
              if (landBlock.type === BLOCK.DRAIN_FUEL) airDrainFuel = true;
              else airDrainOxy = true;
            }
          } else {
            var bounceV = -playerVY * BOUNCE_FACTOR;
            if (bounceV > 1.5) {
              playerVY = bounceV;
              coyoteTimer = COYOTE_TIME;
              if (landIsDrain) {
                if (landBlock.type === BLOCK.DRAIN_FUEL) airDrainFuel = true;
                else airDrainOxy = true;
              }
            } else {
              playerVY = 0;
              grounded = true;
              padSustain = false;
            }
          }
        }
      }

      // Head bonk check — all 4 top corners
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
        var bonkedKill = false;
        for (var bci = 0; bci < 4; bci++) {
          var col = getColumnAtX(topCorners[bci].r, topCorners[bci].x);
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
        if (bonked) {
          if (bonkedKill && !debugInvincible) { die('kill'); return; }
          airDrainFuel = false; airDrainOxy = false;
          if (!sndBonkWas) SFX.bonk();
          sndBonkWas = true;
          playerSpeed *= 0.9;
          playerVY = 0;
          playerY = lowestBot - PLAYER_H;
        } else {
          sndBonkWas = false;
        }
      }
    }

    // ---- Z FRONT COLLISION ----
    if (!zBlocked && playerSpeed > 0) {
      var frontZ = playerZ - PLAYER_D / 2;
      var fCorners = [
        { x: playerX - hw, y: playerY + 0.15 },
        { x: playerX + hw, y: playerY + 0.15 },
        { x: playerX - hw, y: playerY + PLAYER_H * 0.5 },
        { x: playerX + hw, y: playerY + PLAYER_H * 0.5 },
      ];
      var baseFrontRow = zToRow(frontZ);
      for (var fri = 0; fri < 2; fri++) {
        var checkRow = baseFrontRow + fri;
        var wallBackFace = rowToZ(checkRow) + BLOCK_SIZE * 0.5;
        if (frontZ < wallBackFace + 0.1) {
          var blocked = false;
          for (var fci = 0; fci < 4; fci++) {
            if (pointInBlock(fCorners[fci].x, fCorners[fci].y, checkRow)) {
              blocked = true; break;
            }
          }
          if (blocked) {
            if (playerSpeed > KILL_SPEED_THRESHOLD && !debugInvincible) {
              die('crash'); return;
            }
            airDrainFuel = false; airDrainOxy = false;
            if (playerSpeed > 2) SFX.collide();
            playerZ = Math.min(prevZ, wallBackFace + 0.1 + PLAYER_D / 2);
            playerSpeed = 0;
            zBlocked = true;
            break;
          }
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
      var sRows = playerRows();
      var hitLeft = false, hitRight = false;
      var killLeft = false, killRight = false;
      for (var ssi = 0; ssi < sRows.length; ssi++) {
        if (!hitLeft) {
          var lbBot = pointInBlock(playerX - hw, playerY, sRows[ssi]);
          var lbTop = pointInBlock(playerX - hw, playerY + PLAYER_H, sRows[ssi]);
          if (lbBot || lbTop) {
            hitLeft = true;
            if ((lbBot && lbBot.type === BLOCK.KILL) || (lbTop && lbTop.type === BLOCK.KILL)) killLeft = true;
          }
        }
        if (!hitRight) {
          var rbBot = pointInBlock(playerX + hw, playerY, sRows[ssi]);
          var rbTop = pointInBlock(playerX + hw, playerY + PLAYER_H, sRows[ssi]);
          if (rbBot || rbTop) {
            hitRight = true;
            if ((rbBot && rbBot.type === BLOCK.KILL) || (rbTop && rbTop.type === BLOCK.KILL)) killRight = true;
          }
        }
      }
      var WALL_BOUNCE_THRESHOLD = 4;
      var WALL_GRIND_DECEL = 24;
      if (hitLeft && playerVX <= 0) {
        if (killLeft && !debugInvincible) { die('kill'); return; }
        airDrainFuel = false; airDrainOxy = false;
        if (!sndHitLeftWas) SFX.wallTap();
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
        if (killRight && !debugInvincible) { die('kill'); return; }
        airDrainFuel = false; airDrainOxy = false;
        if (!sndHitRightWas) SFX.wallTap();
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

  // Win check — standing on or passing over any WIN_TUNNEL block
  if (block && block.type === BLOCK.WIN_TUNNEL) {
    win();
  } else {
    for (var wi = 0; wi < gRows.length && state === 'playing'; wi++) {
      var wCol = getColumnAtX(gRows[wi], playerX);
      for (var wbi = 0; wbi < wCol.length; wbi++) {
        if (wCol[wbi].type === BLOCK.WIN_TUNNEL && blockTop(wCol[wbi]) <= playerY) {
          win(); break;
        }
      }
    }
  }

  // Check for fuel/oxygen blocks within half a block left/right
  var nearFuel = false, nearOxy = false;
  if (grounded) {
    var checkXs = [playerX - LANE_WIDTH * 0.5, playerX, playerX + LANE_WIDTH * 0.5];
    for (var ci = 0; ci < checkXs.length && !(nearFuel && nearOxy); ci++) {
      for (var gi2 = 0; gi2 < gRows.length && !(nearFuel && nearOxy); gi2++) {
        var col2 = getColumnAtX(gRows[gi2], checkXs[ci]);
        for (var bi2 = 0; bi2 < col2.length; bi2++) {
          if (Math.abs(blockTop(col2[bi2]) - playerY) < 0.2) {
            if (col2[bi2].type === BLOCK.FUEL) nearFuel = true;
            if (col2[bi2].type === BLOCK.OXYGEN) nearOxy = true;
          }
        }
      }
    }
  }

  // Speed multiplier for refueling: 100% at 0, 200% at kill speed, 300% at max
  var refillMult = playerSpeed <= KILL_SPEED_THRESHOLD
    ? 1 + playerSpeed / KILL_SPEED_THRESHOLD
    : 2 + (playerSpeed - KILL_SPEED_THRESHOLD) / (MAX_SPEED - KILL_SPEED_THRESHOLD);

  // Ground block effects (only when grounded)
  if (grounded && nearOxy) {
    oxygen = Math.min(100, oxygen + OXY_REFILL * refillMult * dt);
    sndOxyPickupTimer -= dt;
    if (sndOxyPickupTimer <= 0) { SFX.oxyPickup(); sndOxyPickupTimer = 0.3; }
  }
  if (grounded && nearFuel) {
    fuel = Math.min(100, fuel + FUEL_REFILL * refillMult * dt);
    sndFuelPickupTimer -= dt;
    if (sndFuelPickupTimer <= 0) { SFX.fuelPickup(); sndFuelPickupTimer = 0.3; }
  }
  if (grounded && (!block || (block.type !== BLOCK.DRAIN_FUEL && block.type !== BLOCK.DRAIN_OXY))) {
    airDrainFuel = false; airDrainOxy = false;
  }
  if (block && grounded) {
    switch (block.type) {
      case BLOCK.OXYGEN:
      case BLOCK.FUEL:
        break; // handled above
      case BLOCK.KILL:
        if (!debugInvincible) die('kill');
        break;
      case BLOCK.JUMP:
        if (fuel > 0) {
          playerVY = JUMP_FORCE;
          grounded = false;
          padSustain = true;
          SFX.jumpPad();
        }
        break;
      case BLOCK.DRAIN_FUEL:
        fuel = Math.max(0, fuel - FUEL_DRAIN_RATE * dt);
        airDrainFuel = true;
        sndDrainTimer -= dt;
        if (sndDrainTimer <= 0) { SFX.drain(); sndDrainTimer = 0.4; }
        break;
      case BLOCK.DRAIN_OXY:
        oxygen = Math.max(0, oxygen - OXY_DRAIN_BLOCK_RATE * dt);
        airDrainOxy = true;
        sndDrainTimer -= dt;
        if (sndDrainTimer <= 0) { SFX.drain(); sndDrainTimer = 0.4; }
        break;
    }

  }

  // Airborne drain (persists from drain block until next contact)
  if (!grounded && (airDrainFuel || airDrainOxy)) {
    if (airDrainFuel) fuel = Math.max(0, fuel - FUEL_DRAIN_RATE * dt);
    if (airDrainOxy) oxygen = Math.max(0, oxygen - OXY_DRAIN_BLOCK_RATE * dt);
    sndDrainTimer -= dt;
    if (sndDrainTimer <= 0) { SFX.drain(); sndDrainTimer = 0.4; }
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
      // Track safe position for debug revive (not on kill/drain blocks)
      if (!block || (block.type !== BLOCK.KILL && block.type !== BLOCK.DRAIN_FUEL && block.type !== BLOCK.DRAIN_OXY)) {
        safeX = playerX; safeY = playerY; safeZ = playerZ;
      }
    }
  }

  // Fell off map
  if (playerY < -20 && !debugInvincible) die('fall');

  // Death conditions — stranded when out of resources and stopped
  if ((noOxygen || !hasPropellant) && playerSpeed <= 0 && grounded && !debugInvincible) {
    stuckTimer += dt;
    var strandedDelay = !hasPropellant ? 3 : 1;
    if (stuckTimer > strandedDelay) die('stranded');
  } else {
    stuckTimer = 0;
  }
}

// ---- CAMERA ----
function updateCamera() {
  camera.position.set(0, 5, playerZ + 10);
  camera.lookAt(new THREE.Vector3(0, 0, playerZ - 20));

  shipMesh.position.set(playerX, playerY + 0.35, playerZ);
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

  // Flame is now handled by particle system in updateEngineTrail()
}
