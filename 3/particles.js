// ---- EXPLOSION (fire particles + debris chunks) ----
var explosionParticles = null;
var explosionLight = null;
var EXPLOSION_COUNT = 40;
var explosionVelocities = [];
var explosionAge = 0;
var explosionActive = false;

// Debris — small mesh chunks that tumble
var DEBRIS_COUNT = 20;
var debrisMeshes = [];
var debrisVelocities = [];
var debrisSpins = [];

function initExplosion() {
  // Fire particles — round, additive
  var geo = new THREE.BufferGeometry();
  var positions = new Float32Array(EXPLOSION_COUNT * 3);
  var colors = new Float32Array(EXPLOSION_COUNT * 3);
  for (var i = 0; i < EXPLOSION_COUNT; i++) {
    positions[i * 3 + 1] = -100;
    // Fire colors assigned at spawn time
    colors[i * 3] = 1; colors[i * 3 + 1] = 0.5; colors[i * 3 + 2] = 0;
    explosionVelocities.push(0, 0, 0);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  var mat = new THREE.PointsMaterial({
    size: 0.5, vertexColors: true, transparent: true, opacity: 0,
    map: _getFlameTexture(), depthWrite: false, blending: THREE.AdditiveBlending
  });
  explosionParticles = new THREE.Points(geo, mat);
  explosionParticles.frustumCulled = false;
  scene.add(explosionParticles);

  // Debris chunks — small boxes in ship colors
  var debrisColorSet = [0x0099dd, 0x006699, 0x44ddff, 0x002244, 0xff5500];
  var debrisColors = [];
  for (var dc = 0; dc < DEBRIS_COUNT; dc++) debrisColors.push(debrisColorSet[dc % debrisColorSet.length]);
  for (var d = 0; d < DEBRIS_COUNT; d++) {
    var w = 0.08 + Math.random() * 0.15;
    var h = 0.04 + Math.random() * 0.1;
    var l = 0.1 + Math.random() * 0.2;
    var dGeo = new THREE.BoxGeometry(w, h, l);
    var dMat = new THREE.MeshPhongMaterial({ color: debrisColors[d], emissive: 0x111111 });
    var dMesh = new THREE.Mesh(dGeo, dMat);
    dMesh.visible = false;
    dMesh.frustumCulled = false;
    scene.add(dMesh);
    debrisMeshes.push(dMesh);
    debrisVelocities.push(0, 0, 0);
    debrisSpins.push(0, 0, 0);
  }
}

function createExplosion(x, y, z) {
  if (!explosionParticles) return;
  var pos = explosionParticles.geometry.attributes.position.array;
  var col = explosionParticles.geometry.attributes.color.array;
  for (var i = 0; i < EXPLOSION_COUNT; i++) {
    var i3 = i * 3;
    pos[i3] = x + (Math.random() - 0.5) * 0.3;
    pos[i3+1] = y + (Math.random() - 0.5) * 0.3;
    pos[i3+2] = z + (Math.random() - 0.5) * 0.3;
    var sideSpeed = 3 + Math.random() * 8;
    var angle = Math.random() * Math.PI * 2;
    var bloomMag = Math.abs(Math.sin(angle)) * sideSpeed * 0.5 + Math.random() * 3;
    var spread1 = Math.cos(angle) * sideSpeed;
    var spread2 = (Math.random() - 0.3) * sideSpeed;
    var bvx, bvy, bvz;
    if (Math.abs(deathBloomY) > 0.5) {
      bvx = spread1; bvy = bloomMag * deathBloomY; bvz = spread2;
    } else if (Math.abs(deathBloomX) > 0.5) {
      bvx = bloomMag * deathBloomX; bvy = spread1; bvz = spread2;
    } else {
      bvx = spread1; bvy = spread2; bvz = bloomMag * deathBloomZ;
    }
    explosionVelocities[i3] = deathVX + bvx;
    explosionVelocities[i3+1] = deathVY + bvy;
    explosionVelocities[i3+2] = deathVZ + bvz;
    // Fire color per particle
    var t = Math.random();
    if (t < 0.3) { col[i3] = 1; col[i3+1] = 0.9; col[i3+2] = 0.5; }      // bright yellow
    else if (t < 0.6) { col[i3] = 1; col[i3+1] = 0.5; col[i3+2] = 0.05; }  // orange
    else if (t < 0.85) { col[i3] = 1; col[i3+1] = 0.2; col[i3+2] = 0; }     // red-orange
    else { col[i3] = 0.8; col[i3+1] = 0.08; col[i3+2] = 0; }                // deep red
  }
  explosionParticles.geometry.attributes.position.needsUpdate = true;
  explosionParticles.geometry.attributes.color.needsUpdate = true;
  explosionParticles.material.opacity = 1;
  explosionAge = 0;
  explosionActive = true;

  // Launch debris
  for (var d = 0; d < DEBRIS_COUNT; d++) {
    debrisMeshes[d].visible = true;
    debrisMeshes[d].position.set(
      x + (Math.random() - 0.5) * 0.4,
      y + (Math.random() - 0.5) * 0.3,
      z + (Math.random() - 0.5) * 0.4
    );
    var dSideSpeed = 3 + Math.random() * 6;
    var dAngle = Math.random() * Math.PI * 2;
    var d3 = d * 3;
    var dBloom = Math.abs(Math.sin(dAngle)) * dSideSpeed * 0.5 + Math.random() * 3;
    var dSpread1 = Math.cos(dAngle) * dSideSpeed;
    var dSpread2 = (Math.random() - 0.3) * dSideSpeed;
    var dbvx, dbvy, dbvz;
    if (Math.abs(deathBloomY) > 0.5) {
      dbvx = dSpread1; dbvy = dBloom * deathBloomY; dbvz = dSpread2;
    } else if (Math.abs(deathBloomX) > 0.5) {
      dbvx = dBloom * deathBloomX; dbvy = dSpread1; dbvz = dSpread2;
    } else {
      dbvx = dSpread1; dbvy = dSpread2; dbvz = dBloom * deathBloomZ;
    }
    debrisVelocities[d3] = deathVX + dbvx;
    debrisVelocities[d3+1] = deathVY + dbvy;
    debrisVelocities[d3+2] = deathVZ + dbvz;
    debrisSpins[d3] = (Math.random() - 0.5) * 15;
    debrisSpins[d3+1] = (Math.random() - 0.5) * 15;
    debrisSpins[d3+2] = (Math.random() - 0.5) * 15;
  }
}

function updateExplosion(dt) {
  if (!explosionActive) return;
  explosionAge += dt;
  var pos = explosionParticles.geometry.attributes.position.array;
  var vel = explosionVelocities;
  for (var i = 0; i < EXPLOSION_COUNT * 3; i += 3) {
    vel[i + 1] -= 20 * dt;
    var drift = (state === 'dead') ? -deathSpeed * dt : 0;
    pos[i] += vel[i] * dt;
    pos[i + 1] += vel[i + 1] * dt;
    pos[i + 2] += vel[i + 2] * dt + drift;
    vel[i] *= 0.97;
    vel[i + 2] *= 0.97;
  }
  explosionParticles.geometry.attributes.position.needsUpdate = true;
  explosionParticles.material.opacity = Math.max(0, 1 - explosionAge * 0.5);

  // Update debris
  for (var d = 0; d < DEBRIS_COUNT; d++) {
    if (!debrisMeshes[d].visible) continue;
    var d3 = d * 3;
    debrisVelocities[d3 + 1] -= 18 * dt;
    var dDrift = (state === 'dead') ? -deathSpeed * dt : 0;
    debrisMeshes[d].position.x += debrisVelocities[d3] * dt;
    debrisMeshes[d].position.y += debrisVelocities[d3+1] * dt;
    debrisMeshes[d].position.z += debrisVelocities[d3+2] * dt + dDrift;
    debrisMeshes[d].rotation.x += debrisSpins[d3] * dt;
    debrisMeshes[d].rotation.y += debrisSpins[d3+1] * dt;
    debrisMeshes[d].rotation.z += debrisSpins[d3+2] * dt;
    debrisVelocities[d3] *= 0.98;
    debrisVelocities[d3+2] *= 0.98;
    // Fade out via scale
    var fade = Math.max(0, 1 - explosionAge * 0.4);
    debrisMeshes[d].scale.setScalar(fade);
    if (fade <= 0) debrisMeshes[d].visible = false;
  }

  if (explosionAge > 2.5) explosionActive = false;
}

function clearExplosion() {
  if (!explosionParticles) return;
  explosionActive = false;
  explosionParticles.material.opacity = 0;
  var pos = explosionParticles.geometry.attributes.position.array;
  for (var i = 0; i < EXPLOSION_COUNT; i++) pos[i * 3 + 1] = -100;
  explosionParticles.geometry.attributes.position.needsUpdate = true;
  for (var d = 0; d < DEBRIS_COUNT; d++) debrisMeshes[d].visible = false;
}

// ---- LANDING SPARKS ----
var sparkParticles = null;
var SPARK_COUNT = 30;
var sparkAges = [];
var sparkVelocities = [];

function initSparks() {
  var geo = new THREE.BufferGeometry();
  var positions = new Float32Array(SPARK_COUNT * 3);
  for (var i = 0; i < SPARK_COUNT; i++) {
    positions[i * 3 + 1] = -100;
    sparkAges[i] = 1;
    sparkVelocities.push(0, 0, 0);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  var mat = new THREE.PointsMaterial({ color: 0xffcc44, size: 0.15, transparent: true, opacity: 0.9 });
  sparkParticles = new THREE.Points(geo, mat);
  scene.add(sparkParticles);
}

var sparkIdx = 0;
function spawnSparks(x, y, z, intensity) {
  if (!sparkParticles) return;
  var pos = sparkParticles.geometry.attributes.position.array;
  var count = Math.min(SPARK_COUNT, Math.floor(8 + intensity * 12));
  for (var i = 0; i < count; i++) {
    pos[sparkIdx * 3] = x + (Math.random() - 0.5) * 0.8;
    pos[sparkIdx * 3 + 1] = y;
    pos[sparkIdx * 3 + 2] = z + (Math.random() - 0.5) * 0.8;
    var angle = Math.random() * Math.PI * 2;
    var spd = 2 + Math.random() * 4 * intensity;
    sparkVelocities[sparkIdx * 3] = Math.cos(angle) * spd;
    sparkVelocities[sparkIdx * 3 + 1] = 1 + Math.random() * 3 * intensity;
    sparkVelocities[sparkIdx * 3 + 2] = Math.sin(angle) * spd;
    sparkAges[sparkIdx] = 0;
    sparkIdx = (sparkIdx + 1) % SPARK_COUNT;
  }
}

function updateSparks(dt) {
  if (!sparkParticles) return;
  var pos = sparkParticles.geometry.attributes.position.array;
  for (var i = 0; i < SPARK_COUNT; i++) {
    sparkAges[i] += dt * 4;
    if (sparkAges[i] < 1) {
      sparkVelocities[i * 3 + 1] -= 15 * dt;
      pos[i * 3] += sparkVelocities[i * 3] * dt;
      pos[i * 3 + 1] += sparkVelocities[i * 3 + 1] * dt;
      pos[i * 3 + 2] += sparkVelocities[i * 3 + 2] * dt;
    } else {
      pos[i * 3 + 1] = -100;
    }
  }
  sparkParticles.geometry.attributes.position.needsUpdate = true;
  sparkParticles.material.opacity = 0.9;
}



// ---- ENGINE FLAME PARTICLES (two pools: accel + cruise) ----
var accelFlame = null, cruiseFlame = null, oxyAccelFlame = null;
var ACCEL_FLAME_SPAWN = 12;
var CRUISE_FLAME_SPAWN = 12;
var ACCEL_FLAME_COUNT = ACCEL_FLAME_SPAWN * 13;  // ~lifeRate headroom
var CRUISE_FLAME_COUNT = CRUISE_FLAME_SPAWN * 15;

var _flameTexture = null;
function _getFlameTexture() {
  if (_flameTexture) return _flameTexture;
  var c = document.createElement('canvas');
  c.width = 32; c.height = 32;
  var ctx = c.getContext('2d');
  var g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  _flameTexture = new THREE.CanvasTexture(c);
  return _flameTexture;
}

function _initFlamePool(count, size, opacity, ramp) {
  var ages = [], lifeRates = [], velocities = [];
  var geo = new THREE.BufferGeometry();
  var positions = new Float32Array(count * 3);
  var colors = new Float32Array(count * 3);
  for (var i = 0; i < count; i++) {
    positions[i * 3 + 1] = -100;
    colors[i * 3] = 1; colors[i * 3 + 1] = 0.5; colors[i * 3 + 2] = 0;
    ages[i] = 1;
    lifeRates[i] = 2;
    velocities.push(0, 0, 0);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  var mat = new THREE.PointsMaterial({
    size: size, vertexColors: true, transparent: true, opacity: opacity,
    map: _getFlameTexture(), depthWrite: false, blending: THREE.AdditiveBlending
  });
  var points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);
  return { points: points, ages: ages, lifeRates: lifeRates, velocities: velocities, idx: 0, count: count, ramp: ramp };
}

// Accel ramp: bright yellow -> orange -> red
var ACCEL_RAMP = [
  [1.0, 0.9, 0.4],    // bright yellow
  [1.0, 0.65, 0.1],   // yellow-orange
  [1.0, 0.35, 0.0],   // orange
  [0.85, 0.15, 0.0],  // red-orange
  [0.4, 0.05, 0.0],   // dark red
];
// Cruise ramp: blue-white -> blue -> blue-purple -> dim
var CRUISE_RAMP = [
  [0.7, 0.8, 1.0],    // blue-white
  [0.4, 0.55, 0.9],   // soft blue
  [0.3, 0.35, 0.75],  // mid blue
  [0.2, 0.2, 0.5],    // dark blue
  [0.1, 0.08, 0.25],  // dim
];

// Sustain ramp: bright cyan -> blue -> dim
var SUSTAIN_RAMP = [
  [0.5, 0.9, 1.0],
  [0.3, 0.6, 0.9],
  [0.15, 0.3, 0.6],
  [0.05, 0.1, 0.3],
];
// Glide ramp: bright orange-white -> orange -> red -> dim
var GLIDE_RAMP = [
  [1.0, 0.85, 0.5],
  [1.0, 0.55, 0.1],
  [0.8, 0.25, 0.0],
  [0.4, 0.08, 0.0],
];
var SUSTAIN_COUNT = 40;
var GLIDE_COUNT = 30;
var sustainFlame = null, glideFlame = null;

// Jump sparks ramp: bright white-yellow -> orange -> gone
var JUMP_SPARK_RAMP = [
  [1.0, 0.95, 0.7],
  [1.0, 0.7, 0.3],
  [0.8, 0.4, 0.1],
  [0.3, 0.1, 0.0],
];
var JUMP_SPARK_COUNT = 100;
var jumpSparkPool = null;

function initEngineTrail() {
  accelFlame = _initFlamePool(ACCEL_FLAME_COUNT, 0.55, 0.9, ACCEL_RAMP);
  oxyAccelFlame = _initFlamePool(ACCEL_FLAME_COUNT, 0.55, 0.9, CRUISE_RAMP);
  cruiseFlame = _initFlamePool(CRUISE_FLAME_COUNT, 0.4, 0.65, CRUISE_RAMP);
  sustainFlame = _initFlamePool(SUSTAIN_COUNT, 0.3, 0.7, SUSTAIN_RAMP);
  glideFlame = _initFlamePool(GLIDE_COUNT, 0.45, 0.8, GLIDE_RAMP);
  jumpSparkPool = _initFlamePool(JUMP_SPARK_COUNT, 0.2, 0.8, JUMP_SPARK_RAMP);
}

function _spawnFlame(pool, count, spread, speed, lifeRate, nX, nY, nZ, backDir, extraVX, pX, pY, pZ) {
  var pos = pool.points.geometry.attributes.position.array;
  var thrust = speed + Math.random() * speed * 0.5;
  var evx = extraVX || 0;
  var hasPrev = pX !== undefined;
  for (var s = 0; s < count; s++) {
    var i3 = pool.idx * 3;
    var t = hasPrev ? Math.random() : 0;
    var sX = hasPrev ? pX + (nX - pX) * t : nX;
    var sY = hasPrev ? pY + (nY - pY) * t : nY;
    var sZ = hasPrev ? pZ + (nZ - pZ) * t : nZ;
    pos[i3] = sX + (Math.random() - 0.5) * spread;
    pos[i3 + 1] = sY + (Math.random() - 0.5) * spread;
    pos[i3 + 2] = sZ;
    var t = thrust + Math.random() * speed * 0.3;
    pool.velocities[i3] = backDir.x * t + (Math.random() - 0.5) * 0.4 + evx;
    pool.velocities[i3 + 1] = backDir.y * t + (Math.random() - 0.5) * 0.3;
    pool.velocities[i3 + 2] = -playerSpeed + backDir.z * t;
    pool.ages[pool.idx] = 0;
    pool.lifeRates[pool.idx] = lifeRate;
    pool.idx = (pool.idx + 1) % pool.count;
  }
}

var flameLifeScale = 1; // >1 = particles die faster (shorter trails)

function _updateFlamePool(pool, dt) {
  var pos = pool.points.geometry.attributes.position.array;
  var col = pool.points.geometry.attributes.color.array;
  for (var i = 0; i < pool.count; i++) {
    pool.ages[i] += dt * pool.lifeRates[i] * flameLifeScale;
    var i3 = i * 3;
    if (pool.ages[i] < 1) {
      pos[i3] += pool.velocities[i3] * dt;
      pos[i3 + 1] += pool.velocities[i3 + 1] * dt;
      pos[i3 + 2] += pool.velocities[i3 + 2] * dt;
      pool.velocities[i3] += (Math.random() - 0.5) * 1.5 * dt;
      pool.velocities[i3 + 1] += (Math.random() - 0.5) * 1.0 * dt;
      var t = pool.ages[i];
      var ramp = pool.ramp;
      var ri = Math.min(ramp.length - 1, Math.floor(t * ramp.length));
      col[i3] = ramp[ri][0]; col[i3+1] = ramp[ri][1]; col[i3+2] = ramp[ri][2];
    } else {
      pos[i3 + 1] = -100;
    }
  }
  pool.points.geometry.attributes.position.needsUpdate = true;
  pool.points.geometry.attributes.color.needsUpdate = true;
}

var prevNozzle = null, prevTipL = null, prevTipR = null;
function updateEngineTrail(dt) {
  if (!accelFlame) return;

  // Always update existing particles (so they fade out after death)
  _updateFlamePool(accelFlame, dt);
  _updateFlamePool(oxyAccelFlame, dt);
  _updateFlamePool(cruiseFlame, dt);
  _updateFlamePool(sustainFlame, dt);
  _updateFlamePool(glideFlame, dt);
  _updateFlamePool(jumpSparkPool, dt);

  if (!alive) {
    accelFlameLight.intensity = 0;
    cruiseFlameLight.intensity = 0;
    return;
  }

  var speedPct = playerSpeed / MAX_SPEED;
  var inp = (oxygen <= 0 && frozenKeys) ? frozenKeys : keys;
  var accelHeld = inp['ArrowUp'] || inp['KeyW'];
  var brakeHeld = inp['ArrowDown'] || inp['KeyS'];
  shipMesh.updateMatrixWorld();

  var nozzleLocal = new THREE.Vector3(0, -0.02, 1.15);
  var nozzleWorld = shipMesh.localToWorld(nozzleLocal.clone());
  var lightLocal = new THREE.Vector3(0, -0.02, 0.6);
  var lightWorld = shipMesh.localToWorld(lightLocal.clone());
  var nX = nozzleWorld.x;
  var nY = nozzleWorld.y;
  var nZ = nozzleWorld.z;
  var pX = prevNozzle ? prevNozzle.x : nX;
  var pY = prevNozzle ? prevNozzle.y : nY;
  var pZ = prevNozzle ? prevNozzle.z : nZ;
  var lX = lightWorld.x;
  var lY = lightWorld.y;
  var lZ = lightWorld.z;
  // Ship's backward direction in world space
  var backLocal = new THREE.Vector3(0, 0, 1);
  var backWorld = backLocal.applyQuaternion(shipMesh.quaternion).normalize();

  // Target position = nozzle + backward direction * distance
  var tX = nX + backWorld.x * 5;
  var tY = nY + backWorld.y * 5;
  var tZ = nZ + backWorld.z * 5;

  var hasProp = fuel > 0 || oxygen > 0;
  if (accelHeld && fuel > 0 && oxygen > 0 && !brakeHeld) {
    _spawnFlame(accelFlame, ACCEL_FLAME_SPAWN, 0.03, 0.5 + speedPct * 0.8, 5.6, nX, nY, nZ, backWorld, playerVX, pX, pY, pZ);
    accelFlameLight.position.set(lX, lY, lZ);
    accelFlameLight.target.position.set(tX, tY, tZ);
    accelFlameLight.intensity = 0.8 + Math.random() * 0.4;
    cruiseFlameLight.intensity = 0;
  } else if (accelHeld && fuel <= 0 && oxygen > 0 && !brakeHeld) {
    _spawnFlame(oxyAccelFlame, ACCEL_FLAME_SPAWN, 0.03, 0.5 + speedPct * 0.8, 5.6, nX, nY, nZ, backWorld, playerVX, pX, pY, pZ);
    cruiseFlameLight.position.set(lX, lY, lZ);
    cruiseFlameLight.target.position.set(tX, tY, tZ);
    cruiseFlameLight.intensity = 0.6 + Math.random() * 0.3;
    accelFlameLight.intensity = 0;
  } else if (playerSpeed > 0.5 && !brakeHeld && hasProp) {
    _spawnFlame(cruiseFlame, CRUISE_FLAME_SPAWN, 0.02, 0.3 + speedPct * 0.4, 12.0, nX, nY, nZ, backWorld, 0, pX, pY, pZ);
    cruiseFlameLight.position.set(lX, lY, lZ);
    cruiseFlameLight.target.position.set(tX, tY, tZ);
    cruiseFlameLight.intensity = 0.4 + Math.random() * 0.2;
    accelFlameLight.intensity = 0;
  } else {
    accelFlameLight.intensity = 0;
    cruiseFlameLight.intensity = 0;
  }

  // Sustain/glide at wing tips
  var spaceHeld = inp['Space'] || inp['KeySpace'];
  if (!grounded && (spaceHeld || padSustain) && hasProp) {
    var downDir = new THREE.Vector3(0, -1 + playerVY * 0.15, 0).normalize();
    var tipL = shipMesh.localToWorld(new THREE.Vector3(-1.30, 0.10, 0.5));
    var tipR = shipMesh.localToWorld(new THREE.Vector3( 1.30, 0.10, 0.5));
    var ptL = prevTipL || tipL;
    var ptR = prevTipR || tipR;
    if (playerVY > 0) {
      _spawnFlame(sustainFlame, 2, 0.01, 3.5, 16.0, tipL.x, tipL.y, tipL.z, downDir, playerVX, ptL.x, ptL.y, ptL.z);
      _spawnFlame(sustainFlame, 2, 0.01, 3.5, 16.0, tipR.x, tipR.y, tipR.z, downDir, playerVX, ptR.x, ptR.y, ptR.z);
    } else {
      _spawnFlame(glideFlame, 2, 0.03, 5.0, 12.0, tipL.x, tipL.y, tipL.z, downDir, playerVX, ptL.x, ptL.y, ptL.z);
      _spawnFlame(glideFlame, 2, 0.03, 5.0, 12.0, tipR.x, tipR.y, tipR.z, downDir, playerVX, ptR.x, ptR.y, ptR.z);
    }
    prevTipL = { x: tipL.x, y: tipL.y, z: tipL.z };
    prevTipR = { x: tipR.x, y: tipR.y, z: tipR.z };
  } else {
    prevTipL = null;
    prevTipR = null;
  }
  prevNozzle = { x: nX, y: nY, z: nZ };
}

function spawnJumpSparks(x, y, z) {
  if (!jumpSparkPool) return;
  var pos = jumpSparkPool.points.geometry.attributes.position.array;
  var count = 30;
  for (var i = 0; i < count; i++) {
    var i3 = jumpSparkPool.idx * 3;
    pos[i3] = x + (Math.random() - 0.5) * 0.5;
    pos[i3 + 1] = y;
    pos[i3 + 2] = z + (Math.random() - 0.5) * 0.5;
    var angle = Math.random() * Math.PI * 2;
    var spd = 1.5 + Math.random() * 3;
    jumpSparkPool.velocities[i3] = Math.cos(angle) * spd + playerVX;
    jumpSparkPool.velocities[i3 + 1] = 2 + Math.random() * 4;
    jumpSparkPool.velocities[i3 + 2] = Math.sin(angle) * spd - playerSpeed;
    jumpSparkPool.ages[jumpSparkPool.idx] = 0;
    jumpSparkPool.lifeRates[jumpSparkPool.idx] = 4 + Math.random() * 2;
    jumpSparkPool.idx = (jumpSparkPool.idx + 1) % jumpSparkPool.count;
  }
}

// ---- AMBIENT DUST ----
var dustParticles = null;
var DUST_COUNT = 60;

function initDust() {
  var geo = new THREE.BufferGeometry();
  var positions = new Float32Array(DUST_COUNT * 3);
  for (var i = 0; i < DUST_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = Math.random() * 4 + 0.5;
    positions[i * 3 + 2] = -Math.random() * 60;
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  var mat = new THREE.PointsMaterial({ color: 0x556688, size: 0.08, transparent: true, opacity: 0.4 });
  dustParticles = new THREE.Points(geo, mat);
  scene.add(dustParticles);
}

function updateDust(dt) {
  if (!dustParticles) return;
  var pos = dustParticles.geometry.attributes.position.array;
  for (var i = 0; i < DUST_COUNT; i++) {
    // Drift slowly
    pos[i * 3] += (Math.random() - 0.5) * dt * 0.5;
    pos[i * 3 + 1] += Math.sin(performance.now() * 0.001 + i) * dt * 0.3;
    // Recycle particles that fall behind the player
    if (pos[i * 3 + 2] > playerZ + 15) {
      pos[i * 3] = playerX + (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 4 + 0.5;
      pos[i * 3 + 2] = playerZ - 20 - Math.random() * 40;
    }
  }
  dustParticles.geometry.attributes.position.needsUpdate = true;
}

function _clearPool(pool) {
  if (!pool) return;
  var pos = pool.points.geometry.attributes.position.array;
  for (var i = 0; i < pool.count; i++) { pos[i * 3 + 1] = -100; pool.ages[i] = 1; }
  pool.points.geometry.attributes.position.needsUpdate = true;
}

function clearAllParticles() {
  clearExplosion();
  // Sparks
  if (sparkParticles) {
    var sp = sparkParticles.geometry.attributes.position.array;
    for (var i = 0; i < SPARK_COUNT; i++) { sp[i * 3 + 1] = -100; sparkAges[i] = 1; }
    sparkParticles.geometry.attributes.position.needsUpdate = true;
  }
  // Flames
  prevNozzle = null; prevTipL = null; prevTipR = null;
  _clearPool(accelFlame);
  _clearPool(oxyAccelFlame);
  _clearPool(cruiseFlame);
  _clearPool(sustainFlame);
  _clearPool(glideFlame);
  _clearPool(jumpSparkPool);
  if (typeof accelFlameLight !== 'undefined') accelFlameLight.intensity = 0;
  if (typeof cruiseFlameLight !== 'undefined') cruiseFlameLight.intensity = 0;
  // Dust
  if (dustParticles) {
    var dp = dustParticles.geometry.attributes.position.array;
    for (var i = 0; i < DUST_COUNT; i++) dp[i * 3 + 1] = -100;
    dustParticles.geometry.attributes.position.needsUpdate = true;
  }
}
