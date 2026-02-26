// Level 3: "Razor Run" — speed zigzag, all flat, pure lateral challenge
// See level-design.md for philosophy, THINK.md for detailed plan

// Shorthands
var K = [B.KILL, S.FLAT, 2];     // default kill wall, h=2 (can't jump over)
var K1 = [B.KILL, S.FLAT, 1];    // low kill
var K3 = [B.KILL, S.FLAT, 3];    // tall kill wall
var K4 = [B.KILL, S.FLAT, 4];    // tower
var DF = [B.DRAIN_FUEL, S.FLAT];
var DF1 = [B.DRAIN_FUEL, S.FLAT, 1];  // raised drain (lava wave crest)
var DO_ = [B.DRAIN_OXY, S.FLAT];
var DO1 = [B.DRAIN_OXY, S.FLAT, 1];   // raised drain
var OX = [B.OXYGEN, S.FLAT];
var FU = [B.FUEL, S.FLAT];
var W = [B.WIN_TUNNEL, S.FLAT];

LEVELS.push({
  id: 2,
  name: "Razor Run",
  gridColors: [0x881111, 0x991122],
  rows: concat(
    // ===== 1. OPEN START (40r) =====
    // Wide flat, scattered fuel. Get moving.
    repeat(F, 10),
    repeat([N,N,FU,N,N, N,N,N,N,N, N,N,N,N,N, N,N,FU,N,N], 6),
    repeat(F, 6),
    repeat([N,N,N,N,N, N,FU,N,N,N, N,N,N,FU,N, N,N,N,N,N], 6),
    repeat(F, 6),
    repeat([N,N,N,N,FU, N,N,N,N,N, N,N,N,N,N, FU,N,N,N,N], 6),

    // ===== 2. GENTLE WEAVE (80r) =====
    // Kill blocks on edges, 10-wide safe path drifts across the track
    // Path: cols 1-10 (20r) → cols 6-15 (20r) → cols 2-11 (20r) → cols 8-17 (20r)

    // 2a: path at cols 1-10 (kills on 0, 11-19) — jagged wall heights
    repeat([K3,N,N,N,N, N,N,N,N,N, N,K,K3,K,K3, K,K3,K,K3,K], 4),
    repeat([K,N,N,N,N, N,N,N,N,N, N,K3,K,K3,K, K3,K,K3,K,K3], 4),
    repeat([K3,N,N,FU,N, N,N,N,N,FU, N,K,K4,K,K3, K,K4,K,K3,K], 4),
    repeat([K,N,N,N,N, N,N,N,N,N, N,K3,K,K3,K, K3,K,K3,K,K3], 8),

    // transition: path shifts right to cols 6-15 (smooth diagonal)
    repeat([K,K3,N,N,N, N,N,N,N,N, N,N,K3,K,K3, K,K3,K,K3,K], 5),
    repeat([K3,K,K3,N,N, N,N,N,N,N, N,N,N,K,K3, K,K3,K,K3,K], 5),
    repeat([K,K3,K,K3,N, N,N,N,N,N, N,N,N,N,K3, K,K3,K,K3,K], 5),

    // 2b: path at cols 6-15
    repeat([K3,K,K3,K,K, K3,N,N,N,N, N,N,N,N,N, N,K,K3,K,K3], 4),
    repeat([K,K3,K,K3,K, K,N,N,N,N, N,N,N,N,N, N,K3,K,K3,K], 4),
    repeat([K3,K,K3,K,K, K3,N,N,FU,N, N,N,OX,N,N, N,K,K4,K,K3], 4),
    repeat([K,K3,K,K3,K, K,N,N,N,N, N,N,N,N,N, N,K3,K,K3,K], 8),

    // transition: shift left to cols 2-11
    repeat([K3,K,K3,K,K, N,N,N,N,N, N,N,N,N,N, K,K3,K,K3,K], 5),
    repeat([K,K3,K,K3,N, N,N,N,N,N, N,N,N,N,K3, K,K3,K,K3,K], 5),
    repeat([K3,K,K3,N,N, N,N,N,N,N, N,N,N,K,K3, K,K3,K,K3,K], 5),

    // 2c: path at cols 2-11
    repeat([K3,K,N,N,N, N,N,N,N,N, N,N,K,K3,K, K3,K,K3,K,K3], 4),
    repeat([K,K3,N,N,N, N,N,N,N,N, N,N,K3,K,K3, K,K3,K,K3,K], 4),
    repeat([K3,K,N,N,FU, N,N,N,OX,N, N,N,K,K4,K3, K,K4,K,K3,K], 4),
    // transition rightward not shown yet — continued below

    // ===== 3. FUEL ALLEY (30r) =====
    repeat(F, 6),
    repeat([N,N,FU,N,OX, N,N,FU,N,N, N,N,FU,N,N, OX,N,FU,N,N], 8),
    repeat(F, 4),
    repeat([N,FU,N,N,N, OX,N,N,FU,N, N,FU,N,N,OX, N,N,N,FU,N], 8),
    repeat(F, 4),

    // ===== 4. TIGHTENING SLALOM (120r) =====
    // 4a: 8-wide path, moderate zigzag
    // Path starts cols 1-8, zigzags to 10-17, back to 2-9, then 11-18

    // cols 1-8 — jagged walls
    repeat([K3,N,N,N,N, N,N,N,N,K, K3,K,K3,K, K3,K,K3,K,K3,K], 5),
    repeat([K,N,N,N,N, N,N,N,N,K3, K,K3,K,K3, K,K3,K,K3,K,K3], 5),
    repeat([K3,N,N,FU,N, N,N,FU,N,K, K3,K4,K3,K, K3,K4,K3,K,K3,K], 4),
    // shift to cols 10-17
    repeat([K,K3,N,N,N, N,N,N,N,N, K3,K,K3,K, K3,K,K3,K,K3,K], 4),
    repeat([K3,K,K3,N,N, N,N,N,N,N, N,K,K3,K, K3,K,K3,K,K3,K], 4),
    repeat([K,K3,K,K3,K, N,N,N,N,N, N,N,K3,K, K3,K,K3,K,K3,K], 4),
    repeat([K3,K,K3,K,K3, K,K3,N,N,N, N,N,N,N,K, K3,K,K3,K,K3], 4),
    repeat([K,K3,K,K3,K, K3,K,K3,N,N, N,N,N,N,N, K,K3,K,K3,K], 4),
    // cols 10-17
    repeat([K3,K,K3,K,K3, K,K3,K,K3,K, N,N,N,N,N, N,N,N,K3,K], 6),
    repeat([K,K3,K,K3,K, K3,K,K3,K,K3, N,N,N,N,N, N,N,N,K,K3], 6),
    repeat([K3,K,K3,K,K3, K,K3,K,K3,K, N,N,FU,N,N, FU,N,N,K3,K], 4),

    // 4b: 6-wide, sharper zigzag to cols 2-7
    repeat([K,K3,K,K3,K, K3,K,K3,K,N, N,N,N,N,N, N,N,K3,K,K3], 4),
    repeat([K3,K,K3,K,K3, K,K3,N,N,N, N,N,N,N,K, K3,K,K3,K,K3], 4),
    repeat([K,K3,K,K3,K, N,N,N,N,N, N,K3,K,K3,K, K3,K,K3,K,K3], 4),
    repeat([K3,K,K3,N,N, N,N,N,N,K, K3,K,K3,K,K3, K,K3,K,K3,K], 4),
    // cols 2-7
    repeat([K,K3,N,N,N, N,N,N,K3,K, K3,K,K3,K,K3, K,K3,K,K3,K], 5),
    repeat([K3,K,N,N,N, N,N,N,K,K3, K,K3,K,K3,K, K3,K,K3,K,K3], 5),
    repeat([K,K3,N,FU,N, N,FU,N,K3,K, K3,K4,K3,K,K3, K,K4,K3,K,K3], 4),

    // shift to cols 12-17
    repeat([K3,K,K3,N,N, N,N,N,N,K, K3,K,K3,K,K3, K,K3,K,K3,K], 4),
    repeat([K,K3,K,K3,K, N,N,N,N,N, K3,K,K3,K,K3, K,K3,K,K3,K], 4),
    repeat([K3,K,K3,K,K3, K,K3,N,N,N, N,N,K,K3,K, K3,K,K3,K,K3], 4),
    repeat([K,K3,K,K3,K, K3,K,K3,K,N, N,N,N,N,K3, K,K3,K,K3,K], 4),
    // cols 12-17
    repeat([K3,K,K3,K,K3, K,K3,K,K3,K, K3,K,N,N,N, N,N,N,K3,K], 5),
    repeat([K,K3,K,K3,K, K3,K,K3,K,K3, K,K3,N,N,N, N,N,N,K,K3], 5),

    // 4c: 4-wide, rapid zigzag (K only — low enough to see over)
    // hold cols 12-15
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,N,N,N, N,K,K,K,K], 8),
    // sweep left: 2-lane shifts, 2-col overlap each step
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,N,N,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,N, N,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // hold cols 3-6
    repeat([K,K,K,N,N, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 4),
    repeat([K,K,K,N,FU, FU,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 4),
    // snap right: 2-lane shifts back to cols 14-17
    repeat([K,K,K,K,K, N,N,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,N, N,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,N, N,N,N,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,N,N,N,N, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,N,N, N,N,K,K,K], 2),
    // hold cols 14-17
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,N, N,N,N,K,K], 8),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,N, FU,N,N,K,K], 4),
    // snap far left to cols 1-4: 2-lane shifts
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,N,N,N, N,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,N,N,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,N,N, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,N,N,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // hold cols 1-4
    repeat([K,N,N,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 7),

    // ===== 5. DRAIN GAUNTLET (100r) =====
    // Drain blocks everywhere except winding 4-wide path
    // Path wanders: cols 3-6 (long) → 8-11 (snap) → 6-9 (hold) → 13-16 (snap) → 2-5

    // cols 3-6 — alternating drain heights for lava wave effect
    repeat([DF1,DF,DF1,N,N, N,N,DO1,DO_,DO1, DO_,DO1,DO_,DO1,DO_, DO1,DO_,DF1,DF,DF1], 6),
    repeat([DF,DF1,DF,N,N, N,N,DO_,DO1,DO_, DO1,DO_,DO1,DO_,DO1, DO_,DO1,DF,DF1,DF], 6),
    repeat([DF1,DF,DF1,N,FU, FU,N,DO1,DO_,DO1, DO_,DO1,DO_,DO1,DO_, DO1,DO_,DF1,DF,DF1], 4),
    repeat([DF,DF1,DF,N,N, N,N,DO_,DO1,DO_, DO1,DO_,DO1,DO_,DO1, DO_,DO1,DF,DF1,DF], 8),
    // shift to cols 8-11
    repeat([DO1,DO_,DO1,DO_,N, N,N,N,DO1,DO_, DO1,DO_,DO1,DF,DF1, DF,DF1,DF,DF1,DF], 4),
    repeat([DO_,DO1,DO_,DO1,DO_, N,N,N,N,DO1, DO_,DO1,DF1,DF,DF1, DF,DF1,DF,DF1,DF], 4),
    repeat([DO1,DO_,DO1,DO_,DO1, DO_,N,N,N,N, DO1,DO_,DF,DF1,DF, DF1,DF,DF1,DF,DF1], 4),
    // cols 8-11
    repeat([DF,DF1,DF,DF1,DF, DF1,DF,DF1,N,N, N,N,DO_,DO1,DO_, DO1,DO_,DO1,DO_,DO1], 6),
    repeat([DF1,DF,DF1,DF,DF1, DF,DF1,DF,N,N, N,N,DO1,DO_,DO1, DO_,DO1,DO_,DO1,DO_], 6),
    repeat([DF,DF1,DF,DF1,DF, DF1,DF,DF1,N,OX, OX,N,DO_,DO1,DO_, DO1,DO_,DO1,DO_,DO1], 4),
    // shift to cols 6-9
    repeat([DF1,DF,DF1,DF,DF1, DF,DF1,N,N,N, N,DO_,DO1,DO_,DO1, DO_,DO1,DO_,DO1,DO_], 4),
    // cols 6-9
    repeat([DO1,DO_,DO1,DO_,DO1, DO_,N,N,N,N, DF,DF1,DF,DF1,DF, DF1,DF,DF1,DF,DF1], 4),
    repeat([DO_,DO1,DO_,DO1,DO_, DO1,N,N,N,N, DF1,DF,DF1,DF,DF1, DF,DF1,DF,DF1,DF], 4),
    // snap right to cols 13-16
    repeat([DO1,DO_,DO1,DO_,DO1, DO_,DO1,N,N,N, N,DF,DF1,DF,DF1, DF,DF1,DF,DF1,DF], 4),
    repeat([DO_,DO1,DO_,DO1,DO_, DO1,DO_,DO1,N,N, N,N,DF1,DF,DF1, DF,DF1,DF,DF1,DF], 4),
    repeat([DO1,DO_,DO1,DO_,DO1, DO_,DO1,DO_,DO1,N, N,N,N,DF,DF1, DF,DF1,DF,DF1,DF], 4),
    repeat([DF1,DF,DF1,DF,DF1, DF,DO_,DO1,DO_,DO1, N,N,N,N,DO1, DO_,DO1,DO_,DF1,DF], 4),
    // cols 13-16
    repeat([DF,DF1,DF,DF1,DF, DF1,DF,DO_,DO1,DO_, DO1,DO_,DO1,N,N, N,N,DF1,DF,DF1], 6),
    repeat([DF1,DF,DF1,DF,DF1, DF,DF1,DO1,DO_,DO1, DO_,DO1,DO_,N,N, N,N,DF,DF1,DF], 6),
    // snap left to cols 2-5
    repeat([DF,DF1,DF,DF1,DF, DF1,DO_,DO1,DO_,DO1, DO_,DO1,N,N,N, N,DF1,DF,DF1,DF], 3),
    repeat([DF1,DF,DF1,DF,DF1, DO_,DO1,DO_,DO1,DO_, N,N,N,N,DF, DF1,DF,DF1,DF,DF1], 3),
    repeat([DF,DF1,DF,DO_,DO1, DO_,DO1,DO_,N,N, N,N,DF1,DF,DF1, DF,DF1,DF,DF1,DF], 3),
    repeat([DF1,DF,N,N,N, N,DO1,DO_,DO1,DO_, DO1,DO_,DF,DF1,DF, DF1,DF,DF1,DF,DF1], 3),
    // cols 2-5
    repeat([DO_,DO1,N,N,N, N,DF1,DF,DF1,DF, DF1,DF,DF1,DF,DF1, DF,DF1,DO_,DO1,DO_], 4),
    repeat([DO1,DO_,N,N,N, N,DF,DF1,DF,DF1, DF,DF1,DF,DF1,DF, DF1,DF,DO1,DO_,DO1], 4),

    // ===== 6. BREATHER (30r) =====
    repeat(F, 6),
    repeat([N,FU,N,OX,N, FU,N,N,OX,N, N,OX,N,N,FU, N,OX,N,FU,N], 8),
    repeat(F, 4),
    repeat([OX,N,N,FU,N, N,N,OX,N,FU, FU,N,OX,N,N, N,FU,N,N,OX], 8),
    repeat(F, 4),

    // ===== 7. RAZOR CORRIDOR (140r) =====
    // 3-wide kill-walled corridor that zigzags aggressively
    // This is the signature section

    // Funnel: walls close in from right, forcing player left
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,K,K], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,K, K,K,K,K,K], 2),
    repeat([N,N,N,N,N, N,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // Start: cols 2-4
    repeat([K,K,N,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // shift to cols 8-10
    repeat([K,K,K,N,N, N,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 3),
    repeat([K,K,K,K,N, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 3),
    repeat([K,K,K,K,K, N,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 3),
    repeat([K,K,K,K,K, K,N,N,N,K, K,K,K,K,K, K,K,K,K,K], 3),
    repeat([K,K,K,K,K, K,K,N,N,N, K,K,K,K,K, K,K,K,K,K], 3),
    // hold cols 8-10
    repeat([K,K,K,K,K, K,K,K,N,N, N,K,K,K,K, K,K,K,K,K], 8),
    // fuel pocket (5-wide for 4r)
    repeat([K,K,K,K,K, K,K,N,FU,N, FU,N,K,K,K, K,K,K,K,K], 4),
    // shift to cols 15-17
    repeat([K,K,K,K,K, K,K,K,K,N, N,N,K,K,K, K,K,K,K,K], 3),
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,N,K,K, K,K,K,K,K], 3),
    repeat([K,K,K,K,K, K,K,K,K,K, K,N,N,N,K, K,K,K,K,K], 3),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,N,N,N, K,K,K,K,K], 3),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,N,N, N,K,K,K,K], 3),
    // hold cols 15-17
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,K, N,N,N,K,K], 8),
    // snap left to cols 4-6
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,N,N, N,K,K,K,K], 3),
    repeat([K,K,K,K,K, K,K,K,K,K, K,N,N,N,K, K,K,K,K,K], 3),
    repeat([K,K,K,K,K, K,K,K,K,N, N,N,K,K,K, K,K,K,K,K], 3),
    repeat([K,K,K,K,K, K,K,N,N,N, K,K,K,K,K, K,K,K,K,K], 3),
    repeat([K,K,K,K,K, N,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 3),
    // hold cols 4-6
    repeat([K,K,K,K,N, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 8),
    repeat([K,K,K,K,N, FU,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 4),
    // shift to cols 12-14
    repeat([K,K,K,K,K, N,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, N,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,N, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,N,K,K, K,K,K,K,K], 2),
    // hold cols 12-14
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,N,N,N, K,K,K,K,K], 10),
    // quick snap to cols 1-3
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,N,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, N,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,N, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,N,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // hold cols 1-3
    repeat([K,N,N,N,K, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 4),
    repeat([K,N,FU,N,K, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // shift to cols 16-18 (1-lane steps, 3-wide corridor)
    repeat([K,K,N,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,N,N, N,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,N, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, N,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, N,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,N, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,N,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,N,N,N,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,N,N,N, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,N,N, N,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,N, N,N,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,K, N,N,N,K,K], 2),
    // hold cols 16-18
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,K, K,N,N,N,K], 4),
    // snap to cols 6-8
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,N, N,N,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,N,N,N, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,N,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, N,K,K,K,K, K,K,K,K,K], 2),
    // hold cols 6-8
    repeat([K,K,K,K,K, K,N,N,N,K, K,K,K,K,K, K,K,K,K,K], 6),
    // fuel pocket
    repeat([K,K,K,K,K, N,FU,N,FU,N, K,K,K,K,K, K,K,K,K,K], 2),
    // shift to cols 11-13
    repeat([K,K,K,K,K, K,K,N,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, N,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,N, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,N,K,K, K,K,K,K,K], 2),
    // hold cols 11-13
    repeat([K,K,K,K,K, K,K,K,K,K, K,N,N,N,K, K,K,K,K,K], 8),
    // snap to cols 0-2
    repeat([K,K,K,K,K, K,K,K,K,N, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, N,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,N,N, N,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // hold cols 0-2
    repeat([N,N,N,K,K, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 6),
    // shift to cols 9-11
    repeat([K,N,N,N,K, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,N,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,N, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    // hold cols 9-11
    repeat([K,K,K,K,K, K,K,K,K,N, N,N,K,K,K, K,K,K,K,K], 8),
    // fuel pocket
    repeat([K,K,K,K,K, K,K,K,N,FU, N,FU,N,K,K, K,K,K,K,K], 4),

    // ===== 8. THE SCRAMBLE (182r) =====
    // Kill blocks scattered asymmetrically, player threads through gaps
    // No single corridor — multiple viable paths
    // All K (h=2): unjumpable but low enough to see over

    // sparse zone — scattered kill blocks, wide gaps
    repeat([N,N,K,N,N, N,N,N,K,N, N,N,N,N,K, N,N,N,N,N], 6),
    repeat([N,N,N,N,K, N,N,N,N,N, N,K,N,N,N, N,N,K,N,N], 6),
    repeat([K,N,N,N,N, N,N,K,N,N, K,N,N,N,N, N,K,N,N,N], 6),
    repeat([N,N,N,K,N, N,N,N,N,K, N,N,K,N,N, N,N,N,N,K], 6),
    // medium density — pillar clusters, 2+ wide gaps
    repeat([K,K,N,N,N, K,N,N,K,K, N,N,N,K,N, N,K,K,N,N], 6),
    repeat([N,N,K,K,N, N,N,K,N,N, K,N,N,N,K, K,N,N,N,K], 6),
    repeat([K,N,N,K,K, N,N,N,N,K, K,N,N,K,N, N,N,K,N,N], 6),
    // fuel/oxy scattered among blocks
    repeat([N,FU,N,K,N, N,K,N,OX,N, K,N,N,N,K, N,FU,N,K,K], 6),
    repeat([K,N,N,N,K, K,N,FU,N,N, N,K,K,N,N, OX,N,N,K,K], 6),
    // dense zone — through-lanes at 3-4 and 14-15, other gaps shift
    repeat([K,K,K,N,N, K,N,N,K,K, K,N,N,K,N, N,K,K,K,K], 6),
    repeat([K,K,K,N,N, K,K,K,N,N, K,K,K,K,N, N,K,N,N,K], 6),
    repeat([N,N,K,N,N, K,K,N,N,K, K,K,K,K,N, N,K,K,N,N], 6),
    // fuel break
    repeat([N,N,FU,N,N, K,N,N,N,FU, N,K,N,N,N, N,K,N,FU,N], 6),
    // more density — through-lanes at 7-8, other gaps shift, heavy left
    repeat([K,K,K,N,N, K,K,N,N,K, K,K,N,N,K, K,N,N,K,K], 6),
    repeat([K,K,N,N,K, K,K,N,N,K, K,N,N,K,K, K,N,N,K,K], 6),
    repeat([K,N,N,K,K, K,K,N,N,K, N,N,K,K,K, K,N,N,N,K], 6),
    repeat([K,K,N,N,K, K,K,N,N,K, K,K,N,N,K, K,N,N,K,K], 6),
    // open pocket with fuel
    repeat([N,FU,N,N,K, N,OX,N,N,N, K,N,N,FU,N, K,N,OX,N,N], 6),
    // final dense burst — through-lanes at 3-4 and 11-12
    repeat([K,K,K,N,N, K,K,K,N,N, K,N,N,K,K, N,N,K,K,K], 6),
    repeat([K,K,K,N,N, K,N,N,K,K, K,N,N,K,K, K,N,N,K,K], 6),
    // false clearing — lone blocks, lulls player
    repeat([N,N,N,N,N, N,N,K,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,K,N,N,N, N,N,N,N,N], 4),
    // slam back into dense — through-lanes at 2-3 and 13-14
    repeat([K,K,N,N,K, K,K,N,N,K, K,K,K,N,N, K,K,N,N,K], 6),
    repeat([K,K,N,N,K, N,N,K,K,K, K,K,K,N,N, K,K,K,N,N], 6),
    repeat([K,K,N,N,K, K,N,N,K,K, K,K,K,N,N, K,N,N,K,K], 6),
    // heavy left, lighter right
    repeat([K,K,K,N,N, K,K,N,N,K, N,N,N,N,N, N,N,N,N,N], 6),
    repeat([K,N,N,K,N, N,N,N,K,N, N,N,N,N,N, K,N,N,N,K], 6),
    // diagonal stripes
    repeat([K,N,N,N,K, N,N,N,K,N, N,N,K,N,N, N,K,N,N,N], 6),
    repeat([N,N,N,K,N, N,N,K,N,N, N,K,N,N,N, K,N,N,N,K], 6),
    // fuel/oxy pocket
    repeat([N,FU,N,N,N, K,N,OX,N,N, N,K,N,N,FU, N,N,OX,N,N], 6),
    // one more dense wall — through-lanes at 5-6 and 13-14
    repeat([K,K,K,K,K, N,N,K,K,K, K,K,K,N,N, K,K,N,N,K], 6),

    // ===== 9. RESOURCE STATION (30r) =====
    repeat(F, 4),
    repeat([FU,N,OX,N,FU, N,OX,N,FU,N, OX,N,FU,N,OX, N,FU,N,OX,FU], 8),
    repeat(F, 4),
    repeat([OX,FU,N,OX,N, FU,N,OX,FU,N, N,FU,OX,N,FU, OX,N,FU,OX,N], 8),
    repeat(F, 6),

    // ===== 10. DRAIN SPRINT (80r) =====
    // All drain except 3-wide path, barely weaving. Must go fast.

    // cols 9-11, long straight — wave drain heights
    repeat([DO1,DO_,DO1,DO_,DO1, DO_,DO1,DO_,DO1,N, N,N,DF1,DF,DF1, DF,DF1,DF,DF1,DF], 8),
    repeat([DO_,DO1,DO_,DO1,DO_, DO1,DO_,DO1,DO_,N, N,N,DF,DF1,DF, DF1,DF,DF1,DF,DF1], 8),
    repeat([DO1,DO_,DO1,DO_,DO1, DO_,DO1,DO_,DO1,N, FU,N,DF1,DF,DF1, DF,DF1,DF,DF1,DF], 4),
    // shift to cols 6-8
    repeat([DO_,DO1,DO_,DO1,DO_, DO1,DO_,DO1,N,N, N,DF1,DF,DF1,DF, DF1,DF,DF1,DF,DF1], 4),
    repeat([DO1,DO_,DO1,DO_,DO1, DO_,DO1,N,N,N, DF,DF1,DF,DF1,DF, DF1,DF,DF1,DF,DF1], 4),
    // cols 6-8, hold
    repeat([DF1,DF,DF1,DF,DF1, DF,N,N,N,DO1, DO_,DO1,DO_,DO1,DO_, DO1,DO_,DO1,DO_,DO1], 6),
    repeat([DF,DF1,DF,DF1,DF, DF1,N,N,N,DO_, DO1,DO_,DO1,DO_,DO1, DO_,DO1,DO_,DO1,DO_], 6),
    repeat([DF1,DF,DF1,DF,DF1, DF,N,OX,N,DO1, DO_,DO1,DO_,DO1,DO_, DO1,DO_,DO1,DO_,DO1], 4),
    // shift to cols 13-15
    repeat([DF,DF1,DF,DF1,DF, DF1,DF,N,N,N, DO1,DO_,DO1,DO_,DO1, DO_,DO1,DO_,DO1,DO_], 4),
    repeat([DF1,DF,DF1,DF,DF1, DF,DF1,DF,N,N, N,DO_,DO1,DO_,DO1, DO_,DO1,DO_,DO1,DO_], 4),
    repeat([DO1,DO_,DO1,DO_,DO1, DF,DF1,DF,DF1,N, N,N,DO_,DO1,DO_, DO1,DO_,DO1,DO_,DO1], 4),
    repeat([DO_,DO1,DO_,DO1,DO_, DO1,DF,DF1,DF,DF1, N,N,N,DO1,DO_, DO1,DO_,DO1,DO_,DO1], 4),
    // cols 13-15, hold
    repeat([DO1,DO_,DO1,DO_,DO1, DO_,DO1,DF,DF1,DF, DF1,DF,DF1,N,N, N,DO_,DO1,DO_,DO1], 8),
    repeat([DO_,DO1,DO_,DO1,DO_, DO1,DO_,DF1,DF,DF1, DF,DF1,DF,N,N, N,DO1,DO_,DO1,DO_], 8),
    repeat([DO1,DO_,DO1,DO_,DO1, DO_,DO1,DF,DF1,DF, DF1,DF,DF1,N,FU, N,DO_,DO1,DO_,DO1], 4),
    // shift to cols 3-5
    repeat([DO_,DO_,DO_,DO_,DO_, DO_,DF,DF,DF,DF, DF,DF,N,N,N, DO_,DO_,DO_,DO_,DO_], 4),
    // hold cols 3-5 — wave drain heights
    repeat([DF1,DF,DF1,N,N, N,DO1,DO_,DO1,DO_, DO1,DO_,DO1,DO_,DO1, DO_,DO1,DF1,DF,DF1], 7),
    repeat([DF,DF1,DF,N,N, N,DO_,DO1,DO_,DO1, DO_,DO1,DO_,DO1,DO_, DO1,DO_,DF,DF1,DF], 7),
    repeat([DF1,DF,DF1,N,OX, N,DO1,DO_,DO1,DO_, DO1,DO_,DO1,DO_,DO1, DO_,DO1,DF1,DF,DF1], 4),
    // shift to cols 10-12
    repeat([DF,DF,DF,DF,N, N,N,DO_,DO_,DO_, DO_,DO_,DO_,DO_,DO_, DO_,DF,DF,DF,DF], 4),
    repeat([DO_,DO_,DF,DF,DF, N,N,N,DO_,DO_, DO_,DO_,DO_,DO_,DO_, DF,DF,DF,DO_,DO_], 4),
    repeat([DO_,DO_,DO_,DF,DF, DF,N,N,N,DO_, DO_,DO_,DO_,DO_,DF, DF,DF,DO_,DO_,DO_], 4),
    repeat([DO_,DO_,DO_,DO_,DF, DF,DF,N,N,N, DO_,DO_,DO_,DF,DF, DF,DO_,DO_,DO_,DO_], 4),
    // hold cols 10-12 — wave drain heights
    repeat([DO1,DO_,DO1,DO_,DO1, DF1,DF,DF1,DF,DF1, N,N,N,DF1,DF, DF1,DO1,DO_,DO1,DO_], 7),
    repeat([DO_,DO1,DO_,DO1,DO_, DF,DF1,DF,DF1,DF, N,N,N,DF,DF1, DF,DO_,DO1,DO_,DO1], 7),
    repeat([DO1,DO_,DO1,DO_,DO1, DF1,DF,DF1,DF,DF1, N,OX,N,DF1,DF, DF1,DO1,DO_,DO1,DO_], 4),
    // shift to cols 1-3
    repeat([DO_,DO_,DO_,DO_,DF, DF,DF,DF,DF,N, N,N,DF,DF,DF, DO_,DO_,DO_,DO_,DO_], 4),
    repeat([DO_,DO_,DO_,DF,DF, DF,DF,N,N,N, DF,DF,DF,DF,DO_, DO_,DO_,DO_,DO_,DO_], 4),
    repeat([DO_,DO_,DF,DF,DF, N,N,N,DF,DF, DF,DF,DF,DO_,DO_, DO_,DO_,DO_,DO_,DO_], 4),
    // hold cols 1-3 — wave drain heights
    repeat([DF1,N,N,N,DO1, DO_,DO1,DO_,DO1, DO_,DO1,DO_,DF1,DF, DF1,DF,DF1,DF,DF1,DF], 7),
    repeat([DF,N,N,N,DO_, DO1,DO_,DO1,DO_, DO1,DO_,DO1,DF,DF1, DF,DF1,DF,DF1,DF,DF1], 7),
    repeat([DF1,N,OX,N,DO1, DO_,DO1,DO_,DO1, DO_,DO1,DO_,DF1,DF, DF1,DF,DF1,DF,DF1,DF], 4),

    // ===== 10b. LAST CHANCE (20r) =====
    // Brief refuel before the corridor of death
    repeat(F, 4),
    repeat([N,FU,N,N,OX, N,N,FU,N,N, N,N,OX,N,N, FU,N,N,OX,N], 6),
    repeat(F, 4),
    repeat([OX,N,N,FU,N, N,OX,N,N,FU, N,FU,N,N,OX, N,N,FU,N,OX], 6),

    // ===== 11. CORRIDOR OF DEATH (246r) =====
    // 2-wide kill-walled corridor, fast sustained zigzag
    // All shifts use 1-lane steps for navigability

    // Funnel: walls close in, forcing player to cols 3-4
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,K,K], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,N,N, N,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // hold 3-4
    repeat([K,K,K,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 4),
    // shift right to 9-10
    repeat([K,K,K,K,N, N,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,N, N,K,K,K,K, K,K,K,K,K], 2),
    // hold 9-10
    repeat([K,K,K,K,K, K,K,K,K,N, N,K,K,K,K, K,K,K,K,K], 2),
    // shift left to 3-4
    repeat([K,K,K,K,K, K,K,K,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,N, N,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // hold 3-4 + fuel
    repeat([K,K,K,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,N,FU, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // shift right to 12-13
    repeat([K,K,K,K,N, N,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,N, N,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,N,N,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,N,N,K, K,K,K,K,K], 2),
    // hold 12-13
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,N,N,K, K,K,K,K,K], 2),
    // shift left to 5-6
    repeat([K,K,K,K,K, K,K,K,K,K, K,N,N,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,N, N,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // hold 5-6 + fuel
    repeat([K,K,K,K,K, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, N,FU,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // shift right to 15-16
    repeat([K,K,K,K,K, K,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,N, N,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,N,N,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,N,N,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,N,N, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,N, N,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,K, N,N,K,K,K], 2),
    // hold 15-16
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,K, N,N,K,K,K], 2),
    // shift left to 7-8
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,N, N,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,N,N, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,N,N,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,N,N,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,N, N,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    // hold 7-8
    repeat([K,K,K,K,K, K,K,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    // shift right to 16-17
    repeat([K,K,K,K,K, K,K,K,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,N, N,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,N,N,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,N,N,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,N,N, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,N, N,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,K, N,N,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,K, K,N,N,K,K], 2),
    // hold 16-17 + fuel
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,K, K,N,N,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,K, K,N,FU,K,K], 2),
    // shift left to 1-2
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,K, N,N,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,K,N, N,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,K,N,N, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,K,N,N,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, K,N,N,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,K, N,N,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,N, N,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,N, N,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,N,N,K, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,N,N,K,K, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // hold 1-2
    repeat([K,N,N,K,K, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 4),
    // shift right to 9-10
    repeat([K,K,N,N,K, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,N, N,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,K,N, N,K,K,K,K, K,K,K,K,K], 2),
    // hold 9-10 + fuel
    repeat([K,K,K,K,K, K,K,K,K,N, N,K,K,K,K, K,K,K,K,K], 4),
    repeat([K,K,K,K,K, K,K,K,K,N, FU,K,K,K,K, K,K,K,K,K], 2),
    // shift left to 3-4
    repeat([K,K,K,K,K, K,K,K,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,N, N,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    // hold 3-4
    repeat([K,K,K,N,N, K,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 4),
    // shift right to 8-9 — sets up for gauntlet entry at 9-11
    repeat([K,K,K,K,N, N,K,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, N,N,K,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,N,N,K,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,N,N,K, K,K,K,K,K, K,K,K,K,K], 2),
    repeat([K,K,K,K,K, K,K,K,N,N, K,K,K,K,K, K,K,K,K,K], 2),
    // hold 8-9 + fuel
    repeat([K,K,K,K,K, K,K,K,N,N, K,K,K,K,K, K,K,K,K,K], 6),
    repeat([K,K,K,K,K, K,K,K,N,FU, K,K,K,K,K, K,K,K,K,K], 2),

    // ===== 12. FINAL GAUNTLET (80r) =====
    // Kill walls + drain blocks combined. 3-wide safe path.

    // cols 9-11 — kill walls jagged, drain waves
    repeat([K3,DF1,DF,DF1,K, K3,DO1,DO_,DO1,N, N,N,DO_,DO1,K3, K,DF1,DF,DF1,K3], 4),
    repeat([K,DF,DF1,DF,K3, K,DO_,DO1,DO_,N, N,N,DO1,DO_,K, K3,DF,DF1,DF,K], 4),
    // shift to 3-5
    repeat([K3,DF1,DF,DF1,K, K3,DO1,DO_,N,N, N,DO1,DO_,K3,K, DF1,DF,DF1,K,K3], 3),
    repeat([K,DF1,DF,K3,K, DO1,DO_,N,N,N, DO_,DO1,K,K3,DF1, DF,DF1,K3,K,K3], 3),
    repeat([K3,DF1,K,K3,DO1, DO_,N,N,N,DO1, DO_,K3,K,DF1,DF, DF1,K,K3,K,K3], 3),
    repeat([K,K3,K,N,N, N,DO1,DO_,DO1,K3, K,DF1,DF,DF1,DF, K3,K,K3,K,K3], 3),
    // hold 3-5
    repeat([K3,K,K3,N,N, N,K,DO1,DO_,DO1, K3,K,DF1,DF,DF1, K,K3,K,K3,K], 4),
    repeat([K,K3,K,N,N, N,K3,DO_,DO1,DO_, K,K3,DF,DF1,DF, K3,K,K3,K,K3], 4),
    repeat([K3,K,K3,N,FU, N,K,DO1,DO_,DO1, K3,K,DF1,DF,DF1, K,K3,K,K3,K], 4),
    // shift to 14-16
    repeat([K,K3,K,K3,N, N,N,K,DO1,DO_, K3,K,DF1,DF,K3,K, K3,K,K3,K], 3),
    repeat([K3,K,K3,K,K3, N,N,N,K,DO1, DO_,K3,DF1,K,K3,K, K3,K,K3,K], 3),
    repeat([K,DF1,K3,K,K3, K,N,N,N,K3, DO1,DO_,K,K3,K,K3, K,K3,K,K3], 3),
    repeat([K3,DF,DF1,K,K3, K,K3,N,N,N, K,DO1,DO_,K3,K, K3,K,K3,K,K3], 3),
    repeat([K,DF1,DF,DF1,K3, K,K3,K,N,N, N,K3,DO1,DO_,K, K3,K,K3,K,K3], 3),
    repeat([K3,DF,DF1,DF,K, K3,K,K3,K,N, N,N,K,DO1,DO_, K,K3,K,K3,K], 3),
    repeat([K,DF1,DF,DF1,K3, K,K3,K,K3,K, N,N,N,K3,DO1, DO_,K,K3,K,K3], 3),
    repeat([K3,DF,DF1,K,K3, K,K3,K,K3,K, K3,N,N,N,K, DO1,DO_,K3,K,K3], 3),
    // hold 14-16
    repeat([K,DF1,DF,DF1,K3, K,K3,DO1,DO_,DO1, K,K3,K,K3,N,N, N,K,K3,K], 4),
    repeat([K3,DF,DF1,DF,K, K3,K,DO_,DO1,DO_, K3,K,K3,K,N,N, N,K3,K,K3], 4),
    repeat([K,DF1,DF,DF1,K3, K,K3,DO1,DO_,DO1, K,K3,K,K3,N,FU, N,K,K3,K], 4),
    // shift to 7-9
    repeat([K3,DF,DF1,DF,K, K3,DO1,DO_,DO1,K, K3,K,K3,N,N,N, K,K3,K,K3], 3),
    repeat([K,DF1,DF,K3,K, DO1,DO_,DO1,K3,K, K3,K,N,N,N,K3, K,K3,K,K3], 3),
    repeat([K3,DF1,K,K3,DO1, DO_,DO1,K,K3,K, K3,N,N,N,K,K3, K,K3,K,K3], 3),
    repeat([K,K3,K,DO1,DO_, DO_,K3,K,K3,K, N,N,N,K,K3,K, K3,DF1,DF,K3], 3),
    // hold 7-9
    repeat([K3,K,DO1,DO_,DO1, K,K3,N,N,N, K,K3,K,DF1,DF, DF1,K,K3,K,K3], 4),
    repeat([K,K3,DO_,DO1,DO_, K3,K,N,N,N, K3,K,K3,DF,DF1, DF,K3,K,K3,K], 4),

    // ===== 13. VICTORY STRAIGHT (10r) =====
    repeat(F, 6),
    repeat([N,N,N,N,N, N,N,N,W,W, W,W,N,N,N, N,N,N,N,N], 1),
    repeat(F, 3)
  )
});
