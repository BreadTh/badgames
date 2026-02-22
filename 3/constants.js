// ---- STATE ----
var state = 'menu'; // menu | playing | dead | winning | won
var currentLevel = 0;
var clearedLevels = JSON.parse(localStorage.getItem('spaceRunnerCleared') || '{}');
var score = 0;
var levelTimer = 0;
var levelTimerMax = 0;
var started = false; // true once player first accelerates
var screenFade = 0; // 0-1, used for death/win tint overlay
var levelStartTime = 0;
var bestScores = JSON.parse(localStorage.getItem('spaceRunnerScores') || '{}');

// Player state
var playerLane = 2; // 0-4, start center
var playerX = 0;
var playerY = 0; // height above ground
var playerVY = 0;
var playerVX = 0; // lateral velocity
var playerSpeed = 5; // units/sec forward
var playerZ = 0; // how far along the track
var fuel = 100;
var oxygen = 100;
var alive = true;
var grounded = true;
var coyoteTimer = 0;

// Constants
var LANE_WIDTH = 1;
var BLOCK_SIZE = 1;
var LANES = 20;
var TRACK_WIDTH = LANES * LANE_WIDTH;
var GRAVITY = -50;
var JUMP_FORCE = 20;
var HOLD_GRAVITY = 0.85; // gravity multiplier while holding space (sustain)
var GLIDE_GRAVITY = 0.65; // gravity multiplier while holding space and falling
var JUMP_CUT_VY = 10; // velocity cap when space released early
var AIR_CONTROL = 0.3; // fraction of normal move speed
var AIR_CONTROL_FREE = 0.45; // air control when not sustaining
var AIR_SPEED_CONTROL = 0.25; // fraction of accel/decel rate while airborne
var BOUNCE_FACTOR = 0.45;
var COYOTE_TIME = 0.12; // seconds after leaving ground where jump still works
var VIEW_DISTANCE = 80; // how many rows ahead to show
var BASE_SPEED = 5;
var MAX_SPEED = 40;
var ACCEL_RATE = 16;
var DECEL_RATE = 36;
var FUEL_ACCEL_COST = 0.3; // per second while accelerating (below max speed)
var FUEL_CRUISE_COST = 0.05; // per speed per second at constant speed
var FUEL_JUMP_COST = 1.5; // flat cost on jump launch
var FUEL_AIR_COST = 0.4; // per second while airborne holding space (sustain)
var FUEL_GLIDE_COST = 2.4; // per second while gliding (falling + space)
var FUEL_EMPTY_DECEL = 3; // speed loss per second with no fuel
var OXY_DRAIN = 2; // per second always
var OXY_REFILL = 22.5; // per second on oxygen block (75% of original 30)
var FUEL_REFILL = 25;
var FUEL_DRAIN_RATE = 15;
var OXY_DRAIN_BLOCK_RATE = 15;
var KILL_SPEED_THRESHOLD = 28; // head-on collision kill speed
var PLAYER_H = 0.475;
var PLAYER_W = 0.6; // collision width
var PLAYER_D = 1.2; // collision depth (Z)


// Three.js
var scene, camera, renderer;
var clock = new THREE.Clock();
var shipMesh;
var headlight, underglow, accelFlameLight, cruiseFlameLight;
var starField;
var engineMatRef;

// Chunks: map of rowIndex -> array of meshes
var loadedRows = {};

// Input
var keys = {};
window.addEventListener('keydown', function(e) { keys[e.code] = true; });
window.addEventListener('keyup', function(e) { keys[e.code] = false; });
window.addEventListener('blur', function() { keys = {}; });

// Timers
var deathTimer = 0;
var winTimer = 0;
var stuckTimer = 0;

// ---- HELPERS ----
var LANE_CENTER = (LANES - 1) / 2; // 4.5 for 10 lanes

function laneToX(lane) {
  return (lane - LANE_CENTER) * LANE_WIDTH;
}

function xToLane(x) {
  return Math.round(x / LANE_WIDTH + LANE_CENTER);
}

function getRow(level, rowIdx) {
  if (rowIdx < 0 || rowIdx >= LEVELS[level].rows.length) return null;
  return LEVELS[level].rows[rowIdx];
}

function rowToZ(rowIdx) {
  return -rowIdx * BLOCK_SIZE;
}

function zToRow(z) {
  return Math.round(-z / BLOCK_SIZE);
}

// Get all blocks in a column (row, lane)
function getColumn(rowIdx, lane) {
  var row = getRow(currentLevel, rowIdx);
  if (!row) return [];
  if (lane < 0 || lane >= LANES) return [];
  return row[lane] || [];
}

function getColumnAtX(rowIdx, x) {
  return getColumn(rowIdx, xToLane(x));
}

// Get the top surface Y of a block
function blockTop(block) {
  if (!block) return null;
  return block.h || 0;
}

// Get the bottom of a block's solid region
function blockBottom(block) {
  if (!block) return null;
  return (block.h || 0) - BLOCK_SIZE;
}
