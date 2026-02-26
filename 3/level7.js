// Level 7: "Skyline" — elevated navigation
// See level7-design.md for full design document
//
// Elevated highway at h=4 with drain sea at h=0 below.
// High road is narrow but safe. Low road drains resources.
// Pads and ramps let you climb back up.

// Shorthands
var KF7 = [B.KILL, S.FLAT];
var KH4 = [B.KILL, S.FLAT, 4];   // kill on h=3 road surface
var KH5 = [B.KILL, S.FLAT, 5];   // kill on h=4 road surface
var KH6 = [B.KILL, S.FLAT, 6];   // kill on h=5 road surface
var DF7 = [B.DRAIN_FUEL, S.FLAT];
var DF7_1 = [B.DRAIN_FUEL, S.FLAT, 1];
var DO7 = [B.DRAIN_OXY, S.FLAT];
var DO7_1 = [B.DRAIN_OXY, S.FLAT, 1];
var DF4 = [B.DRAIN_FUEL, S.FLAT, 4]; // drain ON the road surface
var DO4 = [B.DRAIN_OXY, S.FLAT, 4];
var J7 = [B.JUMP, S.FLAT];
var OX7 = [B.OXYGEN, S.FLAT];
var FU7 = [B.FUEL, S.FLAT];
var W7 = [B.WIN_TUNNEL, S.FLAT, 4];
var HR = H(4);  // high road block

// Stacked: drain at h=0 + road at h=4
function DFHR() { return [[B.DRAIN_FUEL, S.FLAT, 0], [B.NORMAL, S.FLAT, 4]]; }
function DOHR() { return [[B.DRAIN_OXY, S.FLAT, 0], [B.NORMAL, S.FLAT, 4]]; }
// Stacked: drain at h=0 + resource at h=4
function DFHF() { return [[B.DRAIN_FUEL, S.FLAT, 0], [B.FUEL, S.FLAT, 4]]; }
function DFHO() { return [[B.DRAIN_FUEL, S.FLAT, 0], [B.OXYGEN, S.FLAT, 4]]; }
function DOHO() { return [[B.DRAIN_OXY, S.FLAT, 0], [B.OXYGEN, S.FLAT, 4]]; }
// Stacked: pad at h=0 under gap (no road above — pad needs clear sky)
// (Pads go under GAPS, not under road — ceiling would bonk)

// Row patterns
// EF: 14-lane elevated road, void edges
var EF = [0,0,0,HR,HR, HR,HR,HR,HR,HR, HR,HR,HR,HR,HR, HR,HR,0,0,0];
// R12D: 12-lane road over drain sea
var R12D = [DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1];
// DS: full-width drain sea (no road)
var DS = [DF7,DF7_1,DF7,DF7_1,DF7, DF7_1,DF7,DF7_1,DF7,DF7_1, DF7,DF7_1,DF7,DF7_1,DF7, DF7_1,DF7,DF7_1,DF7,DF7_1];

LEVELS.push({
  id: 6,
  name: "Skyline",
  gridColors: [0x225544, 0x336655],
  rows: concat(
    // ===== 1. OPEN START (40r) =====
    // 14-lane h=4 highway. Void on both sides.
    repeat(EF, 8),
    repeat([0,0,0,HR,HR, HR,HR,HF(4),HR,HR, HR,HR,HR,HF(4),HR, HR,HR,0,0,0], 8),
    repeat(EF, 8),
    repeat([0,0,0,HR,HF(4), HR,HR,HR,HR,HR, HR,HR,HR,HR,HR, HR,HF(4),0,0,0], 8),
    repeat(EF, 8),
    // 40r ✓

    // ===== 2. FIRST CRACKS (140r) =====
    // 2a: Small gaps + drain appears (40r)
    // Road narrows to 12 lanes. Drain sea visible below and at edges.
    repeat(R12D, 6),
    // Gap: cols 9-10 missing
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DF7, DF7,DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 2),
    // Ramp in gap area: H(1)→H(2)→H(3)→road
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),H(1), H(1),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),H(2), H(2),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),H(3), H(3),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 2),
    repeat(R12D, 4),
    // Fuel on road
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHF(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHF(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 4),
    // Second gap: cols 5-6
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DF7,DF7,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 2),
    // Ramp at cols 5-6
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),H(1),H(1),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),H(2),H(2),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),H(3),H(3),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 2),
    repeat(R12D, 8),
    // 6+2+2+2+2+4+4+2+2+2+2+8 = 38... need 2 more
    repeat(R12D, 2),
    // 40r ✓

    // 2b: First pad (40r)
    // Wider gaps, first jump pad
    repeat(R12D, 6),
    // 4-lane gap: cols 8-11 missing. Pad at cols 9-10 under gap.
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHR(),DFHR(),DF7,J7, J7,DF7,DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 4),
    // Road continues (wide landing zone)
    repeat(R12D, 10),
    // Second gap: cols 6-8, pad at cols 6-7
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),J7,J7,DF7,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 4),
    repeat(R12D, 8),
    // Fuel pickups
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHR(),DFHF(),DFHR(),DFHR(), DFHR(),DFHR(),DFHF(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 8),
    // 6+4+10+4+8+8 = 40 ✓

    // 2c: Learning falls (40r)
    // More gaps with pads, road narrows around gaps
    repeat(R12D, 4),
    // 3-lane gap cols 7-9, pad
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHR(),DF7,J7,DF7, DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 4),
    // Road with oxy reward
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHR(),DFHR(),DFHO(),DFHR(), DFHR(),DFHO(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 6),
    // Gap cols 11-14, pad
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DF7,J7,DF7,DF7,DFHR(), DF7,DF7_1,DF7,DF7_1], 4),
    repeat(R12D, 6),
    // Gap cols 5-7, pad
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DF7,J7,DF7,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 4),
    repeat(R12D, 4),
    // Fuel
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHF(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHF(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 8),
    // 4+4+6+4+6+4+4+8 = 40 ✓

    // 2d: Wider cracks (20r)
    // 6-lane gap with multiple pads
    repeat(R12D, 4),
    // Big gap: cols 6-11 missing, pads at 7-8
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DF7,J7,J7,DF7, DF7,DF7,DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 4),
    repeat(R12D, 4),
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHF(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHF(),DFHR(), DF7,DF7_1,DF7,DF7_1], 4),
    repeat(R12D, 4),
    // 4+4+4+4+4 = 20 ✓

    // ===== 3. ROAD HAZARDS (146r) =====
    // 3a: Scattered kills on road (40r)
    // Wide road (16 lanes cols 2-17), kill blocks at h=5. Varied spacing.
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 6),
    // Kill block at col 7 — first obstacle
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),KH5,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    // Diagonal pair cols 12→10 — forces lateral dodge
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),KH5,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), KH5,DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 6),
    // L-shape cluster at cols 5-6 — can't just slide past
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),KH5,KH5,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),KH5,DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 6),
    // Fuel
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHF(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHF(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 8),
    // 6+2+4+2+8+2+8+8 = 40 ✓

    // 3b: Drain patches on road (40r)
    // 16-lane road with drain patches at h=4
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 6),
    // Fuel drain strip on road (cols 6-7)
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DF4,DF4,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    // Oxy drain strip on road (cols 12-13) + kill
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DO4,DO4,DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),KH5, DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    // Combined strip
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DF4,DF4,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DO4,DO4,DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    // Fuel reward
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHF(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHF(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 8),
    // 6+4+4+4+2+4+4+4+8 = 40 ✓

    // 3c: Height bumps (30r)
    repeat(R12D, 4),
    // H(5) bump across cols 7-12
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHR(),H(5),H(5),H(5), H(5),H(5),H(5),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 4),
    repeat(R12D, 4),
    // H(5) bump cols 5-8 with fuel on top
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),H(5),H(5),HF(5),H(5),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7_1,DF7,DF7_1], 4),
    repeat(R12D, 4),
    // H(5) bump cols 10-14 with oxy
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), H(5),H(5),HO(5),H(5),H(5),DFHR(), DF7,DF7_1,DF7,DF7_1], 4),
    repeat(R12D, 6),
    // 4+4+4+4+4+4+6 = 30 ✓

    // 3d: Combined hazards (36r)
    // Narrower road (14 lanes cols 3-16) with kills + drain + bumps
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DF7,DF7_1,DF7], 4),
    // Kill + drain patch
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),KH5,DFHR(),DF4,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DF7,DF7_1,DF7], 2),
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DO4,DFHR(),KH5,DFHR(), DFHR(),DF7,DF7_1,DF7], 2),
    // H(5) bump + kill
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),H(5),H(5),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),KH5,DFHR(),DFHR(), DFHR(),DF7,DF7_1,DF7], 4),
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DF7,DF7_1,DF7], 4),
    // Drain + bump + kill combo
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),DFHR(),DF4,DFHR(),H(5), H(5),DFHR(),KH5,DFHR(),DFHR(),DFHR(), DFHR(),DF7,DF7_1,DF7], 4),
    // Oxy drain strip + kill — the road itself turns hostile
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DO4, DO4,DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DF7,DF7_1,DF7], 2),
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),KH5,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DF7,DF7_1,DF7], 2),
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DF7,DF7_1,DF7], 2),
    // Resources
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),DFHF(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHO(),DFHR(),DFHR(), DFHR(),DF7,DF7_1,DF7], 6),
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DF7,DF7_1,DF7], 4),
    // 4+2+2+4+4+4+2+2+2+6+4 = 36 ✓

    // ===== 4. BREATHER (30r) =====
    // Full 20-lane h=4 highway, dense resources
    repeat(EF, 4),
    repeat([0,0,0,HR,HF(4), HR,HR,HO(4),HR,HR, HR,HR,HR,HO(4),HR, HR,HF(4),0,0,0], 8),
    repeat(EF, 4),
    repeat([0,0,0,HF(4),HR, HR,HO(4),HR,HR,HR, HR,HR,HR,HR,HO(4), HR,HR,HF(4),0,0,0], 8),
    repeat(EF, 6),
    // 4+8+4+8+6 = 30 ✓

    // ===== 5. HEIGHT SHIFTS (140r) =====
    // 5a: Gentle steps h=4→h=5→h=4 (40r)
    // 16-lane road with drain patch preview
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF4,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    // Step up to h=5 — kill block on platform
    repeat([DF7,DF7_1,H(5),H(5), H(5),H(5),H(5),H(5),H(5),H(5), H(5),H(5),H(5),H(5),H(5),H(5), H(5),H(5),DF7,DF7_1], 4),
    repeat([DF7,DF7_1,H(5),H(5), H(5),H(5),H(5),H(5),KH6,H(5), H(5),H(5),H(5),H(5),H(5),H(5), H(5),H(5),DF7,DF7_1], 2),
    // Fuel on h=5
    repeat([DF7,DF7_1,H(5),H(5), H(5),HF(5),H(5),H(5),H(5),H(5), H(5),H(5),H(5),H(5),HF(5),H(5), H(5),H(5),DF7,DF7_1], 2),
    // Step back to h=4 — oxy drain patch on road
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DO4,DO4,DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    // Oxy reward
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHO(),DFHR(), DFHR(),DFHO(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    repeat(R12D, 8),
    // 4+4+4+2+2+4+4+4+4+8 = 40 ✓

    // 5b: Double step h=4→h=5→h=3→h=4 (40r)
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 6),
    // Up to h=5 (14 lanes) — kills on platform
    repeat([DF7,DF7_1,DF7,H(5), H(5),H(5),H(5),H(5),H(5),H(5), H(5),H(5),H(5),H(5),H(5),H(5), H(5),DF7,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,H(5), H(5),H(5),H(5),H(5),H(5),H(5), H(5),H(5),KH6,H(5),H(5),H(5), H(5),DF7,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,H(5), H(5),H(5),H(5),H(5),H(5),H(5), H(5),H(5),H(5),H(5),H(5),H(5), H(5),DF7,DF7,DF7_1], 2),
    // Down to h=3 (12 lanes) — drain patch on platform
    repeat([DF7,DF7_1,DF7,DF7_1, H(3),H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3),H(3), DF7,DF7_1,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7_1, H(3),H(3),[B.DRAIN_FUEL,S.FLAT,3],[B.DRAIN_FUEL,S.FLAT,3],H(3),H(3), H(3),H(3),H(3),H(3),H(3),H(3), DF7,DF7_1,DF7,DF7_1], 4),
    // Oxy on h=3
    repeat([DF7,DF7_1,DF7,DF7_1, H(3),H(3),HO(3),H(3),H(3),H(3), H(3),H(3),H(3),HO(3),H(3),H(3), DF7,DF7_1,DF7,DF7_1], 4),
    // Back to h=4
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 6),
    repeat(R12D, 8),
    // 6+4+2+2+4+4+4+6+8 = 40 ✓

    // 5c: Staircase up h=3→h=4→h=5→h=6 (30r)
    // Start at h=3 (16 lanes) — kill block on step
    repeat([DF7,DF7_1,H(3),H(3), H(3),H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3),H(3), H(3),H(3),DF7,DF7_1], 4),
    repeat([DF7,DF7_1,H(3),H(3), H(3),H(3),KH4,H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3),H(3), H(3),H(3),DF7,DF7_1], 2),
    // h=4 (14 lanes) — drain patch on step
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DF7,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DO4,DFHR(),DFHR(),DFHR(), DFHR(),DF7,DF7,DF7_1], 2),
    // h=5 (12 lanes) — kill on step
    repeat([DF7,DF7_1,DF7,DF7, H(5),H(5),H(5),H(5),H(5),H(5), H(5),H(5),H(5),H(5),H(5),H(5), DF7,DF7,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7, H(5),H(5),H(5),H(5),H(5),H(5), H(5),H(5),KH6,H(5),H(5),H(5), DF7,DF7,DF7,DF7_1], 2),
    // h=6 (10 lanes) with resources
    repeat([DF7,DF7_1,DF7,DF7, DF7,H(6),H(6),HF(6),H(6),H(6), H(6),H(6),HO(6),H(6),H(6),DF7, DF7,DF7,DF7,DF7_1], 6),
    repeat([DF7,DF7_1,DF7,DF7, DF7,H(6),H(6),H(6),H(6),H(6), H(6),H(6),H(6),H(6),H(6),DF7, DF7,DF7,DF7,DF7_1], 6),
    // 4+2+4+2+4+2+6+6 = 30 ✓

    // 5d: Descent h=6→h=5→h=4 (30r)
    // h=5 (12 lanes) — kill block on descent
    repeat([DF7,DF7_1,DF7,DF7, H(5),H(5),H(5),H(5),H(5),H(5), H(5),H(5),H(5),H(5),H(5),H(5), DF7,DF7,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7, H(5),H(5),H(5),H(5),H(5),KH6, H(5),H(5),H(5),H(5),H(5),H(5), DF7,DF7,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7, H(5),H(5),H(5),H(5),H(5),H(5), H(5),H(5),H(5),H(5),H(5),H(5), DF7,DF7,DF7,DF7_1], 2),
    // h=4 (14 lanes) with drain patches
    repeat([DF7,DF7_1,DF7,DFHR(), DFHR(),DFHR(),DF4,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF4,DFHR(),DFHR(), DFHR(),DF7,DF7,DF7_1], 6),
    // Widen to 18
    repeat([DF7,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF7_1], 8),
    // Flat h=4
    repeat(R12D, 8),
    // 4+2+2+6+8+8 = 30 ✓

    // ===== 6. BROKEN BRIDGES (120r) =====
    // 6a: Wide bridges (40r)
    // 8-lane bridges at h=4 separated by 3r gaps with drain
    // Bridge 1 (cols 6-13)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 10),
    // Gap (3r) — drain + pad
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,J7,DF7, DF7,J7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // Bridge 2 (cols 5-12, 1 lane offset left)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 10),
    // Gap (3r)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,J7,J7,DF7, DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // Bridge 3 (cols 7-14, offset right)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DF7, DF7,DF7_1,DF7,DF7_1], 8),
    // Fuel
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHF(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHF(),DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // 10+3+10+3+8+3 = 37... need 3 more
    repeat(R12D, 3),
    // 40 ✓

    // 6b: Narrow bridges (40r)
    // 5-lane bridges offset laterally 2-3 lanes
    // Bridge 1 (cols 8-12)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 8),
    // Gap + pad
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF7,J7, J7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // Bridge 2 (cols 5-9, offset left 3)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 8),
    // Gap + pad
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,J7,J7,DF7, DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // Bridge 3 (cols 10-14, offset right 5)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF7,DF7, DFHR(),DFHR(),DFHF(),DFHR(),DFHR(),DF7, DF7,DF7_1,DF7,DF7_1], 6),
    // Gap + pad
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF7,DF7, DF7,J7,J7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // Bridge 4 (cols 7-11)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 8),
    // 8+3+8+3+6+4+8 = 40 ✓

    // 6c: Mixed heights (40r)
    // Bridges at h=3, h=4, h=5
    // Bridge at h=5 (cols 7-12)
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,H(5),H(5),H(5), H(5),H(5),H(5),DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 8),
    // Gap + pad (oxy drain below)
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,J7,DO7, DO7,J7,DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    // Bridge at h=3 (cols 6-11) — drop down from h=5
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,H(3),H(3),H(3),H(3), H(3),H(3),DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 8),
    // Gap
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,J7,DO7, DO7,DO7,DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    // Bridge at h=4 (cols 8-13) — jump up from h=3
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,HR,HR, HR,HR,HR,HR,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 6),
    // Oxy reward
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,HR,HR, HO(4),HR,HR,HR,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    // Transition to flat
    repeat(R12D, 6),
    // 8+4+8+4+6+4+6 = 40 ✓

    // ===== 7. RESOURCE STATION (30r) =====
    // Wide h=4, dense resources, drain below
    repeat(R12D, 4),
    repeat([DF7,DF7_1,DF7,DF7_1, DFHF(),DFHR(),DFHO(),DFHR(),DFHF(),DFHR(), DFHR(),DFHF(),DFHR(),DFHO(),DFHR(),DFHF(), DF7,DF7_1,DF7,DF7_1], 8),
    repeat(R12D, 4),
    repeat([DF7,DF7_1,DF7,DF7_1, DFHR(),DFHF(),DFHR(),DFHO(),DFHR(),DFHF(), DFHF(),DFHR(),DFHO(),DFHR(),DFHF(),DFHR(), DF7,DF7_1,DF7,DF7_1], 8),
    repeat(R12D, 6),
    // 4+8+4+8+6 = 30 ✓

    // ===== 8. DUAL LEVEL (160r) =====
    // 8a: Introduction — high road + drain floor + gaps + pads (40r)
    // High road: 6 lanes (cols 7-12). Drain everywhere else.
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 10),
    // Fuel on high road
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHF(),DFHR(),DFHR(), DFHR(),DFHR(),DFHF(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // Gap in high road (cols 9-10 missing), pad below
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),J7, J7,DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // Continue high road
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 10),
    // Second gap (cols 8-11), pads
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,J7,DF7, DF7,J7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 8),
    // 10+4+4+10+4+8 = 40 ✓

    // 8b: Choose your level (40r)
    // High road: 4 lanes (cols 8-11) with fuel
    // Low road: drain with 6-lane normal path (cols 7-12) h=0 with oxy
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,N,DFHR(),DFHR(), DFHR(),DFHR(),N,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 6),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,OX7,DFHF(),DFHR(), DFHR(),DFHF(),OX7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 6),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,N,DFHR(),DFHR(), DFHR(),DFHR(),N,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 6),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,OX7,DFHF(),DFHR(), DFHR(),DFHF(),OX7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 6),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,N,DFHR(),DFHR(), DFHR(),DFHR(),N,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 6),
    // Pad to get back up + ramp
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,H(1),DFHR(),DFHR(), DFHR(),DFHR(),H(1),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,H(2),DFHR(),DFHR(), DFHR(),DFHR(),H(2),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,H(3),DFHR(),DFHR(), DFHR(),DFHR(),H(3),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat(R12D, 4),
    // 6+6+6+6+6+2+2+2+4 = 40 ✓

    // 8c: Forced drops (40r)
    // TWO drop→ramp cycles teach the recovery rhythm
    // Cycle 1: 6r road → 4r gap → 6r ramp → 2r fuel reward = 18r
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 6),
    // Gap (4r) — forced fall to drain
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // Ramp back up (cols 8-11): h=1→h=2→h=3
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,H(1),H(1), H(1),H(1),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,H(2),H(2), H(2),H(2),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,H(3),H(3), H(3),H(3),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    // Fuel reward on road
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DFHF(),DFHR(), DFHR(),DFHF(),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    // Cycle 2: 4r road → 4r gap → 6r ramp → 4r reward = 18r
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // Second gap — oxy drain below (more punishing)
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DO7,DO7, DO7,DO7,DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    // Ramp back up
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,H(1),H(1), H(1),H(1),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,H(2),H(2), H(2),H(2),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,H(3),H(3), H(3),H(3),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    // Oxy reward on drain + road continues
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,OX7,DF7,DFHR(),DFHR(), DFHR(),DFHR(),DF7,OX7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // Transition
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // 6+4+2+2+2+2+4+4+2+2+2+4+4 = 40 ✓

    // 8d: Dual challenge (40r)
    // High road 4 lanes with kills, low road oxy drain with kills
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DOHR(),DOHR(), DOHR(),DOHR(),DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 6),
    // Kill on high road + kill on drain
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,KF7,DO7,DOHR(),KH5, DOHR(),DOHR(),DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DOHR(),DOHR(), DOHR(),DOHR(),DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    // More kills
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DOHR(),DOHR(), KH5,DOHR(),DO7,KF7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    // Pad on drain
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DO7,J7, J7,DO7,DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    // Continue — third kill set (escalating density)
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DOHR(),DOHR(), DOHR(),DOHR(),DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 2),
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DOHR(),KH5, DOHR(),DOHR(),DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 2),
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DOHR(),DOHR(), DOHR(),DOHR(),DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 2),
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DOHO(),DOHR(), DOHR(),DOHO(),DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    // Transition back to fuel drain
    repeat(R12D, 8),
    // 6+4+4+4+4+6+4+8 = 40 ✓

    // ===== 9. THE SQUEEZE (120r) =====
    // 9a: Narrow road with kills (40r)
    // 8-lane road (cols 6-13) with kill blocks
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 8),
    // Kill at col 8
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),KH5,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 6),
    // Kill at col 12
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),KH5,DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // Kills at cols 7, 11
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),KH5,DFHR(),DFHR(), DFHR(),KH5,DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // Fuel
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),DFHF(),DFHR(), DFHR(),DFHF(),DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 8),
    // 8+2+6+2+4+2+4+4+8 = 40 ✓

    // 9b: Drain surface (40r)
    // 6-lane road (cols 7-12) with drain patches on road
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 6),
    // Drain on road + kill
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF4,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),KH5, DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHR(), DO4,DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DF4,DFHR(), DFHR(),KH5,DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // Oxy pickup
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHO(), DFHO(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    repeat(R12D, 8),
    // 6+4+2+4+4+4+4+4+8 = 40 ✓

    // 9c: Gauntlet bridge (40r)
    // 4-lane bridge (cols 8-11) with everything
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DOHR(),DOHR(), DOHR(),DOHR(),DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 6),
    // Kill + drain on bridge
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,KH5,DOHR(), DOHR(),DOHR(),DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 2),
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DOHR(),DO4, DOHR(),DOHR(),DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DOHR(),DOHR(), DOHR(),KH5,DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 2),
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DOHR(),DOHR(), DOHR(),DOHR(),DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    // Gap in bridge
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DO7,J7, J7,DO7,DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    // Resume wider road (12 lanes) with resources
    repeat([DF7,DF7_1,DF7,DF7_1, DFHF(),DFHR(),DFHR(),DFHO(),DFHR(),DFHR(), DFHR(),DFHR(),DFHO(),DFHR(),DFHR(),DFHF(), DF7,DF7_1,DF7,DF7_1], 6),
    repeat(R12D, 4),
    // Opening — drain accents + kill to maintain tension
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),KH5, DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 2),
    // 6+2+4+2+4+4+6+4+4+2+2 = 40 ✓

    // ===== 10. RESOURCE STATION (30r) =====
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHF(),DFHR(),DFHO(),DFHR(),DFHF(),DFHR(), DFHR(),DFHF(),DFHR(),DFHO(),DFHR(),DFHF(), DFHR(),DFHR(),DF7,DF7_1], 8),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHF(),DFHR(),DFHO(),DFHR(),DFHF(), DFHF(),DFHR(),DFHO(),DFHR(),DFHF(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 8),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 6),
    // 4+8+4+8+6 = 30 ✓

    // ===== 11. THE COLLAPSE (320r) =====
    // 11a: Rapid bridges (80r)
    // Short 5-lane bridges at h=4, 3r drain gaps, lateral offsets
    // Bridge 1 (cols 7-11)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 10),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,J7,DF7, DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // Bridge 2 (cols 9-13, offset right 2) — fuel + kill
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF7,DFHF(), DFHR(),DFHR(),DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF7,DFHR(), DFHR(),KH5,DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF7,DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF7,DF7, DF7,J7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // Bridge 3 (cols 6-10, offset left 3)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),DFHR(),DFHO(), DFHR(),DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 8),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,J7,DF7, DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // Bridge 4 (cols 8-12) — fuel + drain patch
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DFHR(),DFHF(), DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF4,DFHR(), DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF7,J7, J7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // Bridge 5 (cols 5-9, offset left)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DFHR(),DFHR(),DFHR(),DFHO(),DFHR(), DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 8),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,J7,DF7,DF7, DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // Bridge 6 (cols 10-14) with kill
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF7,DF7, DFHR(),DFHF(),DFHR(),DFHR(),DFHR(),DF7, DF7,DF7_1,DF7,DF7_1], 6),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF7,DF7, DFHR(),DFHR(),KH5,DFHR(),DFHR(),DF7, DF7,DF7_1,DF7,DF7_1], 2),
    // Transition: drain accent then road
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DF7,DO7_1, DO7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    repeat(R12D, 8),
    // 10+3+8+3+8+3+8+3+8+3+6+2+4+8+3 = 80 ✓

    // 11b: Dual chaos (80r)
    // Constant high/low switching — VARIED segment lengths break the rhythm
    // Seg 1: cols 7-11, long intro (12r + 4r gap = 16)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 12),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,J7,DF7, DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // Seg 2: cols 8-12, oxy drain below, compressed (10r + 3r gap = 13) — surprise compression
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DOHR(),DOHR(), DOHR(),DOHR(),DOHR(),DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 10),
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DO7,J7, J7,DO7,DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 3),
    // Seg 3: cols 6-10, fuel drain, kill on road, SHORT (8r + 3r gap = 11)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHF(),DFHR(),DFHR(),DFHR(), DFHR(),DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),KH5,DFHR(), DFHR(),DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 2),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,J7,DF7, DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // Seg 4: cols 9-13, oxy drain, LONG (12r + 4r gap) — breathing room
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DO7,DOHR(), DOHR(),DOHR(),DOHO(),DOHR(),DO7,DO7, DO7,DO7_1,DO7,DO7_1], 8),
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DO7,DOHR(), DOHR(),KH5,DOHR(),DOHR(),DO7,DO7, DO7,DO7_1,DO7,DO7_1], 2),
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DO7,DOHR(), DOHR(),DOHR(),DOHR(),DOHR(),DO7,DO7, DO7,DO7_1,DO7,DO7_1], 2),
    repeat([DO7,DO7_1,DO7,DO7_1, DO7,DO7,DO7,DO7,DO7,DO7, J7,DO7,DO7,DO7,DO7,DO7, DO7,DO7_1,DO7,DO7_1], 4),
    // Seg 5: cols 7-11, oxy reward, compressed (8r + 3r gap = 11) — rapid end
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DFHR(),DFHR(),DFHO(), DFHR(),DFHR(),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 8),
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,J7,DF7, DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // Road widens — transition to void (13r)
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 6),
    repeat(R12D, 7),
    // 16+13+11+16+11+13 = 80 ✓

    // 11c: Void below (80r)
    // Pure void below bridges. Falling = death.
    // Bridge 1: cols 7-11 (5 lanes) over void
    repeat([0,0,0,0, 0,0,0,HR,HR,HR, HR,HR,0,0,0,0, 0,0,0,0], 10),
    // Kill on bridge
    repeat([0,0,0,0, 0,0,0,HR,KH5,HR, HR,HR,0,0,0,0, 0,0,0,0], 2),
    // Void gap (3r)
    repeat([0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0], 3),
    // Bridge 2: cols 9-12 (4 lanes, NARROW — more danger over void)
    repeat([0,0,0,0, 0,0,0,0,0,HR, HR,HF(4),HR,0,0,0, 0,0,0,0], 10),
    // Void gap (4r — wider)
    repeat([0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0], 4),
    // Bridge 3: cols 6-10
    repeat([0,0,0,0, 0,0,HR,HR,HR,HR, HR,0,0,0,0,0, 0,0,0,0], 8),
    repeat([0,0,0,0, 0,0,HR,HR,KH5,HR, HR,0,0,0,0,0, 0,0,0,0], 2),
    // Void gap
    repeat([0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0], 3),
    // Bridge 4: cols 7-12 (6 lanes, WIDE — relief after narrow bridges)
    repeat([0,0,0,0, 0,0,0,HR,HR,HR, HO(4),HR,HR,0,0,0, 0,0,0,0], 8),
    // Drain patch on wide bridge
    repeat([0,0,0,0, 0,0,0,HR,DF4,HR, HR,HR,HR,0,0,0, 0,0,0,0], 2),
    // Void gap (2r — shorter, builds urgency)
    repeat([0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0], 2),
    // Bridge 5: cols 7-11 with kills
    repeat([0,0,0,0, 0,0,0,HR,HR,HR, HR,HR,0,0,0,0, 0,0,0,0], 6),
    repeat([0,0,0,0, 0,0,0,HR,HR,KH5, HR,HR,0,0,0,0, 0,0,0,0], 2),
    repeat([0,0,0,0, 0,0,0,HR,HF(4),HR, HR,HR,0,0,0,0, 0,0,0,0], 4),
    // Void gap
    repeat([0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0], 3),
    // Bridge 6: cols 9-13
    repeat([0,0,0,0, 0,0,0,0,0,HR, HR,HR,HR,HR,0,0, 0,0,0,0], 7),
    // Transition back to drain
    repeat(R12D, 4),
    // 10+2+3+10+3+8+2+3+10+3+6+2+4+3+7+4 = 80 ✓

    // 11d: Mixed nightmare (80r)
    // Bridges at varied heights, some drain below, some void
    // Bridge h=5 over drain (cols 7-12)
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,H(5),H(5),H(5), H(5),H(5),H(5),DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 8),
    // Drain gap
    repeat(DS, 3),
    // Bridge h=3 over VOID (cols 8-12) — falling here = death
    repeat([0,0,0,0, 0,0,0,0,H(3),H(3), H(3),HF(3),H(3),0,0,0, 0,0,0,0], 8),
    // Void gap
    repeat([0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0], 3),
    // Bridge h=4 over drain (cols 6-11) with kills
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DFHR(),DFHR(),KH5,DFHR(), DFHR(),DFHR(),DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 8),
    // Drain gap + pad
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,J7,DF7, DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 3),
    // Bridge h=5 over VOID (cols 7-11) — death below
    repeat([0,0,0,0, 0,0,0,H(5),H(5),HO(5), H(5),H(5),0,0,0,0, 0,0,0,0], 8),
    // Void gap
    repeat([0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0], 3),
    // Bridge h=4 over drain (cols 8-13) with drain patches
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DFHR(),DFHR(), DF4,DFHR(),DFHR(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 6),
    // Kill
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,DFHR(),KH5, DFHR(),DFHR(),DFHF(),DFHR(),DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // Drain gap + pad
    repeat([DF7,DF7_1,DF7,DF7_1, DF7,DF7,DF7,DF7,J7,DF7, DF7,DF7,DF7,DF7,DF7,DF7, DF7,DF7_1,DF7,DF7_1], 4),
    // Bridge h=3 over VOID (cols 7-11) with kill
    repeat([0,0,0,0, 0,0,0,H(3),H(3),H(3), H(3),H(3),0,0,0,0, 0,0,0,0], 6),
    repeat([0,0,0,0, 0,0,0,H(3),KH4,H(3), HO(3),H(3),0,0,0,0, 0,0,0,0], 4),
    // Transition to finale
    repeat(R12D, 4),
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 8),
    // 8+3+8+3+8+3+8+3+6+4+4+6+4+4+8 = 80 ✓

    // ===== 12. LAST BRIDGE (141r) =====
    // 12a: Descent h=4→h=3→h=2→h=1→h=0 (30r)
    // Drain patches on the h=4 approach
    repeat([DF7,DF7_1,DFHR(),DFHR(), DFHR(),DFHR(),DO4,DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DFHR(),DFHR(),DFHR(),DFHR(), DFHR(),DFHR(),DF7,DF7_1], 4),
    // h=3 (12 lanes) — kill block on step
    repeat([DF7,DF7_1,DF7,DF7_1, H(3),H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3),H(3), DF7,DF7_1,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7_1, H(3),H(3),H(3),H(3),H(3),H(3), H(3),H(3),KH4,H(3),H(3),H(3), DF7,DF7_1,DF7,DF7_1], 2),
    // h=2 (12 lanes) — drain accent
    repeat([DF7,DF7_1,DF7,DF7_1, H(2),H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(2),H(2), DF7,DF7_1,DF7,DF7_1], 4),
    repeat([DF7,DF7_1,DF7,DF7_1, H(2),H(2),[B.DRAIN_FUEL,S.FLAT,2],[B.DRAIN_FUEL,S.FLAT,2],H(2),H(2), H(2),H(2),H(2),H(2),H(2),H(2), DF7,DF7_1,DF7,DF7_1], 2),
    // h=1
    repeat([N,N,N,N,H(1),H(1), H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1),H(1), N,N,N,N], 6),
    // h=0 (ground)
    repeat(F, 8),
    // 4+4+2+4+2+6+8 = 30 ✓

    // 12b: Ground gauntlet (45r)
    // Ground level — drain sea edges (cols 0-1, 18-19) anchor this in L7
    repeat([DF7,DF7_1,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,DF7_1,DF7], 4),
    // Kill blocks scattered
    repeat([DF7,DF7_1,N,KF7,N, N,N,N,N,N, N,N,N,N,N, N,KF7,N,DF7_1,DF7], 4),
    repeat([DF7,DF7_1,N,N,N, N,N,N,N,N, N,KF7,N,N,N, N,N,N,DF7_1,DF7], 2),
    // Drain patches
    repeat([DF7,DF7_1,N,N,N, DF7,DF7,N,N,N, N,N,N,DO7,DO7, N,N,N,DF7_1,DF7], 4),
    repeat([DF7,DF7_1,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,DF7_1,DF7], 2),
    // H(1) ridges
    repeat([DF7,DF7_1,H(1),H(1),H(1), H(1),H(1),H(1),N,N, N,N,N,N,N, N,N,N,DF7_1,DF7], 4),
    repeat([DF7,DF7_1,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,DF7_1,DF7], 2),
    // Oxy drain river — callback to elevated drain, now at ground level
    repeat([DF7,DF7_1,N,N,N, N,N,N,DO7,DO7, DO7,N,N,N,N, N,N,N,DF7_1,DF7], 3),
    repeat([DF7,DF7_1,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,DF7_1,DF7], 2),
    // Kill + gap
    repeat([DF7,DF7_1,N,N,N, N,0,0,N,N, N,KF7,N,N,0, 0,N,N,DF7_1,DF7], 4),
    // Resources
    repeat([DF7,DF7_1,FU7,N,OX7, N,N,FU7,N,N, N,N,FU7,N,N, OX7,N,FU7,DF7_1,DF7], 6),
    repeat([DF7,DF7_1,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,DF7_1,DF7], 8),
    // 4+4+2+4+2+4+2+3+2+4+6+8 = 45 ✓

    // 12c: Final ascent (30r)
    // Ramp from h=0 back up to h=4
    repeat(F, 4),
    // Staircase up (14 lanes)
    repeat([0,0,0,H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),0,0,0], 4),
    repeat([0,0,0,0,H(2), H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(2), H(2),0,0,0,0], 4),
    // Narrowing + kills
    repeat([0,0,0,0,0, H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3), 0,0,0,0,0], 4),
    repeat([0,0,0,0,0, 0,H(3),H(3),KH4,H(3), H(3),H(3),H(3),H(3),0, 0,0,0,0,0], 2),
    // h=4 (6 lanes)
    repeat([0,0,0,0,0, 0,0,HR,HR,HR, HR,HR,HR,0,0,0, 0,0,0,0], 6),
    // Kill on road
    repeat([0,0,0,0,0, 0,0,HR,HR,KH5, HR,HR,HR,0,0,0, 0,0,0,0], 2),
    repeat([0,0,0,0,0, 0,0,HR,HR,HR, HR,HR,HR,0,0,0, 0,0,0,0], 4),
    // 4+4+4+4+2+6+2+4 = 30 ✓

    // 12d: Last bridge (28r)
    // Narrowing h=4 bridge over void. 6→4→2 lanes.
    // 6 lanes (cols 7-12)
    repeat([0,0,0,0, 0,0,0,HR,HF(4),HR, HR,HO(4),HR,0,0,0, 0,0,0,0], 4),
    repeat([0,0,0,0, 0,0,0,HR,HR,HR, HR,HR,HR,0,0,0, 0,0,0,0], 4),
    // Kill on bridge
    repeat([0,0,0,0, 0,0,0,KH5,HR,HR, HR,HR,HR,0,0,0, 0,0,0,0], 2),
    repeat([0,0,0,0, 0,0,0,HR,HR,HR, HR,HR,KH5,0,0,0, 0,0,0,0], 2),
    // 4 lanes (cols 8-11) — drain patches force weaving
    repeat([0,0,0,0, 0,0,0,0,HR,HR, HR,HR,0,0,0,0, 0,0,0,0], 2),
    repeat([0,0,0,0, 0,0,0,0,DF4,HR, HR,DO4,0,0,0,0, 0,0,0,0], 2),
    repeat([0,0,0,0, 0,0,0,0,HR,HR, HR,HR,0,0,0,0, 0,0,0,0], 2),
    // 2 lanes (cols 9-10) — the narrowest, kill forces final dodge
    repeat([0,0,0,0, 0,0,0,0,0,HR, HR,0,0,0,0,0, 0,0,0,0], 2),
    repeat([0,0,0,0, 0,0,0,0,0,KH5, HR,0,0,0,0,0, 0,0,0,0], 2),
    repeat([0,0,0,0, 0,0,0,0,0,HR, HR,0,0,0,0,0, 0,0,0,0], 2),
    // Last resources
    repeat([0,0,0,0, 0,0,0,0,0,HF(4), HO(4),0,0,0,0,0, 0,0,0,0], 2),
    repeat([0,0,0,0, 0,0,0,0,0,HR, HR,0,0,0,0,0, 0,0,0,0], 2),
    // 4+4+2+2+6+6+2+2 = 28 ✓

    // ===== 13. VICTORY (8r) =====
    repeat([0,0,0,0, 0,0,0,0,0,HR, HR,0,0,0,0,0, 0,0,0,0], 6),
    // Win tunnel
    repeat([0,0,0,0, 0,0,0,0,0,W7, W7,0,0,0,0,0, 0,0,0,0], 2)
    // 6+2 = 8 ✓
  )
});
