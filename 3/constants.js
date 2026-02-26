// ---- STATE ----
var state = 'menu'; // menu | playing | dead | winning | won
var currentLevel = 0;
var clearedLevels = JSON.parse(localStorage.getItem('spaceRunnerCleared') || '{}');
var score = 0;
var isNewBest = false;
var prevBest = 0;
var levelTimer = 0;
var levelTimerMax = 0;
var started = false; // true once player first accelerates
var startedTime = 0; // timestamp when started flipped to true
var screenFade = 0; // 0-1, used for death/win tint overlay
var deathTimer = 0;
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
var isSustaining = false; // holding space while rising (jump extend)
var isGliding = false;    // holding space while falling (glide)

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
var VIEW_DISTANCE = 160; // how many rows ahead to show
var FOG_START = 15; // distance where fog begins
var PATH_CURVE = 0.00000009; // visual upward curve of distant track (quartic)
var CURVE_START = 1/5; // fraction of view distance before curve begins
var CURVE_LERP_RATE = 12; // exponential lerp rate for curvature toggle (~0.25s)
var DEATH_DITHER_DELAY = 0.5; // seconds before dither sweep starts
var DEATH_DITHER_DURATION = 0.75; // seconds for dither sweep
var SHIP_DITHER_DURATION = 1.5; // seconds for ship to dither out after level dither completes
var DEATH_DITHER_X = 0;  // weight of world X in sweep direction
var DEATH_DITHER_Z = -1; // weight of distance-ahead in sweep direction (negative = far end first)
var DITHER_MAX_AHEAD = VIEW_DISTANCE * CURVE_START; // tunnel dither stops where curve begins
var BASE_SPEED = 5;
var MAX_SPEED = 40;
var BOOST_SPEED_PCT = 0.25; // extra speed while holding accel at max
var BOOST_FUEL_MULT = 1.0; // fuel cost multiplier while boosting (vs FUEL_ACCEL_COST)
var BOOST_DECAY_RATE = 20; // speed/sec bleed back to MAX_SPEED after releasing accel
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
var FUEL_BOUNCE = 5; // fuel gain on bounce off fuel block (at full-extended-jump landing speed)
var OXY_BOUNCE = 5;  // oxy gain on bounce off oxy block (at full-extended-jump landing speed)
var BOUNCE_REFUEL_SCALE = Math.sqrt(HOLD_GRAVITY) / JUMP_FORCE; // |VY| * this * BOUNCE = amount
var FUEL_DRAIN_RATE = 60;
var OXY_DRAIN_BLOCK_RATE = 60;
var KILL_SPEED_THRESHOLD = 28; // head-on collision kill speed
var PLAYER_H = 0.475;
var PLAYER_W = 0.6; // collision width
var PLAYER_D = 1.2; // collision depth (Z)

// Fade durations (ms)
var FADE_LOADING_IN = 250;       // loading text fades in
var FADE_BOOT_OUT = 250;         // loading text fades away
var FADE_BOOT_IN = 250;          // overlay fades to reveal menu after boot
var FADE_START_LEVEL_OUT = 125;  // menu fades to black before level
var FADE_START_LEVEL_IN = 125;   // level fades in from black
var FADE_TO_MENU_OUT = 125;      // level fades to black before menu
var FADE_TO_MENU_IN = 125;       // menu fades in from black
var FADE_RESTART_OUT = 63;       // level fades to black for restart
var FADE_RESTART_IN = 63;        // level fades in from black after restart


// Three.js
var scene, camera, renderer;
var clock = new THREE.Clock();
var shipMesh;
var headlight, underglow, accelFlameLight, cruiseFlameLight;
var starField;
var engineMatRef;

// Merged geometry system
var loadedRowData = {};   // rowIdx -> array of block objects
var mergedMesh = null;    // single THREE.Mesh
var mergedMaterial = null; // single MeshPhongMaterial
var curveStart = VIEW_DISTANCE * CURVE_START;
var pathCurveUniform = { value: PATH_CURVE };
var curveTarget = PATH_CURVE;

// Input
var keys = {};
window.addEventListener('keydown', function(e) {
  if (!isPlayback) keys[e.code] = true;
  if (isRecording && !e.repeat) recKeyDown(e.code);
});
window.addEventListener('keyup', function(e) {
  if (!isPlayback) keys[e.code] = false;
  if (isRecording) recKeyUp(e.code);
});
window.addEventListener('blur', function() { if (!isPlayback) keys = {}; });

// Timers
var deathTimer = 0;
var deathStoppedTimer = 0; // time since scroll stopped after death
var deathFade = 0; // 0-1, ramps over 125ms after death for HUD gray transition
var frozenDist = -1; // locked distance display (-1 = live)
var winTimer = 0;
var wonTime = 0; // time since entering 'won' state
var winLiftBoost = 0;
var winShipVZ = 0;   // ship's forward velocity during win (visual only)
var winShipZ = 0;    // ship's forward offset during win (visual only)
var stuckTimer = 0;

// Debug
var debugMode = false;
var debugInvincible = false;
var debugInspect = false;
var debugPlane = null;
var debugWireframe = false;
var debugWireMesh = null;
var debugTypeBuffer = '';
var safeX = 0;
var safeY = 0;
var safeZ = 0;
var airDrainFuel = false;
var airDrainOxy = false;

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
