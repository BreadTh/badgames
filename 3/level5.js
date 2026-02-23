// Level 5: "The Divide" — parallel paths, path commitment
// See level5-design.md for full design document
//
// The track splits into parallel paths separated by impassable walls.
// You choose a side and live with it until the next crossover.

// Shorthands
var KF5 = [B.KILL, S.FLAT];           // kill floor at h=0
var KW5 = [B.KILL, S.FLAT, 2];        // kill wall h=2
var KW5_3 = [B.KILL, S.FLAT, 3];      // kill wall h=3
var KW5_4 = [B.KILL, S.FLAT, 4];      // kill wall h=4
var DF5 = [B.DRAIN_FUEL, S.FLAT];
var DF5_1 = [B.DRAIN_FUEL, S.FLAT, 1];  // raised drain (wave crest)
var DO5 = [B.DRAIN_OXY, S.FLAT];
var DO5_1 = [B.DRAIN_OXY, S.FLAT, 1];   // raised drain (wave crest)
var OX5 = [B.OXYGEN, S.FLAT];
var FU5 = [B.FUEL, S.FLAT];
var W5 = [B.WIN_TUNNEL, S.FLAT];
var J5 = [B.JUMP, S.FLAT];

// Kill column helper (solid kill blocks from 0 to height)
function KC(height) {
  var blocks = [];
  for (var y = 0; y <= height; y++) {
    blocks.push([B.KILL, S.FLAT, y]);
  }
  return blocks;
}

// Jump pad at height
function JP5(h) { return [B.JUMP, S.FLAT, h]; }

LEVELS.push({
  name: "The Divide",
  gridColors: [0x553366, 0x664477],
  rows: concat(
    // ===== 1. OPEN START (40r) =====
    repeat(F, 10),
    repeat([N,N,FU5,N,N, N,N,N,N,N, N,N,N,N,N, N,N,FU5,N,N], 6),
    repeat(F, 6),
    repeat([N,N,N,N,N, N,FU5,N,N,N, N,N,N,FU5,N, N,N,N,N,N], 6),
    repeat(F, 6),
    repeat([N,N,N,N,FU5, N,N,N,N,N, N,N,N,N,N, FU5,N,N,N,N], 6),

    // ===== 2. FIRST FORK (64r) =====

    // 2a: Wall grows (10r)
    repeat(F, 2),
    repeat([N,N,N,N,N, N,N,N,N,KC(1), KC(1),N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,KC(2), KC(2),N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,KC(3), KC(3),N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,KC(4), KC(4),N,N,N,N, N,N,N,N,N], 2),

    // 2b: Gentle split (24r) — left has bumps+fuel, right has gaps+oxy
    repeat([N,N,N,N,H(1), H(1),N,N,N,KC(4), KC(4),N,N,N,N, N,N,N,N,N], 4),
    repeat([N,FU5,N,N,N, N,N,N,N,KC(4), KC(4),N,N,N,N, 0,0,N,OX5,N], 6),
    repeat([N,N,N,H(1),H(1), H(1),N,N,N,KC(4), KC(4),N,N,0,0, N,N,N,N,N], 4),
    repeat([N,N,H(1),N,N, N,N,FU5,N,KC(4), KC(4),N,N,N,N, N,0,0,OX5,N], 6),
    repeat([N,N,N,N,N, H(1),H(1),N,N,KC(4), KC(4),N,N,N,N, N,N,N,N,N], 4),

    // 2c: First crossover (10r)
    repeat(F, 4),
    repeat([N,FU5,N,OX5,N, N,N,FU5,N,N, N,N,OX5,N,N, FU5,N,N,OX5,N], 4),
    repeat(F, 2),

    // 2d: Second split (20r) — swapped resources
    repeat([N,N,N,N,N, N,N,N,N,KC(4), KC(4),N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,KF5,KF5,N, N,N,OX5,N,KC(4), KC(4),N,N,N,0, 0,N,FU5,N,N], 6),
    repeat([N,N,N,N,N, KF5,N,N,N,KC(4), KC(4),N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,OX5,N,N,KC(4), KC(4),N,0,0,N, N,FU5,N,N,N], 6),
    repeat(F, 2),

    // ===== 3. RISK VS REWARD (120r) =====

    // 3a: Wall grows, asymmetric (10r)
    repeat(F, 2),
    repeat([N,N,N,N,N, N,N,N,N,N, KC(2),N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, KC(4),N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, KC(5),KC(5),N,N,N, N,N,N,N,N], 4),

    // 3b+3c: Safe left (10 lanes 0-9) / Dangerous right (8 lanes 12-19) (50r)
    // Left: gentle h=1 ridges, sparse kill blocks, sparse resources
    // Right: kill wall zigzag corridor with dense resources
    // Right safe path: cols 12-17 (6-wide)
    repeat([N,N,N,N,N, N,N,KF5,KF5,N, KC(5),KC(5),KW5,KW5,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,H(1), H(1),H(1),N,N,N, KC(5),KC(5),KW5,KW5,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, H(1),H(1),N,N,N, KC(5),KC(5),N,N,N, FU5,N,N,KW5,KW5], 6),
    repeat([N,N,KF5,KF5,N, N,N,N,N,N, KC(5),KC(5),KW5,KW5,N, N,N,N,N,N], 4),
    // Right shifts: safe cols 14-19
    repeat([N,FU5,N,N,N, N,N,N,N,N, KC(5),KC(5),KW5,KW5,N, N,OX5,N,N,N], 6),
    repeat([N,N,N,N,N, KF5,KF5,N,N,N, KC(5),KC(5),N,N,KW5, KW5,N,N,N,N], 4),
    // Right shifts: safe cols 12-16
    repeat([N,N,N,N,N, N,N,N,OX5,N, KC(5),KC(5),N,N,N, FU5,N,KW5,KW5,KW5], 6),
    repeat([N,N,N,H(1),H(1), H(1),N,N,N,N, KC(5),KC(5),N,N,N, N,N,N,KW5,KW5], 4),
    // Right shifts: safe cols 13-18
    repeat([N,N,N,N,N, N,N,N,N,N, KC(5),KC(5),KW5,N,N, OX5,N,FU5,N,N], 6),
    repeat([N,N,N,N,N, N,KF5,N,N,N, KC(5),KC(5),KW5,N,N, N,N,N,N,KW5], 6),

    // 3d: Crossover (10r)
    repeat(F, 4),
    repeat([N,OX5,N,N,FU5, N,N,N,OX5,N, N,FU5,N,N,N, OX5,N,FU5,N,N], 4),
    repeat(F, 2),

    // 3e: Reversed — left dangerous (drain+platforms), right safe (50r)
    // Wall at cols 10-11
    repeat([N,N,N,N,N, N,N,N,N,N, KC(5),KC(5),N,N,N, N,N,N,N,N], 4),
    // Left: drain floor with wave heights + h=2 resource platforms
    repeat([DF5_1,DF5,DF5_1,DF5,H(2), HF(2),H(2),DF5_1,DF5,DF5_1, KC(5),KC(5),N,N,N, N,N,N,N,N], 6),
    repeat([DF5,DF5_1,DF5,DF5_1,DF5, DF5_1,DF5,DF5_1,DF5,DF5_1, KC(5),KC(5),N,N,N, H(1),H(1),N,N,N], 6),
    repeat([DF5_1,DF5,H(2),HO(2),H(2), DF5,DF5_1,DF5,DF5_1,DF5, KC(5),KC(5),N,N,0, 0,N,N,N,N], 6),
    repeat([DF5,DF5_1,DF5,DF5_1,DF5, DF5_1,DF5,DF5_1,DF5,DF5_1, KC(5),KC(5),N,N,N, N,N,H(1),N,N], 6),
    repeat([DF5_1,DF5,DF5_1,DF5,DF5_1, DF5,H(2),HF(2),HO(2),DF5_1, KC(5),KC(5),N,N,N, N,N,0,0,N], 6),
    repeat([DF5,DF5_1,DF5,DF5_1,DF5, DF5_1,DF5,DF5_1,DF5,DF5_1, KC(5),KC(5),N,H(1),H(1), N,N,N,N,N], 4),
    // Right: gentle ground, sparse pickups
    repeat([DF5_1,DF5,DF5_1,H(2),HF(2), H(2),DF5_1,DF5,DF5_1,DF5, KC(5),KC(5),N,N,N, N,N,N,OX5,N], 6),
    repeat([DF5,DF5_1,DF5,DF5_1,DF5, DF5_1,DF5,DF5_1,DF5,DF5_1, KC(5),KC(5),N,N,H(1), H(1),N,N,N,N], 6),

    // ===== 4. BREATHER (30r) =====
    repeat(F, 6),
    repeat([N,FU5,N,OX5,N, FU5,N,N,OX5,N, N,OX5,N,N,FU5, N,OX5,N,FU5,N], 8),
    repeat(F, 4),
    repeat([OX5,N,N,FU5,N, N,OX5,N,N,FU5, FU5,N,OX5,N,N, N,FU5,N,N,OX5], 8),
    repeat(F, 4),

    // ===== 5. DRAIN MOAT (100r) =====

    // 5a: Fuel drain moat (40r)
    // Center 4 lanes (8-11) are fuel drain with wave heights (alive, not flat)
    // First half: kill blocks left, gaps right
    repeat([N,N,N,N,N, N,N,N,DF5_1,DF5, DF5_1,DF5,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,KF5,KF5,N, N,N,N,DF5,DF5_1, DF5,DF5_1,N,N,N, N,N,N,N,N], 6),
    repeat([N,FU5,N,N,N, N,N,N,DF5_1,DF5, DF5_1,DF5,N,N,0, 0,N,N,OX5,N], 6),
    repeat([N,N,N,N,KF5, N,N,N,DF5,DF5_1, DF5,DF5_1,N,N,N, N,N,N,N,N], 4),
    // Second half: obstacles SWAP — gaps left, kill blocks right
    repeat([N,N,0,0,N, N,N,N,DF5_1,DF5, DF5_1,DF5,N,N,KF5, KF5,N,N,N,N], 6),
    repeat([N,FU5,N,N,N, N,N,N,DF5,DF5_1, DF5,DF5_1,N,N,N, N,N,OX5,N,N], 6),
    repeat([N,N,N,N,N, 0,0,N,DF5_1,DF5, DF5_1,DF5,N,N,N, KF5,N,N,N,N], 4),
    repeat([N,N,N,FU5,N, N,N,N,DF5,DF5_1, DF5,DF5_1,N,KF5,N, N,N,N,OX5,N], 4),

    // 5b: Oxy drain moat (30r)
    // Center switches to oxy drain with wave heights
    repeat([N,N,N,N,N, N,N,N,DO5_1,DO5, DO5_1,DO5,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,H(1),H(1),N, OX5,N,N,DO5,DO5_1, DO5,DO5_1,KW5,N,N, N,FU5,N,N,N], 6),
    repeat([N,N,N,N,H(2), H(2),OX5,N,DO5_1,DO5, DO5_1,DO5,N,N,KW5, N,N,N,N,N], 6),
    repeat([N,N,N,N,N, N,N,N,DO5,DO5_1, DO5,DO5_1,N,N,N, KW5,N,FU5,N,N], 6),
    repeat([N,OX5,N,H(1),N, N,N,N,DO5_1,DO5, DO5_1,DO5,KW5,N,N, N,N,N,N,N], 8),

    // 5c: Double drain (30r)
    // cols 8-9 fuel drain, cols 10-11 oxy drain — both with wave heights
    repeat([N,N,N,N,N, N,N,N,DF5_1,DF5, DO5,DO5_1,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,KF5,N,N, N,FU5,N,DF5,DF5_1, DO5_1,DO5,N,N,0, 0,N,OX5,N,N], 6),
    repeat([N,N,N,N,KF5, N,N,N,DF5_1,DF5, DO5,DO5_1,N,N,N, N,N,N,N,N], 6),
    repeat([N,OX5,N,N,N, N,N,N,DF5,DF5_1, DO5_1,DO5,N,0,0, N,FU5,N,N,N], 6),
    repeat([N,N,N,N,N, KF5,N,N,DF5_1,DF5, DO5,DO5_1,N,N,N, N,N,N,N,N], 4),
    repeat(F, 4),

    // 5-6 transition: mini-breather (8r)
    repeat([N,FU5,N,N,OX5, N,N,N,N,N, N,N,N,N,N, OX5,N,N,FU5,N], 4),
    repeat(F, 4),

    // ===== 6. PAD SPLIT (100r) =====

    // 6a: Pad left (44r) — left has kill floor + pads, right has drain ground
    // Islands 8r, pads 2r, gaps 10r. Navigable speed 20-25.
    repeat([N,N,N,N,N, N,N,N,N,KC(5), KC(5),N,N,N,N, N,N,N,N,N], 2),
    // Left: island 1 (cols 3-6) + right: drain ground
    repeat([KF5,KF5,KF5,H(1),H(1), H(1),H(1),KF5,KF5,KC(5), KC(5),N,N,N,N, N,N,N,N,N], 4),
    repeat([KF5,KF5,KF5,H(1),HF(1), H(1),H(1),KF5,KF5,KC(5), KC(5),DF5,DF5,DF5,N, N,N,OX5,DF5,DF5], 4),
    repeat([KF5,KF5,KF5,H(1),JP5(1), JP5(1),H(1),KF5,KF5,KC(5), KC(5),DF5,DF5,N,N, N,N,DF5,DF5,DF5], 2),
    // Kill floor gap
    repeat([KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KC(5), KC(5),DF5,DF5,N,N, N,N,DF5,DF5,DF5], 10),
    // Left: island 2 (cols 2-6) with fuel
    repeat([KF5,KF5,H(1),H(1),H(1), HF(1),H(1),KF5,KF5,KC(5), KC(5),DF5,N,N,N, OX5,N,N,DF5,DF5], 4),
    repeat([KF5,KF5,H(1),H(1),H(1), H(1),H(1),KF5,KF5,KC(5), KC(5),DF5,DF5,N,N, N,N,N,DF5,DF5], 4),
    repeat([KF5,KF5,H(1),JP5(1),JP5(1), H(1),H(1),KF5,KF5,KC(5), KC(5),DF5,DF5,DF5,N, N,N,DF5,DF5,DF5], 2),
    // Kill floor gap
    repeat([KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KC(5), KC(5),DF5,DF5,DF5,N, N,N,DF5,DF5,DF5], 10),
    // Landing
    repeat([N,N,H(1),HF(1),H(1), H(1),N,N,N,KC(5), KC(5),N,N,N,N, N,OX5,N,N,N], 2),

    // 6b: Crossover (6r)
    repeat(F, 2),
    repeat([N,FU5,N,OX5,N, N,FU5,N,N,N, N,N,OX5,N,FU5, N,N,OX5,N,N], 4),

    // 6c: Pad right (44r) — swapped
    // Islands 8r, pads 2r, gaps 10r. Same navigability.
    repeat([N,N,N,N,N, N,N,N,N,KC(5), KC(5),N,N,N,N, N,N,N,N,N], 2),
    // Right: island 1 (cols 13-16) + Left: drain ground
    repeat([DF5,DF5,N,N,N, FU5,N,DF5,DF5,KC(5), KC(5),KF5,KF5,H(1),H(1), H(1),H(1),KF5,KF5,KF5], 4),
    repeat([DF5,DF5,DF5,N,N, N,N,DF5,DF5,KC(5), KC(5),KF5,KF5,H(1),H(1), H(1),H(1),KF5,KF5,KF5], 4),
    repeat([DF5,DF5,N,N,N, N,DF5,DF5,DF5,KC(5), KC(5),KF5,KF5,H(1),JP5(1), JP5(1),H(1),KF5,KF5,KF5], 2),
    // Kill floor gap
    repeat([DF5,DF5,N,N,N, N,DF5,DF5,DF5,KC(5), KC(5),KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KF5], 10),
    // Right: island 2 (cols 13-17) with oxy
    repeat([DF5,DF5,DF5,N,N, FU5,N,DF5,DF5,KC(5), KC(5),KF5,KF5,H(1),H(1), HO(1),H(1),H(1),KF5,KF5], 4),
    repeat([DF5,DF5,N,N,N, N,DF5,DF5,DF5,KC(5), KC(5),KF5,KF5,H(1),H(1), H(1),H(1),KF5,KF5,KF5], 4),
    repeat([DF5,DF5,DF5,N,N, N,N,DF5,DF5,KC(5), KC(5),KF5,KF5,KF5,JP5(1), JP5(1),H(1),KF5,KF5,KF5], 2),
    // Kill floor gap
    repeat([DF5,DF5,DF5,N,N, N,N,DF5,DF5,KC(5), KC(5),KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KF5], 10),
    // Landing
    repeat([N,N,N,OX5,N, N,N,N,N,KC(5), KC(5),N,N,H(1),HO(1), H(1),N,N,N,N], 2),

    // 6d: Landing (6r)
    repeat(F, 2),
    repeat([N,FU5,N,N,OX5, N,N,N,N,N, N,N,N,N,N, OX5,N,N,FU5,N], 4),

    // ===== 7. HIGH AND LOW (140r) =====

    // 7a: High road forms (20r)
    repeat(F, 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),KF5,KF5, KF5,KF5,N,N,N, N,N,N,N,N], 4),
    repeat([H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(2),KF5,KF5, KF5,KF5,N,N,N, N,N,N,N,N], 4),
    repeat([H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),KF5,KF5, KF5,KF5,N,N,N, N,N,N,N,N], 6),

    // 7b: Dual roads (60r) — left h=3, right h=0, kill floor gap
    repeat([H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),KF5,KF5, KF5,KF5,N,N,N, N,N,N,N,N], 8),
    repeat([H(3),HF(3),H(3),H(3),H(3), H(3),H(3),H(3),KF5,KF5, KF5,KF5,N,N,N, 0,0,N,OX5,N], 6),
    // Kill pillar on high road
    repeat([H(3),H(3),H(3),[B.KILL,S.FLAT,3],H(3), H(3),H(3),H(3),KF5,KF5, KF5,KF5,N,N,N, N,N,N,N,N], 6),
    repeat([H(3),H(3),H(3),H(3),H(3), H(3),HF(3),H(3),KF5,KF5, KF5,KF5,N,N,0, 0,N,N,N,N], 6),
    repeat([H(3),H(3),H(3),H(3),H(3), [B.KILL,S.FLAT,3],H(3),H(3),KF5,KF5, KF5,KF5,N,N,N, N,OX5,N,N,N], 6),
    repeat([H(3),H(3),HF(3),H(3),H(3), H(3),H(3),H(3),KF5,KF5, KF5,KF5,N,N,N, N,N,N,N,N], 4),
    repeat([H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),KF5,KF5, KF5,KF5,N,0,0, 0,N,N,N,N], 6),
    repeat([H(3),H(3),H(3),H(3),[B.KILL,S.FLAT,3], H(3),H(3),H(3),KF5,KF5, KF5,KF5,N,N,N, N,N,OX5,N,N], 6),
    repeat([H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),KF5,KF5, KF5,KF5,N,N,N, N,N,N,N,N], 6),
    repeat([H(3),H(3),H(3),HF(3),H(3), H(3),H(3),H(3),KF5,KF5, KF5,KF5,N,N,N, 0,0,N,OX5,N], 6),
    repeat([H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),KF5,KF5, KF5,KF5,N,N,N, N,N,N,N,N], 4),
    repeat([H(3),H(3),[B.KILL,S.FLAT,3],H(3),H(3), H(3),HF(3),H(3),KF5,KF5, KF5,KF5,N,N,0, 0,0,N,N,N], 6),

    // 7c: Ramp down (10r)
    repeat([H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(2),N,N, N,N,N,N,N, N,N,N,N,N], 4),
    repeat([H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat(F, 2),
    repeat([N,FU5,N,OX5,N, N,N,N,N,N, N,N,N,N,N, N,OX5,N,FU5,N], 2),

    // 7d: Inverted (50r) — right rises to h=3, left stays low with drain
    repeat([N,N,N,N,N, N,N,N,KF5,KF5, KF5,KF5,H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1)], 4),
    repeat([N,N,N,N,N, N,N,N,KF5,KF5, KF5,KF5,H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(2)], 4),
    repeat([N,N,N,N,N, N,N,N,KF5,KF5, KF5,KF5,H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3)], 2),
    // Left: drain patches, right: elevated with pillars
    repeat([DF5,DF5,N,N,N, N,DF5,DF5,KF5,KF5, KF5,KF5,H(3),H(3),H(3), H(3),HF(3),H(3),H(3),H(3)], 6),
    repeat([DF5,DF5,DF5,N,OX5, N,N,DF5,KF5,KF5, KF5,KF5,H(3),H(3),[B.KILL,S.FLAT,3], H(3),H(3),H(3),H(3),H(3)], 6),
    repeat([N,N,N,N,DF5, DF5,DF5,N,KF5,KF5, KF5,KF5,H(3),H(3),H(3), H(3),H(3),HF(3),H(3),H(3)], 6),
    repeat([DF5,DF5,N,N,N, OX5,DF5,DF5,KF5,KF5, KF5,KF5,H(3),H(3),H(3), [B.KILL,S.FLAT,3],H(3),H(3),H(3),H(3)], 6),
    repeat([N,N,N,DF5,DF5, N,N,N,KF5,KF5, KF5,KF5,H(3),H(3),H(3), H(3),H(3),H(3),HF(3),H(3)], 6),
    repeat([DF5,N,OX5,N,N, DF5,DF5,N,KF5,KF5, KF5,KF5,H(3),H(3),[B.KILL,S.FLAT,3], H(3),H(3),H(3),H(3),H(3)], 6),
    repeat([N,N,N,N,N, N,N,N,KF5,KF5, KF5,KF5,H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3)], 4),
    // Ramp down from inverted (4r)
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(2)], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1)], 2),

    // ===== 8. RESOURCE STATION (30r) =====
    repeat(F, 4),
    repeat([FU5,N,OX5,N,FU5, N,OX5,N,FU5,N, OX5,N,FU5,N,OX5, N,FU5,N,OX5,FU5], 8),
    repeat(F, 4),
    repeat([OX5,FU5,N,OX5,N, FU5,N,OX5,FU5,N, N,FU5,OX5,N,FU5, OX5,N,FU5,OX5,N], 8),
    repeat(F, 6),

    // ===== 9. TRIPLE FORK (100r) =====

    // 9a: Walls form (10r)
    repeat(F, 2),
    repeat([N,N,N,N,N, KC(2),KC(2),N,N,N, N,N,KC(2),KC(2),N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, KC(4),KC(4),N,N,N, N,N,KC(4),KC(4),N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, KC(5),KC(5),N,N,N, N,N,KC(5),KC(5),N, N,N,N,N,N], 4),

    // 9b: Triple split (60r)
    // Left (0-4): hard, dense resources. 3-wide safe corridor zigzag.
    // Center (7-11): medium, h=1/h=2 terrain. Moderate resources.
    // Right (14-19): easy, sparse resources.

    // Left zigzag: cols 1-3 safe
    repeat([KW5,N,N,N,KW5, KC(5),KC(5),N,N,N, N,N,KC(5),KC(5),N, N,N,N,N,N], 6),
    repeat([KW5,N,FU5,N,KW5, KC(5),KC(5),N,H(1),H(1), N,N,KC(5),KC(5),N, N,N,N,N,N], 4),
    // Left: shift to cols 2-4
    repeat([KW5,KW5,N,N,N, KC(5),KC(5),N,N,N, H(1),N,KC(5),KC(5),N, N,N,KF5,N,N], 6),
    repeat([KW5,KW5,N,OX5,N, KC(5),KC(5),N,N,H(2), H(2),N,KC(5),KC(5),N, N,N,N,N,N], 4),
    // Left: shift to cols 0-2
    repeat([N,N,N,KW5,KW5, KC(5),KC(5),N,N,N, N,N,KC(5),KC(5),N, FU5,N,N,N,N], 6),
    repeat([N,FU5,N,KW5,KW5, KC(5),KC(5),H(1),N,N, N,H(1),KC(5),KC(5),N, N,N,N,KF5,N], 4),
    // Left: shift to cols 1-3
    repeat([KW5,N,N,N,KW5, KC(5),KC(5),N,N,H(1), H(2),N,KC(5),KC(5),N, N,N,N,N,N], 6),
    repeat([KW5,N,OX5,N,KW5, KC(5),KC(5),N,N,N, N,N,KC(5),KC(5),N, N,OX5,N,N,N], 4),
    // Left: shift to cols 2-4
    repeat([KW5,KW5,N,N,N, KC(5),KC(5),N,H(2),H(2), N,N,KC(5),KC(5),N, N,N,N,N,N], 6),
    repeat([KW5,KW5,N,FU5,N, KC(5),KC(5),N,N,N, N,N,KC(5),KC(5),N, N,FU5,N,N,N], 4),
    // Left: hold cols 1-3
    repeat([KW5,N,N,N,KW5, KC(5),KC(5),N,N,H(1), N,N,KC(5),KC(5),N, N,N,KF5,N,N], 6),
    repeat([KW5,N,OX5,FU5,KW5, KC(5),KC(5),N,N,N, N,N,KC(5),KC(5),N, N,N,N,N,N], 4),

    // 9c: Triple merge (30r)
    repeat([N,N,N,N,N, KC(4),KC(4),N,N,N, N,N,KC(4),KC(4),N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, KC(2),KC(2),N,N,N, N,N,KC(2),KC(2),N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, KC(1),KC(1),N,N,N, N,N,KC(1),KC(1),N, N,N,N,N,N], 2),
    repeat(F, 4),
    repeat([N,FU5,N,OX5,N, FU5,N,OX5,N,FU5, OX5,N,FU5,N,OX5, N,FU5,N,OX5,N], 8),
    repeat(F, 4),
    repeat([OX5,N,FU5,N,N, OX5,N,N,FU5,N, N,FU5,N,N,OX5, N,N,FU5,N,OX5], 4),

    // ===== 10. RAPID FORKS (160r) =====

    // 10a: Alternating walls (40r)
    // 20r: wall center, left has kill blocks, right has gaps
    repeat([N,N,N,N,N, N,N,N,N,KC(4), KC(4),N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,KF5,KF5,N, N,N,N,N,KC(4), KC(4),N,N,N,0, 0,N,N,N,N], 6),
    repeat([N,N,N,N,N, KF5,N,N,N,KC(4), KC(4),N,N,N,N, N,0,0,N,N], 6),
    repeat([N,N,N,N,KF5, N,N,FU5,N,KC(4), KC(4),N,N,0,0, N,N,OX5,N,N], 6),
    // Crossover
    repeat(F, 4),
    // 16r: swapped — left gaps, right kill blocks
    repeat([N,N,N,0,0, N,N,N,N,KC(4), KC(4),N,KF5,KF5,N, N,N,N,N,N], 6),
    repeat([N,N,N,N,N, 0,0,N,N,KC(4), KC(4),N,N,N,N, KF5,N,N,N,N], 6),
    repeat([N,OX5,0,0,N, N,N,N,N,KC(4), KC(4),N,N,N,KF5, N,FU5,N,N,N], 4),

    // 10b: Shifting wall (40r)
    repeat(F, 2),
    // Wall at cols 5-6 (narrow left 5 lanes, wide right)
    repeat([N,N,N,N,N, KC(4),KC(4),N,N,N, N,N,N,KF5,N, N,N,N,N,N], 6),
    repeat([N,N,FU5,N,N, KC(4),KC(4),N,N,N, N,N,N,N,N, KF5,N,OX5,N,N], 6),
    // Crossover
    repeat(F, 4),
    // Wall at cols 13-14 (wide left, narrow right 6 lanes)
    repeat([N,N,N,N,KF5, N,N,N,N,N, N,N,N,KC(4),KC(4), N,N,N,N,N], 6),
    repeat([N,N,OX5,N,N, N,KF5,N,N,N, N,N,N,KC(4),KC(4), N,N,FU5,N,N], 6),
    // Crossover
    repeat(F, 4),

    // 10c: Rapid fire (40r)
    // 8r split, 4r open, 8r split, 4r open, 8r split, 4r open, 4r flat
    repeat([N,N,N,N,N, N,N,N,N,KC(4), KC(4),N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,KF5,N,N, FU5,N,N,N,KC(4), KC(4),N,N,N,N, N,N,OX5,N,N], 4),
    repeat(F, 4),
    // Second split — one side has drain
    repeat([N,N,N,N,N, N,N,N,N,KC(4), KC(4),DF5,DF5,N,N, N,DF5,DF5,N,N], 4),
    repeat([N,N,FU5,N,N, N,N,OX5,N,KC(4), KC(4),DF5,DF5,N,N, N,DF5,DF5,N,N], 4),
    repeat(F, 4),
    // Third split — one side has kill floor patches
    repeat([N,N,N,N,N, N,N,N,N,KC(4), KC(4),KF5,KF5,N,N, N,N,KF5,KF5,N], 4),
    repeat([N,N,OX5,N,N, FU5,N,N,N,KC(4), KC(4),KF5,KF5,N,OX5, N,N,KF5,KF5,N], 4),
    repeat(F, 4),

    // 10d: Zigzag split (50r) — ASYMMETRIC narrowing (left closes first)
    // Thematic: paths are DIFFERENT, even when narrowing
    repeat([N,N,N,N,N, N,N,N,N,KC(4), KC(4),N,N,N,N, N,N,N,N,N], 4),
    // Left closes in fast (2 KW), right still open
    repeat([KW5,KW5,N,N,N, N,N,N,N,KC(4), KC(4),N,N,N,N, N,N,N,N,N], 4),
    // Left aggressively narrow (4 KW), right just starting (1 KW)
    repeat([KW5,KW5,KW5,KW5,N, N,FU5,N,N,KC(4), KC(4),N,N,OX5,N, N,N,N,N,KW5], 4),
    // Left holds narrow, right catches up (3 KW)
    repeat([KW5,KW5,KW5,KW5,N, N,N,N,N,KC(4), KC(4),N,N,N,N, N,N,KW5,KW5,KW5], 4),
    // Both at narrowest — left 5-wide, right 5-wide. Dense resources.
    repeat([KW5,KW5,KW5,KW5,N, FU5,N,N,N,KC(4), KC(4),N,N,N,N, OX5,KW5,KW5,KW5,KW5], 4),
    repeat([KW5,KW5,KW5,KW5,N, N,OX5,N,N,KC(4), KC(4),N,N,FU5,N, N,KW5,KW5,KW5,KW5], 6),
    // Crossover at narrowest
    repeat(F, 4),
    // Reopening: LEFT opens fast, RIGHT stays narrow (role reversal!)
    repeat([KW5,KW5,N,N,N, N,N,N,N,KC(4), KC(4),N,N,N,N, N,KW5,KW5,KW5,KW5], 4),
    // Left wide, right still squeezed + resources on both
    repeat([N,N,N,N,OX5, N,N,N,N,KC(4), KC(4),N,N,N,FU5, N,N,KW5,KW5,KW5], 4),
    // Right finally opens
    repeat([N,N,N,N,N, N,N,N,N,KC(4), KC(4),N,N,N,N, N,N,N,N,KW5], 4),
    repeat([N,N,N,N,N, N,N,N,N,KC(4), KC(4),N,N,N,N, N,N,N,N,N], 4),
    repeat(F, 4),

    // ===== 11. RESOURCE STATION (30r) =====
    repeat(F, 4),
    repeat([FU5,N,OX5,N,FU5, N,OX5,N,FU5,N, OX5,N,FU5,N,OX5, N,FU5,N,OX5,FU5], 8),
    repeat(F, 4),
    repeat([OX5,FU5,N,OX5,N, FU5,N,OX5,FU5,N, N,FU5,OX5,N,FU5, OX5,N,FU5,OX5,N], 8),
    repeat(F, 6),

    // ===== 12. LONG COMMITMENT (280r) =====

    // 12a: Wall rises (10r)
    repeat([N,N,N,N,N, N,N,N,N,KC(1), KC(1),N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,KC(3), KC(3),N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,KC(6), KC(6),N,N,N,N, N,N,N,N,N], 4),

    // 12b: First long leg (80r)
    // Left (0-8): kill floor + islands + pads (L4 callback). Fuel rewards.
    // Right (11-19): kill wall zigzag corridor (L3 callback). Oxy rewards.

    // Left: island 1 (cols 2-6)
    repeat([KF5,KF5,H(1),H(1),H(1), H(1),H(1),KF5,KF5,KC(6), KC(6),KW5,KW5,N,N, N,N,KW5,KW5,KW5], 6),
    repeat([KF5,KF5,H(1),JP5(1),JP5(1), H(1),H(1),KF5,KF5,KC(6), KC(6),KW5,KW5,N,OX5, N,N,KW5,KW5,KW5], 4),
    // Left: kill floor gap. Right: corridor holds (jagged wall heights)
    repeat([KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KC(6), KC(6),KW5_3,N,N,N, N,N,N,KW5_3,KW5], 14),
    // Left: island 2 (cols 3-7) with fuel
    repeat([KF5,KF5,KF5,H(1),H(1), HF(1),H(1),H(1),KF5,KC(6), KC(6),N,N,N,KW5, KW5,N,N,N,KW5], 6),
    repeat([KF5,KF5,KF5,H(1),JP5(1), JP5(1),H(1),KF5,KF5,KC(6), KC(6),N,N,N,N, OX5,N,N,N,KW5], 4),
    // Kill floor gap, right corridor shifts (jagged walls)
    repeat([KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KC(6), KC(6),N,N,N,KW5_3, N,N,N,N,KW5_3], 12),
    // Left: island 3 (cols 1-5) with fuel
    repeat([KF5,H(1),H(1),H(1),HF(1), H(1),KF5,KF5,KF5,KC(6), KC(6),KW5,KW5,KW5,N, N,N,OX5,N,N], 6),
    repeat([KF5,H(1),JP5(1),JP5(1),H(1), KF5,KF5,KF5,KF5,KC(6), KC(6),KW5,KW5,KW5,N, N,N,N,N,N], 4),
    // Kill floor gap, right corridor (jagged walls)
    repeat([KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KC(6), KC(6),N,N,N,KW5_3, KW5,N,N,N,KW5_3], 12),
    // Left: island 4 landing with fuel
    repeat([KF5,KF5,H(1),H(1),HF(1), H(1),H(1),KF5,KF5,KC(6), KC(6),N,N,N,N, OX5,N,N,N,KW5], 6),
    // Right: corridor landing
    repeat([KF5,KF5,H(1),H(1),H(1), H(1),KF5,KF5,KF5,KC(6), KC(6),N,N,N,N, N,N,N,KW5,KW5], 4),
    repeat([N,N,N,N,FU5, N,N,N,N,KC(6), KC(6),N,N,N,OX5, N,N,N,N,N], 6),

    // 12b-12c crossover (8r)
    repeat(F, 4),
    repeat([N,FU5,N,OX5,N, N,N,N,N,N, N,N,N,N,N, OX5,N,FU5,N,N], 4),

    // 12c: Second long leg (80r) — paths swap character
    // Left (0-8): kill wall zigzag (oxy rewards). Right (11-19): kill floor + pads (fuel rewards).
    // Right pads: 2r (halved uncertainty). Islands 8-10r. Navigable speed 22-28.

    // Wall returns (2r)
    repeat([N,N,N,N,N, N,N,N,N,KC(6), KC(6),N,N,N,N, N,N,N,N,N], 2),

    // Cycle 1 (22r): Left corridor cols 1-4. Right island cols 13-17 (10r+2r pad+10r gap).
    repeat([KW5,N,N,N,N, KW5,KW5,KW5,KW5,KC(6), KC(6),KF5,KF5,H(1),H(1), H(1),H(1),H(1),KF5,KF5], 4),
    repeat([KW5,N,OX5,N,N, KW5,KW5,KW5,KW5,KC(6), KC(6),KF5,KF5,H(1),HF(1), H(1),H(1),H(1),KF5,KF5], 4),
    repeat([KW5,N,N,N,N, KW5,KW5,KW5,KW5,KC(6), KC(6),KF5,KF5,H(1),H(1), H(1),H(1),H(1),KF5,KF5], 2),
    repeat([KW5,N,N,N,N, KW5,KW5,KW5,KW5,KC(6), KC(6),KF5,KF5,H(1),JP5(1), JP5(1),H(1),KF5,KF5,KF5], 2),
    repeat([N,N,N,N,KW5_3, KW5,KW5_3,KW5,KW5_3,KC(6), KC(6),KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KF5], 10),

    // Cycle 2 (22r): Left corridor cols 2-5. Right island cols 12-16 (8r+2r pad+12r gap).
    repeat([KW5,KW5,N,N,N, N,KW5_3,KW5,KW5_3,KC(6), KC(6),KF5,H(1),H(1),HF(1), H(1),H(1),KF5,KF5,KF5], 4),
    repeat([KW5,KW5,N,N,OX5, N,KW5,KW5_3,KW5,KC(6), KC(6),KF5,H(1),H(1),H(1), H(1),H(1),KF5,KF5,KF5], 4),
    repeat([KW5,KW5,N,N,N, N,KW5_3,KW5,KW5_3,KC(6), KC(6),KF5,H(1),JP5(1),JP5(1), H(1),KF5,KF5,KF5,KF5], 2),
    repeat([KW5_3,N,N,N,N, N,KW5,KW5_3,KW5,KC(6), KC(6),KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KF5], 12),

    // Cycle 3 (22r): Left corridor cols 0-2 (3-wide). Right island cols 14-18 (8r+2r pad+12r gap).
    repeat([N,N,N,KW5_3,KW5, KW5_3,KW5,KW5_3,KW5,KC(6), KC(6),KF5,KF5,KF5,H(1), H(1),HF(1),H(1),H(1),KF5], 4),
    repeat([N,OX5,N,KW5,KW5_3, KW5,KW5_3,KW5,KW5_3,KC(6), KC(6),KF5,KF5,KF5,H(1), H(1),H(1),H(1),H(1),KF5], 4),
    repeat([N,N,N,KW5_3,KW5, KW5_3,KW5,KW5_3,KW5,KC(6), KC(6),KF5,KF5,KF5,H(1), JP5(1),JP5(1),H(1),KF5,KF5], 2),
    repeat([KW5_3,N,N,N,N, KW5,KW5_3,KW5,KW5_3,KC(6), KC(6),KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KF5], 12),

    // Landing (12r)
    repeat([N,N,N,N,OX5, N,N,N,N,KC(6), KC(6),KF5,KF5,H(1),H(1), HF(1),H(1),H(1),KF5,KF5], 6),
    repeat([N,N,N,N,N, N,N,N,N,KC(6), KC(6),N,N,N,N, FU5,N,N,N,N], 6),

    // 12c-12d crossover (6r)
    repeat(F, 2),
    repeat([N,FU5,N,N,OX5, N,N,N,N,N, N,N,N,N,N, N,OX5,N,N,FU5], 4),

    // 12d: Final leg (108r) — both paths hard, no more crossovers
    // Left: kill floor + islands + 2r pads (navigable speed 22-28)
    // Right: 3-wide kill corridor + drain. Corridor alternates cols 13-15 / 14-16.
    // Gap+Safe constraint: G+S > F-1 where F = speed×0.8, 2r pads.

    // Wall returns (2r)
    repeat([N,N,N,N,N, N,N,N,N,KC(6), KC(6),N,N,N,N, N,N,N,N,N], 2),

    // Cycle 1: forgiving (14r island, 2r pad, 8r gap = 24r)
    // Left: 4-wide island cols 3-6 h=1. Right: corridor cols 13-15.
    repeat([KF5,KF5,KF5,H(1),H(1), H(1),H(1),KF5,KF5,KC(6), KC(6),KW5,KW5,N,N, N,KW5,KW5,KW5,KW5], 4),
    repeat([KF5,KF5,KF5,H(1),HF(1), H(1),H(1),KF5,KF5,KC(6), KC(6),KW5,KW5,N,OX5, N,KW5,KW5,KW5,KW5], 4),
    repeat([KF5,KF5,KF5,H(1),H(1), H(1),H(1),KF5,KF5,KC(6), KC(6),KW5,KW5,N,N, N,KW5,KW5,KW5,KW5], 6),
    repeat([KF5,KF5,KF5,H(1),JP5(1), JP5(1),H(1),KF5,KF5,KC(6), KC(6),KW5,KW5,N,N, N,KW5,KW5,KW5,KW5], 2),
    repeat([KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KC(6), KC(6),KW5_3,KW5,N,N, N,KW5,KW5_3,KW5,KW5_3], 8),

    // Cycle 2: medium (10r island, 2r pad, 10r gap = 22r)
    // Left: island cols 2-5 h=1. Right: corridor cols 14-16.
    repeat([KF5,KF5,H(1),H(1),H(1), H(1),KF5,KF5,KF5,KC(6), KC(6),KW5,KW5_3,KW5,N, N,N,KW5_3,KW5,KW5_3], 4),
    repeat([KF5,KF5,H(1),HF(1),H(1), H(1),KF5,KF5,KF5,KC(6), KC(6),KW5_3,KW5,KW5_3,N, OX5,N,KW5,KW5_3,KW5], 4),
    repeat([KF5,KF5,H(1),H(1),H(1), H(1),KF5,KF5,KF5,KC(6), KC(6),KW5,KW5_3,KW5,N, N,N,KW5_3,KW5,KW5_3], 2),
    repeat([KF5,KF5,H(1),JP5(1),JP5(1), H(1),KF5,KF5,KF5,KC(6), KC(6),KW5_3,KW5,KW5_3,N, N,N,KW5,KW5_3,KW5], 2),
    repeat([KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KC(6), KC(6),KW5,KW5_3,KW5,N, N,N,KW5_3,KW5,KW5_3], 10),

    // Cycle 3: drain borders (10r island, 2r pad, 10r gap = 22r)
    // Left: island cols 3-6 h=1, drain at edges. Right: corridor cols 13-15, drain flanks.
    repeat([DF5,DF5,KF5,H(1),H(1), H(1),H(1),KF5,DF5,KC(6), KC(6),DF5,KW5,N,N, N,KW5,DF5,KW5,KW5], 4),
    repeat([DF5,DF5,KF5,H(1),HF(1), HO(1),H(1),KF5,DF5,KC(6), KC(6),DF5,KW5,N,OX5, N,KW5,DF5,KW5,KW5], 4),
    repeat([DF5,DF5,KF5,H(1),H(1), H(1),H(1),KF5,DF5,KC(6), KC(6),DF5,KW5,N,N, N,KW5,DF5,KW5,KW5], 2),
    repeat([DF5,DF5,KF5,H(1),JP5(1), JP5(1),H(1),KF5,DF5,KC(6), KC(6),DF5,KW5,N,N, N,KW5,DF5,KW5,KW5], 2),
    repeat([DF5,DF5,KF5,KF5,KF5, KF5,KF5,KF5,DF5,KC(6), KC(6),DF5,DF5,N,N, N,DF5,DF5,KW5,KW5], 10),

    // Cycle 4: maximum difficulty (10r island, 2r pad, 12r gap = 24r)
    // Left: island cols 2-5 h=1, wider drain. Right: corridor cols 14-16, drain flanks.
    repeat([DF5,KF5,H(1),H(1),H(1), H(1),KF5,KF5,DF5,KC(6), KC(6),DF5,KW5,KW5,N, N,N,KW5,DF5,KW5], 4),
    repeat([DF5,KF5,H(1),HO(1),HF(1), H(1),KF5,KF5,DF5,KC(6), KC(6),DF5,KW5,KW5,N, FU5,N,KW5,DF5,KW5], 4),
    repeat([DF5,KF5,H(1),H(1),H(1), H(1),KF5,KF5,DF5,KC(6), KC(6),DF5,KW5,KW5,N, N,N,KW5,DF5,KW5], 2),
    repeat([DF5,KF5,H(1),JP5(1),JP5(1), H(1),KF5,KF5,DF5,KC(6), KC(6),DF5,KW5,KW5,N, N,N,KW5,DF5,KW5], 2),
    repeat([DF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,DF5,KC(6), KC(6),DF5,DF5,DF5,N, N,N,DF5,DF5,KW5], 12),

    // Ending: landing + flat (14r)
    repeat([KF5,KF5,H(1),H(1),HF(1), H(1),H(1),H(1),KF5,KC(6), KC(6),N,N,N,N, OX5,N,N,N,N], 6),
    repeat([N,N,N,N,N, N,N,N,N,KC(6), KC(6),N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,FU5,N, N,N,N,N,KC(6), KC(6),N,N,N,FU5, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,KC(6), KC(6),N,N,N,N, N,N,N,N,N], 2),

    // ===== 13. CONVERGENCE (160r) =====

    // 13a: The merge (20r)
    repeat([N,N,N,N,N, N,N,N,N,KC(4), KC(4),N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,KC(2), KC(2),N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,KC(1), KC(1),N,N,N,N, N,N,N,N,N], 2),
    repeat(F, 4),
    repeat([N,FU5,N,OX5,N, N,N,FU5,N,N, N,N,OX5,N,N, N,FU5,N,OX5,N], 4),
    repeat(F, 2),

    // 13b: Combined gauntlet (80r)
    // 20r: kill wall weave (jagged heights for visual interest)
    repeat([N,N,KW5_3,KW5,N, N,N,N,N,N, KW5,KW5_3,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, KW5,KW5_3,N,N,N, N,N,N,KW5_3,KW5, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,FU5,N,N, N,N,KW5_3,KW5,N, N,N,N,KW5,KW5_3], 4),
    repeat([KW5,KW5_3,N,N,N, N,N,N,N,KW5_3, KW5,N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,KW5_3, N,N,N,N,N, N,N,N,N,N, KW5,KW5_3,N,OX5,N], 4),

    // 22r: gap islands (varied widths: 2, 3, 4-wide gaps like L2)
    repeat([N,N,N,N,N, N,N,N,0,0, N,N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,OX5,N,N, N,N,N,N,N, N,N,0,0,0, 0,N,N,N,N], 4),
    repeat([N,N,N,N,0, 0,0,N,N,N, N,N,N,N,N, N,N,FU5,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,N, 0,0,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,0, 0,0,0,N,N], 4),
    repeat([N,N,N,0,0, 0,N,N,N,N, N,N,N,N,N, N,N,N,OX5,N], 2),

    // 20r: pad launch over kill floor
    repeat([KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KF5], 2),
    repeat([KF5,KF5,KF5,KF5,KF5, KF5,KF5,J5,J5,J5, J5,J5,J5,KF5,KF5, KF5,KF5,KF5,KF5,KF5], 4),
    repeat([KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KF5, KF5,KF5,KF5,KF5,KF5], 10),
    repeat([N,N,N,N,N, N,H(1),H(1),HF(1),H(1), H(1),H(1),H(1),H(1),N, N,N,N,N,N], 4),

    // 20r: drain field zigzag (wave heights for visual life)
    repeat([DF5_1,DF5,DF5_1,DF5,DF5_1, DF5,DF5_1,DF5,N,N, N,N,DO5,DO5_1,DO5, DO5_1,DO5,DO5_1,DO5,DO5_1], 6),
    repeat([DF5,DF5_1,DF5,DF5_1,DF5, DF5_1,DF5,DF5_1,DF5,DF5_1, N,N,N,N,DO5_1, DO5,DO5_1,DO5,DO5_1,DO5], 4),
    repeat([DF5_1,DF5,DF5_1,DF5,DF5_1, N,N,N,N,DF5, DO5_1,DO5,DO5_1,DO5,DO5_1, DO5,DO5_1,DO5,DO5_1,DO5], 4),
    repeat([DF5,DF5_1,DF5,DF5_1,DF5, DF5_1,DF5,DF5_1,N,N, N,OX5,DO5,DO5_1,DO5, DO5_1,DO5,DO5_1,DO5,DO5_1], 6),

    // 13c: The narrowing (44r) — ASYMMETRIC: left closes first
    repeat(F, 2),
    // Left closes first: cols 0-3 become walls → safe path shifts right
    repeat([KW5_3,KW5_3,KW5_3,KW5_3,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 8),
    // Left extends to 0-5, right starts closing from 18-19
    repeat([KW5_3,KW5_3,KW5_3,KW5_3,KW5_3, KW5_3,N,N,N,N, N,N,N,N,N, N,N,N,KW5_3,KW5_3], 10),
    // Both sides close to 8-wide (cols 6-13)
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,N,N,FU5,N, N,OX5,N,N,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 8),
    // Final narrow to 6-wide (cols 7-12)
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,N,N,N, N,N,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 8),
    // Last fuel
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,N,N,FU5, OX5,N,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 4),
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,N,N,N, N,N,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 4),

    // 13d: Final corridor (28r)
    // 6-wide corridor (cols 7-12), kill blocks force side-choosing
    // Sequence: dodge → forced LEFT → forced RIGHT → forced CENTER → win
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,N,N,N, N,N,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 2),
    // Single block — first asymmetric dodge
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,N,KF5,N, N,N,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 4),
    // Brief relief
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,N,N,N, N,N,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 4),
    // Right blocked — forces player LEFT (cols 7-9)
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,N,N,N, KF5,KF5,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 4),
    // Last fuel + open
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,N,N,FU5, N,N,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 2),
    // Left blocked — forces player RIGHT (cols 10-12)
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,KF5,KF5,N, N,N,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 4),
    // Both edges blocked — forces CENTER (cols 9-11). The duality resolves.
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,KF5,KF5,N, N,N,KF5,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 4),
    // Last resources + open approach to win
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,N,N,FU5, OX5,N,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 2),
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,N,N,N, N,N,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 2),

    // ===== 14. VICTORY (8r) =====
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,N,N,N, N,N,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 2),
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,N,W5, W5,N,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 1),
    repeat([KW5_4,KW5_4,KW5_4,KW5_4,KW5_4, KW5_4,KW5_4,N,N,N, N,N,N,KW5_4,KW5_4, KW5_4,KW5_4,KW5_4,KW5_4,KW5_4], 5)
  )
});
