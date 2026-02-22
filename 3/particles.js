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
    explosionVelocities[i3] = Math.cos(angle) * sideSpeed;
    explosionVelocities[i3+1] = Math.abs(Math.sin(angle)) * sideSpeed * 0.5 + Math.random() * 3;
    explosionVelocities[i3+2] = -deathSpeed * 0.7 + (Math.random() - 0.3) * sideSpeed;
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
    debrisVelocities[d3] = Math.cos(dAngle) * dSideSpeed;
    debrisVelocities[d3+1] = Math.abs(Math.sin(dAngle)) * dSideSpeed * 0.5 + Math.random() * 3;
    debrisVelocities[d3+2] = -deathSpeed * 0.7 + (Math.random() - 0.3) * dSideSpeed;
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

// ---- SPEED LINES ----
var speedLineCount = 30;
var speedLines = null;
var speedLineData = [];

function initSpeedLines() {
  var geo = new THREE.BufferGeometry();
  var positions = new Float32Array(speedLineCount * 6);
  for (var i = 0; i < speedLineCount; i++) {
    var idx = i * 6;
    positions[idx] = positions[idx + 3] = (Math.random() - 0.5) * 20;
    positions[idx + 1] = positions[idx + 4] = Math.random() * 6 + 1;
    positions[idx + 2] = 0;
    positions[idx + 5] = -1;
    speedLineData.push({ life: Math.random() });
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  var mat = new THREE.LineBasicMaterial({ color: 0x4488cc, transparent: true, opacity: 0.3 });
  speedLines = new THREE.LineSegments(geo, mat);
  scene.add(speedLines);
}

function updateSpeedLines(dt) {
  if (!speedLines) return;
  var pos = speedLines.geometry.attributes.position.array;
  var speedFactor = playerSpeed / MAX_SPEED;
  speedLines.material.opacity = speedFactor * 0.5;

  for (var i = 0; i < speedLineCount; i++) {
    var d = speedLineData[i];
    d.life += dt * 2;
    if (d.life > 1) {
      d.life = 0;
      var idx = i * 6;
      var x = (Math.random() - 0.5) * 16;
      var y = Math.random() * 5 + 1;
      var z = playerZ - 15 - Math.random() * 30;
      pos[idx] = x; pos[idx + 1] = y; pos[idx + 2] = z;
      pos[idx + 3] = x; pos[idx + 4] = y; pos[idx + 5] = z - 1 - speedFactor * 3;
    }
  }
  speedLines.geometry.attributes.position.needsUpdate = true;
}

// ---- ENGINE FLAME PARTICLES (two pools: accel + cruise) ----
var accelFlame = null, cruiseFlame = null;
var ACCEL_FLAME_COUNT = 150;
var CRUISE_FLAME_COUNT = 60;

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
var JUMP_SPARK_COUNT = 50;
var jumpSparkPool = null;

function initEngineTrail() {
  accelFlame = _initFlamePool(ACCEL_FLAME_COUNT, 0.55, 0.9, ACCEL_RAMP);
  cruiseFlame = _initFlamePool(CRUISE_FLAME_COUNT, 0.4, 0.65, CRUISE_RAMP);
  sustainFlame = _initFlamePool(SUSTAIN_COUNT, 0.3, 0.7, SUSTAIN_RAMP);
  glideFlame = _initFlamePool(GLIDE_COUNT, 0.45, 0.8, GLIDE_RAMP);
  jumpSparkPool = _initFlamePool(JUMP_SPARK_COUNT, 0.2, 0.8, JUMP_SPARK_RAMP);
}

function _spawnFlame(pool, count, spread, speed, lifeRate, nX, nY, nZ, backDir, extraVX) {
  var pos = pool.points.geometry.attributes.position.array;
  var thrust = speed + Math.random() * speed * 0.5;
  var evx = extraVX || 0;
  for (var s = 0; s < count; s++) {
    var i3 = pool.idx * 3;
    pos[i3] = nX + (Math.random() - 0.5) * spread;
    pos[i3 + 1] = nY + (Math.random() - 0.5) * spread;
    pos[i3 + 2] = nZ;
    var t = thrust + Math.random() * speed * 0.3;
    pool.velocities[i3] = backDir.x * t + (Math.random() - 0.5) * 0.4 + evx;
    pool.velocities[i3 + 1] = backDir.y * t + (Math.random() - 0.5) * 0.3;
    pool.velocities[i3 + 2] = -playerSpeed + backDir.z * t;
    pool.ages[pool.idx] = 0;
    pool.lifeRates[pool.idx] = lifeRate;
    pool.idx = (pool.idx + 1) % pool.count;
  }
}

function _updateFlamePool(pool, dt) {
  var pos = pool.points.geometry.attributes.position.array;
  var col = pool.points.geometry.attributes.color.array;
  for (var i = 0; i < pool.count; i++) {
    pool.ages[i] += dt * pool.lifeRates[i];
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

function updateEngineTrail(dt) {
  if (!accelFlame || !alive) return;

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

  // Update existing particles BEFORE spawning new ones,
  // so freshly spawned particles don't get displaced on their birth frame
  _updateFlamePool(accelFlame, dt);
  _updateFlamePool(cruiseFlame, dt);
  _updateFlamePool(sustainFlame, dt);
  _updateFlamePool(glideFlame, dt);
  _updateFlamePool(jumpSparkPool, dt);

  if (accelHeld && fuel > 0 && oxygen > 0 && !brakeHeld) {
    _spawnFlame(accelFlame, 12, 0.03, 0.5 + speedPct * 0.8, 5.6, nX, nY, nZ, backWorld, playerVX);
    accelFlameLight.position.set(lX, lY, lZ);
    accelFlameLight.target.position.set(tX, tY, tZ);
    accelFlameLight.intensity = 0.8 + Math.random() * 0.4;
    cruiseFlameLight.intensity = 0;
  } else if (playerSpeed > 0.5 && !brakeHeld && fuel > 0) {
    _spawnFlame(cruiseFlame, 4, 0.02, 0.3 + speedPct * 0.4, 5.0, nX, nY, nZ, backWorld);
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
  if (!grounded && spaceHeld && fuel > 0) {
    var downDir = new THREE.Vector3(0, -1 + playerVY * 0.15, 0).normalize();
    var tipL = shipMesh.localToWorld(new THREE.Vector3(-1.30, 0.10, 0.5));
    var tipR = shipMesh.localToWorld(new THREE.Vector3( 1.30, 0.10, 0.5));
    if (playerVY > 0) {
      _spawnFlame(sustainFlame, 2, 0.01, 3.5, 16.0, tipL.x, tipL.y, tipL.z, downDir, playerVX);
      _spawnFlame(sustainFlame, 2, 0.01, 3.5, 16.0, tipR.x, tipR.y, tipR.z, downDir, playerVX);
    } else {
      _spawnFlame(glideFlame, 2, 0.03, 5.0, 12.0, tipL.x, tipL.y, tipL.z, downDir, playerVX);
      _spawnFlame(glideFlame, 2, 0.03, 5.0, 12.0, tipR.x, tipR.y, tipR.z, downDir, playerVX);
    }
  }
}

function spawnJumpSparks(x, y, z) {
  if (!jumpSparkPool) return;
  var pos = jumpSparkPool.points.geometry.attributes.position.array;
  var count = 15;
  for (var i = 0; i < count; i++) {
    var i3 = jumpSparkPool.idx * 3;
    pos[i3] = x + (Math.random() - 0.5) * 0.5;
    pos[i3 + 1] = y;
    pos[i3 + 2] = z + (Math.random() - 0.5) * 0.5;
    var angle = Math.random() * Math.PI * 2;
    var spd = 1.5 + Math.random() * 3;
    jumpSparkPool.velocities[i3] = Math.cos(angle) * spd + playerVX;
    jumpSparkPool.velocities[i3 + 1] = 2 + Math.random() * 4;
    jumpSparkPool.velocities[i3 + 2] = Math.sin(angle) * spd - playerSpeed * 0.3;
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
  // Speed lines
  if (speedLines) {
    speedLines.material.opacity = 0;
    for (var i = 0; i < speedLineCount; i++) speedLineData[i].life = 1;
  }
  // Flames
  _clearPool(accelFlame);
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
