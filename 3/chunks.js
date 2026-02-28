// ---- BLOCK COLOR LOOKUP TABLES ----
var blockColorLUT = {};   // type -> {r, g, b}
var blockEmissiveLUT = {}; // type -> {r, g, b}
var gridColor0 = null;    // THREE.Color for NORMAL parity 0
var gridColor1 = null;    // THREE.Color for NORMAL parity 1

function initColorLUTs(level) {
  var tmp = new THREE.Color();
  // Build color LUT from BLOCK_COLOR
  for (var key in BLOCK) {
    var type = BLOCK[key];
    if (type === BLOCK.EMPTY) continue;
    tmp.set(BLOCK_COLOR[type] || 0x888888);
    blockColorLUT[type] = { r: tmp.r, g: tmp.g, b: tmp.b };
  }
  // Build emissive LUT
  var emMap = {};
  emMap[BLOCK.KILL] = 0x330000;
  emMap[BLOCK.OXYGEN] = 0x001133;
  emMap[BLOCK.FUEL] = 0x221100;
  emMap[BLOCK.JUMP] = 0x222200;
  emMap[BLOCK.WIN_TUNNEL] = 0x003311;
  emMap[BLOCK.DRAIN_FUEL] = 0x110800;
  emMap[BLOCK.DRAIN_OXY] = 0x000811;
  for (var key2 in BLOCK) {
    var type2 = BLOCK[key2];
    if (type2 === BLOCK.EMPTY) continue;
    tmp.set(emMap[type2] || 0x080808);
    blockEmissiveLUT[type2] = { r: tmp.r, g: tmp.g, b: tmp.b };
  }
  // Grid colors for NORMAL parity
  var levelData = LEVELS[level];
  gridColor0 = new THREE.Color(levelData && levelData.gridColors ? levelData.gridColors[0] : 0x888888);
  gridColor1 = new THREE.Color(levelData && levelData.gridColors ? levelData.gridColors[1] : 0x888888);
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
var playerXUniform = { value: 0 };
var deathDitherUniform = { value: 0 };

var DITHER_DISCARD =
  'float dist = vWorldZ - playerZ;\n' +
  'float abovePlayer = max(0.0, vWorldY - playerY);\n' +
  // Behind fade: same height or below = 2 blocks back, above player = sooner
  'float behindStart = max(0.0, 2.0 - abovePlayer * 1.5);\n' +
  'float behindFade = clamp((dist - behindStart) / 1.0, 0.0, 1.0);\n' +
  // Angle fade: per-pixel, works ahead and behind (only for blocks above)
  'float angleStr = 0.0;\n' +
  'float aheadDist = playerZ - vWorldZ;\n' +
  'if (aheadDist < ' + DITHER_MAX_AHEAD.toFixed(1) + ') {\n' +
  '  float horizDist = max(0.5, abs(dist));\n' +
  '  float angle = atan(abovePlayer, horizDist);\n' +
  '  float minDeg = max(10.0, 50.0 - 5.0 * horizDist);\n' +
  '  float minAngle = minDeg * 3.14159 / 180.0;\n' +
  '  angleStr = clamp((angle - minAngle) / (1.5708 - minAngle), 0.0, 1.0);\n' +
  // Dither more at horizontal center, less at edges (halfway = unchanged)
  '  float xFrac = clamp(abs(vWorldX) / 10.0, 0.0, 1.0);\n' +
  '  angleStr = clamp(angleStr * mix(1.5, 0.5, xFrac), 0.0, 1.0);\n' +
  // Extra dither near player X, only where angle dither is already active
  '  if (angleStr > 0.0) {\n' +
  '    float pxDist = abs(vWorldX - playerX);\n' +
  '    float nearPx = 1.0 - clamp(pxDist / 5.0, 0.0, 1.0);\n' +
  '    angleStr = clamp(angleStr + nearPx * 0.3, 0.0, 1.0);\n' +
  '  }\n' +
  '}\n' +
  'float totalFade = (1.0 - behindFade) * (1.0 - angleStr);\n' +
  'if (totalFade < 1.0) {\n' +
  '  float threshold = bayerDither(gl_FragCoord.xy);\n' +
  '  if (totalFade < threshold) discard;\n' +
  '}\n' +
  'if (deathDither > 0.0) {\n' +
  '  float ahead = playerZ - vWorldZ;\n' +
  '  float diag = ' + DEATH_DITHER_X.toFixed(2) + ' * vWorldX + ' + DEATH_DITHER_Z.toFixed(2) + ' * ahead;\n' +
  '  float dMin = min(' + DEATH_DITHER_X.toFixed(2) + ', 0.0) * 20.0 + min(' + DEATH_DITHER_Z.toFixed(2) + ', 0.0) * 160.0;\n' +
  '  float dMax = max(' + DEATH_DITHER_X.toFixed(2) + ', 0.0) * 20.0 + max(' + DEATH_DITHER_Z.toFixed(2) + ', 0.0) * 160.0;\n' +
  '  float nd = (diag - dMin) / max(dMax - dMin, 1.0);\n' +
  '  float edge = deathDither * 1.3;\n' +
  '  float fade = clamp((edge - nd) / 0.15, 0.0, 1.0);\n' +
  '  if (fade > 0.0) {\n' +
  '    float thr = bayerDither(gl_FragCoord.xy);\n' +
  '    if (fade > thr) discard;\n' +
  '  }\n' +
  '}\n';

function injectDither(mat, fadeUniform, curveUni, useVertexEmissive) {
  mat.onBeforeCompile = function(shader) {
    shader.uniforms.fadeAmount = fadeUniform;
    shader.uniforms.playerZ = playerZUniform;
    shader.uniforms.playerY = playerYUniform;
    shader.uniforms.playerX = playerXUniform;
    shader.uniforms.deathDither = deathDitherUniform;

    var vertDecls = 'varying float vWorldZ;\nvarying float vWorldY;\nvarying float vWorldX;\n';
    var vertMain = '';

    if (useVertexEmissive) {
      vertDecls += 'attribute vec3 aEmissive;\nvarying vec3 vBlockEmissive;\n';
      vertMain = 'vBlockEmissive = aEmissive;\n';
    }

    if (curveUni) {
      // Merged path: positions are world-space, apply curve in vertex shader
      shader.uniforms.pathCurve = curveUni;
      vertDecls += 'uniform float playerZ;\nuniform float pathCurve;\n';
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        vertDecls + 'void main() {'
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        vertMain +
        'float aheadDist = max(0.0, (playerZ + 10.0) - position.z);\n' +
        'float curveDist = max(0.0, aheadDist - ' + curveStart.toFixed(1) + ');\n' +
        'float cd2 = curveDist * curveDist;\n' +
        'transformed.y += pathCurve * cd2 * cd2;\n' +
        'vWorldZ = position.z;\n' +
        'vWorldY = transformed.y;\n' +
        'vWorldX = position.x;\n' +
        '#include <project_vertex>'
      );
    } else {
      // Per-mesh path: curve applied via mesh.position.y on CPU
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        vertDecls + 'void main() {'
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        '#include <project_vertex>\nvec4 wPos = modelMatrix * vec4(position, 1.0);\nvWorldZ = wPos.z;\nvWorldY = wPos.y;\nvWorldX = wPos.x;'
      );
    }

    var fragDecls = DITHER_FUNCS + 'uniform float fadeAmount;\nuniform float playerZ;\nuniform float playerY;\nuniform float playerX;\nuniform float deathDither;\nvarying float vWorldZ;\nvarying float vWorldY;\nvarying float vWorldX;\n';
    if (useVertexEmissive) {
      fragDecls += 'varying vec3 vBlockEmissive;\n';
    }
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      fragDecls + 'void main() {'
    );
    if (useVertexEmissive) {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        'totalEmissiveRadiance = vBlockEmissive;'
      );
    }
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      DITHER_DISCARD
    );
  };
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
// ---- REMAPPED GEOMETRY FOR MERGED RENDERING ----
var remappedGeoCache = {};
function getRemappedGeo(mask) {
  if (remappedGeoCache[mask]) return remappedGeoCache[mask];

  var srcPos = blockGeo.getAttribute('position').array;
  var srcNorm = blockGeo.getAttribute('normal').array;
  var srcIndex = blockGeo.index.array;

  // Collect indices for this mask (same logic as getBlockGeoForMask)
  var indices = [];
  for (var f = 0; f < 6; f++) {
    if (mask & (1 << f)) {
      for (var j = 0; j < 6; j++) indices.push(srcIndex[f * 6 + j]);
    }
  }
  var edgeFaces = [9,5,10,6, 20,24,36,40, 17,33,34,18];
  for (var e = 0; e < 12; e++) {
    if (mask & edgeFaces[e]) {
      var off = 36 + e * 6;
      for (var j = 0; j < 6; j++) indices.push(srcIndex[off + j]);
    }
  }
  var cornerFaces = [21,37,25,41, 38,22,42,26];
  for (var c = 0; c < 8; c++) {
    if (mask & cornerFaces[c]) {
      var off2 = 108 + c * 3;
      for (var j2 = 0; j2 < 3; j2++) indices.push(srcIndex[off2 + j2]);
    }
  }

  // Find unique vertices and build remap table
  var vertexMap = {};
  var uniqueVerts = [];
  for (var i = 0; i < indices.length; i++) {
    if (vertexMap[indices[i]] === undefined) {
      vertexMap[indices[i]] = uniqueVerts.length;
      uniqueVerts.push(indices[i]);
    }
  }

  // Build compact position/normal arrays
  var vertCount = uniqueVerts.length;
  var positions = new Float32Array(vertCount * 3);
  var normals = new Float32Array(vertCount * 3);
  for (var i = 0; i < vertCount; i++) {
    var src = uniqueVerts[i] * 3;
    var dst = i * 3;
    positions[dst] = srcPos[src];
    positions[dst + 1] = srcPos[src + 1];
    positions[dst + 2] = srcPos[src + 2];
    normals[dst] = srcNorm[src];
    normals[dst + 1] = srcNorm[src + 1];
    normals[dst + 2] = srcNorm[src + 2];
  }

  // Remap indices to compact vertex space
  var remappedIndices = new Uint16Array(indices.length);
  for (var i = 0; i < indices.length; i++) {
    remappedIndices[i] = vertexMap[indices[i]];
  }

  var result = {
    positions: positions,
    normals: normals,
    indices: remappedIndices,
    vertCount: vertCount,
    indexCount: indices.length
  };
  remappedGeoCache[mask] = result;
  return result;
}

// ---- MERGED MATERIAL & MESH ----
function countMaxBlocks(level) {
  var rows = LEVELS[level].rows;
  var windowSize = VIEW_DISTANCE + 17;
  var maxSum = 0;
  // Count blocks per row (all types, all heights)
  var rowCounts = new Array(rows.length);
  for (var r = 0; r < rows.length; r++) {
    var count = 0;
    var row = rows[r];
    if (row) {
      for (var lane = 0; lane < row.length; lane++) {
        if (row[lane]) count += row[lane].length;
      }
    }
    rowCounts[r] = count;
  }
  // Sliding window
  var windowSum = 0;
  for (var r = 0; r < rows.length; r++) {
    windowSum += rowCounts[r];
    if (r >= windowSize) windowSum -= rowCounts[r - windowSize];
    if (windowSum > maxSum) maxSum = windowSum;
  }
  return maxSum;
}

// ---- INCREMENTAL BUFFER TRACKING ----
var bufTailV = 0;       // next vertex write position
var bufTailI = 0;       // next index write position
var bufHeadI = 0;       // first valid index (for drawRange)
var bufHeadV = 0;       // first valid vertex (for compaction safety)
var rowBufInfo = {};    // rowIdx -> {vStart, vCount, iStart, iCount}
var needsCompact = false;
var bufDirtyV3 = -1;    // start of dirty vertex range (float offset)
var bufDirtyV3End = 0;  // end of dirty vertex range
var bufDirtyI = -1;     // start of dirty index range
var bufDirtyIEnd = 0;   // end of dirty index range
var bufDrawChanged = false;

function initMergedChunks(level) {
  disposeMergedChunks();
  loadedRowData = {};
  bufTailV = 0; bufTailI = 0; bufHeadI = 0; bufHeadV = 0;
  rowBufInfo = {};
  needsCompact = false;
  compacting = false;
  compactKeys = null; compactCursor = 0;
  compactV = 0; compactI = 0; compactInfo = {};
  bufDirtyV3 = -1; bufDirtyV3End = 0;
  bufDirtyI = -1; bufDirtyIEnd = 0;
  bufDrawChanged = false;

  initColorLUTs(level);

  // Single material with per-vertex color + emissive
  var mat = new THREE.MeshPhongMaterial({
    vertexColors: true,
    color: 0xffffff,
    emissive: 0x000000,
    shininess: 8,
    specular: 0x111111
  });
  injectDither(mat, { value: 1.0 }, pathCurveUniform, true);
  mergedMaterial = mat;

  // Buffer sized 2x max visible — room for dead-space before compaction
  var maxBlocks = countMaxBlocks(level) * 2;
  var maxVerts = maxBlocks * 96;
  var maxIndices = maxBlocks * 132;

  var posArr = new Float32Array(maxVerts * 3);
  var normArr = new Float32Array(maxVerts * 3);
  var colArr = new Float32Array(maxVerts * 3);
  var emArr = new Float32Array(maxVerts * 3);
  var idxArr = new Uint32Array(maxIndices);

  var geo = new THREE.BufferGeometry();
  var posAttr = new THREE.BufferAttribute(posArr, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', posAttr);
  var normAttr = new THREE.BufferAttribute(normArr, 3);
  normAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('normal', normAttr);
  var colAttr = new THREE.BufferAttribute(colArr, 3);
  colAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('color', colAttr);
  var emAttr = new THREE.BufferAttribute(emArr, 3);
  emAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('aEmissive', emAttr);
  var idxAttr = new THREE.BufferAttribute(idxArr, 1);
  idxAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setIndex(idxAttr);
  geo.setDrawRange(0, 0);

  mergedMesh = new THREE.Mesh(geo, mat);
  mergedMesh.frustumCulled = false;
  scene.add(mergedMesh);
}

function disposeMergedChunks() {
  if (mergedMesh) {
    scene.remove(mergedMesh);
    mergedMesh.geometry.dispose();
    mergedMesh = null;
  }
  if (mergedMaterial) {
    mergedMaterial.dispose();
    mergedMaterial = null;
  }
}

// ---- ROW LOADING ----
function computeRowBlocks(level, rowIdx) {
  var row = getRow(level, rowIdx);
  if (!row) return null;

  // Build height lookup for current row: curH[lane] = {h: true, ...}
  var curH = new Array(LANES);
  for (var li = 0; li < LANES; li++) {
    var c = row[li];
    if (c && c.length) {
      var m = {};
      for (var ci = 0; ci < c.length; ci++) m[c[ci].h || 0] = true;
      curH[li] = m;
    }
  }
  // Build height lookup for previous row (rowIdx-1) for back-face check
  var prevRow = getRow(level, rowIdx - 1);
  var prevH = null;
  if (prevRow) {
    prevH = new Array(LANES);
    for (var li2 = 0; li2 < LANES; li2++) {
      var c2 = prevRow[li2];
      if (c2 && c2.length) {
        var m2 = {};
        for (var ci2 = 0; ci2 < c2.length; ci2++) m2[c2[ci2].h || 0] = true;
        prevH[li2] = m2;
      }
    }
  }

  var blocks = [];
  for (var lane = 0; lane < LANES; lane++) {
    var col = row[lane];
    if (!col || !col.length) continue;

    for (var bi = 0; bi < col.length; bi++) {
      var cell = col[bi];
      var h = cell.h || 0;
      var ch = curH[lane];
      // Face mask: only include exposed faces
      // Bits: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z(back), 5=-Z(front)
      var mask = 0;
      if (!(curH[lane + 1] && curH[lane + 1][h])) mask |= 1;
      if (lane === 0 || !(curH[lane - 1] && curH[lane - 1][h])) mask |= 2;
      if (!ch[h + BLOCK_SIZE]) mask |= 4;
      if (!ch[h - BLOCK_SIZE]) mask |= 8;
      if (!(prevH && prevH[lane] && prevH[lane][h])) mask |= 16;
      // -Z (bit 5): faces away from camera (forward), never visible
      // -Y (bit 3): bottom face, camera at Y=5 so cull if block top < 5
      if (h < 5) mask &= ~8;
      // +X (bit 0): faces right, cull on blocks right of camera (X=0)
      var bx = laneToX(lane);
      if (bx > 0.5) mask &= ~1;
      // -X (bit 1): faces left, cull on blocks left of camera
      if (bx < -0.5) mask &= ~2;
      if (mask === 0) continue;

      // Resolve color: NORMAL uses grid parity colors, others use type LUT
      var cr, cg, cb;
      if (cell.type === BLOCK.NORMAL) {
        var parity = (lane + rowIdx + Math.round(h / BLOCK_SIZE)) % 2;
        var gc = parity === 0 ? gridColor0 : gridColor1;
        cr = gc.r; cg = gc.g; cb = gc.b;
      } else {
        var clut = blockColorLUT[cell.type];
        cr = clut.r; cg = clut.g; cb = clut.b;
      }
      var elut = blockEmissiveLUT[cell.type];

      blocks.push({
        lane: lane,
        h: h,
        type: cell.type,
        mask: mask,
        x: laneToX(lane),
        y: h - BLOCK_SIZE * 0.5,
        z: rowToZ(rowIdx),
        cr: cr, cg: cg, cb: cb,
        er: elut.r, eg: elut.g, eb: elut.b
      });
    }
  }
  return blocks;
}

// Write blocks into buffer at given cursor position
// Returns {vEnd, iEnd} or null on overflow
function writeBlocksAt(blocks, vStart, iStart, maxV, maxI) {
  if (!mergedMesh) return null;
  var geo = mergedMesh.geometry;
  var posArr = geo.getAttribute('position').array;
  var normArr = geo.getAttribute('normal').array;
  var colArr = geo.getAttribute('color').array;
  var emArr = geo.getAttribute('aEmissive').array;
  var idxArr = geo.index.array;

  var vCur = vStart, iCur = iStart;

  for (var j = 0; j < blocks.length; j++) {
    var b = blocks[j];
    var remapped = getRemappedGeo(b.mask);
    var vc = remapped.vertCount;

    if (vCur + vc > maxV || iCur + remapped.indexCount > maxI) return null;

    var baseV3 = vCur * 3;
    for (var v = 0; v < vc; v++) {
      var sv = v * 3;
      var dv = baseV3 + sv;
      posArr[dv] = remapped.positions[sv] + b.x;
      posArr[dv + 1] = remapped.positions[sv + 1] + b.y;
      posArr[dv + 2] = remapped.positions[sv + 2] + b.z;
      colArr[dv] = b.cr;
      colArr[dv + 1] = b.cg;
      colArr[dv + 2] = b.cb;
      emArr[dv] = b.er;
      emArr[dv + 1] = b.eg;
      emArr[dv + 2] = b.eb;
    }
    normArr.set(remapped.normals, baseV3);

    for (var k = 0; k < remapped.indexCount; k++) {
      idxArr[iCur + k] = remapped.indices[k] + vCur;
    }

    vCur += vc;
    iCur += remapped.indexCount;
  }

  return { vEnd: vCur, iEnd: iCur };
}

function loadRow(level, rowIdx) {
  if (loadedRowData[rowIdx]) return;
  var blocks = computeRowBlocks(level, rowIdx);
  if (!blocks || !blocks.length) return;
  loadedRowData[rowIdx] = blocks;

  // During gradual compaction, new rows queue up — they'll be picked up
  // when compaction finishes or in the pending-rows pass
  if (compacting) { bufDrawChanged = true; return; }

  if (!needsCompact) {
    var maxV = mergedMesh ? mergedMesh.geometry.getAttribute('position').array.length / 3 : 0;
    var maxI = mergedMesh ? mergedMesh.geometry.index.array.length : 0;
    var vBefore = bufTailV * 3;
    var iBefore = bufTailI;
    var vBeforeV = bufTailV;
    var result = writeBlocksAt(blocks, bufTailV, bufTailI, maxV, maxI);
    if (result) {
      rowBufInfo[rowIdx] = { vStart: vBeforeV, vCount: result.vEnd - vBeforeV, iStart: iBefore, iCount: result.iEnd - iBefore };
      bufTailV = result.vEnd;
      bufTailI = result.iEnd;
      // Track dirty range for partial GPU upload
      if (bufDirtyV3 < 0) bufDirtyV3 = vBefore;
      bufDirtyV3End = bufTailV * 3;
      if (bufDirtyI < 0) bufDirtyI = iBefore;
      bufDirtyIEnd = bufTailI;
    } else {
      needsCompact = true;
    }
  }
  bufDrawChanged = true;
}

function unloadRow(rowIdx) {
  if (!loadedRowData[rowIdx]) return;
  delete loadedRowData[rowIdx];
  var info = rowBufInfo[rowIdx];
  if (info) {
    if (info.iStart === bufHeadI) {
      bufHeadV = info.vStart + info.vCount;
      bufHeadI = info.iStart + info.iCount;
    } else if (!compacting) {
      needsCompact = true;
    }
    delete rowBufInfo[rowIdx];
  }
  bufDrawChanged = true;
}

function clearAllRows() {
  loadedRowData = {};
  rowBufInfo = {};
  loadedRowMin = 0;
  bufTailV = 0; bufTailI = 0; bufHeadI = 0; bufHeadV = 0;
  needsCompact = false;
  compacting = false;
  compactKeys = null; compactCursor = 0;
  compactV = 0; compactI = 0; compactInfo = {};
  bufDirtyV3 = -1; bufDirtyV3End = 0;
  bufDirtyI = -1; bufDirtyIEnd = 0;
  bufDrawChanged = true;
}

// ---- GRADUAL COMPACTION ----
// Writes compacted data into the dead region [0..bufHeadI) over multiple
// frames, then atomically swaps the draw range. During compaction, the old
// live region continues to render undisturbed.
var compacting = false;
var compactKeys = null;   // snapshot of row keys to compact
var compactCursor = 0;    // index into compactKeys
var compactV = 0;         // vertex write cursor in compacted region
var compactI = 0;         // index write cursor in compacted region
var compactInfo = {};     // new rowBufInfo being built
var COMPACT_ROWS_PER_FRAME = 25;

function startCompaction() {
  compacting = true;
  compactKeys = [];
  for (var key in loadedRowData) compactKeys.push(key);
  compactCursor = 0;
  compactV = 0;
  compactI = 0;
  compactInfo = {};
  needsCompact = false;
}

// Returns true when compaction is finished
function stepCompaction() {
  if (!mergedMesh) return true;
  // Write into dead region [0..bufHeadV) / [0..bufHeadI) — safe, not rendered
  var limitV = bufHeadV;
  var limitI = bufHeadI;
  var end = Math.min(compactCursor + COMPACT_ROWS_PER_FRAME, compactKeys.length);

  for (var i = compactCursor; i < end; i++) {
    var rowIdx = parseInt(compactKeys[i]);
    var blocks = loadedRowData[rowIdx];
    if (!blocks) continue; // row was unloaded during compaction
    var result = writeBlocksAt(blocks, compactV, compactI, limitV, limitI);
    if (result) {
      compactInfo[rowIdx] = { vStart: compactV, vCount: result.vEnd - compactV, iStart: compactI, iCount: result.iEnd - compactI };
      compactV = result.vEnd;
      compactI = result.iEnd;
    }
  }
  compactCursor = end;

  // Upload the chunk we just wrote
  var geo = mergedMesh.geometry;
  geo.getAttribute('position').needsUpdate = true;
  geo.getAttribute('normal').needsUpdate = true;
  geo.getAttribute('color').needsUpdate = true;
  geo.getAttribute('aEmissive').needsUpdate = true;
  geo.index.needsUpdate = true;

  if (compactCursor < compactKeys.length) return false; // more to do

  // Compaction complete — pick up any rows loaded during compaction
  // These can write past the old head since we're about to swap
  var fullV = mergedMesh.geometry.getAttribute('position').array.length / 3;
  var fullI = mergedMesh.geometry.index.array.length;
  for (var key in loadedRowData) {
    if (compactInfo[key] !== undefined) continue;
    var blocks = loadedRowData[key];
    if (!blocks) continue;
    var result = writeBlocksAt(blocks, compactV, compactI, fullV, fullI);
    if (result) {
      compactInfo[parseInt(key)] = { vStart: compactV, vCount: result.vEnd - compactV, iStart: compactI, iCount: result.iEnd - compactI };
      compactV = result.vEnd;
      compactI = result.iEnd;
    }
  }

  // Atomic swap
  rowBufInfo = compactInfo;
  bufTailV = compactV;
  bufTailI = compactI;
  bufHeadV = 0;
  bufHeadI = 0;
  compacting = false;
  compactKeys = null;
  compactInfo = {};
  bufDirtyV3 = -1; bufDirtyV3End = 0;
  bufDirtyI = -1; bufDirtyIEnd = 0;
  bufDrawChanged = false;
  geo.setDrawRange(0, bufTailI);
  return true;
}

function flushBufferUpdates() {
  if (!mergedMesh) return;

  if (compacting) {
    stepCompaction();
    return;
  }

  if (needsCompact) {
    startCompaction();
    stepCompaction();
    return;
  }

  if (!bufDrawChanged) return;
  bufDrawChanged = false;

  var geo = mergedMesh.geometry;

  // Partial GPU upload for newly written data
  if (bufDirtyV3 >= 0) {
    var v3Count = bufDirtyV3End - bufDirtyV3;
    var attrs = ['position', 'normal', 'color', 'aEmissive'];
    for (var i = 0; i < attrs.length; i++) {
      var attr = geo.getAttribute(attrs[i]);
      attr.updateRange.offset = bufDirtyV3;
      attr.updateRange.count = v3Count;
      attr.needsUpdate = true;
    }
    var idxAttr = geo.index;
    idxAttr.updateRange.offset = bufDirtyI;
    idxAttr.updateRange.count = bufDirtyIEnd - bufDirtyI;
    idxAttr.needsUpdate = true;

    bufDirtyV3 = -1; bufDirtyV3End = 0;
    bufDirtyI = -1; bufDirtyIEnd = 0;
  }

  geo.setDrawRange(bufHeadI, bufTailI - bufHeadI);
}

var loadedRowMin = 0; // lowest row index currently loaded
function updateChunks() {
  var currentRow = zToRow(playerZ);
  for (var r = currentRow - 2; r < currentRow + VIEW_DISTANCE; r++) {
    loadRow(currentLevel, r);
  }
  var cutoff = currentRow - 15;
  for (var ri = loadedRowMin; ri < cutoff; ri++) {
    if (loadedRowData[ri]) unloadRow(ri);
  }
  if (loadedRowMin < cutoff) loadedRowMin = cutoff;
  flushBufferUpdates();
  updateBlockFade();
}

function updateBlockFade() {
  playerZUniform.value = playerZ;
  playerYUniform.value = Math.max(0, playerY);
  playerXUniform.value = playerX;
}
