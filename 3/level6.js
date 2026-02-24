// Level 6: "Breathless" — oxygen economy
// See level6-design.md for full design document
//
// Fuel drain blocks at the start empty your tank. No fuel pickups exist.
// Every action burns oxygen — your lifeline is your propellant.

// Shorthands
var KF6 = [B.KILL, S.FLAT];           // kill floor at h=0
var KW6 = [B.KILL, S.FLAT, 2];        // kill wall h=2
var KW6_3 = [B.KILL, S.FLAT, 3];      // kill wall h=3
var KW6_4 = [B.KILL, S.FLAT, 4];      // kill wall h=4
var DF6 = [B.DRAIN_FUEL, S.FLAT];     // fuel drain (SAFE — no fuel!)
var DF6_1 = [B.DRAIN_FUEL, S.FLAT, 1]; // raised fuel drain
var DO6 = [B.DRAIN_OXY, S.FLAT];      // oxy drain (DEADLY)
var DO6_1 = [B.DRAIN_OXY, S.FLAT, 1]; // raised oxy drain
var OX6 = [B.OXYGEN, S.FLAT];
var W6 = [B.WIN_TUNNEL, S.FLAT];

LEVELS.push({
  name: "Breathless",
  gridColors: [0x664422, 0x775533],
  rows: concat(
    // ===== 1. THE DRAIN (40r) =====

    // 1a: Fuel drain floor (30r) — immediate, all 20 lanes, wave heights = flowing lava
    repeat([DF6,DF6_1,DF6,DF6,DF6_1, DF6,DF6,DF6_1,DF6,DF6, DF6,DF6_1,DF6,DF6,DF6_1, DF6,DF6,DF6_1,DF6,DF6], 6),
    repeat([DF6_1,DF6,DF6_1,DF6,DF6, DF6_1,DF6,DF6,DF6_1,DF6, DF6_1,DF6,DF6_1,DF6,DF6, DF6_1,DF6,DF6,DF6_1,DF6], 6),
    // Oxy hint at row ~15 — first sign that oxygen matters
    repeat([DF6,DF6_1,DF6,DF6,DF6_1, DF6,DF6,DF6_1,DF6,OX6, OX6,DF6_1,DF6,DF6,DF6_1, DF6,DF6,DF6_1,DF6,DF6], 6),
    repeat([DF6_1,DF6,DF6,DF6_1,DF6, DF6,DF6_1,DF6,DF6,DF6_1, DF6,DF6,DF6_1,DF6,DF6, DF6_1,DF6,DF6,DF6_1,DF6_1], 6),
    repeat([DF6,DF6,DF6_1,DF6,DF6_1, DF6,DF6,DF6_1,DF6,DF6, DF6_1,DF6,DF6,DF6_1,DF6, DF6,DF6_1,DF6,DF6,DF6_1], 6),

    // 1b: The reality (10r) — normal ground, fuel stays at 0
    repeat(F, 10),

    // ===== 2. SHALLOW BREATHS (140r) =====
    // Gentle terrain, inline oxy stations. Learn the rhythm.

    // 2a: First run (40r) — features escalate toward station
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    // Small bump — first sign of terrain
    repeat([N,N,N,N,H(1), H(1),N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Gap + bump on opposite side
    repeat([N,N,N,N,N, N,N,N,0,0, N,N,N,N,N, H(1),H(1),N,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Kill blocks — first danger
    repeat([N,N,N,N,N, KF6,KF6,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,KF6,N, N,N,N,N,N], 2),
    // Paired bumps — visual interest
    repeat([N,N,H(1),N,N, N,N,N,N,N, N,N,N,N,N, N,N,H(1),N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // DF6 patch — early reminder that orange is harmless
    repeat([N,N,N,N,N, N,N,N,DF6,DF6, N,N,N,N,N, N,N,N,N,N], 2),
    // DO6 patch — first taste of oxy-specific danger
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,DO6,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Kill blocks denser before station — building intensity
    repeat([N,N,N,N,N, N,N,N,N,N, N,KF6,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,KF6,N, N,N,N,N,N, N,N,N,N,N, N,KF6,N,N,N], 4),

    // 2b: First station (10r)
    repeat(F, 2),
    repeat([N,N,N,N,N, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, N,N,N,N,N], 6),
    repeat(F, 2),

    // 2c: Second run (40r) — h=1/h=2 ridges, wider gaps, varied spacing
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Ridge left
    repeat([N,N,N,H(1),H(1), H(1),H(1),H(1),N,N, N,N,N,N,N, N,N,N,N,N], 4),
    // Quick gap right
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,0,0,0, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Center kill blocks
    repeat([N,N,N,N,N, N,N,N,N,KF6, KF6,N,N,N,N, N,N,N,N,N], 2),
    // H(2) wall — taller than before
    repeat([N,N,N,N,N, N,H(2),H(2),H(2),N, N,N,N,N,N, N,N,N,N,N], 6),
    // Ridge right + gap left close together (6r total, not 8)
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,H(1), H(1),H(1),N,N,N], 2),
    repeat([N,N,N,N,0, 0,0,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    // Kill blocks + DF6 hint
    repeat([N,N,N,N,N, N,N,N,N,N, N,KF6,KF6,N,N, DF6,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 6),
    repeat(F, 4),

    // 2d: Second station (10r)
    repeat(F, 2),
    repeat([N,N,N,N,N, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, N,N,N,N,N], 6),
    repeat(F, 2),

    // 2e: Third run (30r) — kill blocks in pairs, h=1 ridges
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,KF6,KF6,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,H(1),H(1),N, N,N,N,N,KF6, KF6,N,N,N,N], 6),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,KF6,KF6, N,N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,H(1), H(1),N,N,N,N, N,N,N,N,N, KF6,N,N,N,N], 6),
    // DF6 streaks + DO6 warning approach the station — L6 flavor
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,DF6, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,DO6,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),

    // 2f: Mini station (10r)
    repeat(F, 2),
    repeat([N,N,N,N,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,N,N,N,N], 6),
    repeat(F, 2),

    // ===== 3. JUMP TAX (140r) =====
    // Every jump costs 3 oxy. Minimize unnecessary jumps.

    // 3a: Gentle jumps (40r) — H(1) ridges, must jump
    repeat(F, 6),
    // Ridge 1: wide, cols 2-17. DO6 just before = sloppy approach costs oxy
    repeat([N,N,N,N,N, N,N,N,DO6,DO6, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),N,N], 2),
    repeat(F, 2),
    repeat([N,N,N,N,N, N,N,N,N,OX6, OX6,N,N,N,N, N,N,N,N,N], 4),
    // Ridge 2: wide, cols 1-18
    repeat([N,H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),N], 2),
    repeat(F, 6),
    // Ridge 3: full width, DF6 on top — inversion foreshadow (safe to land on!)
    repeat([DF6,H(1),H(1),H(1),H(1), H(1),H(1),H(1),DF6_1,H(1), H(1),DF6_1,H(1),H(1),H(1), H(1),H(1),H(1),H(1),DF6], 2),
    repeat(F, 6),
    repeat([N,N,N,N,N, N,N,N,OX6,N, N,OX6,N,N,N, N,N,N,N,N], 4),
    repeat(F, 4),

    // 3b: Choice jumps (40r) — wide vs narrow obstacles, minor features between
    // Ridge 1: cols 2-17 (16-wide). Jump = 3 oxy. Walk-around ≈ 6 oxy.
    repeat([N,N,H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),N,N], 2),
    repeat(F, 4),
    // Kill block + DF6 between ridges — L6 flavor in the gaps
    repeat([N,N,N,N,N, N,N,KF6,N,N, N,N,DF6,DF6,N, N,N,N,N,N], 2),
    repeat(F, 6),
    // Ridge 2: cols 6-13 (8-wide). Jump = 3 oxy. Walk-around ≈ 3 oxy.
    repeat([N,N,N,N,N, N,H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),N, N,N,N,N,N], 2),
    repeat(F, 2),
    // DO6 patch between ridges — sloppy cruising costs oxy
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,DO6,DO6, N,N,N,N,N], 2),
    repeat(F, 4),
    // Ridge 3: cols 8-11 (4-wide). Jump = 3 oxy. Walk-around ≈ 1.5 oxy.
    repeat([N,N,N,N,N, N,N,N,H(1),H(1), H(1),H(1),N,N,N, N,N,N,N,N], 2),
    repeat(F, 4),
    // DF6 patch on approach to oxy — trust the orange
    repeat([N,N,N,N,N, N,N,DF6,DF6,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,OX6, OX6,N,N,N,N, N,N,N,N,N], 4),
    repeat(F, 4),

    // 3c: Expensive jumps (30r) — rapid ridges + reward
    // 4 ridges close together (6r apart). DO6 patches between = sloppy landing hurts
    repeat([H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1)], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,DO6,N, N,N,N,N,N], 4),
    repeat([H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1)], 2),
    repeat([N,N,N,N,DO6, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    repeat([H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1)], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, DO6,N,N,N,N], 4),
    repeat([H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1)], 2),
    // Reward: oxy between H(1) borders
    repeat([N,N,N,N,N, N,N,H(1),OX6,OX6, OX6,OX6,H(1),N,N, N,N,N,N,N], 4),
    repeat(F, 6),

    // 3d: Mixed terrain (30r) — gaps, ridges, kill blocks + L6 accents
    repeat([N,N,N,0,0, 0,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,H(1),H(1),H(1), H(1),H(1),H(1),N,N], 6),
    repeat([N,N,N,N,N, KF6,KF6,KF6,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Gap with DF6 bridge — trust the orange even in mixed terrain
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,0,DF6, 0,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),N, N,N,N,N,N], 2),
    // DO6 near kill blocks — L6 flavor
    repeat([N,N,N,N,N, N,N,N,N,DO6, KF6,KF6,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,0,0,0, N,N,N,N,N, N,N,N,N,N, N,0,0,N,N], 6),
    repeat(F, 6),

    // ===== 4. OXYGEN STATION (30r) =====
    repeat(F, 4),
    repeat([OX6,N,OX6,N,OX6, N,OX6,N,OX6,N, OX6,N,OX6,N,OX6, N,OX6,N,OX6,N], 8),
    repeat(F, 4),
    repeat([N,OX6,N,OX6,N, OX6,N,OX6,N,OX6, N,OX6,N,OX6,N, OX6,N,OX6,N,OX6], 8),
    repeat(F, 6),

    // ===== 5. THE INVERSION (156r) =====
    // Fuel drain = SAFE. Oxy drain = DEADLY. Unlearn your instincts.

    // 5a: Introduction (30r) — fuel drain side is EASIER
    // Left: fuel drain with wave bumps (safe, visual texture).
    // Right: normal ground with kill blocks + DO6 warning.
    repeat([DF6,DF6,DF6_1,DF6,DF6, DF6,DF6_1,DF6,DF6,DF6, N,N,N,N,N, N,N,N,N,N], 4),
    repeat([DF6,DF6,DF6,DF6,DF6_1, DF6,DF6,DF6,DF6,DF6, N,N,KF6,KF6,N, N,N,N,N,N], 6),
    repeat([DF6_1,DF6,DF6,DF6,DF6, DF6,DF6,DF6_1,DF6,DF6, N,N,N,N,N, N,KF6,KF6,N,N], 6),
    repeat([DF6,DF6,DF6,DF6_1,DF6, DF6,DF6,DF6,DF6,DF6, N,N,N,DO6,KF6, N,N,N,N,N], 4),
    repeat([DF6,DF6_1,DF6,DF6,DF6, DF6,DF6,DF6,DF6_1,DF6, N,N,N,N,N, KF6,KF6,N,N,N], 6),
    // Reward for fuel-drain walkers
    repeat([DF6,DF6,DF6,OX6,OX6, DF6,DF6,DF6,DF6,DF6, N,N,N,N,N, N,N,N,OX6,N], 4),

    // 5b: The trick (40r) — alternating DF/DO strips
    // Pattern: DF DF DF DF | DO DO DO DO | DF DF DF DF | DO DO DO DO | DF DF DF DF
    repeat([DF6,DF6,DF6,DF6,DO6, DO6,DO6,DO6,DF6,DF6, DF6,DF6,DO6,DO6,DO6, DO6,DF6,DF6,DF6,DF6], 6),
    // Kill blocks on fuel drain strips — must dodge on safe ground
    repeat([DF6,KF6,DF6,DF6,DO6, DO6,DO6,DO6,DF6,DF6, DF6,DF6,DO6,DO6,DO6, DO6,DF6,DF6,KF6,DF6], 6),
    repeat([DF6,DF6,DF6,DF6,DO6, DO6,DO6,DO6,DF6,KF6, KF6,DF6,DO6,DO6,DO6, DO6,DF6,DF6,DF6,DF6], 6),
    repeat([DF6,DF6,KF6,DF6,DO6, DO6,DO6,DO6,DF6,DF6, DF6,DF6,DO6,DO6,DO6, DO6,DF6,KF6,DF6,DF6], 6),
    // Oxy reward on center fuel drain strip
    repeat([DF6,DF6,DF6,DF6,DO6, DO6,DO6,DO6,DF6,OX6, OX6,DF6,DO6,DO6,DO6, DO6,DF6,DF6,DF6,DF6], 6),
    repeat(F, 4),
    // Brief transition
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),

    // 5c: Rivers (40r) — oxy drain rivers with wave heights across full track
    // River 1: 2-wide, fuel drain bridge at cols 9-10
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 6),
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DF6, DF6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 6),
    // River 2: 3-wide, fuel drain bridge at cols 4-5
    repeat([DO6_1,DO6,DO6_1,DO6,DF6, DF6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 3),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 5),
    // River 3: 2-wide, fuel drain bridge at cols 14-15
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DF6, DF6,DO6_1,DO6,DO6_1,DO6], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 6),
    // River 4: 3-wide, fuel drain bridge at cols 8-9
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DF6,DF6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 3),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 5),
    // River 5: 2-wide, no bridge — just sprint through
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 2),
    // Buffer before maze — let player reposition
    repeat(F, 2),

    // 5d: The maze (28r) — safe path through fuel drain, oxy drain walls shimmer
    // 6-wide fuel drain path weaving left-right through oxy drain with wave heights
    // Path center: cols 3-8
    repeat([DO6_1,DO6,DO6_1,DF6,DF6, DF6,DF6,DF6,DF6,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 6),
    // Path shifts right: cols 7-12
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DF6,DF6,DF6, DF6,DF6,DF6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 6),
    // Path shifts right more: cols 11-16
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DF6,DF6,DF6,DF6, DF6,DF6,DO6_1,DO6,DO6_1], 6),
    // Path shifts left: cols 7-12
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DF6,DF6,DF6, DF6,DF6,DF6,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 4),
    // Exit with oxy reward
    repeat([N,N,N,N,N, N,N,N,OX6,OX6, OX6,OX6,N,N,N, N,N,N,N,N], 6),

    // 5e: Transition (20r) — wider oxy for reliable refuel
    repeat(F, 4),
    repeat([N,N,N,N,N, N,N,OX6,OX6,OX6, OX6,OX6,OX6,N,N, N,N,N,N,N], 8),
    repeat(F, 8),

    // ===== 6. THIN AIR (124r) =====
    // Elevated terrain. Every height gain requires a jump (3 oxy each).

    // 6a: Staircase (40r) — h=0 → h=1 → h=2 → h=3
    // DF6 patches on steps reinforce the inversion lesson: orange is safe!
    // Step 0 to 1 — DF6 mixed in (trust the orange)
    repeat(F, 4),
    repeat([N,N,H(1),H(1),DF6_1, H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), DF6_1,H(1),H(1),N,N], 8),
    // Step 1 to 2
    repeat([0,0,H(1),H(2),H(2), H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(2), H(2),H(1),0,0,0], 8),
    // Oxy reward on h=2
    repeat([0,0,0,H(2),H(2), H(2),HO(2),H(2),H(2),H(2), H(2),H(2),H(2),HO(2),H(2), H(2),H(2),0,0,0], 4),
    // Step 2 to 3 — DF6 streaks on the high road (h=3 to match walking surface)
    repeat([0,0,0,0,0, H(3),H(3),[B.DRAIN_FUEL,S.FLAT,3],H(3),H(3), H(3),H(3),[B.DRAIN_FUEL,S.FLAT,3],H(3),H(3), 0,0,0,0,0], 8),
    repeat([0,0,0,0,0, H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3), 0,0,0,0,0], 8),

    // 6b: High road (44r) — elevated highway at h=3, kill floor below
    // Kill pillars must be h=4 (one above road) to register collision at h=3
    // OX6 must be HO(3) to be collectible at h=3
    repeat([KF6,KF6,KF6,KF6,KF6, H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3), KF6,KF6,KF6,KF6,KF6], 6),
    // Kill pillar at h=4
    repeat([KF6,KF6,KF6,KF6,KF6, H(3),H(3),H(3),[B.KILL,S.FLAT,4],H(3), H(3),H(3),H(3),H(3),H(3), KF6,KF6,KF6,KF6,KF6], 4),
    repeat([KF6,KF6,KF6,KF6,KF6, H(3),H(3),HO(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3), KF6,KF6,KF6,KF6,KF6], 6),
    // Kill pillar at h=4
    repeat([KF6,KF6,KF6,KF6,KF6, H(3),H(3),H(3),H(3),H(3), H(3),[B.KILL,S.FLAT,4],H(3),H(3),H(3), KF6,KF6,KF6,KF6,KF6], 4),
    repeat([KF6,KF6,KF6,KF6,KF6, H(3),H(3),H(3),H(3),H(3), H(3),H(3),HO(3),H(3),H(3), KF6,KF6,KF6,KF6,KF6], 6),
    // Kill pillar at h=4
    repeat([KF6,KF6,KF6,KF6,KF6, H(3),H(3),H(3),H(3),[B.KILL,S.FLAT,4], H(3),H(3),H(3),H(3),H(3), KF6,KF6,KF6,KF6,KF6], 4),
    repeat([KF6,KF6,KF6,KF6,KF6, H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3), KF6,KF6,KF6,KF6,KF6], 4),
    // Road narrows briefly to 8 lanes — kill floor encroaches
    repeat([KF6,KF6,KF6,KF6,KF6, KF6,H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),KF6, KF6,KF6,KF6,KF6,KF6], 4),
    repeat([KF6,KF6,KF6,KF6,KF6, H(3),HO(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3), KF6,KF6,KF6,KF6,KF6], 4),
    // Road widens back
    repeat([KF6,KF6,KF6,KF6,KF6, H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3), KF6,KF6,KF6,KF6,KF6], 2),

    // 6c: The descent (40r) — h=3 → h=2 → h=1 → h=0
    // Descend h=3 → h=2 (8r)
    repeat([0,0,0,0,H(2), H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(2), H(2),0,0,0,0], 8),
    // Descend h=2 → h=1, gaps appear (8r)
    repeat([0,0,0,H(1),H(1), H(1),H(1),H(1),0,0, H(1),H(1),H(1),H(1),H(1), H(1),H(1),0,0,0], 8),
    // Kill blocks at ground to punish bad drops
    repeat([N,N,KF6,N,N, N,N,N,N,N, N,N,N,N,N, KF6,N,N,N,N], 4),
    // Descend h=1 → h=0 (8r)
    repeat([N,N,N,N,N, N,N,N,N,0, 0,N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    repeat(F, 4),
    // Flat exit — wider oxy for reliable refuel before station 7
    repeat([N,N,N,N,N, N,N,OX6,OX6,OX6, OX6,OX6,OX6,N,N, N,N,N,N,N], 4),
    repeat(F, 4),

    // ===== 7. OXYGEN STATION (30r) =====
    // DF6 borders = L6 visual signature on its stations
    repeat([DF6,DF6,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,DF6,DF6], 4),
    repeat([DF6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,DF6], 8),
    repeat([DF6,DF6,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,DF6,DF6], 4),
    repeat([DF6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,DF6], 8),
    repeat(F, 6),

    // ===== 8. TOXIC RIVER (136r) =====
    // Oxy drain rivers to cross. Speed helps. Fuel drain = stepping stones.

    // 8a: Narrow crossings (36r) — 2-wide rivers with wave heights, fuel drain bridges
    repeat(F, 4),
    // River 1: fuel drain bridge cols 9-10
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DF6, DF6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 2),
    repeat(F, 6),
    // River 2: fuel drain bridge cols 3-4
    repeat([DO6,DO6_1,DO6,DF6,DF6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 2),
    repeat(F, 6),
    // River 3: fuel drain bridge cols 15-16
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DF6,DF6,DO6_1,DO6,DO6_1], 2),
    repeat([N,N,N,N,N, N,N,N,OX6,OX6, N,N,N,N,N, N,N,N,N,N], 2),
    repeat(F, 4),
    // River 4: no bridge — sprint through
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 2),
    repeat(F, 6),

    // 8b: Wide crossings (40r) — 4-6 lane rivers with wave heights, stepping stones
    // River 1: 4-wide, fuel drain stones at cols 5-6 and 13-14
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DF6,DF6,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DF6,DF6, DO6_1,DO6,DO6_1,DO6,DO6_1], 4),
    repeat(F, 6),
    // River 2: 6-wide, fuel drain stones at cols 3-4 and 9-10 and 16-17
    repeat([DO6,DO6_1,DO6,DF6,DF6, DO6_1,DO6,DO6_1,DO6,DF6, DF6,DO6,DO6_1,DO6,DO6_1, DO6,DF6,DF6,DO6_1,DO6], 6),
    repeat(F, 4),
    // River 3: 4-wide, stones at cols 7-8
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DF6,DF6,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 4),
    repeat(F, 4),
    repeat([N,N,N,N,N, N,N,N,N,OX6, OX6,N,N,N,N, N,N,N,N,N], 4),
    repeat(F, 8),

    // 8c: The flood (26r) — partial rivers force lateral weaving
    // Half-rivers create choices: steer around or sprint through.
    // Normal approach
    repeat(F, 4),
    // River 1: LEFT half DO6 (cols 0-11), right side DF6 safe — steer right
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DF6,DF6_1,DF6, DF6_1,DF6,DF6_1,DF6,DF6_1], 4),
    // DF6 wave breathing room (2r)
    repeat([DF6_1,DF6,DF6_1,DF6,DF6_1, DF6,DF6_1,DF6,DF6_1,DF6, DF6_1,DF6,DF6_1,DF6,DF6_1, DF6,DF6_1,DF6,DF6_1,DF6], 2),
    // River 2: FULL width DO6 — unavoidable, must sprint through
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 2),
    // DF6 wave safe zone (4r) — need time to reposition from right to left
    repeat([DF6,DF6_1,DF6,DF6_1,DF6, DF6_1,DF6,DF6_1,DF6,DF6_1, DF6,DF6_1,DF6,DF6_1,DF6, DF6_1,DF6,DF6_1,DF6,DF6_1], 2),
    repeat([DF6_1,DF6,DF6_1,DF6,DF6_1, DF6,DF6_1,DF6,DF6_1,DF6, DF6_1,DF6,DF6_1,DF6,DF6_1, DF6,DF6_1,DF6,DF6_1,DF6], 2),
    // River 3: RIGHT half DO6 (cols 8-19), left side DF6 safe — steer left
    repeat([DF6_1,DF6,DF6_1,DF6,DF6_1, DF6,DF6_1,DF6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 4),
    // Mixing: DF6 waves with DO6 center patches (cols 8-11) — the flood swirls
    repeat([DF6,DF6_1,DF6,DF6_1,DF6, DF6_1,DF6,DF6_1,DO6,DO6_1, DO6,DO6_1,DF6_1,DF6,DF6_1, DF6,DF6_1,DF6,DF6_1,DF6], 2),
    // Oxy on fuel drain waves (reward for understanding) — HO(1) to match walking height
    repeat([DF6_1,DF6,DF6_1,DF6,DF6_1, DF6,DF6_1,DF6,DF6_1,HO(1), HO(1),DF6_1,DF6,DF6_1,DF6, DF6_1,DF6,DF6_1,DF6,DF6_1], 4),

    // 8d: Final river (30r) — wide river with wave heights, kill blocks on stones
    // 8-wide oxy drain river with fuel drain stepping stones
    repeat(F, 4),
    repeat([DO6_1,DO6,DO6_1,DO6,DF6, DF6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DF6,DF6, DO6_1,DO6,DO6_1,DO6,DO6_1], 4),
    repeat([DO6,DO6_1,DO6,DO6_1,DF6, KF6,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,KF6,DF6, DO6,DO6_1,DO6,DO6_1,DO6], 4),
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DF6,DF6,DO6, DO6_1,DF6,DF6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 4),
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DF6,KF6,DO6_1, DO6,KF6,DF6,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 4),
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DF6, DF6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 4),
    // Safe bank with oxy
    repeat([N,N,N,N,N, N,N,N,N,OX6, OX6,N,N,N,N, N,N,N,N,N], 4),
    repeat(F, 6),

    // ===== 9. THE SQUEEZE (120r) =====
    // Kill wall corridors. Wall-grinding costs speed → oxy to regain.

    // 9a: Wide corridor (30r) — 8-wide, jagged heights, DF6 floor texture
    repeat(F, 4),
    // Corridor: cols 6-13 (8-wide), DF6 at edges — looks narrower than it is
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, KW6_3,DF6,N,N,N, N,N,N,DF6,KW6_3, KW6,KW6_3,KW6,KW6_3,KW6], 4),
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, KW6_3,N,N,N,N, N,N,N,N,KW6_3, KW6,KW6_3,KW6,KW6_3,KW6], 4),
    // Shift right: cols 8-15
    repeat([KW6_3,KW6,KW6_3,KW6,KW6_3, KW6,KW6_3,KW6,N,N, N,N,N,N,N, N,KW6,KW6_3,KW6,KW6_3], 4),
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, KW6_3,KW6,KW6_3,N,N, OX6,N,N,N,N, N,KW6_3,KW6,KW6_3,KW6], 4),
    // Shift left: cols 4-11
    repeat([KW6_3,KW6,KW6_3,KW6,N, N,N,N,N,N, N,N,KW6,KW6_3,KW6, KW6_3,KW6,KW6_3,KW6,KW6_3], 6),
    repeat(F, 4),

    // 9b: Narrowing (30r) — 8 → 6 → 4 wide, DF6 on corridor edges
    // DF6 next to walls looks like danger but is SAFE — inversion callback
    // 8-wide: cols 6-13, DF6 at edges
    repeat([KW6,KW6,KW6,KW6,KW6, KW6,DF6,N,N,N, N,N,N,DF6,KW6, KW6,KW6,KW6,KW6,KW6], 6),
    // 6-wide: cols 7-12, DF6 edges (jagged heights)
    repeat([KW6_3,KW6,KW6_3,KW6,KW6_3, KW6,KW6_3,DF6,N,N, N,N,DF6,KW6_3,KW6, KW6_3,KW6,KW6_3,KW6,KW6_3], 8),
    // Shift: 6-wide cols 6-11, DF6 edges
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, KW6_3,DF6,N,N,N, N,DF6,KW6_3,KW6,KW6_3, KW6,KW6_3,KW6,KW6_3,KW6], 8),
    // 4-wide: cols 8-11, DF6 edges — corridor LOOKS 2-wide but IS 4-wide
    repeat([KW6_3,KW6,KW6_3,KW6,KW6_3, KW6,KW6_3,KW6,DF6,N, N,DF6,KW6,KW6_3,KW6, KW6_3,KW6,KW6_3,KW6,KW6_3], 8),

    // 9c: Razor threading (30r) — 4-wide with tight zigzag + drain floor patches
    // Corridor cols 8-11 with kill blocks, oxy drain patches cost precious oxy
    repeat([KW6_3,KW6,KW6_3,KW6,KW6_3, KW6,KW6_3,KW6,DO6,KF6, N,N,KW6,KW6_3,KW6, KW6_3,KW6,KW6_3,KW6,KW6_3], 6),
    // Shift: cols 7-10 with drain patch
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, KW6_3,KW6,N,N,DO6, N,KW6_3,KW6,KW6_3,KW6, KW6_3,KW6,KW6_3,KW6,KW6_3], 6),
    // Shift: cols 9-12 with kill inside + drain
    repeat([KW6_3,KW6,KW6_3,KW6,KW6_3, KW6,KW6_3,KW6,KW6,N, DO6,KF6,N,KW6_3,KW6, KW6_3,KW6,KW6_3,KW6,KW6_3], 6),
    // Shift: cols 8-11 with drain patch
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, KW6_3,KW6,KW6_3,N,DO6, N,N,KW6_3,KW6,KW6_3, KW6,KW6_3,KW6,KW6_3,KW6], 6),
    // Shift: cols 7-10 with kill inside + drain
    repeat([KW6_3,KW6,KW6_3,KW6,KW6_3, KW6,KW6,N,KF6,DO6, N,KW6,KW6_3,KW6,KW6_3, KW6,KW6_3,KW6,KW6_3,KW6], 6),

    // 9d: Opening (30r) — corridor widens
    // 4-wide → 6
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, KW6_3,KW6,N,N,N, N,N,N,KW6,KW6_3, KW6,KW6_3,KW6,KW6_3,KW6], 6),
    // 6-wide → 10
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, N,N,N,N,N, N,N,N,N,N, KW6_3,KW6,KW6_3,KW6,KW6_3], 6),
    // 10 → 14
    repeat([KW6,KW6_3,KW6,N,N, N,N,N,N,N, N,N,N,N,N, N,N,KW6,KW6_3,KW6], 4),
    // Oxy reward as corridor opens — centered for reliable collection
    repeat([N,N,N,N,N, N,N,N,OX6,OX6, OX6,OX6,N,N,N, N,N,N,N,N], 6),
    // Open
    repeat(F, 4),
    repeat([N,N,N,N,N, N,N,OX6,OX6,OX6, OX6,OX6,N,N,N, N,N,N,N,N], 4),

    // ===== 10. OXYGEN STATION (30r) =====
    // Last full station — DF6 borders, dense OX6. The player KNOWS this is the last one.
    repeat([DF6,DF6,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,DF6,DF6], 4),
    repeat([DF6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,DF6], 8),
    repeat([DF6,DF6,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,DF6,DF6], 4),
    repeat([DF6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,DF6], 8),
    repeat(F, 6),

    // ===== 11. DEAD AIR (282r) =====
    // Signature section. No full stations. Survive on what you have.

    // 11a: Open road (40r) — cruise drain with minor terrain and DF6 streaks
    // Sparse obstacles keep visual interest without adding oxy cost
    repeat(F, 6),
    repeat([N,N,N,N,N, N,DF6,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, H(1),N,N,N,N], 4),
    repeat(F, 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,DF6,DF6, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,0, 0,N,N,N,N, N,N,N,N,N], 4),
    repeat(F, 6),
    repeat([N,N,N,N,H(1), H(1),N,N,N,N, N,N,N,N,N, N,N,DF6,N,N], 4),
    repeat(F, 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),

    // 11b: Kill block field (42r) — steer around, varied formations + L6 accents
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Diagonal pair — forces weave
    repeat([N,N,KF6,KF6,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,KF6,KF6,N,N, N,N,N,KF6,KF6, N,N,N,N,N], 2),
    // DF6 accent — L6 visual texture in the gap
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,DF6,N,N, N,N,N,N,N], 2),
    // Center cluster — lingers (4r not 2r)
    repeat([N,N,N,N,N, N,N,N,KF6,KF6, KF6,N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,KF6,N,N, N,KF6,N,N,N, N,N,N,N,N], 2),
    // DO6 accent near kills — sloppy dodge costs oxy
    repeat([N,N,N,N,N, N,N,N,N,DO6, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Wide spread — forces choice
    repeat([N,N,N,KF6,N, N,N,N,N,N, N,N,N,N,N, N,N,KF6,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,KF6, N,N,N,N,N, N,N,N,N,N], 2),
    // Triple threat — L-shaped (extends 4r)
    repeat([N,KF6,N,N,N, N,N,N,N,N, N,N,N,N,KF6, KF6,N,N,N,N], 4),
    // DF6 strip — safe but adds visual variety
    repeat([N,N,N,N,N, DF6,DF6,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Scattered singles
    repeat([N,N,N,N,N, N,KF6,N,N,N, N,N,N,N,N, KF6,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,KF6,N,N, N,N,N,N,N], 2),
    // Late surprise — tight pair
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,KF6,N, N,KF6,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,KF6, N,N,N,N,N, N,N,N,N,N, N,KF6,N,N,N], 2),
    repeat(F, 4),

    // 11c: Drain patches (42r) — oxy drain spots + fuel drain decoys, varied sizes
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Small left patch
    repeat([N,N,N,DO6,DO6, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Decoy — fuel drain looks dangerous but isn't
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,DF6, DF6,DF6,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Wide center patch — lingers for 4r, hard to avoid cleanly
    repeat([N,N,N,N,N, N,N,DO6,DO6,DO6, DO6,N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Fork: DO6 left AND right, safe center
    repeat([N,N,DO6,DO6,N, N,N,N,N,N, N,N,N,N,N, N,DO6,DO6,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    // Decoy cluster near DO6 — player must read colors fast
    repeat([N,N,N,N,N, DF6,DF6,N,N,DO6, DO6,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Final: wide right patch + single left
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,DO6, DO6,DO6,N,N,N], 2),
    repeat([N,DO6,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    // Tight double — back-to-back with gap
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,DO6,DO6,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,DO6,DO6,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),

    // 11d: The gasp (20r) — tiny station with L6's DF6 border signature
    repeat([DF6,DF6,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,DF6,DF6], 2),
    repeat([DF6,N,N,N,N, N,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,N, N,N,N,N,DF6], 14),
    repeat(F, 4),

    // 11e: Gap hopping (42r) — ridges force jumps, gaps allow walk-arounds
    // Ridge 1: full-width H(1) — MUST jump (3 oxy)
    repeat(F, 4),
    repeat([H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1)], 2),
    repeat(F, 4),
    // Gap 2: 3-wide void, right — walk around (saves 3 oxy vs jumping)
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,0,0,0, N,N,N,N,N], 2),
    repeat(F, 4),
    // Gap 3: 5-wide void, left, DF6 bridge — walk around or use bridge
    repeat([N,N,N,0,0, DF6,0,0,0,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat(F, 4),
    // Ridge 4: full-width H(1) — MUST jump (3 oxy)
    repeat([H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1)], 2),
    repeat(F, 4),
    // Gap 5: 4-wide void, center, DF6 bridge — walk around or use bridge
    repeat([N,N,N,N,N, N,N,0,0,DF6, 0,0,N,N,N, N,N,N,N,N], 2),
    repeat(F, 6),
    // Ridge 6: 18-wide H(1) (cols 1-18) — edge gaps too far to reach, MUST jump
    repeat([N,H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),N], 2),
    repeat(F, 4),

    // 11f: Oxy drain sprint (42r) — varied rivers, compressing gaps
    // River widths: 2, 2, 3, 2, 3. Gaps: generous → compressed. Kill blocks vary.
    // Approach (4r)
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    // Kill warning left (2r) then RIVER 1: thin (2r)
    repeat([N,N,KF6,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 2),
    // Generous gap (6r) — lulls the player
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 6),
    // RIVER 2: thin (2r) — NO warning, surprise after long gap
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 2),
    // Compressed gap (2r) — suddenly tight
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // Double kill warning (2r) then RIVER 3: WIDE (3r)
    repeat([N,N,N,N,N, N,N,N,N,KF6, N,N,N,N,KF6, N,N,N,N,N], 2),
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 3),
    // Relief gap (6r)
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 6),
    // Scattered kill (2r) then RIVER 4: thin (2r)
    repeat([N,N,N,N,N, N,KF6,N,N,N, N,N,N,N,N, N,N,KF6,N,N], 2),
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 2),
    // Very short gap (2r) — almost no time to breathe
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 2),
    // RIVER 5: WIDE (3r) — no warning, punishing finale
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 3),
    // Exhale with DF6 decoy (4r) — inversion callback
    repeat([N,N,N,N,N, N,N,N,N,DF6, DF6,N,N,N,N, N,N,N,N,N], 4),

    // 11g: Elevated run (40r) — h=2 over kill floor, DF6 patches on road
    repeat(F, 4),
    repeat([N,N,N,N,H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),N,N,N,N], 4),
    repeat([KF6,KF6,KF6,KF6,H(2), H(2),H(2),[B.DRAIN_FUEL,S.FLAT,2],H(2),H(2), H(2),H(2),H(2),H(2),H(2), H(2),KF6,KF6,KF6,KF6], 4),
    // Kill pillar on elevated road (h=3 to collide at h=2 surface)
    repeat([KF6,KF6,KF6,KF6,H(2), H(2),H(2),H(2),[B.KILL,S.FLAT,3],H(2), H(2),H(2),H(2),H(2),H(2), H(2),KF6,KF6,KF6,KF6], 4),
    repeat([KF6,KF6,KF6,KF6,H(2), H(2),H(2),H(2),H(2),H(2), H(2),H(2),[B.DRAIN_FUEL,S.FLAT,2],H(2),H(2), H(2),KF6,KF6,KF6,KF6], 6),
    // Kill pillar (h=3)
    repeat([KF6,KF6,KF6,KF6,H(2), H(2),H(2),H(2),H(2),H(2), H(2),[B.KILL,S.FLAT,3],H(2),H(2),H(2), H(2),KF6,KF6,KF6,KF6], 4),
    repeat([KF6,KF6,KF6,KF6,H(2), H(2),[B.DRAIN_FUEL,S.FLAT,2],H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(2), H(2),KF6,KF6,KF6,KF6], 4),
    // Descent
    repeat([N,N,N,N,H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),N,N,N,N], 4),
    repeat(F, 6),

    // 11h: Final sprint (14r) — open ground with fuel drain streaks (safe, adds color)
    repeat(F, 4),
    repeat([N,N,N,DF6,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,DF6, DF6,N,N,N,N], 4),
    repeat(F, 2),

    // ===== 12. LAST GASP (178r) =====
    // Final station, then everything combined at max intensity.

    // 12a: Final station (30r) — the last full recharge, DENSE oxy
    // DF6 borders signal: "this is L6's style of station"
    repeat([DF6,DF6,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,DF6,DF6], 4),
    repeat([DF6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,DF6], 8),
    repeat([DF6,DF6,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,DF6,DF6], 4),
    repeat([DF6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,OX6, OX6,OX6,OX6,OX6,DF6], 8),
    repeat(F, 6),

    // 12b: Combined hell (38r) — kill corridor + oxy drain patches
    // 6-wide corridor with drain patches inside
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, KW6_3,KW6,N,N,N, N,N,N,KW6_3,KW6, KW6_3,KW6,KW6_3,KW6,KW6_3], 4),
    repeat([KW6_3,KW6,KW6_3,KW6,KW6_3, KW6,KW6_3,N,DO6,N, N,N,N,KW6,KW6_3, KW6,KW6_3,KW6,KW6_3,KW6], 4),
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, KW6_3,KW6,N,N,N, N,N,N,KW6_3,KW6, KW6_3,KW6,KW6_3,KW6,KW6_3], 4),
    // Corridor shifts right: cols 9-14
    repeat([KW6_3,KW6,KW6_3,KW6,KW6_3, KW6,KW6_3,KW6,KW6_3,N, N,N,N,N,N, KW6,KW6_3,KW6,KW6_3,KW6], 4),
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, KW6_3,KW6,KW6_3,KW6,N, N,DO6,N,N,N, KW6_3,KW6,KW6_3,KW6,KW6_3], 4),
    repeat([KW6_3,KW6,KW6_3,KW6,KW6_3, KW6,KW6_3,KW6,KW6_3,N, N,N,N,N,N, KW6,KW6_3,KW6,KW6_3,KW6], 4),
    // Corridor shifts left: cols 5-10
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, N,N,N,N,N, N,KW6_3,KW6,KW6_3,KW6, KW6_3,KW6,KW6_3,KW6,KW6_3], 4),
    repeat([KW6_3,KW6,KW6_3,KW6,KW6_3, N,N,N,DO6,N, N,KW6,KW6_3,KW6,KW6_3, KW6,KW6_3,KW6,KW6_3,KW6], 4),
    repeat([KW6,KW6_3,KW6,KW6_3,KW6, N,N,N,N,N, N,KW6_3,KW6,KW6_3,KW6, KW6_3,KW6,KW6_3,KW6,KW6_3], 2),
    repeat(F, 4),

    // 12c: Drain corridor (44r) — fuel drain floor (safe!) with oxy drain walls
    // 6-wide corridor, floor is fuel drain, walls are oxy drain with wave heights
    // Shifts LEFT then RIGHT (opposite of 12b's right-then-left): 7-12 → 5-10 → 9-14
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DF6,DF6,DF6, DF6,DF6,DF6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 4),
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DF6,DF6,DF6, DF6,DF6,DF6,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 2),
    // Kill block inside corridor
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DF6,KF6,DF6, DF6,DF6,DF6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 4),
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DF6,DF6,DF6, DF6,DF6,DF6,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 4),
    // Corridor shifts left: cols 5-10. Overlap with seg 1: cols 7-10 (4 wide).
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DF6,DF6,DF6,DF6,DF6, DF6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 4),
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DF6,DF6,DF6,DF6,DF6, DF6,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 2),
    // Kill block
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DF6,DF6,KF6,DF6,DF6, DF6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DO6_1], 4),
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DF6,DF6,DF6,DF6,DF6, DF6,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DO6], 4),
    // Corridor shifts right: cols 9-14. Overlap with seg 2: cols 9-10 (2 wide).
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DF6, DF6,DF6,DF6,DF6,DF6, DO6_1,DO6,DO6_1,DO6,DO6_1], 4),
    repeat([DO6,DO6_1,DO6,DO6_1,DO6, DO6_1,DO6,DO6_1,DO6,DF6, DF6,DF6,DF6,DF6,DF6, DO6,DO6_1,DO6,DO6_1,DO6], 2),
    // Kill block
    repeat([DO6_1,DO6,DO6_1,DO6,DO6_1, DO6,DO6_1,DO6,DO6_1,DF6, DF6,DF6,KF6,DF6,DF6, DO6_1,DO6,DO6_1,DO6,DO6_1], 4),
    repeat(F, 6),

    // 12d: The climb (30r) — ascending steps over kill floor
    // h=0 → h=1
    repeat([N,N,N,N,N, N,N,H(1),H(1),H(1), H(1),H(1),H(1),N,N, N,N,N,N,N], 4),
    repeat([KF6,KF6,KF6,KF6,KF6, KF6,KF6,H(1),H(1),H(1), H(1),H(1),H(1),KF6,KF6, KF6,KF6,KF6,KF6,KF6], 4),
    // h=1 → h=2
    repeat([KF6,KF6,KF6,KF6,KF6, KF6,KF6,KF6,H(2),H(2), H(2),H(2),KF6,KF6,KF6, KF6,KF6,KF6,KF6,KF6], 6),
    // h=2 → h=3 with oxy drain patch on platform (drain at h=3 to affect player)
    repeat([KF6,KF6,KF6,KF6,KF6, KF6,KF6,KF6,KF6,H(3), H(3),KF6,KF6,KF6,KF6, KF6,KF6,KF6,KF6,KF6], 4),
    repeat([KF6,KF6,KF6,KF6,KF6, KF6,KF6,KF6,KF6,[B.DRAIN_OXY,S.FLAT,3], H(3),KF6,KF6,KF6,KF6, KF6,KF6,KF6,KF6,KF6], 4),
    // Widen to 6-wide at h=3
    repeat([KF6,KF6,KF6,KF6,KF6, KF6,KF6,H(3),H(3),H(3), H(3),H(3),H(3),KF6,KF6, KF6,KF6,KF6,KF6,KF6], 4),
    repeat([KF6,KF6,KF6,KF6,KF6, KF6,KF6,H(3),HO(3),H(3), H(3),HO(3),H(3),KF6,KF6, KF6,KF6,KF6,KF6,KF6], 4),

    // 12e: Narrowing (36r) — kill walls close in, oxy drain patches on floor
    // 20-wide with drain patches
    repeat([N,N,N,N,N, N,DO6,N,N,N, N,N,N,DO6,N, N,N,N,N,N], 4),
    // 12-wide (cols 4-15) with drain patch
    repeat([KW6_3,KW6_3,KW6_3,KW6_3,N, N,N,N,N,N, N,N,N,N,N, N,KW6_3,KW6_3,KW6_3,KW6_3], 4),
    repeat([KW6_3,KW6_3,KW6_3,KW6_3,N, N,N,N,N,DO6, N,N,N,N,N, N,KW6_3,KW6_3,KW6_3,KW6_3], 2),
    // 8-wide (cols 6-13) with kill block
    repeat([KW6_4,KW6_4,KW6_4,KW6_4,KW6_4, KW6_4,N,N,N,N, N,N,KF6,N,KW6_4, KW6_4,KW6_4,KW6_4,KW6_4,KW6_4], 2),
    repeat([KW6_4,KW6_4,KW6_4,KW6_4,KW6_4, KW6_4,N,N,DO6,N, N,N,N,N,KW6_4, KW6_4,KW6_4,KW6_4,KW6_4,KW6_4], 4),
    // 6-wide (cols 7-12) — last oxy
    repeat([KW6_4,KW6_4,KW6_4,KW6_4,KW6_4, KW6_4,KW6_4,N,N,N, N,N,N,KW6_4,KW6_4, KW6_4,KW6_4,KW6_4,KW6_4,KW6_4], 4),
    repeat([KW6_4,KW6_4,KW6_4,KW6_4,KW6_4, KW6_4,KW6_4,N,N,OX6, OX6,N,N,KW6_4,KW6_4, KW6_4,KW6_4,KW6_4,KW6_4,KW6_4], 4),
    // 4-wide (cols 8-11) — DF6/DO6 floor, the final inversion test
    // Safe orange center (DF6), deadly blue edges (DO6) — must stay centered
    // 12r corridor: long enough to feel the tension at speed 35 (~0.34s)
    repeat([KW6_4,KW6_4,KW6_4,KW6_4,KW6_4, KW6_4,KW6_4,KW6_4,DO6,DF6, DF6,DO6,KW6_4,KW6_4,KW6_4, KW6_4,KW6_4,KW6_4,KW6_4,KW6_4], 12),

    // ===== 13. VICTORY (8r) =====
    // After a whole level of rationing oxygen, the ending is a single
    // narrow breath. 2-wide win tunnel.
    repeat([KW6_4,KW6_4,KW6_4,KW6_4,KW6_4, KW6_4,KW6_4,KW6_4,DO6,DF6, DF6,DO6,KW6_4,KW6_4,KW6_4, KW6_4,KW6_4,KW6_4,KW6_4,KW6_4], 2),
    repeat([KW6_4,KW6_4,KW6_4,KW6_4,KW6_4, KW6_4,KW6_4,KW6_4,KW6_4,W6, W6,KW6_4,KW6_4,KW6_4,KW6_4, KW6_4,KW6_4,KW6_4,KW6_4,KW6_4], 1),
    repeat([KW6_4,KW6_4,KW6_4,KW6_4,KW6_4, KW6_4,KW6_4,KW6_4,N,N, N,N,KW6_4,KW6_4,KW6_4, KW6_4,KW6_4,KW6_4,KW6_4,KW6_4], 5)
  )
});
