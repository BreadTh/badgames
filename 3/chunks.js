// ---- BLOCK MATERIALS & GEOMETRY ----
var blockMaterials = {};
function getBlockMat(type) {
  if (!blockMaterials[type]) {
    var color = BLOCK_COLOR[type] || 0x888888;
    var c = new THREE.Color(color);
    var emissive = new THREE.Color(0x000000);
    var shininess = 30;
    if (type === BLOCK.KILL) { emissive.set(0x330000); shininess = 60; }
    else if (type === BLOCK.OXYGEN) { emissive.set(0x001133); shininess = 50; }
    else if (type === BLOCK.FUEL) { emissive.set(0x221100); shininess = 50; }
    else if (type === BLOCK.JUMP) { emissive.set(0x222200); shininess = 40; }
    else if (type === BLOCK.WIN_TUNNEL) { emissive.set(0x003311); shininess = 80; }
    else if (type === BLOCK.DRAIN_FUEL) { emissive.set(0x110800); }
    else if (type === BLOCK.DRAIN_OXY) { emissive.set(0x000811); }
    else { emissive.set(0x080808); }
    blockMaterials[type] = new THREE.MeshPhongMaterial({
      color: color,
      emissive: emissive,
      shininess: shininess,
      specular: 0x444444
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

var DITHER_DISCARD =
  'if (fadeAmount < 1.0) {\n' +
  '  float threshold = bayerDither(gl_FragCoord.xy);\n' +
  '  if (fadeAmount < threshold) discard;\n' +
  '}\n';

function injectDither(mat, fadeUniform) {
  mat.onBeforeCompile = function(shader) {
    shader.uniforms.fadeAmount = fadeUniform;
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      DITHER_FUNCS + 'uniform float fadeAmount;\nvoid main() {'
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

var blockGeo = new THREE.BoxGeometry(LANE_WIDTH, BLOCK_SIZE, BLOCK_SIZE);

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
      var mat = getBlockMat(cell.type).clone();
      var fadeUniform = { value: 1.0 };
      injectDither(mat, fadeUniform);
      var mesh = new THREE.Mesh(blockGeo, mat);
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

var FADE_BEHIND = 8;
var HEIGHT_ABOVE_FADE_FULL = 3;
function updateBlockFade() {
  for (var key in loadedRows) {
    var meshes = loadedRows[key];
    for (var i = 0; i < meshes.length; i++) {
      var m = meshes[i];
      var dist = m.position.z - playerZ; // positive = behind player
      var abovePlayer = m.position.y - playerY;
      // 0 when at/below player, ramps to 1 the higher above
      var heightStr = Math.max(0, Math.min(1, abovePlayer / HEIGHT_ABOVE_FADE_FULL));
      // 0 ahead of player, ramps to 1 far behind
      var behindStr = Math.max(0, Math.min(1, dist / FADE_BEHIND));
      // 0 at track edge, 1 at center
      var centerStr = 1 - Math.min(1, Math.abs(m.position.x) / (TRACK_WIDTH * 0.4));
      // 1 at/behind player, tapers to 0 far ahead
      var ahead = Math.max(0, playerZ - m.position.z);
      var nearStr = 1 - Math.min(1, ahead / 30);

      var fade = 1;
      // Behind-player Z fade — fully scaled by height (ground untouched)
      fade *= 1 - behindStr * behindStr * heightStr;
      // Center fade — only behind, scaled by height
      fade *= 1 - behindStr * centerStr * 0.7 * heightStr;
      // Height fade — strongest nearby, weakens far ahead
      fade *= 1 - heightStr * heightStr * nearStr * nearStr * nearStr;

      m.userData.fadeUniform.value = fade;
      m.visible = fade > 0.01;
    }
  }
}
