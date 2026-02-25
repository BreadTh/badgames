// ---- INIT 3D ----
function init3D() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011);
  scene.fog = new THREE.Fog(0x000011, VIEW_DISTANCE - FOG_START, VIEW_DISTANCE);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 800);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Lights
  var ambient = new THREE.AmbientLight(0x223344, 0.5);
  scene.add(ambient);
  var dirLight = new THREE.DirectionalLight(0xccddff, 1.0);
  dirLight.position.set(-8, 15, 10);
  scene.add(dirLight);
  headlight = new THREE.PointLight(0x88bbff, 0.15, 15);
  scene.add(headlight);
  underglow = new THREE.PointLight(0x0066ff, 0.1, 5);
  scene.add(underglow);
  accelFlameLight = new THREE.SpotLight(0xff6622, 0, 12, Math.PI * 0.4, 0.5);
  accelFlameLight.target = new THREE.Object3D();
  scene.add(accelFlameLight);
  scene.add(accelFlameLight.target);
  cruiseFlameLight = new THREE.SpotLight(0x4466cc, 0, 8, Math.PI * 0.35, 0.6);
  cruiseFlameLight.target = new THREE.Object3D();
  scene.add(cruiseFlameLight);
  scene.add(cruiseFlameLight.target);

  // Ship
  createShip();
  initShipDebris();
  createShadow();

  // Stars — cylindrical tunnel arrangement
  var STAR_COUNT = 2000;
  var STAR_DEPTH = 800;  // tunnel length along Z
  var STAR_RMIN = 70;   // inner radius
  var STAR_RMAX = 90;   // outer radius
  var STAR_FADE_START = 0.5; // taper fraction where stars become fully visible
  var STAR_DECEL = 0.99;    // scroll deceleration (0=uniform, 1=full stop at camera)
  var starGeo = new THREE.BufferGeometry();
  var starVerts = new Float32Array(STAR_COUNT * 3);
  var starColors = new Float32Array(STAR_COUNT * 3);
  var starAngles = new Float32Array(STAR_COUNT);
  var starRadii = new Float32Array(STAR_COUNT);
  var starFadeThresh = new Float32Array(STAR_COUNT);
  var zBack = STAR_DEPTH * 0.1;
  var zFront = -STAR_DEPTH * 0.8;
  var zRange = zBack - zFront;
  for (var i = 0; i < STAR_COUNT; i++) {
    starAngles[i] = Math.random() * Math.PI * 2;
    starRadii[i] = STAR_RMIN + Math.random() * (STAR_RMAX - STAR_RMIN);
    starFadeThresh[i] = Math.random() * STAR_FADE_START;
    var t0 = (1 - Math.pow(1 - STAR_DECEL, Math.random())) / STAR_DECEL;
    var sz = zFront + t0 * zRange;
    var taper = Math.max(0, (sz - zFront) / zRange);
    starVerts[i * 3] = Math.cos(starAngles[i]) * starRadii[i] * taper;
    starVerts[i * 3 + 1] = Math.sin(starAngles[i]) * starRadii[i] * taper;
    starVerts[i * 3 + 2] = sz;
    // Fade: invisible at far tip (taper=0), fully visible by STAR_FADE_START
    var fade = taper >= STAR_FADE_START ? 1.0 : taper <= starFadeThresh[i] ? 0.0 : (taper - starFadeThresh[i]) / (STAR_FADE_START - starFadeThresh[i]);
    starColors[i * 3] = fade; starColors[i * 3 + 1] = fade; starColors[i * 3 + 2] = fade;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starVerts, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  var starMat = new THREE.PointsMaterial({ size: 0.3, vertexColors: true, transparent: true, opacity: 0.6, fog: false });
  starField = new THREE.Points(starGeo, starMat);
  starField.renderOrder = -1;
  starField.userData.depth = STAR_DEPTH;
  starField.userData.rmin = STAR_RMIN;
  starField.userData.rmax = STAR_RMAX;
  starField.userData.fadeStart = STAR_FADE_START;
  starField.userData.decel = STAR_DECEL;
  starField.userData.angles = starAngles;
  starField.userData.radii = starRadii;
  starField.userData.fadeThresh = starFadeThresh;
  starField.userData.zBack = zBack;
  starField.userData.zFront = zFront;
  starField.userData.zRange = zRange;
  scene.add(starField);

  // Particles
  initExplosion();
  initEngineTrail();
  initSparks();
  initDust();

  // Pre-warm shaders: make hidden debris visible, render once (canvas is display:none),
  // then hide again. Avoids shader compilation lag on first explosion.
  var i;
  for (i = 0; i < debrisMeshes.length; i++) debrisMeshes[i].visible = true;
  for (i = 0; i < debrisPool.length; i++) debrisPool[i].mesh.visible = true;
  renderer.render(scene, camera);
  for (i = 0; i < debrisMeshes.length; i++) debrisMeshes[i].visible = false;
  for (i = 0; i < debrisPool.length; i++) debrisPool[i].mesh.visible = false;

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (hudCanvas) {
      hudCanvas.width = window.innerWidth;
      hudCanvas.height = window.innerHeight;
    }
  });
}

var lastStarZ = 0;
var winStarSpeed = 1;
function updateStars(dt) {
  if (!starField || !starField.visible) return;
  var pos = starField.geometry.attributes.position.array;
  var angles = starField.userData.angles;
  var radii = starField.userData.radii;
  var zBack = starField.userData.zBack;
  var zFront = starField.userData.zFront;
  var zRange = starField.userData.zRange;
  var rmin = starField.userData.rmin;
  var rmax = starField.userData.rmax;
  var fadeThresh = starField.userData.fadeThresh;
  var fadeStart = starField.userData.fadeStart;
  var decel = starField.userData.decel;
  var col = starField.geometry.attributes.color.array;
  // Scroll based on actual camera movement
  var dz = playerZ - lastStarZ;
  lastStarZ = playerZ;
  if (state === 'winning' || state === 'won') {
    if (shipDitherUniform.value >= 1) {
      winStarSpeed = Math.max(0, winStarSpeed - 8.0 * dt);
    } else {
      winStarSpeed += 16.0 * dt;
    }
  } else {
    winStarSpeed = 1;
  }
  var scroll = -dz * 0.0375 * winStarSpeed;
  var totalStars = pos.length / 3;
  for (var si = 0; si < totalStars; si++) {
    var i3 = si * 3;
    var t = Math.max(0, (pos[i3 + 2] - zFront) / zRange);
    pos[i3 + 2] += scroll * (1 - t * decel);
    // Wrap stars that pass behind camera back to far end
    if (pos[i3 + 2] > zBack) {
      angles[si] = Math.random() * Math.PI * 2;
      radii[si] = rmin + Math.random() * (rmax - rmin);
      fadeThresh[si] = Math.random() * fadeStart;
      pos[i3 + 2] = zFront + Math.random() * 10;
    }
    // Recompute XY from taper every frame — cone shape
    var taper = Math.max(0, (pos[i3 + 2] - zFront) / zRange);
    pos[i3] = Math.cos(angles[si]) * radii[si] * taper;
    pos[i3 + 1] = Math.sin(angles[si]) * radii[si] * taper;
    // Fade: invisible at far tip (taper=0), fully visible by fadeStart
    var fade = taper >= fadeStart ? 1.0 : taper <= fadeThresh[si] ? 0.0 : (taper - fadeThresh[si]) / (fadeStart - fadeThresh[si]);
    col[i3] = fade; col[i3 + 1] = fade; col[i3 + 2] = fade;
  }
  starField.geometry.attributes.position.needsUpdate = true;
  starField.geometry.attributes.color.needsUpdate = true;
}
