// ---- BLOCK MATERIALS & GEOMETRY ----
var blockMaterials = {};
function getBlockMat(type) {
  if (!blockMaterials[type]) {
    var color = BLOCK_COLOR[type] || 0x888888;
    var c = new THREE.Color(color);
    var emissive = new THREE.Color(0x000000);
    var shininess = 5;
    if (type === BLOCK.KILL) { emissive.set(0x330000); shininess = 10; }
    else if (type === BLOCK.OXYGEN) { emissive.set(0x001133); shininess = 8; }
    else if (type === BLOCK.FUEL) { emissive.set(0x221100); shininess = 8; }
    else if (type === BLOCK.JUMP) { emissive.set(0x222200); shininess = 8; }
    else if (type === BLOCK.WIN_TUNNEL) { emissive.set(0x003311); shininess = 15; }
    else if (type === BLOCK.DRAIN_FUEL) { emissive.set(0x110800); }
    else if (type === BLOCK.DRAIN_OXY) { emissive.set(0x000811); }
    else { emissive.set(0x080808); }
    blockMaterials[type] = new THREE.MeshPhongMaterial({
      color: color,
      emissive: emissive,
      shininess: shininess,
      specular: 0x111111
    });
  }
  return blockMaterials[type];
}

var edgeMats = {};
function getEdgeMat(type) {
  if (!edgeMats[type]) {
    var base = BLOCK_COLOR[type] || 0x888888;
    var c = new THREE.Color(base);
    c.multiplyScalar(1.5); // brighter than face
    edgeMats[type] = new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.4 });
  }
  return edgeMats[type];
}

// ---- DITHER SHADER INJECTION ----
// 4x4 Bayer matrix computed mathematically, scaled up 3x for chunky pixels
var DITHER_FUNCS =
  'float bayer2(float x, float y) {\n' +
  '  return 2.0*x + 3.0*y - 4.0*x*y;\n' +
  '}\n' +
  'float bayerDither(vec2 coord) {\n' +
  '  vec2 p = mod(floor(coord / 3.0), 4.0);\n' +
  '  float lx = mod(p.x, 2.0);\n' +
  '  float ly = mod(p.y, 2.0);\n' +
  '  float hx = floor(p.x / 2.0);\n' +
  '  float hy = floor(p.y / 2.0);\n' +
  '  float val = 4.0 * bayer2(lx, ly) + bayer2(hx, hy);\n' +
  '  return (val + 0.5) / 16.0;\n' +
  '}\n';

var playerZUniform = { value: 0 };
var playerYUniform = { value: 0 };

var DITHER_DISCARD =
  'float dist = vWorldZ - playerZ;\n' +
  'float abovePlayer = max(0.0, vWorldY - playerY);\n' +
  // Behind fade: same height or below = 2 blocks back, above player = sooner
  'float behindStart = 2.0 - abovePlayer * 0.33;\n' +
  'float behindFade = clamp((dist - behindStart) / 1.0, 0.0, 1.0);\n' +
  // Angle fade: per-pixel, works ahead and behind (only for blocks above)
  'float horizDist = max(0.5, abs(dist));\n' +
  'float angle = atan(abovePlayer, horizDist);\n' +
  'float minDeg = max(10.0, 50.0 - 5.0 * horizDist);\n' +
  'float minAngle = minDeg * 3.14159 / 180.0;\n' +
  'float angleStr = clamp((angle - minAngle) / (1.5708 - minAngle), 0.0, 1.0);\n' +
  'float totalFade = (1.0 - behindFade) * (1.0 - angleStr);\n' +
  'if (totalFade < 1.0) {\n' +
  '  float threshold = bayerDither(gl_FragCoord.xy);\n' +
  '  if (totalFade < threshold) discard;\n' +
  '}\n';

function injectDither(mat, fadeUniform) {
  mat.onBeforeCompile = function(shader) {
    shader.uniforms.fadeAmount = fadeUniform;
    shader.uniforms.playerZ = playerZUniform;
    shader.uniforms.playerY = playerYUniform;
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      'varying float vWorldZ;\nvarying float vWorldY;\nvoid main() {'
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      '#include <project_vertex>\nvec4 wPos = modelMatrix * vec4(position, 1.0);\nvWorldZ = wPos.z;\nvWorldY = wPos.y;'
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      DITHER_FUNCS + 'uniform float fadeAmount;\nuniform float playerZ;\nuniform float playerY;\nvarying float vWorldZ;\nvarying float vWorldY;\nvoid main() {'
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      DITHER_DISCARD
    );
  };
}

function addEdges(mesh, type, fadeUniform) {
  var edges = new THREE.EdgesGeometry(mesh.geometry);
  var edgeMat = getEdgeMat(type).clone();
  if (fadeUniform) injectDither(edgeMat, fadeUniform);
  var line = new THREE.LineSegments(edges, edgeMat);
  mesh.add(line);
}

var blockGeo = (function() {
  var w = LANE_WIDTH, h = BLOCK_SIZE, d = BLOCK_SIZE;
  var b = 0.06; // bevel size
  var hw = w/2, hh = h/2, hd = d/2;
  var pos = [], norm = [], idx = [];
  var vi = 0;

  function _cross(a, b, c) {
    var bx=b[0]-a[0],by=b[1]-a[1],bz=b[2]-a[2];
    var cx=c[0]-a[0],cy=c[1]-a[1],cz=c[2]-a[2];
    return [by*cz-bz*cy, bz*cx-bx*cz, bx*cy-by*cx];
  }
  function quad(a, b, c, d, nx, ny, nz) {
    var cr = _cross(a, b, c);
    if (cr[0]*nx+cr[1]*ny+cr[2]*nz < 0) { var t=b; b=d; d=t; }
    pos.push(a[0],a[1],a[2], b[0],b[1],b[2], c[0],c[1],c[2], d[0],d[1],d[2]);
    for (var i = 0; i < 4; i++) norm.push(nx, ny, nz);
    idx.push(vi,vi+1,vi+2, vi,vi+2,vi+3);
    vi += 4;
  }
  function tri(a, b, c, nx, ny, nz) {
    var cr = _cross(a, b, c);
    if (cr[0]*nx+cr[1]*ny+cr[2]*nz < 0) { var t=b; b=c; c=t; }
    pos.push(a[0],a[1],a[2], b[0],b[1],b[2], c[0],c[1],c[2]);
    for (var i = 0; i < 3; i++) norm.push(nx, ny, nz);
    idx.push(vi,vi+1,vi+2);
    vi += 3;
  }

  // 6 main faces (inset by bevel)
  // +X
  quad([hw,-hh+b,-hd+b],[hw,-hh+b,hd-b],[hw,hh-b,hd-b],[hw,hh-b,-hd+b], 1,0,0);
  // -X
  quad([-hw,-hh+b,hd-b],[-hw,-hh+b,-hd+b],[-hw,hh-b,-hd+b],[-hw,hh-b,hd-b], -1,0,0);
  // +Y
  quad([-hw+b,hh,-hd+b],[hw-b,hh,-hd+b],[hw-b,hh,hd-b],[-hw+b,hh,hd-b], 0,1,0);
  // -Y
  quad([-hw+b,-hh,hd-b],[hw-b,-hh,hd-b],[hw-b,-hh,-hd+b],[-hw+b,-hh,-hd+b], 0,-1,0);
  // +Z
  quad([-hw+b,-hh+b,hd],[hw-b,-hh+b,hd],[hw-b,hh-b,hd],[-hw+b,hh-b,hd], 0,0,1);
  // -Z
  quad([hw-b,-hh+b,-hd],[-hw+b,-hh+b,-hd],[-hw+b,hh-b,-hd],[hw-b,hh-b,-hd], 0,0,-1);

  // 12 edge bevels
  var s = 0.7071; // 1/sqrt(2)
  // edges along Z (top/bottom/left/right)
  quad([hw,-hh+b,-hd+b],[hw,-hh+b,hd-b],[hw-b,-hh,hd-b],[hw-b,-hh,-hd+b], s,-s,0); // +X-Y
  quad([hw,hh-b,hd-b],[hw,hh-b,-hd+b],[hw-b,hh,-hd+b],[hw-b,hh,hd-b], s,s,0);     // +X+Y
  quad([-hw,-hh+b,hd-b],[-hw,-hh+b,-hd+b],[-hw+b,-hh,-hd+b],[-hw+b,-hh,hd-b], -s,-s,0); // -X-Y
  quad([-hw,hh-b,-hd+b],[-hw,hh-b,hd-b],[-hw+b,hh,hd-b],[-hw+b,hh,-hd+b], -s,s,0);     // -X+Y
  // edges along X (top/bottom/front/back)
  quad([-hw+b,hh-b,hd],[hw-b,hh-b,hd],[hw-b,hh,hd-b],[-hw+b,hh,hd-b], 0,s,s);     // +Y+Z
  quad([hw-b,-hh+b,hd],[-hw+b,-hh+b,hd],[-hw+b,-hh,hd-b],[hw-b,-hh,hd-b], 0,-s,s); // -Y+Z
  quad([hw-b,hh-b,-hd],[-hw+b,hh-b,-hd],[-hw+b,hh,-hd+b],[hw-b,hh,-hd+b], 0,s,-s); // +Y-Z
  quad([-hw+b,-hh+b,-hd],[hw-b,-hh+b,-hd],[hw-b,-hh,-hd+b],[-hw+b,-hh,-hd+b], 0,-s,-s); // -Y-Z
  // edges along Y (4 vertical edges)
  quad([hw,hh-b,hd-b],[hw,-hh+b,hd-b],[hw-b,-hh+b,hd],[hw-b,hh-b,hd], s,0,s);     // +X+Z
  quad([hw,-hh+b,-hd+b],[hw,hh-b,-hd+b],[hw-b,hh-b,-hd],[hw-b,-hh+b,-hd], s,0,-s); // +X-Z
  quad([-hw,hh-b,-hd+b],[-hw,-hh+b,-hd+b],[-hw+b,-hh+b,-hd],[-hw+b,hh-b,-hd], -s,0,-s); // -X-Z
  quad([-hw,-hh+b,hd-b],[-hw,hh-b,hd-b],[-hw+b,hh-b,hd],[-hw+b,-hh+b,hd], -s,0,s); // -X+Z

  // 8 corner bevels
  var cs = 0.5774; // 1/sqrt(3)
  tri([hw,hh-b,hd-b],[hw-b,hh,hd-b],[hw-b,hh-b,hd], cs,cs,cs);
  tri([hw,hh-b,-hd+b],[hw-b,hh-b,-hd],[hw-b,hh,-hd+b], cs,cs,-cs);
  tri([hw,-hh+b,hd-b],[hw-b,-hh+b,hd],[hw-b,-hh,hd-b], cs,-cs,cs);
  tri([hw,-hh+b,-hd+b],[hw-b,-hh,-hd+b],[hw-b,-hh+b,-hd], cs,-cs,-cs);
  tri([-hw,hh-b,-hd+b],[-hw+b,hh,-hd+b],[-hw+b,hh-b,-hd], -cs,cs,-cs);
  tri([-hw,hh-b,hd-b],[-hw+b,hh-b,hd],[-hw+b,hh,hd-b], -cs,cs,cs);
  tri([-hw,-hh+b,-hd+b],[-hw+b,-hh+b,-hd],[-hw+b,-hh,-hd+b], -cs,-cs,-cs);
  tri([-hw,-hh+b,hd-b],[-hw+b,-hh,hd-b],[-hw+b,-hh+b,hd], -cs,-cs,cs);

  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
  geo.setIndex(idx);
  return geo;
})();
var geoCache = {};

function blockExistsAt(level, rowIdx, lane, h) {
  var row = getRow(level, rowIdx);
  if (!row) return false;
  if (lane < 0 || lane >= LANES) return false;
  var col = row[lane] || [];
  for (var i = 0; i < col.length; i++) {
    if ((col[i].h || 0) === h) return true;
  }
  return false;
}

function getBlockGeoForMask(mask) {
  if (geoCache[mask]) return geoCache[mask];
  if (mask === 63) { geoCache[63] = blockGeo; return blockGeo; }
  var srcIndex = blockGeo.index.array;
  var indices = [];
  // First 36 indices = 6 face quads (6 indices each), cullable
  for (var f = 0; f < 6; f++) {
    if (mask & (1 << f)) {
      for (var j = 0; j < 6; j++) indices.push(srcIndex[f * 6 + j]);
    }
  }
  // 12 edge bevels (6 indices each, starting at 36): show if either adjacent face is visible
  // faces: 0=+X 1=-X 2=+Y 3=-Y 4=+Z 5=-Z
  var edgeFaces = [9,5,10,6, 20,24,36,40, 17,33,34,18];
  for (var e = 0; e < 12; e++) {
    if (mask & edgeFaces[e]) {
      var off = 36 + e * 6;
      for (var j = 0; j < 6; j++) indices.push(srcIndex[off + j]);
    }
  }
  // 8 corner bevels (3 indices each, starting at 108): show if any adjacent face is visible
  var cornerFaces = [21,37,25,41, 38,22,42,26];
  for (var c = 0; c < 8; c++) {
    if (mask & cornerFaces[c]) {
      var off2 = 108 + c * 3;
      for (var j2 = 0; j2 < 3; j2++) indices.push(srcIndex[off2 + j2]);
    }
  }
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', blockGeo.getAttribute('position'));
  geo.setAttribute('normal', blockGeo.getAttribute('normal'));
  geo.setIndex(indices);
  geoCache[mask] = geo;
  return geo;
}

// ---- ROW LOADING ----
function loadRow(level, rowIdx) {
  if (loadedRows[rowIdx]) return;
  var row = getRow(level, rowIdx);
  if (!row) return;

  var meshes = [];
  for (var lane = 0; lane < LANES; lane++) {
    var col = row[lane];
    if (!col || !col.length) continue;

    for (var bi = 0; bi < col.length; bi++) {
      var cell = col[bi];
      var h = cell.h || 0;
      // Face mask: only include exposed faces
      // Bits: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z(back), 5=-Z(front)
      var mask = 0;
      var pX = !blockExistsAt(level, rowIdx, lane + 1, h);
      var nX = !blockExistsAt(level, rowIdx, lane - 1, h);
      var pY = !blockExistsAt(level, rowIdx, lane, h + BLOCK_SIZE);
      var nY = !blockExistsAt(level, rowIdx, lane, h - BLOCK_SIZE);
      var pZ = !blockExistsAt(level, rowIdx - 1, lane, h);
      var nZ = !blockExistsAt(level, rowIdx + 1, lane, h);
      if (pX) mask |= 1;
      if (nX) mask |= 2;
      if (pY) mask |= 4;
      if (nY) mask |= 8;
      if (pZ) mask |= 16;
      // -Z (bit 5): faces away from camera (forward), never visible
      // -Y (bit 3): bottom face, camera at Y=5 so cull if block top < 5
      if (h < 5) mask &= ~8;
      // +X (bit 0): faces right, cull on blocks right of camera (X=0)
      var bx = laneToX(lane);
      if (bx > 0.5) mask &= ~1;
      // -X (bit 1): faces left, cull on blocks left of camera
      if (bx < -0.5) mask &= ~2;
      if (mask === 0) continue;

      var geo = getBlockGeoForMask(mask);
      var mat;
      var levelData = LEVELS[level];
      if (cell.type === BLOCK.NORMAL && levelData && levelData.gridColors) {
        var parity = (lane + rowIdx + Math.round(h / BLOCK_SIZE)) % 2;
        var gridColor = levelData.gridColors[parity];
        mat = getBlockMat(cell.type).clone();
        mat.color.set(gridColor);
      } else {
        mat = getBlockMat(cell.type).clone();
      }
      var fadeUniform = { value: 1.0 };
      injectDither(mat, fadeUniform);
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(laneToX(lane), (cell.h || 0) - BLOCK_SIZE * 0.5, rowToZ(rowIdx));
      mesh.userData = { type: cell.type, shape: cell.shape, lane: lane, row: rowIdx, fadeUniform: fadeUniform };
      scene.add(mesh);
      meshes.push(mesh);
    }
  }
  loadedRows[rowIdx] = meshes;
}

function unloadRow(rowIdx) {
  if (!loadedRows[rowIdx]) return;
  var meshes = loadedRows[rowIdx];
  for (var i = 0; i < meshes.length; i++) {
    scene.remove(meshes[i]);
  }
  delete loadedRows[rowIdx];
}

function clearAllRows() {
  for (var key in loadedRows) {
    unloadRow(parseInt(key));
  }
}

function updateChunks() {
  var currentRow = zToRow(playerZ);
  for (var r = currentRow - 2; r < currentRow + VIEW_DISTANCE; r++) {
    loadRow(currentLevel, r);
  }
  for (var key in loadedRows) {
    var ri = parseInt(key);
    if (ri < currentRow - 15) {
      unloadRow(ri);
    }
  }
  updateBlockFade();
}

function updateBlockFade() {
  playerZUniform.value = playerZ;
  playerYUniform.value = playerY;
  for (var key in loadedRows) {
    var meshes = loadedRows[key];
    for (var i = 0; i < meshes.length; i++) {
      var m = meshes[i];
      var dist = m.position.z - playerZ; // positive = behind player
      var abovePlayer = m.position.y - playerY;

      // Both fades are now per-pixel in shader; CPU just does visibility culling
      m.userData.fadeUniform.value = 1;

      var above = Math.max(0, abovePlayer);
      var behindStart = 2 - above * 0.33;
      var frontDist = (m.position.z - BLOCK_SIZE / 2) - playerZ;
      var behindMin = Math.min(1, Math.max(0, (frontDist - behindStart) / BLOCK_SIZE));
      // Rough angle check for culling
      var angleVis = 1;
      if (abovePlayer > 0) {
        var hd = Math.max(0.5, Math.abs(dist));
        var ang = Math.atan2(abovePlayer, hd);
        var minD = Math.max(10, 50 - 5 * hd);
        var minA = minD * Math.PI / 180;
        angleVis = 1 - Math.max(0, Math.min(1, (ang - minA) / (Math.PI / 2 - minA)));
      }
      m.visible = (1 - behindMin) * angleVis > 0.01;
    }
  }
}
