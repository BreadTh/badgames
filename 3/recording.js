// ---- RECORDING & PLAYBACK ----

var isRecording = false;
var isPlayback = false;
var recEvents = [];
var recStartTime = 0;
var recKeyState = {}; // logical key refcounts

var playbackEvents = [];
var playbackIdx = 0;
var playbackStartTime = 0;
var playbackLevel = 0;
var playbackRows = null;
var savedLevelRows = null;
var playbackDebug = false;
var recDebugWasOn = false;

// Map physical keys to logical codes
var REC_KEY_MAP = {
  ArrowUp: 'F', KeyW: 'F',
  ArrowDown: 'B', KeyS: 'B',
  ArrowLeft: 'L', KeyA: 'L',
  ArrowRight: 'R', KeyD: 'R',
  Space: 'J'
};

// Map logical codes back to physical keys (for playback)
var PLAYBACK_KEY_MAP = {
  F: ['ArrowUp', 'KeyW'],
  B: ['ArrowDown', 'KeyS'],
  L: ['ArrowLeft', 'KeyA'],
  R: ['ArrowRight', 'KeyD'],
  J: ['Space']
};

// ---- RECORDING ----

function startRecording() {
  isRecording = true;
  recEvents = [];
  recKeyState = {};
  recStartTime = performance.now();
  recDebugWasOn = debugMode;
  // Capture keys already held (e.g. after mid-game restart)
  for (var code in keys) {
    if (keys[code]) {
      var logical = REC_KEY_MAP[code];
      if (logical) {
        if (!recKeyState[logical]) recKeyState[logical] = 0;
        recKeyState[logical]++;
        if (recKeyState[logical] === 1) {
          recordEvent('+' + logical);
        }
      }
    }
  }
}

function stopRecording() {
  isRecording = false;
}

function recordEvent(str) {
  if (!isRecording) return;
  var ms = Math.round(performance.now() - recStartTime);
  recEvents.push(ms + ' ' + str);
}

function recKeyDown(code) {
  var logical = REC_KEY_MAP[code];
  if (!logical) return;
  if (!recKeyState[logical]) recKeyState[logical] = 0;
  recKeyState[logical]++;
  if (recKeyState[logical] === 1) {
    recordEvent('+' + logical);
  }
}

function recKeyUp(code) {
  var logical = REC_KEY_MAP[code];
  if (!logical) return;
  if (!recKeyState[logical]) return;
  recKeyState[logical]--;
  if (recKeyState[logical] <= 0) {
    recKeyState[logical] = 0;
    recordEvent('-' + logical);
  }
}

function recordSync(x, y, z, spd, vy, vx) {
  recordEvent('S ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' ' + z.toFixed(2) + ' ' + spd.toFixed(2) + ' ' + vy.toFixed(2) + ' ' + vx.toFixed(2));
}

function recordDeath(reason) {
  recordEvent('D ' + reason);
}

function recordWin() {
  recordEvent('W');
}

function recordScore() {
  recordEvent('$ ' + score + ' ' + scoreDist + ' ' + scoreTimeMult.toFixed(4) + ' ' + scoreFuelMult.toFixed(4) + ' ' + scoreOxyMult.toFixed(4));
}

function recordPause() {
  recordEvent('P');
}

function recordResume() {
  recordEvent('Q');
}

// ---- INTEGRITY CHECK ----

function _recMix(h, v) {
  h = ((h << 5) - h + v) & 0xFFFF;
  return h ^ (h >>> 8);
}

function computeRecHash(levelIdx, eventCount, flagBits) {
  var h = levelIdx * 2749;
  var name = LEVELS[levelIdx].name;
  for (var i = 0; i < name.length; i++) h = _recMix(h, name.charCodeAt(i));
  h = _recMix(h, eventCount * 3);
  h = (h ^ (flagBits * 0x6B2C)) & 0xFFFF;
  return ('0000' + h.toString(16)).slice(-4);
}

// ---- SERIALIZATION ----

var TYPE_TO_CHAR = {};
TYPE_TO_CHAR[BLOCK.NORMAL] = 'N';
TYPE_TO_CHAR[BLOCK.OXYGEN] = 'O';
TYPE_TO_CHAR[BLOCK.FUEL] = 'F';
TYPE_TO_CHAR[BLOCK.KILL] = 'K';
TYPE_TO_CHAR[BLOCK.JUMP] = 'J';
TYPE_TO_CHAR[BLOCK.DRAIN_FUEL] = 'D';
TYPE_TO_CHAR[BLOCK.DRAIN_OXY] = 'X';
TYPE_TO_CHAR[BLOCK.WIN_TUNNEL] = 'W';

var CHAR_TO_TYPE = {};
CHAR_TO_TYPE['N'] = BLOCK.NORMAL;
CHAR_TO_TYPE['O'] = BLOCK.OXYGEN;
CHAR_TO_TYPE['F'] = BLOCK.FUEL;
CHAR_TO_TYPE['K'] = BLOCK.KILL;
CHAR_TO_TYPE['J'] = BLOCK.JUMP;
CHAR_TO_TYPE['D'] = BLOCK.DRAIN_FUEL;
CHAR_TO_TYPE['X'] = BLOCK.DRAIN_OXY;
CHAR_TO_TYPE['W'] = BLOCK.WIN_TUNNEL;

function serializeCell(blocks) {
  if (!blocks || blocks.length === 0) return '.';
  var parts = [];
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    var ch = TYPE_TO_CHAR[b.type];
    if (!ch) continue;
    var s = ch;
    if (b.h && b.h !== 0) s += b.h;
    parts.push(s);
  }
  if (parts.length === 0) return '.';
  return parts.join('+');
}

function serializeLevel(levelIdx) {
  var rows = LEVELS[levelIdx].rows;
  var lines = [];
  for (var r = 0; r < rows.length; r++) {
    var row = rows[r];
    var cells = [];
    for (var c = 0; c < LANES; c++) {
      cells.push(serializeCell(row[c]));
    }
    lines.push(cells.join(','));
  }
  return lines.join('\n');
}

function serializeRecording(levelIdx) {
  // Trim idle time: find first input event and shift all timestamps
  var trimOffset = 0;
  for (var ti = 0; ti < recEvents.length; ti++) {
    var sp = recEvents[ti].indexOf(' ');
    var code = recEvents[ti].charAt(sp + 1);
    if (code === '+' || code === '-' || code === 'P' || code === 'Q') {
      trimOffset = parseInt(recEvents[ti].substring(0, sp), 10);
      break;
    }
  }
  var trimmed = [];
  for (var ti = 0; ti < recEvents.length; ti++) {
    var sp = recEvents[ti].indexOf(' ');
    var ms = parseInt(recEvents[ti].substring(0, sp), 10);
    var rest = recEvents[ti].substring(sp);
    trimmed.push(Math.max(0, ms - trimOffset) + rest);
  }

  var flagBits = recDebugWasOn ? 1 : 0;
  var hash = computeRecHash(levelIdx, trimmed.length, flagBits);
  var header = 'SPACERUNNER REC v1\n';
  header += 'L:' + levelIdx + ':' + LEVELS[levelIdx].name + '\n';
  header += 'C:' + hash + '\n';
  header += '---EVENTS---\n';
  var events = trimmed.join('\n');
  var rowData = '\n---ROWS---\n' + serializeLevel(levelIdx);
  return header + events + rowData;
}

function downloadRecording(levelIdx) {
  var text = serializeRecording(levelIdx);
  var name = LEVELS[levelIdx].name.replace(/[^a-zA-Z0-9]/g, '_');
  var ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  var filename = 'run-' + name + '-' + ts + '.run';
  var blob = new Blob([text], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---- PARSING ----

function parseCell(str) {
  str = str.trim();
  if (str === '.' || str === '') return [];
  var parts = str.split('+');
  var blocks = [];
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];
    var ch = p.charAt(0);
    var type = CHAR_TO_TYPE[ch];
    if (type === undefined) continue;
    var h = 0;
    if (p.length > 1) h = parseInt(p.substring(1), 10) || 0;
    blocks.push({ type: type, shape: 0, h: h });
  }
  return blocks;
}

function parseRow(line) {
  var cells = line.split(',');
  var row = [];
  for (var i = 0; i < cells.length; i++) {
    row.push(parseCell(cells[i]));
  }
  // Pad to LANES if short
  while (row.length < LANES) row.push([]);
  return row;
}

function parseRecording(text) {
  var lines = text.split('\n');
  var idx = 0;

  // Header
  if (lines[idx].trim() !== 'SPACERUNNER REC v1') return null;
  idx++;

  // Level info
  var levelLine = lines[idx].trim();
  if (levelLine.indexOf('L:') !== 0) return null;
  var lParts = levelLine.substring(2).split(':');
  var level = parseInt(lParts[0], 10);
  var levelName = lParts.slice(1).join(':');
  idx++;

  // Optional content hash
  var storedHash = null;
  if (lines[idx].trim().indexOf('C:') === 0) {
    storedHash = lines[idx].trim().substring(2);
    idx++;
  }

  // Events marker
  if (lines[idx].trim() !== '---EVENTS---') return null;
  idx++;

  // Events
  var events = [];
  while (idx < lines.length && lines[idx].trim() !== '---ROWS---') {
    var line = lines[idx].trim();
    if (line !== '') {
      var spaceIdx = line.indexOf(' ');
      if (spaceIdx > 0) {
        var ms = parseInt(line.substring(0, spaceIdx), 10);
        var evt = line.substring(spaceIdx + 1);
        events.push({ ms: ms, evt: evt });
      }
    }
    idx++;
  }

  // Rows marker
  if (idx >= lines.length || lines[idx].trim() !== '---ROWS---') return null;
  idx++;

  // Row data
  var rows = [];
  while (idx < lines.length) {
    var line = lines[idx].trim();
    if (line !== '') {
      rows.push(parseRow(line));
    }
    idx++;
  }

  // Verify content hash to detect flags
  var wasDebug = false;
  if (storedHash && level >= 0 && level < LEVELS.length) {
    // Try both flag values — one will match
    if (computeRecHash(level, events.length, 1) === storedHash) wasDebug = true;
  }

  return { level: level, levelName: levelName, events: events, rows: rows, debug: wasDebug };
}

// ---- PLAYBACK ----

function startPlayback(data) {
  playbackLevel = data.level;
  playbackEvents = data.events;
  playbackIdx = 0;
  playbackRows = data.rows;
  playbackDebug = data.debug;

  // Save original rows and swap in recorded rows
  savedLevelRows = LEVELS[data.level].rows;
  LEVELS[data.level].rows = data.rows;

  isPlayback = true;
  // 1 second of looking at the start line before events play
  playbackStartTime = performance.now() + 1000;
  startLevel(data.level);
}

function processPlaybackFrame() {
  if (!isPlayback) return;
  var elapsed = performance.now() - playbackStartTime;

  // Process all events up to current time
  while (playbackIdx < playbackEvents.length && playbackEvents[playbackIdx].ms <= elapsed) {
    var evt = playbackEvents[playbackIdx].evt;

    if (evt.charAt(0) === '+' || evt.charAt(0) === '-') {
      var press = evt.charAt(0) === '+';
      var logical = evt.substring(1);
      var physKeys = PLAYBACK_KEY_MAP[logical];
      if (physKeys) {
        for (var i = 0; i < physKeys.length; i++) {
          keys[physKeys[i]] = press;
        }
      }
    } else if (evt === 'P') {
      paused = true;
    } else if (evt === 'Q') {
      paused = false;
    } else if (evt.charAt(0) === 'S') {
      var parts = evt.split(' ');
      if (parts.length >= 5) {
        playerX = parseFloat(parts[1]);
        playerY = parseFloat(parts[2]);
        playerZ = parseFloat(parts[3]);
        playerSpeed = parseFloat(parts[4]);
        if (parts.length >= 6) playerVY = parseFloat(parts[5]);
        if (parts.length >= 7) playerVX = parseFloat(parts[6]);
      }
    } else if (evt.charAt(0) === 'D') {
      // Death event — replay the death
      var reason = evt.substring(2) || 'kill';
      die(reason);
    } else if (evt === 'W') {
      win();
    } else if (evt.charAt(0) === '$') {
      // Recorded score — override display vars
      var sp = evt.split(' ');
      if (sp.length >= 6) {
        score = parseInt(sp[1], 10);
        scoreDist = parseInt(sp[2], 10);
        scoreTimeMult = parseFloat(sp[3]);
        scoreFuelMult = parseFloat(sp[4]);
        scoreOxyMult = parseFloat(sp[5]);
        isNewBest = false;
      }
    }

    playbackIdx++;
  }

  // Auto-stop 3 seconds after last event (only if no death/win screen showing)
  if (playbackIdx >= playbackEvents.length && playbackEvents.length > 0 &&
      state === 'playing') {
    var lastMs = playbackEvents[playbackEvents.length - 1].ms;
    if (elapsed > lastMs + 3000) {
      stopPlayback();
    }
  }
}

function stopPlayback() {
  if (!isPlayback) return;
  // Restore original rows
  if (savedLevelRows) {
    LEVELS[playbackLevel].rows = savedLevelRows;
    savedLevelRows = null;
  }
  isPlayback = false;
  keys = {};
  playbackEvents = [];
  playbackIdx = 0;
  cancelAnimationFrame(animId);
  stopContinuousSounds();
  clearAllRows();
  clearAllParticles();
  clearShipDebris();
  showMenu();
}

// ---- MENU BUTTON ----

(function() {
  var btn = document.getElementById('load-playback-btn');
  var fileInput = document.getElementById('playback-file');
  if (!btn || !fileInput) return;

  btn.addEventListener('click', function() {
    fileInput.click();
  });

  fileInput.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      var text = ev.target.result;
      var data = parseRecording(text);
      if (!data) {
        alert('Invalid .run file');
        return;
      }
      if (data.level < 0 || data.level >= LEVELS.length) {
        alert('Unknown level index: ' + data.level);
        return;
      }
      startPlayback(data);
    };
    reader.readAsText(file);
    // Reset so same file can be loaded again
    fileInput.value = '';
  });
})();
