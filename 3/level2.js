LEVELS.push({
  name: "Shattered Highway",
  gridColors: [0x887766, 0x998877],
  rows: concat(
    // ===== WARMUP: gentle height intro (40r) =====
    repeat(F, 8),
    // Center ridge rises
    repeat([N,N,N,N,N, N,N,H(1),H(1),H(1), H(1),H(1),H(1),N,N, N,N,N,N,N], 6),
    repeat([N,N,N,H(1),H(1), H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(1), H(1),N,N,N,N], 8),
    // Comes back down
    repeat([N,N,N,N,N, N,N,H(1),H(1),H(1), H(1),H(1),H(1),N,N, N,N,N,N,N], 6),
    repeat(F, 6),
    // Fuel pickup
    repeat([N,[B.FUEL,S.FLAT],N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,[B.FUEL,S.FLAT],N], 6),

    // ===== BROKEN HIGHWAY: gaps appear (80r) =====
    repeat(F, 4),
    // Small gap right side
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,0,0,N], 6),
    repeat(F, 4),
    // Small gap left side
    repeat([N,0,0,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 6),
    repeat(F, 4),
    // Center gap
    repeat([N,N,N,N,N, N,N,N,0,0, 0,0,N,N,N, N,N,N,N,N], 6),
    repeat(F, 4),
    // Both sides missing
    repeat([N,N,0,0,0, N,N,N,N,N, N,N,N,N,N, 0,0,0,N,N], 6),
    repeat(F, 4),
    // Raised center, edges gone
    repeat([0,0,0,N,N, H(1),H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(1), N,N,0,0,0], 8),
    repeat(F, 4),
    // Scattered remains - multiple holes
    repeat([N,N,0,0,N, N,N,0,0,N, N,0,0,N,N, 0,0,N,N,N], 8),
    repeat([N,0,0,N,N, 0,0,N,N,N, N,N,N,0,0, N,N,0,0,N], 8),
    repeat(F, 8),

    // ===== HEIGHT WAVES (80r) =====
    // Wave 1: whole track rises then falls
    repeat([N,N,N,H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),N,N,N], 6),
    repeat([N,H(1),H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(1),N], 6),
    repeat([H(1),H(2),H(3),H(4),H(4), H(4),H(4),H(4),H(4),H(4), H(4),H(4),H(4),H(4),H(4), H(4),H(4),H(3),H(2),H(1)], 8),
    // Peak - edges fall away
    repeat([0,0,H(3),H(4),H(4), H(4),H(4),H(4),H(4),H(4), H(4),H(4),H(4),H(4),H(4), H(4),H(4),H(3),0,0], 6),
    // Descent
    repeat([N,H(1),H(2),H(3),H(3), H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(2),H(1),N], 6),
    repeat([N,N,N,H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),N,N,N], 6),
    repeat(F, 6),
    // Wave 2: edges high, center valley
    repeat([H(2),H(2),H(1),N,N, N,N,N,N,N, N,N,N,N,N, N,N,H(1),H(2),H(2)], 6),
    repeat([H(4),H(3),H(2),H(1),N, N,N,N,N,N, N,N,N,N,N, N,H(1),H(2),H(3),H(4)], 8),
    // Valley narrows - walls close in
    repeat([H(4),H(3),H(2),H(1),0, 0,N,N,N,N, N,N,N,N,0, 0,H(1),H(2),H(3),H(4)], 8),
    // Open back up
    repeat([H(2),H(2),H(1),N,N, N,N,N,N,N, N,N,N,N,N, N,N,H(1),H(2),H(2)], 6),
    repeat(F, 8),

    // ===== FUEL + OXY STATION (30r) =====
    repeat([[B.FUEL,S.FLAT],N,[B.OXYGEN,S.FLAT],N,N, [B.FUEL,S.FLAT],N,N,[B.OXYGEN,S.FLAT],N, N,[B.OXYGEN,S.FLAT],N,N,[B.FUEL,S.FLAT], N,N,[B.OXYGEN,S.FLAT],N,[B.FUEL,S.FLAT]], 8),
    repeat(F, 6),
    repeat([N,N,[B.FUEL,S.FLAT],N,[B.OXYGEN,S.FLAT], N,N,[B.FUEL,S.FLAT],N,N, N,N,[B.FUEL,S.FLAT],N,N, [B.OXYGEN,S.FLAT],N,[B.FUEL,S.FLAT],N,N], 8),
    repeat(F, 8),

    // ===== CANYON DESCENT (100r) =====
    // Walls rise on sides
    repeat([COL(3),COL(3),N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,COL(3),COL(3)], 8),
    repeat([COL(4),COL(4),COL(4),N,N, N,N,N,N,N, N,N,N,N,N, N,N,COL(4),COL(4),COL(4)], 8),
    // Floor rises inside canyon
    repeat([COL(5),COL(5),COL(5),N,N, N,H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),N, N,N,COL(5),COL(5),COL(5)], 8),
    repeat([COL(6),COL(6),COL(6),COL(6),N, H(1),H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(1), N,COL(6),COL(6),COL(6),COL(6)], 8),
    // Canyon peak - ceiling forms briefly
    repeat([COL(6),COL(6),COL(6),COL(6),TUN(5), TUN(5),TUN(5),TUN(5),TUN(5),TUN(5), TUN(5),TUN(5),TUN(5),TUN(5),TUN(5), TUN(5),COL(6),COL(6),COL(6),COL(6)], 10),
    // Descending out
    repeat([COL(6),COL(6),COL(6),COL(6),N, H(1),H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(1), N,COL(6),COL(6),COL(6),COL(6)], 8),
    repeat([COL(5),COL(5),COL(5),N,N, N,H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),N, N,N,COL(5),COL(5),COL(5)], 8),
    // Interior pillars to dodge
    repeat([COL(4),COL(4),N,N,COL(3), N,N,N,N,N, N,N,N,N,N, COL(3),N,N,COL(4),COL(4)], 8),
    repeat([COL(4),COL(4),N,N,N, N,N,COL(3),N,N, N,N,COL(3),N,N, N,N,N,COL(4),COL(4)], 8),
    // Fuel inside canyon
    repeat([COL(4),COL(4),N,[B.FUEL,S.FLAT],N, N,N,N,N,N, N,N,N,N,N, N,[B.FUEL,S.FLAT],N,COL(4),COL(4)], 6),
    // Canyon opens up
    repeat([COL(3),COL(3),N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,COL(3),COL(3)], 6),
    repeat(F, 6),
    // rows: 8+8+8+8+10+8+8+8+8+6+6+6+8 = 100 ✓ (actually 102, close enough)

    // ===== ISLAND HOPPING (120r) =====
    // Easy islands - wide platforms, small gaps
    repeat(F, 4),
    // Island 1 - full width, then gap
    repeat([N,N,N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    // Island 2 - raised slightly
    repeat([0,0,N,N,N, N,N,N,H(1),H(1), H(1),H(1),N,N,N, N,N,N,0,0], 8),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    // Island 3 - narrower, higher
    repeat([0,0,0,0,N, N,N,H(1),H(2),H(2), H(2),H(2),H(1),N,N, N,0,0,0,0], 8),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    // Island 4 - two separate platforms
    repeat([0,0,N,N,N, N,0,0,0,0, 0,0,0,0,N, N,N,N,0,0], 8),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    // Island 5 - left + right at different heights
    repeat([0,0,N,N,N, H(1),H(1),H(1),H(1),0, 0,H(2),H(2),H(2),H(2), N,N,N,0,0], 8),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    // Island 6 - stepping stones (wider clusters)
    repeat([0,0,0,N,N, N,N,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,0,N,N, N,N,0,0,0, 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,N,N,N, N,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,N,N,N, N,0,0,0,0, 0,0,0,0,0], 6),
    // Oxygen island
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,0,0, 0,[B.OXYGEN,S.FLAT],[B.OXYGEN,S.FLAT],[B.OXYGEN,S.FLAT],N, N,[B.OXYGEN,S.FLAT],[B.OXYGEN,S.FLAT],[B.OXYGEN,S.FLAT],0, 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    // Harder islands - wider + height jumps
    repeat([0,0,0,0,N, N,N,N,N,N, 0,0,0,0,0, 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,0,0, 0,0,0,0,H(1), H(1),H(1),H(1),H(1),H(1), 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,0,0, 0,N,N,N,N, 0,0,0,0,0, 0,0,0,0,0], 6),
    // Back to solid ground
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,0,N, N,N,N,N,N, N,N,N,N,N, N,0,0,0,0], 4),
    repeat(F, 6),
    // Elevated island run - islands at increasing heights
    repeat([0,0,0,0,0, N,N,N,N,N, N,N,N,N,N, 0,0,0,0,0], 8),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,H(1),H(1),H(1), H(1),H(1),H(1),H(1),0, 0,0,0,0,0, 0,0,0,0,0], 8),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,0,0, 0,0,0,0,0, H(2),H(2),H(2),H(2),H(2), H(2),H(2),0,0,0], 8),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,0,0, H(3),H(3),H(3),H(3),H(3), H(3),0,0,0,0, 0,0,0,0,0], 8),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    // Big island with resources
    repeat([0,0,0,0,H(2),H(2), [B.FUEL,S.FLAT,2],[B.OXYGEN,S.FLAT,2],H(2),H(2), H(2),H(2),[B.OXYGEN,S.FLAT,2],[B.FUEL,S.FLAT,2],H(2), H(2),0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    // Three islands — pick a lane and commit
    repeat([0,0,N,N,N, N,0,0,N,N, N,N,0,0,0, N,N,N,N,0], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,N,N, N,N,0,0,0, 0,0,N,N,N, N,0,0,0,0], 6),
    repeat(F, 6),

    // ===== DRAIN ALLEY (60r) =====
    // Narrow safe path through drain blocks
    repeat(F, 4),
    repeat([[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],N,N, N,N,N,N,N, N,N,N,N,N, N,N,[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT]], 8),
    // Safe path narrows
    repeat([[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],N, N,N,N,N,N, N,N,N,N,N, N,[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT]], 8),
    // Safe path weaves - shifts right
    repeat([[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT], [B.DRAIN_OXY,S.FLAT],N,N,N,N, N,N,N,N,[B.DRAIN_OXY,S.FLAT], [B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT]], 8),
    // Shifts further right
    repeat([[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT], [B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],N,N, N,N,[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT], [B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT]], 8),
    // Safe path with height change — raised section through drains
    repeat([[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT], [B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],N, N,[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT], [B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT],[B.DRAIN_OXY,S.FLAT]], 8),
    // Opens back up
    repeat([[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],N,N, N,N,N,N,N, N,N,N,N,N, N,N,[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT],[B.DRAIN_FUEL,S.FLAT]], 8),
    repeat(F, 8),
    // rows: 4+8+8+8+8+8+8+8 = 60 ✓

    // ===== ELEVATED BRIDGES (100r) =====
    // Thin bridges at height with gaps below
    repeat(F, 6),
    // Bridge rises from ground
    repeat([N,N,N,N,N, N,N,H(1),H(1),H(1), H(1),H(1),H(1),N,N, N,N,N,N,N], 4),
    repeat([0,0,0,0,0, 0,0,H(2),H(2),H(2), H(2),H(2),H(2),0,0, 0,0,0,0,0], 4),
    repeat([0,0,0,0,0, 0,0,0,H(3),H(3), H(3),H(3),0,0,0, 0,0,0,0,0], 8),
    // Bridge splits into two
    repeat([0,0,0,H(3),H(3), 0,0,0,0,0, 0,0,0,0,0, H(3),H(3),0,0,0], 10),
    // Oxygen on left bridge, fuel on right
    repeat([0,0,0,HO(3),HO(3), 0,0,0,0,0, 0,0,0,0,0, HF(3),HF(3),0,0,0], 4),
    repeat([0,0,0,H(3),H(3), 0,0,0,0,0, 0,0,0,0,0, H(3),H(3),0,0,0], 10),
    // Bridges converge, rise higher
    repeat([0,0,0,0,H(3),H(3), 0,0,0,0, 0,0,0,0,H(3), H(3),0,0,0,0], 6),
    repeat([0,0,0,0,0,H(4),H(4), H(4),0,0, 0,0,H(4),H(4),H(4), 0,0,0,0,0], 8),
    // Single high bridge
    repeat([0,0,0,0,0, 0,0,H(4),H(4),H(4), H(4),H(4),H(4),0,0, 0,0,0,0,0], 10),
    // Bridge descends back down
    repeat([0,0,0,0,0, 0,0,H(3),H(3),H(3), H(3),H(3),H(3),0,0, 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2),0, 0,0,0,0,0], 6),
    repeat([N,N,N,N,N, H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), N,N,N,N,N], 6),
    repeat(F, 6),
    // Fuel/oxy before next section
    repeat([N,[B.FUEL,S.FLAT],N,[B.OXYGEN,S.FLAT],N, N,[B.FUEL,S.FLAT],N,N,[B.OXYGEN,S.FLAT], [B.OXYGEN,S.FLAT],N,N,[B.FUEL,S.FLAT],N, N,[B.OXYGEN,S.FLAT],N,[B.FUEL,S.FLAT],N], 6),
    // rows: 6+4+4+8+10+4+10+6+8+10+6+6+6+6+6 = 104

    // ===== JUMP PAD PLAYGROUND (100r) =====
    repeat(F, 6),
    // Jump pads launch you onto raised platforms
    repeat([N,N,N,N,[B.JUMP,S.FLAT], [B.JUMP,S.FLAT],N,N,N,N, N,N,N,N,[B.JUMP,S.FLAT], [B.JUMP,S.FLAT],N,N,N,N], 4),
    // Landing platforms at height
    repeat([0,0,0,0,H(3),H(3), H(3),H(3),0,0, 0,0,H(3),H(3),H(3), H(3),0,0,0,0], 8),
    // Jump pads on the platforms to go higher
    repeat([0,0,0,0,H(3),H(3), [B.JUMP,S.FLAT,3],[B.JUMP,S.FLAT,3],0,0, 0,0,[B.JUMP,S.FLAT,3],[B.JUMP,S.FLAT,3],H(3), H(3),0,0,0,0], 4),
    // High platforms
    repeat([0,0,0,H(5),H(5),H(5), H(5),H(5),H(5),0, 0,H(5),H(5),H(5),H(5), H(5),H(5),0,0,0], 8),
    // Back down via gaps (fall to ground)
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 4),
    repeat(F, 6),
    // Second jump sequence — zigzag
    repeat([N,N,[B.JUMP,S.FLAT],N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    repeat([0,0,0,0,0, H(3),H(3),H(3),0,0, 0,0,0,0,0, 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, H(3),H(3),[B.JUMP,S.FLAT,3],0,0, 0,0,0,0,0, 0,0,0,0,0], 4),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,H(5),H(5),H(5),0, 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,H(5),H(5),[B.JUMP,S.FLAT,5],0, 0,0,0,0,0], 4),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,H(7),H(7),H(7),0], 8),
    // Gentle descent from h=7
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,H(5),H(5), H(5),H(6),H(7),0,0], 4),
    repeat([0,0,0,0,0, 0,0,0,0,H(3), H(3),H(3),H(4),H(5),0, 0,0,0,0,0], 4),
    repeat([0,0,0,0,N, N,N,H(1),H(2),H(3), 0,0,0,0,0, 0,0,0,0,0], 4),
    repeat(F, 6),
    repeat([N,[B.OXYGEN,S.FLAT],N,[B.FUEL,S.FLAT],N, N,[B.OXYGEN,S.FLAT],N,N,[B.FUEL,S.FLAT], [B.FUEL,S.FLAT],N,N,[B.OXYGEN,S.FLAT],N, N,[B.FUEL,S.FLAT],N,[B.OXYGEN,S.FLAT],N], 8),
    // rows: 6+4+8+4+8+4+6+4+6+4+6+4+8+4+4+4+6+8 = 98

    // ===== TUNNEL MAZE (120r) =====
    // Entrance - walls form
    repeat(F, 4),
    repeat([COL(4),COL(4),N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,COL(4),COL(4)], 6),
    // Ceiling closes
    repeat([COL(4),COL(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),COL(4),COL(4)], 8),
    // Fork: wall down the middle, go left or right
    repeat([COL(4),COL(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),COL(4),COL(4), COL(4),COL(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),COL(4),COL(4)], 10),
    // Left path: fuel, right path: oxygen
    repeat([COL(4),COL(4),TUN(4),TUN(4),TUN(4,B.FUEL), TUN(4),TUN(4),TUN(4),COL(4),COL(4), COL(4),COL(4),TUN(4),TUN(4),TUN(4), TUN(4,B.OXYGEN),TUN(4),TUN(4),COL(4),COL(4)], 6),
    // Left path gets obstacle
    repeat([COL(4),COL(4),TUN(4),TUN(4),COL(4), TUN(4),TUN(4),TUN(4),COL(4),COL(4), COL(4),COL(4),TUN(4),TUN(4),TUN(4), TUN(4),COL(4),TUN(4),COL(4),COL(4)], 6),
    // Paths rejoin
    repeat([COL(4),COL(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),COL(4),COL(4)], 6),
    // Second fork: top path and bottom path (height split)
    // Bottom stays at ground, top has raised floor
    repeat([COL(4),COL(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),COL(4),COL(4)], 4),
    // Interior wall at h=2 splits high/low
    repeat([COL(4),COL(4),TUN(4),TUN(4),TUN(4), STACK(0,2),STACK(0,2),STACK(0,2),STACK(0,2),STACK(0,2), STACK(0,2),STACK(0,2),STACK(0,2),STACK(0,2),STACK(0,2), TUN(4),TUN(4),TUN(4),COL(4),COL(4)], 10),
    // Kill blocks in low path to punish wrong choice
    repeat([COL(4),COL(4),TUN(4),TUN(4),TUN(4), STACK(0,2),STACK(0,2),[B.KILL,S.FLAT],STACK(0,2),STACK(0,2), STACK(0,2),STACK(0,2),[B.KILL,S.FLAT],STACK(0,2),STACK(0,2), TUN(4),TUN(4),TUN(4),COL(4),COL(4)], 8),
    // Merge back
    repeat([COL(4),COL(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),COL(4),COL(4)], 6),
    // Narrow squeeze
    repeat([COL(4),COL(4),COL(4),COL(4),COL(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), COL(4),COL(4),COL(4),COL(4),COL(4)], 8),
    // Interior obstacles zigzag
    repeat([COL(4),COL(4),COL(4),COL(4),COL(4), TUN(4),TUN(4),COL(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), COL(4),COL(4),COL(4),COL(4),COL(4)], 6),
    repeat([COL(4),COL(4),COL(4),COL(4),COL(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),COL(4),TUN(4),TUN(4), COL(4),COL(4),COL(4),COL(4),COL(4)], 6),
    // Oxygen before exit
    repeat([COL(4),COL(4),COL(4),COL(4),COL(4), TUN(4),TUN(4,B.OXYGEN),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4,B.OXYGEN),TUN(4), COL(4),COL(4),COL(4),COL(4),COL(4)], 6),
    // Exit
    repeat([COL(4),COL(4),COL(4),N,N, N,N,N,N,N, N,N,N,N,N, N,N,COL(4),COL(4),COL(4)], 6),
    repeat([COL(3),COL(3),N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,COL(3),COL(3)], 4),
    repeat(F, 6),
    // rows: 4+6+8+10+6+6+6+4+10+8+6+8+6+6+6+6+4+6 = 120 ✓

    // ===== STACKED CITY (120r) =====
    // Dense multi-level platforms
    repeat(F, 6),
    // Ground level with pillars supporting upper deck
    repeat([N,N,STACK(0,3),STACK(0,3),STACK(0,3), STACK(0,3),N,N,N,N, N,N,N,N,STACK(0,3), STACK(0,3),STACK(0,3),STACK(0,3),N,N], 4),
    // Upper deck
    repeat([N,N,H(3),H(3),H(3), H(3),N,N,N,N, N,N,N,N,H(3), H(3),H(3),H(3),N,N], 8),
    // More stacking: ground, mid(3), high(5)
    repeat([N,N,H(3),H(3),STACK(3,5), STACK(3,5),H(3),N,N,N, N,N,N,H(3),STACK(3,5), STACK(3,5),H(3),H(3),N,N], 4),
    repeat([N,N,H(3),H(3),H(5), H(5),H(3),N,N,N, N,N,N,H(3),H(5), H(5),H(3),H(3),N,N], 8),
    // Fuel on high level, oxy on mid
    repeat([N,N,HO(3),H(3),HF(5), H(5),HO(3),N,N,N, N,N,N,HO(3),H(5), HF(5),H(3),HO(3),N,N], 4),
    // City block with interior
    repeat([STACK(0,3),N,N,N,STACK(0,3), COL(5),COL(5),N,N,N, N,N,N,COL(5),COL(5), STACK(0,3),N,N,N,STACK(0,3)], 4),
    repeat([H(3),N,N,N,H(3), 0,0,N,N,N, N,N,N,0,0, H(3),N,N,N,H(3)], 8),
    repeat([H(3),N,N,N,H(3), 0,0,N,N,N, N,N,N,0,0, H(3),N,N,N,H(3)], 4),
    // Bridge between buildings at h=3
    repeat([H(3),H(3),H(3),H(3),H(3), 0,0,N,N,N, N,N,N,0,0, H(3),H(3),H(3),H(3),H(3)], 6),
    // Ground path through buildings
    repeat([STACK(0,3),N,N,N,STACK(0,3), STACK(0,5),N,N,N,N, N,N,N,N,STACK(0,5), STACK(0,3),N,N,N,STACK(0,3)], 4),
    repeat([0,N,N,N,0, 0,N,N,N,N, N,N,N,N,0, 0,N,N,N,0], 8),
    // Tall towers with gaps
    repeat([COL(6),0,0,N,N, N,0,0,COL(6),0, 0,COL(6),0,0,N, N,N,0,0,COL(6)], 6),
    repeat(F, 4),
    repeat([0,0,COL(6),0,0, N,N,N,0,0, 0,0,N,N,N, 0,0,COL(6),0,0], 6),
    repeat(F, 4),
    // Multi-tier descent
    repeat([N,N,N,H(4),H(4), H(4),H(4),N,N,N, N,N,N,H(2),H(2), H(2),H(2),N,N,N], 8),
    repeat([N,N,N,H(2),H(2), H(2),H(2),N,N,N, N,N,N,N,N, N,N,N,N,N], 6),
    repeat(F, 6),
    // Resources
    repeat([[B.FUEL,S.FLAT],N,[B.OXYGEN,S.FLAT],N,[B.FUEL,S.FLAT], N,[B.OXYGEN,S.FLAT],N,[B.FUEL,S.FLAT],N, N,[B.FUEL,S.FLAT],N,[B.OXYGEN,S.FLAT],N, [B.FUEL,S.FLAT],N,[B.OXYGEN,S.FLAT],N,[B.FUEL,S.FLAT]], 8),
    repeat(F, 6),
    // rows: 6+4+8+4+8+4+4+8+4+6+4+8+6+4+6+4+8+6+6+8+6 = 124

    // ===== PRECISION ISLANDS (100r) =====
    // Wider platforms, manageable gaps
    repeat(F, 4),
    // 6-wide islands
    repeat([0,0,0,0,0, 0,0,N,N,N, N,N,N,0,0, 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,0,N, N,N,N,N,N, 0,0,0,0,0, 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    // 4-wide at height
    repeat([0,0,0,0,0, 0,0,0,0,H(1), H(1),H(1),H(1),0,0, 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,H(2),H(2), H(2),H(2),0,0,0, 0,0,0,0,0, 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    // Zigzag islands (4-wide each)
    repeat([0,0,0,0,0, 0,0,0,N,N, N,N,0,0,0, 0,0,0,0,0], 5),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,N,N,N, N,0,0,0,0], 5),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,0,0, 0,N,N,N,N, 0,0,0,0,0, 0,0,0,0,0], 5),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    // Oxygen island
    repeat([0,0,0,0,0, 0,[B.OXYGEN,S.FLAT],[B.OXYGEN,S.FLAT],[B.OXYGEN,S.FLAT],N, N,[B.OXYGEN,S.FLAT],[B.OXYGEN,S.FLAT],[B.OXYGEN,S.FLAT],0, 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    // Final sequence - 4-wide
    repeat([0,0,0,0,N, N,N,N,0,0, 0,0,0,0,0, 0,0,0,0,0], 5),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,N,N,N, N,0,0,0,0], 5),
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,0,0, 0,0,0,N,N, N,N,0,0,0, 0,0,0,0,0], 5),
    // Landing back on solid ground
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0], 3),
    repeat([0,0,0,0,N, N,N,N,N,N, N,N,N,N,N, N,0,0,0,0], 4),
    repeat(F, 6),
    // rows: 4+4+4+4+4+4+4+4+4+3+3+3+3+3+3+3+3+4+4+3+3+3+3+3+3+4+6 = 96

    // ===== KILL GAUNTLET (80r) =====
    repeat(F, 4),
    // Kill blocks scattered - weave through
    repeat([N,N,[B.KILL,S.FLAT],[B.KILL,S.FLAT],N, N,N,N,N,N, N,[B.KILL,S.FLAT],[B.KILL,S.FLAT],N,N, N,N,N,N,N], 6),
    repeat([N,N,N,N,N, N,[B.KILL,S.FLAT],[B.KILL,S.FLAT],N,N, N,N,N,N,[B.KILL,S.FLAT], [B.KILL,S.FLAT],N,N,N,N], 6),
    // Kill blocks with height — kill columns
    repeat([N,N,N,COL(3,B.KILL),N, N,N,N,N,N, N,N,N,N,N, COL(3,B.KILL),N,N,N,N], 6),
    repeat([N,N,N,N,N, N,N,COL(3,B.KILL),N,N, N,N,COL(3,B.KILL),N,N, N,N,N,N,N], 6),
    // Kill floor with safe raised path
    repeat([[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],H(1),H(1), H(1),[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT], [B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],H(1), H(1),H(1),[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT]], 8),
    // Safe path shifts
    repeat([[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT], [B.KILL,S.FLAT],[B.KILL,S.FLAT],H(1),H(1),H(1), H(1),H(1),H(1),[B.KILL,S.FLAT],[B.KILL,S.FLAT], [B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT]], 8),
    // Safe path narrows to 4 wide
    repeat([[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT], [B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],H(1),H(1), H(1),H(1),[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT], [B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT]], 8),
    // Kill blocks above too (must duck/stay low through tunnel)
    repeat([[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT], [B.KILL,S.FLAT],[B.KILL,S.FLAT],N,N,N, N,N,N,[B.KILL,S.FLAT],[B.KILL,S.FLAT], [B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT],[B.KILL,S.FLAT]], 8),
    // Open up
    repeat([N,N,[B.KILL,S.FLAT],N,N, N,N,N,N,N, N,N,N,N,N, N,N,[B.KILL,S.FLAT],N,N], 6),
    repeat(F, 6),
    // Fuel/oxy before finale
    repeat([[B.FUEL,S.FLAT],[B.OXYGEN,S.FLAT],N,[B.FUEL,S.FLAT],N, [B.OXYGEN,S.FLAT],N,[B.FUEL,S.FLAT],N,[B.OXYGEN,S.FLAT], [B.OXYGEN,S.FLAT],N,[B.FUEL,S.FLAT],N,[B.OXYGEN,S.FLAT], N,[B.FUEL,S.FLAT],N,[B.OXYGEN,S.FLAT],[B.FUEL,S.FLAT]], 8),
    // rows: 4+6+6+6+6+8+8+8+8+6+6+8 = 80 ✓

    // ===== HEIGHT SWITCHBACK (90r) =====
    // Path weaves left and right at different heights
    repeat(F, 6),
    // Left high road
    repeat([H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(2),0,0, 0,0,0,0,0, 0,0,0,0,0], 8),
    // Bridge connects to right at h=2
    repeat([0,0,0,0,0, 0,0,H(2),H(2),H(2), H(2),H(2),H(2),0,0, 0,0,0,0,0], 6),
    // Right road rises to h=3
    repeat([0,0,0,0,0, 0,0,0,0,0, 0,0,H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3)], 8),
    // Bridge back to center
    repeat([0,0,0,0,0, 0,H(3),H(3),H(3),H(3), H(3),H(3),H(3),0,0, 0,0,0,0,0], 6),
    // Center continues, drops to h=2
    repeat([0,0,0,0,0, H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(2), 0,0,0,0,0], 8),
    // Splits into two paths at h=2
    repeat([0,0,H(2),H(2),H(2), 0,0,0,0,0, 0,0,0,0,0, H(2),H(2),H(2),0,0], 8),
    // Both paths have resources
    repeat([0,0,HF(2),H(2),HO(2), 0,0,0,0,0, 0,0,0,0,0, HO(2),H(2),HF(2),0,0], 4),
    // Both paths converge through a descent
    repeat([0,0,0,H(2),H(2), H(2),H(2),H(1),H(1),H(1), H(1),H(1),H(1),H(2),H(2), H(2),H(2),0,0,0], 6),
    repeat([0,0,0,0,N, N,N,N,N,N, N,N,N,N,N, N,0,0,0,0], 6),
    // Valley with pillars
    repeat([0,0,0,N,N, COL(4),N,N,N,N, N,N,N,N,COL(4), N,N,0,0,0], 6),
    repeat([0,0,0,N,N, N,N,COL(4),N,N, N,N,COL(4),N,N, N,N,0,0,0], 6),
    repeat([0,0,0,0,N, N,N,N,N,N, N,N,N,N,N, N,0,0,0,0], 6),
    repeat(F, 6),

    // ===== THE ASCENT (120r) =====
    // Long climbing staircase with obstacles
    repeat(F, 8),
    // Step 1: h=1
    repeat([N,N,N,H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),N,N,N], 8),
    // Step 2: h=2
    repeat([0,0,H(1),H(2),H(2), H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(2),H(2),H(2), H(2),H(2),H(1),0,0], 8),
    // Step 3: h=3 with obstacles
    repeat([0,0,0,H(3),H(3), H(3),H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),H(3), H(3),H(3),0,0,0], 6),
    repeat([0,0,0,H(3),H(3), COL(6),H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),COL(6), H(3),H(3),0,0,0], 6),
    // Step 4: h=4 narrower
    repeat([0,0,0,0,H(4), H(4),H(4),H(4),H(4),H(4), H(4),H(4),H(4),H(4),H(4), H(4),0,0,0,0], 8),
    // Fuel on the climb
    repeat([0,0,0,0,HF(4), H(4),H(4),H(4),H(4),H(4), H(4),H(4),H(4),H(4),H(4), HF(4),0,0,0,0], 4),
    // Step 5: h=5 with kill obstacles
    repeat([0,0,0,0,0, H(5),H(5),H(5),H(5),H(5), H(5),H(5),H(5),H(5),H(5), 0,0,0,0,0], 6),
    repeat([0,0,0,0,0, H(5),[B.KILL,S.FLAT,5],H(5),H(5),H(5), H(5),H(5),H(5),[B.KILL,S.FLAT,5],H(5), 0,0,0,0,0], 6),
    // Step 6: h=6 very narrow
    repeat([0,0,0,0,0, 0,H(6),H(6),H(6),H(6), H(6),H(6),H(6),H(6),0, 0,0,0,0,0], 8),
    // Oxygen on the ledge
    repeat([0,0,0,0,0, 0,HO(6),H(6),H(6),H(6), H(6),H(6),H(6),HO(6),0, 0,0,0,0,0], 4),
    // Step 7: h=7 even narrower
    repeat([0,0,0,0,0, 0,0,H(7),H(7),H(7), H(7),H(7),H(7),0,0, 0,0,0,0,0], 8),
    // Kill walls flanking the narrow path
    repeat([0,0,0,0,0, 0,COL(8,B.KILL),H(7),H(7),H(7), H(7),H(7),H(7),COL(8,B.KILL),0, 0,0,0,0,0], 8),
    // Step 8: h=8 peak - tiny platform
    repeat([0,0,0,0,0, 0,0,0,H(8),H(8), H(8),H(8),0,0,0, 0,0,0,0,0], 8),
    // Fuel + oxy on the peak
    repeat([0,0,0,0,0, 0,0,0,HF(8),HO(8), HO(8),HF(8),0,0,0, 0,0,0,0,0], 4),
    // Final bridge to win
    repeat([0,0,0,0,0, 0,0,0,H(8),H(8), H(8),H(8),0,0,0, 0,0,0,0,0], 8),
    repeat([0,0,0,0,0, 0,0,H(8),H(8),H(8), H(8),H(8),H(8),0,0, 0,0,0,0,0], 6),

    // ===== WIN =====
    repeat([0,0,0,0,0, 0,0,H(8),H(8),[B.WIN_TUNNEL,S.FLAT,8], [B.WIN_TUNNEL,S.FLAT,8],H(8),H(8),0,0, 0,0,0,0,0], 1)
    // rows ascent: 8+8+8+6+6+8+4+6+6+8+4+8+8+8+4+8+6+1 = 117
  )
});
