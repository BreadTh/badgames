// ---- SHIP MESH ----
function createShip() {
  shipMesh = new THREE.Group();
  var bodyMat = new THREE.MeshPhongMaterial({ color: 0x0099dd, emissive: 0x002244, shininess: 80, specular: 0x88bbff });
  var accentMat = new THREE.MeshPhongMaterial({ color: 0x006699, emissive: 0x001133, shininess: 60 });
  var glowMat = new THREE.MeshBasicMaterial({ color: 0x44ddff });
  var engineMat = new THREE.MeshBasicMaterial({ color: 0xff5500 });
  engineMatRef = engineMat;

  // Main body - tapered fuselage
  var bodyGeo = new THREE.BoxGeometry(0.5, 0.25, 2.0);
  var body = new THREE.Mesh(bodyGeo, bodyMat);
  shipMesh.add(body);

  // Nose - pointy cone
  var noseGeo = new THREE.ConeGeometry(0.25, 1.0, 6);
  noseGeo.rotateX(Math.PI / 2);
  var nose = new THREE.Mesh(noseGeo, bodyMat);
  nose.position.z = -1.4;
  shipMesh.add(nose);

  // Cockpit dome
  var cockpitGeo = new THREE.SphereGeometry(0.18, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.5);
  var cockpit = new THREE.Mesh(cockpitGeo, glowMat);
  cockpit.position.set(0, 0.15, -0.5);
  shipMesh.add(cockpit);

  // Main wings - swept back
  var wingGeo = new THREE.BoxGeometry(2.2, 0.04, 0.7);
  var wings = new THREE.Mesh(wingGeo, accentMat);
  wings.position.z = 0.3;
  shipMesh.add(wings);

  // Wing tips - angled up
  var tipGeo = new THREE.BoxGeometry(0.04, 0.3, 0.3);
  var tipL = new THREE.Mesh(tipGeo, accentMat);
  tipL.position.set(-1.1, 0.15, 0.3);
  shipMesh.add(tipL);
  var tipR = new THREE.Mesh(tipGeo, accentMat);
  tipR.position.set(1.1, 0.15, 0.3);
  shipMesh.add(tipR);

  // Tail fins
  var finGeo = new THREE.BoxGeometry(0.04, 0.4, 0.5);
  var finL = new THREE.Mesh(finGeo, accentMat);
  finL.position.set(-0.2, 0.2, 0.9);
  shipMesh.add(finL);
  var finR = new THREE.Mesh(finGeo, accentMat);
  finR.position.set(0.2, 0.2, 0.9);
  shipMesh.add(finR);

  // Engines - twin glowing orbs
  var engGeo = new THREE.SphereGeometry(0.12, 8, 8);
  var engL = new THREE.Mesh(engGeo, engineMat);
  engL.position.set(-0.2, -0.02, 1.0);
  shipMesh.add(engL);
  var engR = new THREE.Mesh(engGeo, engineMat);
  engR.position.set(0.2, -0.02, 1.0);
  shipMesh.add(engR);

  // Wing glow strips
  var stripGeo = new THREE.BoxGeometry(1.6, 0.02, 0.04);
  var stripL = new THREE.Mesh(stripGeo, glowMat);
  stripL.position.set(0, 0.04, 0.1);
  shipMesh.add(stripL);

  // Engine flame cones (visible when accelerating/cruising)
  var flameMat = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.8 });
  var flameGeo = new THREE.ConeGeometry(0.08, 0.6, 6);
  flameGeo.rotateX(-Math.PI / 2);
  var flameL = new THREE.Mesh(flameGeo, flameMat);
  flameL.position.set(-0.2, -0.02, 1.3);
  flameL.visible = false;
  shipMesh.add(flameL);
  var flameR = new THREE.Mesh(flameGeo, flameMat);
  flameR.position.set(0.2, -0.02, 1.3);
  flameR.visible = false;
  shipMesh.add(flameR);
  shipMesh._flameL = flameL;
  shipMesh._flameR = flameR;
  shipMesh._flameMat = flameMat;

  shipMesh.scale.set(0.7, 0.7, 0.35);

  scene.add(shipMesh);

  // Debug collider wireframe (drawn in world space, not parented to ship)
  var debugGeo = new THREE.BoxGeometry(PLAYER_W, PLAYER_H, PLAYER_D);
  var debugMat = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
  var debugEdges = new THREE.EdgesGeometry(debugGeo);
  debugCollider = new THREE.LineSegments(debugEdges, debugMat);
  debugCollider.visible = false;
  scene.add(debugCollider);

  // Debug row planes — up to 3 row markers showing which rows the cube overlaps
  debugRowPlanes = [];
  var rowPlaneMat = new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.4 });
  for (var rp = 0; rp < 3; rp++) {
    var rpGeo = new THREE.BufferGeometry();
    var hw2 = TRACK_WIDTH / 2;
    var verts = new Float32Array([
      -hw2, 0, 0,  hw2, 0, 0,  hw2, BLOCK_SIZE * 0.5, 0,  -hw2, BLOCK_SIZE * 0.5, 0,  -hw2, 0, 0
    ]);
    rpGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    var rpLine = new THREE.Line(rpGeo, rowPlaneMat);
    rpLine.visible = false;
    scene.add(rpLine);
    debugRowPlanes.push(rpLine);
  }
}
