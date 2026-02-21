// ---- EXPLOSION ----
var explosionParticles = null;
var explosionLight = null;

function createExplosion(x, y, z) {
  var geo = new THREE.BufferGeometry();
  var positions = [];
  var velocities = [];
  var colors = [];
  var count = 120;
  for (var i = 0; i < count; i++) {
    positions.push(x, y, z);
    var speed = 5 + Math.random() * 15;
    var angle = Math.random() * Math.PI * 2;
    var up = Math.random() * 12;
    velocities.push(
      Math.cos(angle) * speed,
      up,
      Math.sin(angle) * speed
    );
    var t = Math.random();
    if (t < 0.2) { colors.push(1, 1, 0.8); }
    else if (t < 0.5) { colors.push(1, 0.5, 0); }
    else if (t < 0.8) { colors.push(1, 0.15, 0); }
    else { colors.push(0.3, 0.1, 0.6); }
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  var mat = new THREE.PointsMaterial({ size: 0.35, vertexColors: true, transparent: true, opacity: 1 });
  explosionParticles = new THREE.Points(geo, mat);
  explosionParticles._velocities = velocities;
  explosionParticles._age = 0;
  scene.add(explosionParticles);
  explosionLight = new THREE.PointLight(0xff8844, 3, 30);
  explosionLight.position.set(x, y, z);
  scene.add(explosionLight);
}

function updateExplosion(dt) {
  if (!explosionParticles) return;
  explosionParticles._age += dt;
  var pos = explosionParticles.geometry.attributes.position.array;
  var vel = explosionParticles._velocities;
  for (var i = 0; i < vel.length; i += 3) {
    vel[i + 1] -= 25 * dt;
    pos[i] += vel[i] * dt;
    pos[i + 1] += vel[i + 1] * dt;
    pos[i + 2] += vel[i + 2] * dt;
    vel[i] *= 0.98;
    vel[i + 2] *= 0.98;
  }
  explosionParticles.geometry.attributes.position.needsUpdate = true;
  explosionParticles.material.opacity = Math.max(0, 1 - explosionParticles._age * 0.6);
  if (explosionLight) {
    explosionLight.intensity = Math.max(0, 3 - explosionParticles._age * 6);
  }
}

function clearExplosion() {
  if (explosionParticles) {
    scene.remove(explosionParticles);
    explosionParticles = null;
  }
  if (explosionLight) {
    scene.remove(explosionLight);
    explosionLight = null;
  }
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

// ---- ENGINE TRAIL ----
var trailParticles = null;
var TRAIL_COUNT = 80;
var trailAges = [];
var trailIdx = 0;

function initEngineTrail() {
  var geo = new THREE.BufferGeometry();
  var positions = new Float32Array(TRAIL_COUNT * 3);
  var sizes = new Float32Array(TRAIL_COUNT);
  for (var i = 0; i < TRAIL_COUNT; i++) {
    positions[i * 3] = 0;
    positions[i * 3 + 1] = -100;
    positions[i * 3 + 2] = 0;
    sizes[i] = 0;
    trailAges[i] = 1;
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  var mat = new THREE.PointsMaterial({ color: 0xff6600, size: 0.2, transparent: true, opacity: 0.7 });
  trailParticles = new THREE.Points(geo, mat);
  scene.add(trailParticles);
}

function updateEngineTrail(dt) {
  if (!trailParticles || !alive) return;
  var pos = trailParticles.geometry.attributes.position.array;

  var speedPct = playerSpeed / MAX_SPEED;
  var accelHeld = keys['ArrowUp'] || keys['KeyW'];
  // Spawn more particles at higher speed / when accelerating
  var spawnCount = accelHeld ? 4 : 2;
  if (playerSpeed > 0.5) {
    for (var s = 0; s < spawnCount; s++) {
      for (var e = 0; e < 2; e++) {
        var ex = playerX + (e === 0 ? -0.2 : 0.2);
        var ey = playerY + 0.5;
        var ez = playerZ + 0.9;
        var spread = 0.1 + speedPct * 0.15;
        pos[trailIdx * 3] = ex + (Math.random() - 0.5) * spread;
        pos[trailIdx * 3 + 1] = ey + (Math.random() - 0.5) * spread;
        pos[trailIdx * 3 + 2] = ez;
        trailAges[trailIdx] = 0;
        trailIdx = (trailIdx + 1) % TRAIL_COUNT;
      }
    }
  }

  // Size scales with speed
  trailParticles.material.size = 0.15 + speedPct * 0.35;

  for (var i = 0; i < TRAIL_COUNT; i++) {
    trailAges[i] += dt * 3;
    pos[i * 3 + 2] += dt * (2 + speedPct * 4);
    pos[i * 3 + 1] += (Math.random() - 0.5) * dt * 2;
    if (trailAges[i] > 1) {
      pos[i * 3 + 1] = -100;
    }
  }
  trailParticles.geometry.attributes.position.needsUpdate = true;
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
