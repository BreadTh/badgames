// ---- PLANET ----
var planetMesh, cloudMesh;

function makePlanetTexture(size) {
  var c = document.createElement('canvas');
  c.width = size; c.height = size;
  var ctx = c.getContext('2d');

  // Deep ocean base
  ctx.fillStyle = '#0a1e3d';
  ctx.fillRect(0, 0, size, size);

  // Simple noise-ish land and water using overlapping circles
  function blob(x, y, r, color, alpha) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'transparent');
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Seed a simple RNG for consistent results
  var seed = 42;
  function rand() { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; }

  // Ocean variations
  for (var i = 0; i < 30; i++) {
    var hue = 200 + rand() * 40;
    var light = 15 + rand() * 20;
    blob(rand() * size, rand() * size, 40 + rand() * 120,
      'hsl(' + hue + ',60%,' + light + '%)', 0.3 + rand() * 0.3);
  }

  // Land masses — greens and tans
  for (var i = 0; i < 18; i++) {
    var lx = rand() * size, ly = rand() * size;
    var lr = 20 + rand() * 80;
    var green = rand() > 0.4;
    if (green) {
      blob(lx, ly, lr, 'hsl(' + (90 + rand() * 50) + ',40%,' + (15 + rand() * 20) + '%)', 0.5 + rand() * 0.4);
    } else {
      blob(lx, ly, lr, 'hsl(' + (30 + rand() * 20) + ',30%,' + (20 + rand() * 15) + '%)', 0.4 + rand() * 0.3);
    }
    // Mountain highlights
    if (rand() > 0.5) {
      blob(lx + rand() * 20 - 10, ly + rand() * 20 - 10, lr * 0.3,
        'hsl(40,20%,' + (35 + rand() * 15) + '%)', 0.3);
    }
  }

  // Shallow water / coastal teal
  for (var i = 0; i < 12; i++) {
    blob(rand() * size, rand() * size, 15 + rand() * 50,
      'hsl(' + (170 + rand() * 30) + ',50%,' + (20 + rand() * 15) + '%)', 0.25);
  }

  ctx.globalAlpha = 1;
  return new THREE.CanvasTexture(c);
}

function makeCloudTexture(size) {
  var c = document.createElement('canvas');
  c.width = size; c.height = size;
  var ctx = c.getContext('2d');

  var seed = 137;
  function rand() { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; }

  // Swirly cloud bands
  for (var i = 0; i < 40; i++) {
    var cx = rand() * size;
    var cy = rand() * size;
    var cr = 10 + rand() * 80;
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    g.addColorStop(0, 'rgba(255,255,255,' + (0.08 + rand() * 0.15) + ')');
    g.addColorStop(0.6, 'rgba(200,220,255,' + (0.03 + rand() * 0.06) + ')');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(cx - cr, cy - cr, cr * 2, cr * 2);
  }

  // Swirl streaks — elongated ellipses
  for (var i = 0; i < 15; i++) {
    ctx.save();
    ctx.translate(rand() * size, rand() * size);
    ctx.rotate(rand() * Math.PI);
    ctx.scale(2 + rand() * 3, 1);
    var sr = 10 + rand() * 30;
    var sg = ctx.createRadialGradient(0, 0, 0, 0, 0, sr);
    sg.addColorStop(0, 'rgba(230,240,255,' + (0.06 + rand() * 0.1) + ')');
    sg.addColorStop(1, 'transparent');
    ctx.fillStyle = sg;
    ctx.fillRect(-sr, -sr, sr * 2, sr * 2);
    ctx.restore();
  }

  return new THREE.CanvasTexture(c);
}

function createPlanet() {
  var radius = 300;
  var planetGeo = new THREE.SphereGeometry(radius, 64, 48);
  var planetTex = makePlanetTexture(1024);
  planetTex.wrapS = THREE.RepeatWrapping;
  planetTex.wrapT = THREE.RepeatWrapping;
  var planetMat = new THREE.MeshPhongMaterial({
    map: planetTex,
    emissive: 0x061222,
    emissiveIntensity: 0.4,
    shininess: 10,
    fog: false
  });
  planetMesh = new THREE.Mesh(planetGeo, planetMat);
  planetMesh.position.set(80, -310, 0);
  scene.add(planetMesh);

  // Cloud layer
  var cloudGeo = new THREE.SphereGeometry(radius + 1.5, 64, 48);
  var cloudTex = makeCloudTexture(1024);
  cloudTex.wrapS = THREE.RepeatWrapping;
  cloudTex.wrapT = THREE.RepeatWrapping;
  var cloudMat = new THREE.MeshPhongMaterial({
    map: cloudTex,
    transparent: true,
    opacity: 0.7,
    emissive: 0x223344,
    emissiveIntensity: 0.3,
    fog: false,
    depthWrite: false
  });
  cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
  planetMesh.add(cloudMesh); // child of planet, moves with it

  // Atmosphere rim glow
  var atmosGeo = new THREE.SphereGeometry(radius + 4, 64, 48);
  var atmosMat = new THREE.MeshBasicMaterial({
    color: 0x4488cc,
    transparent: true,
    opacity: 0.08,
    fog: false,
    side: THREE.BackSide,
    depthWrite: false
  });
  var atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
  planetMesh.add(atmosMesh); // child of planet
}

// ---- INIT 3D ----
function init3D() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011);
  scene.fog = new THREE.Fog(0x000011, 30, 80);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 800);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Lights
  var ambient = new THREE.AmbientLight(0x223344, 0.5);
  scene.add(ambient);
  var dirLight = new THREE.DirectionalLight(0xccddff, 0.7);
  dirLight.position.set(5, 15, 5);
  scene.add(dirLight);
  headlight = new THREE.PointLight(0x88bbff, 0.8, 25);
  scene.add(headlight);
  underglow = new THREE.PointLight(0x0066ff, 0.3, 8);
  scene.add(underglow);

  // Ship
  createShip();

  // Stars
  var starGeo = new THREE.BufferGeometry();
  var starVerts = [];
  for (var i = 0; i < 2000; i++) {
    starVerts.push(
      (Math.random() - 0.5) * 200,
      Math.random() * 80 + 5,
      (Math.random() - 0.5) * 200
    );
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
  var starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.3 });
  starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // Planet
  createPlanet();

  // Particles
  initSpeedLines();
  initEngineTrail();
  initSparks();
  initDust();

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
