// Level 4: "Vertigo" — jump pad mastery, hostile floors, aerial control
// See level4-design.md for full design document
//
// PHYSICS NOTES:
// Jump pad gives VY=20, GRAVITY=-50. Flight time ~0.8s.
// At speed 25: fly ~20 rows. At speed 30: ~24 rows. At speed 35: ~28 rows.
// Kill floor gaps must be 14-16 rows with 10-12 row landing platforms.
// Drain floor gaps can be shorter (landing is survivable).

// Shorthands
var J = [B.JUMP, S.FLAT];           // jump pad at h=0
var KF = [B.KILL, S.FLAT];          // kill floor at h=0
var KW = [B.KILL, S.FLAT, 2];       // kill wall h=2 (unjumpable)
var KW3 = [B.KILL, S.FLAT, 3];      // tall kill wall
var DF4 = [B.DRAIN_FUEL, S.FLAT];   // drain fuel h=0
var DO4 = [B.DRAIN_OXY, S.FLAT];    // drain oxy h=0
var OX4 = [B.OXYGEN, S.FLAT];       // oxygen h=0
var FU4 = [B.FUEL, S.FLAT];         // fuel h=0
var W4 = [B.WIN_TUNNEL, S.FLAT];    // win tunnel h=0

// Jump pad at height
function JP(h) { return [B.JUMP, S.FLAT, h]; }

LEVELS.push({
  name: "Vertigo",
  gridColors: [0x225566, 0x336677],
  rows: concat(
    // ===== 1. OPEN START (40r) =====
    repeat(F, 10),
    repeat([N,N,FU4,N,N, N,N,N,N,N, N,N,N,N,N, N,N,FU4,N,N], 6),
    repeat(F, 6),
    repeat([N,N,N,N,N, N,FU4,N,N,N, N,N,N,FU4,N, N,N,N,N,N], 6),
    repeat(F, 6),
    repeat([N,N,N,N,FU4, N,N,N,N,N, N,N,N,N,N, FU4,N,N,N,N], 6),

    // ===== 2. LAUNCH SCHOOL (120r) =====

    // 2a: First Launch — center pads, wide platform at h=3
    repeat(F, 4),
    repeat([N,N,N,N,N, N,J,J,J,J, J,J,J,J,N, N,N,N,N,N], 4),
    // Platform starts after short gap. At speed 20: player at h=3 around row 6.
    // Platform wide and long to catch range of speeds.
    repeat([N,N,N,N,H(3),H(3), H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3), H(3),H(3),N,N,N,N], 14),
    repeat([N,N,N,N,H(3),HF(3), H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3), HF(3),H(3),N,N,N,N], 4),
    // ramp down
    repeat([N,N,N,N,N,N, H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2), N,N,N,N,N,N], 3),
    repeat([N,N,N,N,N,N, N,H(1),H(1),H(1), H(1),H(1),H(1),N, N,N,N,N,N,N], 3),

    // 2b: Lateral Launch — pads left, platform right
    repeat(F, 4),
    repeat([N,N,J,J,J, J,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    // Landing platform right side — long to catch various speeds
    repeat([N,N,N,N,N, N,N,N,N,N, H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),N,N], 16),
    repeat([N,N,N,N,N, N,N,N,N,N, H(3),H(3),HF(3),HO(3), H(3),H(3),H(3),H(3),N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,H(2),H(2),H(2), H(2),H(2),H(2),N,N,N], 3),

    // 2c: Two-Tier — ground pads to h=3, pads on h=3 to h=6
    repeat(F, 4),
    repeat([N,N,N,N,N, N,J,J,J,J, J,J,J,J,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),N, N,N,N,N,N], 8),
    repeat([N,N,N,N,N, N,H(3),JP(3),JP(3),H(3), H(3),JP(3),JP(3),H(3),N, N,N,N,N,N], 4),
    // h=6 landing — from h=3 pad, player reaches ~h=7. Lands on h=6 around row 18.
    repeat([N,N,N,N,N, N,N,H(6),H(6),H(6), H(6),H(6),H(6),N,N, N,N,N,N,N], 12),
    repeat([N,N,N,N,N, N,N,HO(6),H(6),H(6), H(6),H(6),HO(6),N,N, N,N,N,N,N], 4),
    // drop back down
    repeat([N,N,N,N,N, N,N,N,H(4),H(4), H(4),H(4),N,N,N, N,N,N,N,N], 3),
    repeat([N,N,N,N,N, N,N,N,N,H(2), H(2),N,N,N,N, N,N,N,N,N], 3),
    repeat(F, 4),

    // 2d: Choice Launch — left or right paths
    repeat([N,N,J,J,J, N,N,N,N,N, N,N,N,N,N, J,J,J,N,N], 4),
    repeat([H(3),H(3),H(3),H(3),H(3), N,N,N,N,N, N,N,N,N,N, H(3),H(3),H(3),H(3),H(3)], 12),
    repeat([HF(3),H(3),HF(3),H(3),HF(3), N,N,N,N,N, N,N,N,N,N, HO(3),H(3),HO(3),H(3),HO(3)], 4),
    repeat([H(2),H(2),H(2),N,N, N,N,N,N,N, N,N,N,N,N, N,N,H(2),H(2),H(2)], 3),
    repeat(F, 4),

    // ===== 3. PAD CHAINS (100r) =====

    // 3a: Straight Chain — drain floor, pads every ~14 rows
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,N,N, N,N,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4], 4),
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,J,J, J,J,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4], 4),
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4], 14),
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,J,J, J,J,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4], 4),
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,N,FU4, N,N,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4], 10),
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,N,N,N, N,N,N,DF4,DF4, DF4,DF4,DF4,DF4,DF4], 4),

    // 3b: Zigzag Chain — drain floor (survivable), pads zigzag
    repeat(F, 2),
    // center pad
    repeat([DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,N,N, N,N,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 3),
    repeat([DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,J,J, J,J,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 3),
    // drain gap, drift left (shorter — drain is survivable, just punishing)
    repeat([DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 6),
    // left pad
    repeat([DO4,DO4,N,N,N, N,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 3),
    repeat([DO4,DO4,J,J,J, J,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 3),
    // drain gap, drift right
    repeat([DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 6),
    // right pad
    repeat([DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,N, N,N,N,DO4,DO4], 3),
    repeat([DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,J, J,J,J,DO4,DO4], 3),
    // drain gap
    repeat([DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 4),
    // center landing
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,N,N,FU4, OX4,N,N,DF4,DF4, DF4,DF4,DF4,DF4,DF4], 4),
    repeat(F, 4),

    // 3c: Ascending Chain — first kill floor, "height = safety"
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 2),
    // h=1 island center (8-wide) with pads at end
    repeat([KF,KF,KF,KF,KF, KF,H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),KF, KF,KF,KF,KF,KF], 6),
    repeat([KF,KF,KF,KF,KF, KF,H(1),H(1),JP(1),JP(1), JP(1),JP(1),H(1),H(1),KF, KF,KF,KF,KF,KF], 4),
    // kill floor gap — player soars to h~5 from h=1 pad
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 12),
    // h=3 landing — HIGHER than where you started. Fuel reward.
    repeat([KF,KF,KF,KF,KF, KF,H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),KF, KF,KF,KF,KF,KF], 8),
    repeat([KF,KF,KF,KF,KF, KF,HF(3),H(3),H(3),H(3), H(3),H(3),H(3),HF(3),KF, KF,KF,KF,KF,KF], 4),
    // ramp back to flat
    repeat([N,N,N,N,N, N,N,H(2),H(2),H(2), H(2),H(2),H(2),N,N, N,N,N,N,N], 2),
    repeat(F, 4),
    // 3c total: 2+6+4+12+8+4+2+4 = 42r

    // ===== 4. AERIAL DRIFT (80r) =====
    // High launches over kill floor, must drift laterally to offset platforms

    // 4a: Gentle Drift — pad center-left, land center-right (~3 lane drift)
    repeat(F, 4),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 2),
    // pad at cols 5-6, h=2
    repeat([KF,KF,KF,KF,KF, JP(2),JP(2),H(2),KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // player reaches ~h=6. Drift right ~3 lanes. Land on h=2 platform at cols 9-14.
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,H(2), H(2),H(2),H(2),H(2),H(2), KF,KF,KF,KF,KF], 14),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,HF(2), H(2),H(2),H(2),H(2),HF(2), KF,KF,KF,KF,KF], 4),

    // 4b: Offset Launch — pad right, land left (~4 lane drift with glide)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 2),
    // pad at cols 13-14, h=3
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,JP(3),JP(3), H(3),KF,KF,KF,KF], 4),
    // drift LEFT ~4 lanes. Land on h=3 platform at cols 8-12.
    // Extended to catch speed 30 (24r flight, platform starts at row 4)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(3),H(3), H(3),H(3),H(3),KF,KF, KF,KF,KF,KF,KF], 16),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,HO(3),H(3), H(3),H(3),HO(3),KF,KF, KF,KF,KF,KF,KF], 4),
    // ramp down
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,H(2), H(2),H(2),KF,KF,KF, KF,KF,KF,KF,KF], 3),

    // 4c: Drift Chain — two linked drifts (~3 lanes each)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 2),
    // pad at cols 13-14, h=2. Drift left to cols 9-12.
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,H(2),JP(2), JP(2),KF,KF,KF,KF], 4),
    // kill floor gap — player flies over, drifting left (catches up to speed 30)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 6),
    // first landing: cols 8-12, h=2 with pad
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(2),H(2), H(2),H(2),H(2),KF,KF, KF,KF,KF,KF,KF], 10),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,JP(2),JP(2), H(2),KF,KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // kill floor gap — second drift
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 6),
    // second landing: cols 4-8, h=2
    repeat([KF,KF,KF,KF,H(2), H(2),H(2),H(2),H(2), KF,KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 10),
    repeat([KF,KF,KF,KF,HF(2), H(2),H(2),H(2),HF(2), KF,KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // ramp to flat
    repeat([N,N,N,N,N, H(1),H(1),H(1),N, N,N,N,N,N,N, N,N,N,N,N], 3),
    repeat(F, 4),

    // ===== 5. BREATHER (30r) =====
    repeat(F, 4),
    repeat([N,FU4,N,OX4,N, FU4,N,N,OX4,N, N,OX4,N,N,FU4, N,OX4,N,FU4,N], 8),
    repeat(F, 4),
    repeat([OX4,N,N,FU4,N, N,OX4,N,N,FU4, FU4,N,OX4,N,N, N,FU4,N,N,OX4], 8),
    repeat(F, 6),

    // ===== 5. KILL FLOOR (160r) =====
    // Kill floor at h=0. Safe islands at h=1 with pads.
    // Gap between islands: 14 rows. Islands: 10-12 rows.
    // At speed 25: fly 20r, land 6r into island. At speed 30: land 10r in.

    // 5a: Wide Islands (center, right, center)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 2),
    // island 1: center, 8-wide, 10r long
    repeat([KF,KF,KF,KF,KF, KF,H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),KF, KF,KF,KF,KF,KF], 8),
    repeat([KF,KF,KF,KF,KF, KF,H(1),H(1),JP(1),JP(1), JP(1),JP(1),H(1),H(1),KF, KF,KF,KF,KF,KF], 4),
    // 14r kill floor gap
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 14),
    // island 2: right, 8-wide, 12r long
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),KF], 8),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,H(1),HF(1),JP(1),JP(1), H(1),H(1),H(1),H(1),KF], 4),
    // 12r gap (shorter — rewards speed)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 12),
    // island 3: center landing
    repeat([KF,KF,KF,KF,KF, KF,H(1),H(1),H(1),HF(1), HO(1),H(1),H(1),H(1),KF, KF,KF,KF,KF,KF], 6),

    // 5b: Narrow Islands (left, center, right)
    repeat([KF,KF,KF,KF,KF, KF,H(1),H(1),JP(1),JP(1), H(1),H(1),KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // 12r gap (tighter with narrow islands)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 12),
    // island 4: left, 5-wide
    repeat([KF,KF,H(1),H(1),H(1), H(1),H(1),KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 6),
    repeat([KF,KF,H(1),HF(1),JP(1), JP(1),H(1),KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // 14r gap
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 14),
    // island 5: center-right, 5-wide (2 lane drift from island 4 pad)
    repeat([KF,KF,KF,KF,KF, KF,KF,H(1),H(1),H(1), H(1),H(1),KF,KF,KF, KF,KF,KF,KF,KF], 6),
    repeat([KF,KF,KF,KF,KF, KF,KF,H(1),JP(1),JP(1), H(1),H(1),KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // 14r gap
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 14),
    // landing with resources (1 lane drift right)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(1),HF(1), HO(1),H(1),H(1),H(1),KF, KF,KF,KF,KF,KF], 6),

    // 5c: Pad Rails — 3-wide rail, tight 2-lane zigzag over kill floor
    // rail 1: center (cols 8-10) — starts where player is
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(1),JP(1), JP(1),H(1),KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // 12r kill floor
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 12),
    // rail 2: center-left (cols 6-8, 2 lane drift)
    repeat([KF,KF,KF,KF,KF, KF,H(1),H(1),H(1),KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 6),
    repeat([KF,KF,KF,KF,KF, KF,H(1),JP(1),H(1),KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 3),
    // 10r kill floor
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 10),
    // rail 3: center-right (cols 10-12, 3 lane drift right)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, H(1),H(1),H(1),KF,KF, KF,KF,KF,KF,KF], 6),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, H(1),JP(1),H(1),KF,KF, KF,KF,KF,KF,KF], 3),
    // 14r kill floor
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 14),
    // rail 4: center-left (cols 7-9, 3 lane drift left)
    repeat([KF,KF,KF,KF,KF, KF,KF,H(1),H(1),H(1), KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 6),
    repeat([KF,KF,KF,KF,KF, KF,KF,H(1),JP(1),H(1), KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 3),
    // 14r kill floor
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 14),
    // center landing with fuel (cols 8-11, 1 lane drift right)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(1),HF(1), HO(1),H(1),KF,KF,KF, KF,KF,KF,KF,KF], 6),

    // transition back to flat
    repeat(F, 4),

    // ===== 6. DRAIN BOUNCE (80r) =====

    // 6a: Open Drain — drain floor, pads save you
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 4),
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,J,J, J,J,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 4),
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 10),
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,DF4,HF(2), HO(2),DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 4),
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,J,J,J, J,J,J,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 4),
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 10),

    // 6b: Drain Corridor — drain + kill walls closing in
    repeat([KW,KW,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,KW,KW], 4),
    repeat([KW,KW,KW,DF4,DF4, DF4,DF4,J,J,J, J,DO4,DO4,DO4,DO4, DO4,DO4,KW,KW,KW], 4),
    repeat([KW,KW,KW,KW,DF4, DF4,DF4,DF4,DF4,DF4, DO4,DO4,DO4,DO4,DO4, DO4,KW,KW,KW,KW], 8),
    repeat([KW,KW,KW,KW,KW, DF4,DF4,J,J,J, J,J,J,DO4,DO4, KW,KW,KW,KW,KW], 4),
    repeat([KW,KW,KW,KW,KW, DF4,DF4,DF4,DF4,DF4, DO4,DO4,DO4,DO4,DO4, KW,KW,KW,KW,KW], 8),

    // 6c: Drain Launch — pads on drain launch to h=2 resource platforms
    // pad on drain floor center (cols 8-11)
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,J,J, J,J,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 3),
    // land on h=2 platform slightly left (cols 5-10, ~2 lane drift)
    repeat([DF4,DF4,DF4,DF4,DF4, H(2),HF(2),H(2),H(2),HO(2), H(2),DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 5),
    // pad on platform (cols 5-6, h=2) → drift right
    repeat([DF4,DF4,DF4,DF4,DF4, JP(2),JP(2),H(2),DF4,DF4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 3),
    // land on h=2 platform right (cols 7-12, ~2 lane drift)
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,H(2),HO(2),H(2), H(2),HF(2),H(2),DO4,DO4, DO4,DO4,DO4,DO4,DO4], 5),
    repeat(F, 4),

    // ===== 7. TUNNEL GRIND (58r) =====
    // Brief contrast: low ceiling, can't jump. Makes you miss being airborne.

    // entrance: ceiling closes fast
    repeat([COL(4),COL(4),N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,COL(4),COL(4)], 2),
    repeat([COL(2),COL(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),COL(2),COL(2)], 2),

    // 7a: Wide Tunnel — kill walls zigzag, 8-wide path (16r)
    repeat([COL(2),COL(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),KW,KW,KW, KW,KW,KW,COL(2),COL(2)], 4),
    repeat([COL(2),COL(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2,B.FUEL),TUN(2),KW, KW,KW,KW,COL(2),COL(2)], 4),
    repeat([COL(2),COL(2),KW,KW,KW, KW,TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),KW,KW,COL(2),COL(2)], 4),
    repeat([COL(2),COL(2),KW,KW,KW, KW,KW,KW,TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),COL(2),COL(2)], 4),

    // 7b: Narrow Tunnel — walls close in fast (16r)
    repeat([COL(2),COL(2),COL(2),COL(2),KW, KW,TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),KW, KW,COL(2),COL(2),COL(2),COL(2)], 4),
    repeat([COL(2),COL(2),COL(2),COL(2),COL(2), KW,KW,TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),KW,KW, COL(2),COL(2),COL(2),COL(2),COL(2)], 4),
    repeat([COL(2),COL(2),COL(2),COL(2),COL(2), KW,KW,KW,TUN(2),TUN(2), TUN(2),TUN(2),KW,KW,KW, COL(2),COL(2),COL(2),COL(2),COL(2)], 4),
    repeat([COL(2),COL(2),COL(2),COL(2),COL(2), KW,TUN(2),TUN(2),TUN(2,B.FUEL),TUN(2), TUN(2),TUN(2,B.OXYGEN),TUN(2),TUN(2),KW, COL(2),COL(2),COL(2),COL(2),COL(2)], 4),

    // 7c: Tunnel Exit — ceiling rises, kill wall requires jump (20r)
    repeat([COL(4),COL(4),COL(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),COL(4),COL(4),COL(4)], 4),
    repeat([COL(4),COL(4),N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,COL(4),COL(4)], 4),
    // kill wall you MUST jump over — the relief of jumping again
    repeat(F, 4),
    repeat([KW,KW,KW,KW,KW, KW,KW,KW,KW,KW, KW,KW,KW,KW,KW, KW,KW,KW,KW,KW], 2),
    repeat(F, 6),

    // ===== 8. MODE SWITCH (100r) =====
    // Alternates vertical (kill floor + pads) and lateral (tunnel + kill walls)

    // 8a: Slow Switch — 20r vertical, 20r lateral
    // VERTICAL: kill floor + pads + platforms
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 2),
    repeat([KF,KF,KF,KF,KF, KF,KF,H(1),JP(1),JP(1), JP(1),JP(1),H(1),KF,KF, KF,KF,KF,KF,KF], 4),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 8),
    repeat([KF,KF,KF,KF,H(1), H(1),H(1),HF(1),H(1),H(1), KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 6),
    // LATERAL: tunnel + kill walls (12r — brief, punchy)
    repeat([COL(2),COL(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),KW,KW,KW, KW,KW,KW,COL(2),COL(2)], 4),
    repeat([COL(2),COL(2),KW,KW,TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),KW, KW,KW,KW,COL(2),COL(2)], 4),
    repeat([COL(2),COL(2),N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,COL(2),COL(2)], 4),

    // 8b: Fast Switch — 10r each
    // VERTICAL
    repeat([KF,KF,KF,KF,KF, KF,KF,H(1),JP(1),JP(1), H(1),KF,KF,KF,KF, KF,KF,KF,KF,KF], 4),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,H(1), H(1),H(1),KF,KF,KF], 6),
    // LATERAL (6r — fast, jarring)
    repeat([COL(2),COL(2),COL(2),KW,TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),KW,KW, KW,KW,COL(2),COL(2),COL(2)], 3),
    repeat([COL(2),COL(2),COL(2),KW,KW, KW,TUN(2),TUN(2),TUN(2,B.FUEL),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),KW, KW,KW,COL(2),COL(2),COL(2)], 3),
    // VERTICAL
    repeat([KF,KF,KF,KF,KF, KF,J,J,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 4),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,H(1),H(1),HO(1),H(1), KF,KF,KF,KF,KF], 6),
    // LATERAL (6r)
    repeat([COL(2),COL(2),KW,KW,KW, TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), KW,KW,KW,COL(2),COL(2)], 3),
    repeat([COL(2),COL(2),KW,TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),KW, KW,TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),KW,KW,COL(2),COL(2)], 3),

    // 8c: Broken Switch — irregular rhythm
    repeat(F, 2),
    // 12r vertical
    repeat([KF,KF,KF,KF,KF, KF,KF,JP(0),JP(0),KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 3),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,H(1), H(1),HF(1),KF,KF,KF], 4),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 5),
    // 6r lateral
    repeat([COL(2),COL(2),KW,TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),KW, KW,KW,KW,COL(2),COL(2)], 3),
    repeat([COL(2),COL(2),KW,KW,KW, TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),KW,KW, KW,KW,KW,COL(2),COL(2)], 3),
    // 5r vertical (brief!)
    repeat(F, 2),
    repeat([KF,KF,KF,KF,KF, KF,J,J,J,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 3),
    // 6r lateral
    repeat([COL(2),COL(2),COL(2),KW,KW, TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), KW,KW,COL(2),COL(2),COL(2)], 3),
    repeat([COL(2),COL(2),COL(2),KW,KW, KW,KW,TUN(2),TUN(2),TUN(2,B.FUEL), TUN(2),TUN(2,B.OXYGEN),TUN(2),KW,KW, KW,KW,COL(2),COL(2),COL(2)], 3),

    // transition
    repeat([COL(2),COL(2),N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,COL(2),COL(2)], 4),
    repeat(F, 4),

    // ===== 9. RESOURCE STATION (30r) =====
    repeat(F, 4),
    repeat([FU4,N,OX4,N,FU4, N,OX4,N,FU4,N, OX4,N,FU4,N,OX4, N,FU4,N,OX4,FU4], 8),
    repeat(F, 4),
    repeat([OX4,FU4,N,OX4,N, FU4,N,OX4,FU4,N, N,FU4,OX4,N,FU4, OX4,N,FU4,OX4,N], 8),
    repeat(F, 6),

    // ===== 10. ELEVATED RUN (160r) =====
    // Narrow platforms at h=3 over kill floor. Pads at platform ends.
    // 14-row kill floor gaps. 10-12 row platforms.

    // 10a: Wide Bridges
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 2),
    // bridge 1: center, 6-wide (tapered entry)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(3),H(3), H(3),H(3),KF,KF,KF, KF,KF,KF,KF,KF], 2),
    repeat([KF,KF,KF,KF,KF, KF,KF,H(3),H(3),H(3), H(3),H(3),H(3),KF,KF, KF,KF,KF,KF,KF], 6),
    repeat([KF,KF,KF,KF,KF, KF,KF,H(3),JP(3),JP(3), JP(3),JP(3),H(3),KF,KF, KF,KF,KF,KF,KF], 4),
    // 14r kill gap
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 14),
    // bridge 2: right, 6-wide (tapered entry)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, H(3),H(3),H(3),H(3),KF, KF,KF,KF,KF,KF], 2),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,H(3), H(3),H(3),H(3),H(3),H(3), KF,KF,KF,KF,KF], 6),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,H(3), HF(3),JP(3),JP(3),H(3),H(3), KF,KF,KF,KF,KF], 4),
    // 14r kill gap
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 14),

    // 10b: Narrow Bridges — 4-wide, center-aligned (max 2-3 lane shifts)
    // bridge 3: center-left (cols 8-11, ~2 lane drift left from bridge 2)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(3),H(3), H(3),H(3),KF,KF,KF, KF,KF,KF,KF,KF], 8),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(3),JP(3), JP(3),H(3),KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // 12r kill gap
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 12),
    // bridge 4: center-right (cols 11-14, ~2 lane drift right)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,H(3),H(3),H(3),H(3), KF,KF,KF,KF,KF], 6),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,H(3),JP(3),JP(3),H(3), KF,KF,KF,KF,KF], 4),
    // 11r gap
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 11),
    // bridge 5: center with fuel
    repeat([KF,KF,KF,KF,KF, KF,KF,H(3),H(3),HF(3), HO(3),H(3),H(3),KF,KF, KF,KF,KF,KF,KF], 6),
    repeat([KF,KF,KF,KF,KF, KF,KF,H(3),JP(3),JP(3), JP(3),JP(3),H(3),KF,KF, KF,KF,KF,KF,KF], 4),
    // 14r gap
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 14),

    // 10c: Staggered Heights — h=2 and h=4 alternating, center-aligned
    // h=2 bridge center-left (cols 6-8, ~2 lane drift left from bridge 5)
    repeat([KF,KF,KF,KF,KF, KF,H(2),H(2),H(2),KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 6),
    repeat([KF,KF,KF,KF,KF, KF,H(2),JP(2),H(2),KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 3),
    // 14r gap — from h=2 pad (reaches h=6), landing on h=4
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 14),
    // h=4 bridge center-right (cols 9-11, ~2 lane drift right)
    // Extended to 11r total — catches speed 35 landings (9.9r into platform)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,H(4), H(4),H(4),KF,KF,KF, KF,KF,KF,KF,KF], 8),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,H(4), JP(4),H(4),KF,KF,KF, KF,KF,KF,KF,KF], 3),
    // 14r gap — from h=4 pad (reaches h=8), landing back at h=2
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 14),
    // h=2 center landing with resources (4r — shorter, player falls from h=8→h=2)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(2),HF(2), HO(2),H(2),KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // transition
    repeat(F, 4),

    // ===== 11. THE STORM (140r) =====
    // Everything combined at max intensity

    // 11a: Kill Floor + Chains — bouncing center, max 2-lane shifts
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 2),
    // pad at cols 8-10
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,J,J, J,KF,KF,KF,KF, KF,KF,KF,KF,KF], 3),
    // fly over kill floor
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 10),
    // tiny platform cols 7-9 (1 lane drift left)
    repeat([KF,KF,KF,KF,KF, KF,KF,H(1),H(1),H(1), KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 4),
    repeat([KF,KF,KF,KF,KF, KF,KF,JP(1),JP(1),H(1), KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 3),
    // fly
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 10),
    // tiny platform cols 9-12 (2 lane drift right)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,H(1), H(1),H(1),H(1),KF,KF, KF,KF,KF,KF,KF], 4),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, JP(1),JP(1),H(1),KF,KF, KF,KF,KF,KF,KF], 3),
    // fly
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 10),
    // landing cols 8-11 with resources (2 lane drift left)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(1),HF(1), HO(1),H(1),KF,KF,KF, KF,KF,KF,KF,KF], 6),

    // 11b: Tunnel Interrupt — tunnels with open gaps for pad jumps
    repeat([COL(2),COL(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),COL(2),COL(2)], 6),
    // gap! pad in the open (6r — forgiving first gap)
    repeat([N,N,N,N,N, N,N,J,J,J, J,J,J,N,N, N,N,N,N,N], 6),
    // fly OVER next tunnel section (player above h=2)
    repeat([COL(2),COL(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),COL(2),COL(2)], 12),
    // another gap
    repeat([N,N,N,N,N, N,N,N,J,J, J,J,N,N,N, N,N,N,N,N], 4),
    // fly over
    repeat([COL(2),COL(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),COL(2),COL(2)], 12),
    // landing gap with resources
    repeat([N,N,N,N,N, N,N,FU4,N,N, N,OX4,N,N,N, N,N,N,N,N], 4),

    // 11c: Drain Precision — drain floor, pads, tiny center platforms
    // All pad→platform within 2-lane drift. Player stays center.
    // pad at cols 8-9 on drain floor
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,J,J, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 3),
    // fly over drain (10r)
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 10),
    // h=1 platform at cols 7-10 with oxy (drift 1 lane left — easy)
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,H(1),H(1),HO(1), H(1),DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 4),
    // pad on platform, cols 7-8
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,JP(1),JP(1),H(1), DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 3),
    // fly over drain (10r)
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 10),
    // h=1 platform at cols 9-12 with fuel (drift 2 lanes right — reachable)
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,DF4,H(1), HF(1),H(1),H(1),DO4,DO4, DO4,DO4,DO4,DO4,DO4], 4),

    // 11d: Mixed Nightmare — rapid type switching, center-aligned
    // All pads/platforms within 2-3 lanes of each other. Intensity from speed.
    // transition from drain to kill floor
    repeat(F, 2),
    // PASS 1: centered around cols 8-10
    // kill floor + pad at cols 8-10
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,J,J, J,KF,KF,KF,KF, KF,KF,KF,KF,KF], 3),
    // fly over kill floor
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 8),
    // h=1 landing at cols 7-10 (1 lane drift left)
    repeat([KF,KF,KF,KF,KF, KF,KF,H(1),H(1),H(1), H(1),KF,KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // tunnel section — wide safe path (cols 3-16)
    repeat([COL(2),COL(2),KW,TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),KW,COL(2),COL(2),COL(2)], 8),
    // pad at tunnel exit, cols 8-11
    repeat([N,N,N,N,N, N,N,N,J,J, J,J,N,N,N, N,N,N,N,N], 3),
    // fly over drain section
    repeat([DF4,DF4,DF4,DF4,DF4, DF4,DF4,DF4,DF4,DF4, DO4,DO4,DO4,DO4,DO4, DO4,DO4,DO4,DO4,DO4], 8),
    // flat landing with fuel
    repeat([N,N,N,N,N, N,N,FU4,N,N, N,OX4,N,N,N, N,N,N,N,N], 4),

    // PASS 2: shifted slightly right (cols 10-12)
    // kill floor + pad at cols 10-12
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, J,J,J,KF,KF, KF,KF,KF,KF,KF], 3),
    // fly over kill floor
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 8),
    // h=1 landing at cols 9-12 (1 lane drift left)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,H(1), H(1),H(1),H(1),KF,KF, KF,KF,KF,KF,KF], 4),
    // tunnel — kill walls zigzag inside
    repeat([COL(2),COL(2),COL(2),KW,TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),TUN(2), TUN(2),TUN(2),TUN(2),TUN(2),KW, KW,COL(2),COL(2),COL(2),COL(2)], 6),
    // exit pad cols 9-12
    repeat([N,N,N,N,N, N,N,N,N,J, J,J,J,N,N, N,N,N,N,N], 3),
    // fly over kill floor
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 10),
    // final landing with resources
    repeat([N,N,N,N,N, N,N,FU4,N,OX4, N,N,N,N,N, N,N,N,N,N], 4),
    // transition
    repeat(F, 6),

    // ===== 12. FINAL ASCENT (~76r) =====
    // Dramatic 3-tier climb + elevated running.
    // h=0 → h=3 → h=6 → h=8 → run at h=8 → win. The level's thesis concentrated.

    // 12a: GROUND LAUNCH — wide pads center, land on h=3 right
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 2),
    repeat([KF,KF,KF,KF,KF, KF,J,J,J,J, J,J,J,J,KF, KF,KF,KF,KF,KF], 3),
    // h=3 platform (6-wide, cols 9-14) — shifted RIGHT, must drift
    // Extended to 13r — catches speed 30+ landings (18r from pad)
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,H(3), H(3),H(3),H(3),H(3),H(3), KF,KF,KF,KF,KF], 13),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,HF(3), H(3),H(3),H(3),HF(3),H(3), KF,KF,KF,KF,KF], 2),

    // 12b: SECOND TIER — h=3 pads (4-wide), drift LEFT to h=6
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,H(3), JP(3),JP(3),JP(3),JP(3),KF, KF,KF,KF,KF,KF], 3),
    // kill floor gap (6r) — player soars to h=7
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 6),
    // h=6 platform (4-wide, cols 6-9) — shifted LEFT from h=3
    repeat([KF,KF,KF,KF,KF, KF,H(6),H(6),H(6),H(6), KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 8),
    repeat([KF,KF,KF,KF,KF, KF,HF(6),H(6),H(6),HF(6), KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 2),

    // 12c: SUMMIT — h=6 pads (3-wide), back to center for h=8
    repeat([KF,KF,KF,KF,KF, KF,H(6),JP(6),JP(6),JP(6), KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 2),
    // kill floor gap — player reaches h=10 at apex!
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF, KF,KF,KF,KF,KF], 10),
    // h=8 platform (3-wide, cols 8-10) — tiny, the highest walkable ground
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(8),H(8), H(8),KF,KF,KF,KF, KF,KF,KF,KF,KF], 6),

    // 12d: HIGH ROAD (19r) — elevated h=8 running, kill floor far below
    // widen from 3 to 5 (cols 7-11)
    repeat([KF,KF,KF,KF,KF, KF,KF,H(8),H(8),H(8), H(8),H(8),KF,KF,KF, KF,KF,KF,KF,KF], 2),
    // 5-wide elevated highway, last fuel in the game
    repeat([KF,KF,KF,KF,KF, KF,KF,H(8),H(8),HF(8), H(8),H(8),KF,KF,KF, KF,KF,KF,KF,KF], 2),
    repeat([KF,KF,KF,KF,KF, KF,KF,H(8),H(8),H(8), H(8),H(8),KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // narrow back to 4-wide
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(8),H(8), H(8),H(8),KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // narrow to 3-wide, oxygen reward
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(8),HO(8), H(8),KF,KF,KF,KF, KF,KF,KF,KF,KF], 4),
    // final 3-wide approach
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(8),H(8), H(8),KF,KF,KF,KF, KF,KF,KF,KF,KF], 3),

    // ===== 13. VICTORY (8r) =====
    // Win tunnel at h=8 — narrowest, highest win in the game
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(8),H(8), H(8),KF,KF,KF,KF, KF,KF,KF,KF,KF], 2),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(8),[B.WIN_TUNNEL,S.FLAT,8], H(8),KF,KF,KF,KF, KF,KF,KF,KF,KF], 1),
    repeat([KF,KF,KF,KF,KF, KF,KF,KF,H(8),H(8), H(8),KF,KF,KF,KF, KF,KF,KF,KF,KF], 5)
  )
});
