// ---- SHADOW ----
var shadowQuads = [];
var SHADOW_RX = 0.5;
var SHADOW_RZ = 0.4;

function createShadow() {
  var c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  var ctx = c.getContext('2d');
  var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(0.5, 'rgba(0,0,0,0.35)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  var tex = new THREE.CanvasTexture(c);

  for (var i = 0; i < 4; i++) {
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(12);
    var uvs = new Float32Array(8);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.setIndex([0, 1, 2, 2, 3, 0]);
    var mat = new THREE.MeshBasicMaterial({
      map: tex, transparent: true, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    mesh.visible = false;
    mesh.renderOrder = 1;
    scene.add(mesh);
    shadowQuads.push(mesh);
  }
}

function updateShadow() {
  if (!alive || state === 'menu') {
    for (var h = 0; h < 4; h++) shadowQuads[h].visible = false;
    return;
  }

  var sMinX = playerX - SHADOW_RX;
  var sMaxX = playerX + SHADOW_RX;
  var sMinZ = playerZ - SHADOW_RZ;
  var sMaxZ = playerZ + SHADOW_RZ;

  var laneMin = xToLane(sMinX);
  var laneMax = xToLane(sMaxX);
  var rowFront = zToRow(sMinZ);
  var rowBack = zToRow(sMaxZ);

  var qi = 0;
  for (var lane = laneMin; lane <= laneMax && qi < 4; lane++) {
    if (lane < 0 || lane >= LANES) continue;
    for (var row = rowBack; row <= rowFront && qi < 4; row++) {
      var col = getColumn(row, lane);
      var groundY = null;
      for (var bi = 0; bi < col.length; bi++) {
        var top = blockTop(col[bi]);
        if (top <= playerY + 0.15) {
          if (groundY === null || top > groundY) groundY = top;
        }
      }
      if (groundY === null) continue;

      var tMinX = laneToX(lane) - LANE_WIDTH / 2;
      var tMaxX = laneToX(lane) + LANE_WIDTH / 2;
      var tMinZ = rowToZ(row) - BLOCK_SIZE / 2;
      var tMaxZ = rowToZ(row) + BLOCK_SIZE / 2;

      var cMinX = Math.max(sMinX, tMinX);
      var cMaxX = Math.min(sMaxX, tMaxX);
      var cMinZ = Math.max(sMinZ, tMinZ);
      var cMaxZ = Math.min(sMaxZ, tMaxZ);
      if (cMinX >= cMaxX || cMinZ >= cMaxZ) continue;

      var u0 = (cMinX - sMinX) / (sMaxX - sMinX);
      var u1 = (cMaxX - sMinX) / (sMaxX - sMinX);
      var v0 = (cMinZ - sMinZ) / (sMaxZ - sMinZ);
      var v1 = (cMaxZ - sMinZ) / (sMaxZ - sMinZ);

      var sy = groundY + 0.01;
      var p = shadowQuads[qi].geometry.attributes.position.array;
      p[0] = cMinX; p[1] = sy; p[2] = cMaxZ;
      p[3] = cMaxX; p[4] = sy; p[5] = cMaxZ;
      p[6] = cMaxX; p[7] = sy; p[8] = cMinZ;
      p[9] = cMinX; p[10] = sy; p[11] = cMinZ;
      shadowQuads[qi].geometry.attributes.position.needsUpdate = true;

      var uv = shadowQuads[qi].geometry.attributes.uv.array;
      uv[0] = u0; uv[1] = v1;
      uv[2] = u1; uv[3] = v1;
      uv[4] = u1; uv[5] = v0;
      uv[6] = u0; uv[7] = v0;
      shadowQuads[qi].geometry.attributes.uv.needsUpdate = true;

      // Fade with height above ground
      var height = playerY - groundY;
      var opacity = Math.max(0, 1 - height / 6);
      shadowQuads[qi].material.opacity = opacity;
      shadowQuads[qi].visible = opacity > 0.01;
      qi++;
    }
  }
  for (; qi < 4; qi++) shadowQuads[qi].visible = false;
}

// ---- SHIP DITHER ----
var shipDitherUniform = { value: 0 };

var SHIP_DITHER_FRAG =
  'uniform float shipDither;\n' +
  'float bayer2s(float x, float y) { return 2.0*x + 3.0*y - 4.0*x*y; }\n';

var SHIP_DITHER_DISCARD =
  'if (shipDither > 0.0) {\n' +
  '  vec2 p = mod(floor(gl_FragCoord.xy / 3.0), 4.0);\n' +
  '  float lx = mod(p.x, 2.0); float ly = mod(p.y, 2.0);\n' +
  '  float hx = floor(p.x / 2.0); float hy = floor(p.y / 2.0);\n' +
  '  float val = 4.0 * bayer2s(lx, ly) + bayer2s(hx, hy);\n' +
  '  float thr = (val + 0.5) / 16.0;\n' +
  '  if (shipDither > thr) discard;\n' +
  '}\n';

function injectShipDither(mat) {
  mat.onBeforeCompile = function(shader) {
    shader.uniforms.shipDither = shipDitherUniform;
    shader.fragmentShader = SHIP_DITHER_FRAG + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      SHIP_DITHER_DISCARD
    );
  };
}

// ---- SHIP MESH ----
function createShip() {
  shipMesh = new THREE.Group();
  var bodyMat = new THREE.MeshPhongMaterial({ color: 0x0099dd, emissive: 0x002244, shininess: 80, specular: 0x88bbff });
  var accentMat = new THREE.MeshPhongMaterial({ color: 0x006699, emissive: 0x001133, shininess: 60 });
  var glowMat = new THREE.MeshBasicMaterial({ color: 0x44ddff });
  var engineMat = new THREE.MeshBasicMaterial({ color: 0xff5500 });
  engineMatRef = engineMat;

  // Main fuselage — custom tapered shape
  // Cross-sections from nose (z=-2.2) to tail (z=1.0)
  // Each section: [z, halfWidth, topY, botY]
  var sections = [
    [-2.2, 0.00, 0.02, -0.02],  // nose tip
    [-1.6, 0.10, 0.10, -0.08],  // nose mid
    [-1.0, 0.22, 0.18, -0.12],  // nose base
    [-0.3, 0.28, 0.22, -0.14],  // cockpit area (widest top)
    [ 0.3, 0.26, 0.18, -0.14],  // mid body
    [ 0.55, 0.14, 0.10, -0.10], // rear (ends at engine front)
  ];
  var fuseVerts = [];
  var fuseIdx = [];
  // Build side panels between adjacent sections
  for (var si = 0; si < sections.length; si++) {
    var s = sections[si];
    // 4 verts per section: top-left, top-right, bot-right, bot-left
    fuseVerts.push(-s[1], s[2], s[0]); // TL
    fuseVerts.push( s[1], s[2], s[0]); // TR
    fuseVerts.push( s[1], s[3], s[0]); // BR
    fuseVerts.push(-s[1], s[3], s[0]); // BL
    if (si > 0) {
      var c = si * 4, p = (si - 1) * 4;
      // top face
      fuseIdx.push(p+0, p+1, c+1, c+1, c+0, p+0);
      // bottom face
      fuseIdx.push(p+3, c+3, c+2, c+2, p+2, p+3);
      // left face
      fuseIdx.push(p+0, c+0, c+3, c+3, p+3, p+0);
      // right face
      fuseIdx.push(p+1, p+2, c+2, c+2, c+1, p+1);
    }
  }
  // No tail cap — open for exhaust visibility
  var fuseGeo = new THREE.BufferGeometry();
  fuseGeo.setAttribute('position', new THREE.Float32BufferAttribute(fuseVerts, 3));
  fuseGeo.setIndex(fuseIdx);
  fuseGeo.computeVertexNormals();
  var fuselage = new THREE.Mesh(fuseGeo, bodyMat);
  shipMesh.add(fuselage);

  // Nose ridge — sharp spine along the top
  var ridgeVerts = new Float32Array([
    0.00, 0.20, -1.8,   // front tip (raised)
    -0.04, 0.18, -1.0,  // left base
     0.04, 0.18, -1.0,  // right base
    0.00, 0.24, -1.0,   // peak
  ]);
  var ridgeIdx = [0,1,3, 0,3,2, 0,2,1, 2,3,1]; // double-sided
  var ridgeGeo = new THREE.BufferGeometry();
  ridgeGeo.setAttribute('position', new THREE.BufferAttribute(ridgeVerts, 3));
  ridgeGeo.setIndex(ridgeIdx);
  ridgeGeo.computeVertexNormals();
  shipMesh.add(new THREE.Mesh(ridgeGeo, accentMat));

  // Intake scoops — small wedges on each side of the nose
  function makeIntake(side) {
    var s = side;
    var v = new Float32Array([
      s * 0.22, -0.06, -0.8,
      s * 0.22, -0.06, -0.4,
      s * 0.30,  0.02, -0.4,
      s * 0.30,  0.02, -0.6,
    ]);
    var idx = [0,1,2, 2,3,0, 2,1,0, 0,3,2];
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(v, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, accentMat);
  }
  shipMesh.add(makeIntake(-1));
  shipMesh.add(makeIntake(1));

  // Cockpit canopy — elongated dome
  var cockpitGeo = new THREE.SphereGeometry(0.16, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.5);
  cockpitGeo.scale(1.0, 1.0, 2.0);
  var cockpit = new THREE.Mesh(cockpitGeo, glowMat);
  cockpit.position.set(0, 0.18, -0.6);
  shipMesh.add(cockpit);

  // Wings — swept-back, tapered quads
  // Each wing: root (near body) is wide+forward, tip is narrow+back+up
  function makeWing(side) {
    var s = side; // -1 = left, 1 = right
    var verts = new Float32Array([
      // root leading edge
      s * 0.20, 0.00, -0.3,
      // root trailing edge
      s * 0.20, 0.00,  0.5,
      // tip trailing edge (swept back, up, thin)
      s * 1.30, 0.12,  0.7,
      // tip leading edge
      s * 1.30, 0.12,  0.3,
      // top surface offset (slight thickness)
      s * 0.20, 0.04, -0.3,
      s * 0.20, 0.04,  0.5,
      s * 1.30, 0.16,  0.7,
      s * 1.30, 0.16,  0.3,
    ]);
    var idx = [
      // bottom face
      0,1,2, 2,3,0,
      // top face
      4,7,6, 6,5,4,
      // front edge
      0,3,7, 7,4,0,
      // back edge
      1,5,6, 6,2,1,
      // tip
      3,2,6, 6,7,3,
    ];
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, accentMat);
  }
  shipMesh.add(makeWing(-1));
  shipMesh.add(makeWing(1));

  // Wing tip fins — angled upward at the tips
  function makeWingTip(side) {
    var s = side;
    var verts = new Float32Array([
      s * 1.28, 0.12, 0.3,
      s * 1.28, 0.12, 0.7,
      s * 1.35, 0.45, 0.6,
      s * 1.35, 0.45, 0.4,
    ]);
    var idx = [0,1,2, 2,3,0, 2,1,0, 0,3,2]; // double-sided
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, accentMat);
  }
  shipMesh.add(makeWingTip(-1));
  shipMesh.add(makeWingTip(1));

  // V-tail fins — angled outward
  function makeTailFin(side) {
    var s = side;
    var verts = new Float32Array([
      s * 0.08, 0.10, 0.6,   // root bottom
      s * 0.08, 0.10, 1.1,   // root top-back
      s * 0.30, 0.50, 1.0,   // tip top
      s * 0.30, 0.50, 0.7,   // tip front
    ]);
    var idx = [0,1,2, 2,3,0, 2,1,0, 0,3,2]; // double-sided
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, accentMat);
  }
  shipMesh.add(makeTailFin(-1));
  shipMesh.add(makeTailFin(1));

  // Single central engine nacelle (open-ended to show exhaust)
  var engGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.6, 10, 1, true);
  engGeo.rotateX(Math.PI / 2);
  var engine = new THREE.Mesh(engGeo, accentMat);
  engine.position.set(0, -0.02, 0.85);
  shipMesh.add(engine);

  // Engine exhaust — hollow black interior
  var exhaustMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
  var exhaustGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.6, 10, 1, true);
  exhaustGeo.rotateX(Math.PI / 2);
  var exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
  exhaust.position.set(0, -0.02, 0.85);
  shipMesh.add(exhaust);

  // Black disc inside exhaust to hide fuselage behind it
  var discMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  var discGeo = new THREE.CircleGeometry(0.14, 10);
  var disc = new THREE.Mesh(discGeo, discMat);
  disc.position.set(0, -0.02, 0.85);
  shipMesh.add(disc);
  engineMatRef = null;

  // Wing glow strips — along wing leading edges
  function makeGlowStrip(side) {
    var s = side;
    var verts = new Float32Array([
      s * 0.22, 0.02, -0.25,
      s * 1.20, 0.13, 0.35,
      s * 1.20, 0.15, 0.35,
      s * 0.22, 0.04, -0.25,
    ]);
    var idx = [0,1,2, 2,3,0, 2,1,0, 0,3,2];
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, glowMat);
  }
  shipMesh.add(makeGlowStrip(-1));
  shipMesh.add(makeGlowStrip(1));

  shipMesh.scale.set(0.7, 0.7, 0.35);
  // Tag meshes so we can find them for debris (skip non-Mesh children)
  // Inject dither into all ship materials
  var ditherInjected = [];
  shipMesh.traverse(function(c) {
    if (c.isMesh) {
      c.userData.shipPart = true;
      if (ditherInjected.indexOf(c.material) === -1) {
        injectShipDither(c.material);
        ditherInjected.push(c.material);
      }
    }
  });

  scene.add(shipMesh);

}

// ---- SHIP DEBRIS (explosion) ----
var debrisPool = [];  // pre-created clones, one per ship mesh part
var debrisSources = []; // original mesh references for world transforms
var shipDebris = [];

// Pre-create debris meshes (called once after createShip)
function initShipDebris() {
  debrisSources = [];
  shipMesh.traverse(function(c) { if (c.isMesh && c.userData.shipPart) debrisSources.push(c); });
  for (var i = 0; i < debrisSources.length; i++) {
    var clone = debrisSources[i].clone();
    clone.visible = false;
    scene.add(clone);
    debrisPool.push({ mesh: clone, vx: 0, vy: 0, vz: 0, sx: 0, sy: 0, sz: 0 });
  }
}

var _dPos = new THREE.Vector3();
var _dQuat = new THREE.Quaternion();
var _dScale = new THREE.Vector3();

function explodeShip() {
  clearShipDebris();
  shipMesh.visible = false;
  for (var i = 0; i < debrisPool.length; i++) {
    var d = debrisPool[i];
    var p = debrisSources[i];
    p.getWorldPosition(_dPos);
    p.getWorldQuaternion(_dQuat);
    p.getWorldScale(_dScale);
    d.mesh.position.copy(_dPos);
    d.mesh.quaternion.copy(_dQuat);
    d.mesh.scale.copy(_dScale);
    var bloomMag = Math.random() * 6 + 2;
    var spread1 = (Math.random() - 0.5) * 8;
    var spread2 = (Math.random() - 0.5) * 8;
    var bvx, bvy, bvz;
    if (Math.abs(deathBloomY) > 0.5) {
      bvx = spread1; bvy = bloomMag * deathBloomY; bvz = spread2;
    } else if (Math.abs(deathBloomX) > 0.5) {
      bvx = bloomMag * deathBloomX; bvy = spread1; bvz = spread2;
    } else {
      bvx = spread1; bvy = spread2; bvz = bloomMag * deathBloomZ;
    }
    d.vx = deathVX + bvx;
    d.vy = deathVY + bvy;
    d.vz = deathVZ + bvz;
    d.sx = (Math.random() - 0.5) * 12;
    d.sy = (Math.random() - 0.5) * 12;
    d.sz = (Math.random() - 0.5) * 12;
    d.mesh.visible = true;
    shipDebris.push(d);
  }
}

function updateShipDebris(dt) {
  for (var i = 0; i < shipDebris.length; i++) {
    var d = shipDebris[i];
    d.vy -= 15 * dt; // gravity
    d.mesh.position.x += d.vx * dt;
    d.mesh.position.y += d.vy * dt;
    d.mesh.position.z += d.vz * dt;
    d.mesh.rotation.x += d.sx * dt;
    d.mesh.rotation.y += d.sy * dt;
    d.mesh.rotation.z += d.sz * dt;
  }
}

function clearShipDebris() {
  for (var i = 0; i < shipDebris.length; i++) {
    shipDebris[i].mesh.visible = false;
  }
  shipDebris = [];
}
