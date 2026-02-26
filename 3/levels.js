// Block types
var BLOCK = {
  EMPTY: 0,
  NORMAL: 1,
  OXYGEN: 2,    // blue - refills oxygen
  FUEL: 3,      // orange - refills fuel
  KILL: 4,      // red - instant death
  JUMP: 5,      // yellow - forces jump
  DRAIN_FUEL: 6,  // dark orange - eats fuel
  DRAIN_OXY: 7,   // dark blue - eats oxygen
  WIN_TUNNEL: 8   // green - win the level
};

// Block colors
var BLOCK_COLOR = {};
BLOCK_COLOR[BLOCK.NORMAL] = 0x888888;
BLOCK_COLOR[BLOCK.OXYGEN] = 0x0066ff;
BLOCK_COLOR[BLOCK.FUEL] = 0xff8800;
BLOCK_COLOR[BLOCK.KILL] = 0xff0000;
BLOCK_COLOR[BLOCK.JUMP] = 0xffff00;
BLOCK_COLOR[BLOCK.DRAIN_FUEL] = 0x884400;
BLOCK_COLOR[BLOCK.DRAIN_OXY] = 0x003388;
BLOCK_COLOR[BLOCK.WIN_TUNNEL] = 0x00ff44;

// Block shapes
var SHAPE = {
  FLAT: 0
};

// Cell format: [type, shape, height] for a single block
// Or [[type,shape,h], [type,shape,h], ...] for multiple blocks in one column
// Each cell in a row is a column (array of blocks). Empty = [].
function makeRow(cells) {
  return cells.map(function(c) {
    if (!c) return [];
    // Single block: first element is a number (type)
    if (typeof c[0] === 'number') {
      return [{ type: c[0], shape: c[1] || SHAPE.FLAT, h: c[2] || 0 }];
    }
    // Multiple blocks: array of [type, shape, height] arrays
    return c.map(function(b) {
      return { type: b[0], shape: b[1] || SHAPE.FLAT, h: b[2] || 0 };
    });
  });
}

var B = BLOCK;
var S = SHAPE;
var N = [B.NORMAL, S.FLAT];

// Shorthand for raised normal blocks
function H(height) { return [B.NORMAL, S.FLAT, height]; }
function HF(height) { return [B.FUEL, S.FLAT, height]; }
function HO(height) { return [B.OXYGEN, S.FLAT, height]; }

// Solid column of normal blocks from ground (h=0) up to height
function COL(height, type, shape) {
  type = type || B.NORMAL;
  shape = shape || S.FLAT;
  var blocks = [];
  for (var y = 0; y <= height; y++) {
    blocks.push([type, shape, y]);
  }
  return blocks;
}

function repeat(row, n) {
  var out = [];
  for (var i = 0; i < n; i++) out.push(makeRow(row));
  return out;
}

function concat() {
  var out = [];
  for (var i = 0; i < arguments.length; i++) {
    out = out.concat(arguments[i]);
  }
  return out;
}

// Helper for tunnel: floor at ground + ceiling at height
function TUN(ceilH, floorType, ceilType) {
  floorType = floorType || B.NORMAL;
  ceilType = ceilType || B.NORMAL;
  return [[floorType, S.FLAT, 0], [ceilType, S.FLAT, ceilH]];
}

// Helper: floor + block at height (stacked pillar with gap)
function STACK(h1, h2, type) {
  type = type || B.NORMAL;
  return [[type, S.FLAT, h1], [type, S.FLAT, h2]];
}

// 20-wide flat row shorthand
var F = [N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N];

var LEVELS = [];

function levelKey(idx) { return '' + LEVELS[idx].id; }
