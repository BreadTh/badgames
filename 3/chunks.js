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
var deathDitherUniform = { value: 0 };

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

function injectDither(mat, fadeUniform, curveUni) {
  mat.onBeforeCompile = function(shader) {
    shader.uniforms.fadeAmount = fadeUniform;
    shader.uniforms.playerZ = playerZUniform;
    shader.uniforms.playerY = playerYUniform;
    shader.uniforms.deathDither = deathDitherUniform;

    var vertDecls = 'varying float vWorldZ;\nvarying float vWorldY;\nvarying float vWorldX;\n';

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

    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      DITHER_FUNCS + 'uniform float fadeAmount;\nuniform float playerZ;\nuniform float playerY;\nuniform float deathDither;\nvarying float vWorldZ;\nvarying float vWorldY;\nvarying float vWorldX;\nvoid main() {'
    );
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

// ---- MERGED MATERIALS & MESHES ----
var MERGED_BUCKETS = ['NORMAL_0', 'NORMAL_1', 'OXYGEN', 'FUEL', 'KILL', 'JUMP', 'DRAIN_FUEL', 'DRAIN_OXY', 'WIN_TUNNEL'];

function getBucketForBlock(type, lane, rowIdx, h) {
  if (type === BLOCK.NORMAL) {
    var parity = (lane + rowIdx + Math.round(h / BLOCK_SIZE)) % 2;
    return parity === 0 ? 'NORMAL_0' : 'NORMAL_1';
  }
  if (type === BLOCK.OXYGEN) return 'OXYGEN';
  if (type === BLOCK.FUEL) return 'FUEL';
  if (type === BLOCK.KILL) return 'KILL';
  if (type === BLOCK.JUMP) return 'JUMP';
  if (type === BLOCK.DRAIN_FUEL) return 'DRAIN_FUEL';
  if (type === BLOCK.DRAIN_OXY) return 'DRAIN_OXY';
  if (type === BLOCK.WIN_TUNNEL) return 'WIN_TUNNEL';
  return 'NORMAL_0';
}

function initMergedMaterials(level) {
  // Clean up old materials
  for (var k in mergedMaterials) {
    mergedMaterials[k].dispose();
  }
  mergedMaterials = {};

  var levelData = LEVELS[level];
  for (var i = 0; i < MERGED_BUCKETS.length; i++) {
    var key = MERGED_BUCKETS[i];
    var mat;
    if (key === 'NORMAL_0' || key === 'NORMAL_1') {
      var parity = key === 'NORMAL_0' ? 0 : 1;
      mat = getBlockMat(BLOCK.NORMAL).clone();
      if (levelData && levelData.gridColors) {
        mat.color.set(levelData.gridColors[parity]);
      }
    } else {
      mat = getBlockMat(BLOCK[key]).clone();
    }
    injectDither(mat, { value: 1.0 }, pathCurveUniform);
    mergedMaterials[key] = mat;
  }
}

// Max blocks per bucket — derived from VIEW_DISTANCE
// ~(VIEW_DISTANCE+17) rows loaded, up to LANES blocks/row, split across 2 NORMAL buckets
var MERGED_NORMAL_MAX = Math.ceil((VIEW_DISTANCE + 17) * LANES / 2);
var MERGED_DEFAULT_MAX = Math.ceil((VIEW_DISTANCE + 17) * LANES / 8);

function initMergedMesh(key) {
  var isNormal = key === 'NORMAL_0' || key === 'NORMAL_1';
  var maxBlocks = isNormal ? MERGED_NORMAL_MAX : MERGED_DEFAULT_MAX;
  // Max verts per block = 96, max indices per block = 132
  var maxVerts = maxBlocks * 96;
  var maxIndices = maxBlocks * 132;

  var posArr = new Float32Array(maxVerts * 3);
  var normArr = new Float32Array(maxVerts * 3);
  var idxArr = new Uint32Array(maxIndices);

  var geo = new THREE.BufferGeometry();
  var posAttr = new THREE.BufferAttribute(posArr, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', posAttr);
  var normAttr = new THREE.BufferAttribute(normArr, 3);
  normAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('normal', normAttr);
  var idxAttr = new THREE.BufferAttribute(idxArr, 1);
  idxAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setIndex(idxAttr);
  geo.setDrawRange(0, 0);

  var mesh = new THREE.Mesh(geo, mergedMaterials[key]);
  mesh.frustumCulled = false;
  scene.add(mesh);
  mergedMeshes[key] = mesh;
}

function initMergedChunks(level) {
  // Remove old merged meshes
  for (var k in mergedMeshes) {
    scene.remove(mergedMeshes[k]);
    mergedMeshes[k].geometry.dispose();
  }
  mergedMeshes = {};
  loadedRowData = {};
  mergedDirty = false;

  initMergedMaterials(level);
  for (var i = 0; i < MERGED_BUCKETS.length; i++) {
    initMergedMesh(MERGED_BUCKETS[i]);
  }
}

// ---- ROW LOADING ----
function computeRowBlocks(level, rowIdx) {
  var row = getRow(level, rowIdx);
  if (!row) return null;

  var blocks = [];
  for (var lane = 0; lane < LANES; lane++) {
    var col = row[lane];
    if (!col || !col.length) continue;

    for (var bi = 0; bi < col.length; bi++) {
      var cell = col[bi];
      var h = cell.h || 0;
      // Face mask: only include exposed faces
      // Bits: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z(back), 5=-Z(front)
      var mask = 0;
      if (!blockExistsAt(level, rowIdx, lane + 1, h)) mask |= 1;
      if (!blockExistsAt(level, rowIdx, lane - 1, h)) mask |= 2;
      if (!blockExistsAt(level, rowIdx, lane, h + BLOCK_SIZE)) mask |= 4;
      if (!blockExistsAt(level, rowIdx, lane, h - BLOCK_SIZE)) mask |= 8;
      if (!blockExistsAt(level, rowIdx - 1, lane, h)) mask |= 16;
      // -Z (bit 5): faces away from camera (forward), never visible
      // -Y (bit 3): bottom face, camera at Y=5 so cull if block top < 5
      if (h < 5) mask &= ~8;
      // +X (bit 0): faces right, cull on blocks right of camera (X=0)
      var bx = laneToX(lane);
      if (bx > 0.5) mask &= ~1;
      // -X (bit 1): faces left, cull on blocks left of camera
      if (bx < -0.5) mask &= ~2;
      if (mask === 0) continue;

      blocks.push({
        lane: lane,
        h: h,
        type: cell.type,
        mask: mask,
        bucket: getBucketForBlock(cell.type, lane, rowIdx, h),
        x: laneToX(lane),
        y: h - BLOCK_SIZE * 0.5,
        z: rowToZ(rowIdx)
      });
    }
  }
  return blocks;
}

function loadRow(level, rowIdx) {
  if (loadedRowData[rowIdx]) return;
  var blocks = computeRowBlocks(level, rowIdx);
  if (!blocks) return;
  loadedRowData[rowIdx] = blocks;
  mergedDirty = true;
}

function unloadRow(rowIdx) {
  if (!loadedRowData[rowIdx]) return;
  delete loadedRowData[rowIdx];
  mergedDirty = true;
}

function clearAllRows() {
  for (var key in loadedRowData) {
    delete loadedRowData[key];
  }
  mergedDirty = true;
}

function rebuildMergedGeometry() {
  if (!mergedDirty) return;
  mergedDirty = false;

  // Group blocks by bucket
  var blocksByBucket = {};
  for (var i = 0; i < MERGED_BUCKETS.length; i++) {
    blocksByBucket[MERGED_BUCKETS[i]] = [];
  }
  for (var rowKey in loadedRowData) {
    var blocks = loadedRowData[rowKey];
    for (var i = 0; i < blocks.length; i++) {
      blocksByBucket[blocks[i].bucket].push(blocks[i]);
    }
  }

  for (var bi = 0; bi < MERGED_BUCKETS.length; bi++) {
    var key = MERGED_BUCKETS[bi];
    var mesh = mergedMeshes[key];
    if (!mesh) continue;
    var blocks = blocksByBucket[key];

    var geo = mesh.geometry;
    var posArr = geo.getAttribute('position').array;
    var normArr = geo.getAttribute('normal').array;
    var idxArr = geo.index.array;
    var maxVerts = posArr.length / 3;
    var maxIndices = idxArr.length;

    var vertOffset = 0;
    var idxOffset = 0;

    for (var j = 0; j < blocks.length; j++) {
      var b = blocks[j];
      var remapped = getRemappedGeo(b.mask);

      // Overflow guard
      if (vertOffset + remapped.vertCount > maxVerts || idxOffset + remapped.indexCount > maxIndices) break;

      // Copy positions with world offset
      for (var v = 0; v < remapped.vertCount; v++) {
        var sv = v * 3;
        var dv = (vertOffset + v) * 3;
        posArr[dv] = remapped.positions[sv] + b.x;
        posArr[dv + 1] = remapped.positions[sv + 1] + b.y;
        posArr[dv + 2] = remapped.positions[sv + 2] + b.z;
      }

      // Copy normals (no offset)
      normArr.set(remapped.normals, vertOffset * 3);

      // Copy indices with vertex offset
      for (var k = 0; k < remapped.indexCount; k++) {
        idxArr[idxOffset + k] = remapped.indices[k] + vertOffset;
      }

      vertOffset += remapped.vertCount;
      idxOffset += remapped.indexCount;
    }

    geo.getAttribute('position').needsUpdate = true;
    geo.getAttribute('normal').needsUpdate = true;
    geo.index.needsUpdate = true;
    geo.setDrawRange(0, idxOffset);
  }
}

function updateChunks() {
  var currentRow = zToRow(playerZ);
  for (var r = currentRow - 2; r < currentRow + VIEW_DISTANCE; r++) {
    loadRow(currentLevel, r);
  }
  for (var key in loadedRowData) {
    var ri = parseInt(key);
    if (ri < currentRow - 15) {
      unloadRow(ri);
    }
  }
  rebuildMergedGeometry();
  updateBlockFade();
}

function updateBlockFade() {
  playerZUniform.value = playerZ;
  playerYUniform.value = playerY;
}
