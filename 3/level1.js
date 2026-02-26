LEVELS.push({
  id: 0,
  name: "First Flight",
  gridColors: [0x667788, 0x778899],
  rows: concat(
    // === Wide open start ===
    repeat(F, 12),

    // Gentle raised center ridge
    repeat([N,N,N,N,N, N,N,H(1),H(1),H(1), H(1),H(1),H(1),N,N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,H(1),H(2),H(2),H(2), H(2),H(2),H(2),H(1),N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,N,H(1),H(1),H(1), H(1),H(1),H(1),N,N, N,N,N,N,N], 4),
    repeat(F, 6),

    // Fuel lanes
    repeat([N,[B.FUEL,S.FLAT],N,N,[B.FUEL,S.FLAT], N,N,N,N,N, N,N,N,N,N, [B.FUEL,S.FLAT],N,N,[B.FUEL,S.FLAT],N], 6),

    // === Low walls to jump over ===
    repeat(F, 4),
    repeat([H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1), H(1),H(1),H(1),H(1),H(1)], 2),
    repeat(F, 8),

    // === Stacked platforms: ground floor + raised bridge ===
    // Two levels: walk on ground under the bridge, or jump up onto it
    repeat([N,N,N,N,N, N, STACK(0,3), STACK(0,3), STACK(0,3), STACK(0,3), STACK(0,3), STACK(0,3), STACK(0,3), STACK(0,3), N, N,N,N,N,N], 2),
    repeat([N,N,N,N,N, N,H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),N, N,N,N,N,N], 12),
    // Oxygen on the bridge
    repeat([N,N,N,N,N, N,HO(3),H(3),H(3),HO(3), HO(3),H(3),H(3),HO(3),N, N,N,N,N,N], 4),
    repeat([N,N,N,N,N, N,H(3),H(3),H(3),H(3), H(3),H(3),H(3),H(3),N, N,N,N,N,N], 6),
    // Bridge ends, pillars with landing
    repeat([N,N,N,N,N, N, STACK(0,3), STACK(0,3), STACK(0,3), STACK(0,3), STACK(0,3), STACK(0,3), STACK(0,3), STACK(0,3), N, N,N,N,N,N], 2),
    repeat(F, 8),

    // === Kill strip down the middle - go around ===
    repeat([N,N,N,N,N, N,N,N,[B.KILL,S.FLAT],[B.KILL,S.FLAT], [B.KILL,S.FLAT],[B.KILL,S.FLAT],N,N,N, N,N,N,N,N], 10),
    repeat(F, 6),

    // Fuel + oxygen
    repeat([N,N,[B.FUEL,S.FLAT],N,N, [B.OXYGEN,S.FLAT],N,N,N,N, N,N,N,N,[B.OXYGEN,S.FLAT], N,N,[B.FUEL,S.FLAT],N,N], 6),

    // === Staircase with underpass ===
    // Left side ramps up, right side stays low — tunnel under the left
    repeat([N,N,N,H(1),H(1), H(1),H(1),N,N,N, N,N,N,N,N, N,N,N,N,N], 4),
    repeat([N,N,H(1),H(2),H(2), H(2),H(2),H(1),N,N, N,N,N,N,N, N,N,N,N,N], 4),
    repeat([N,H(1),H(2),H(3),H(3), H(3),H(3),H(2),H(1),N, N,N,N,N,N, N,N,N,N,N], 4),
    repeat([H(1),H(2),H(3),H(4),H(4), H(4),H(4),H(3),H(2),H(1), N,N,N,N,N, N,N,N,N,N], 4),
    // Walk top-left or ground-right
    repeat([0,0,H(4),H(4),H(4), H(4),H(4),H(4),0,0, N,N,N,N,N, N,N,N,N,N], 10),
    // Merge back: drop from left, flat from right
    repeat([N,N,H(2),H(3),H(4), H(4),H(3),H(2),N,N, N,N,N,N,N, N,N,N,N,N], 3),
    repeat([N,N,N,H(1),H(2), H(2),H(1),N,N,N, N,N,N,N,N, N,N,N,N,N], 3),
    repeat(F, 6),

    // === Full tunnel section ===
    // Walls close in from both sides, ceiling covers everything
    repeat([COL(4),COL(4),N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,COL(4),COL(4)], 4),
    repeat([COL(4),COL(4),COL(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),COL(4),COL(4),COL(4)], 10),
    // Fuel inside tunnel
    repeat([COL(4),COL(4),COL(4),TUN(4),TUN(4,B.FUEL), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4,B.FUEL),TUN(4),COL(4),COL(4),COL(4)], 6),
    // Tunnel continues with obstacle inside — stacked column blocks player must dodge
    repeat([COL(4),COL(4),COL(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),COL(4),COL(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),COL(4),COL(4),COL(4)], 4),
    repeat([COL(4),COL(4),COL(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),COL(4),COL(4),COL(4)], 6),
    // Oxygen in tunnel
    repeat([COL(4),COL(4),COL(4),TUN(4),TUN(4), TUN(4),TUN(4,B.OXYGEN),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4,B.OXYGEN),TUN(4),TUN(4), TUN(4),TUN(4),COL(4),COL(4),COL(4)], 4),
    // Tunnel opens back up
    repeat([COL(4),COL(4),COL(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),TUN(4),TUN(4),TUN(4), TUN(4),TUN(4),COL(4),COL(4),COL(4)], 4),
    repeat([COL(4),COL(4),N,N,N, N,N,N,N,N, N,N,N,N,N, N,N,N,COL(4),COL(4)], 4),
    repeat(F, 8),

    // === Multi-level platforms: three tiers ===
    // Ground, mid (h=2), high (h=4) — stacked so you can walk under each
    repeat([N,N,N,STACK(0,2),STACK(0,2), STACK(0,2),STACK(0,2),N,N,N, N,N,N,STACK(0,4),STACK(0,4), STACK(0,4),STACK(0,4),N,N,N], 2),
    repeat([N,N,N,H(2),H(2), H(2),H(2),N,N,N, N,N,N,H(4),H(4), H(4),H(4),N,N,N], 10),
    // Fuel on mid, oxygen on high
    repeat([N,N,N,HF(2),H(2), H(2),HF(2),N,N,N, N,N,N,HO(4),H(4), H(4),HO(4),N,N,N], 4),
    repeat([N,N,N,H(2),H(2), H(2),H(2),N,N,N, N,N,N,H(4),H(4), H(4),H(4),N,N,N], 6),
    repeat([N,N,N,STACK(0,2),STACK(0,2), STACK(0,2),STACK(0,2),N,N,N, N,N,N,STACK(0,4),STACK(0,4), STACK(0,4),STACK(0,4),N,N,N], 2),
    repeat(F, 8),

    // === Weave through tall stacked walls ===
    repeat([N,N,N,N,N, N,N,N,COL(5),COL(5), COL(5),COL(5),N,N,N, N,N,N,N,N], 3),
    repeat(F, 4),
    repeat([COL(5),COL(5),COL(5),COL(5),N, N,N,N,N,N, N,N,N,N,N, N,COL(5),COL(5),COL(5),COL(5)], 3),
    repeat(F, 4),
    repeat([N,N,N,N,N, N,N,N,COL(5),COL(5), COL(5),COL(5),N,N,N, N,N,N,N,N], 3),
    repeat(F, 8),

    // Fuel + oxygen before finish
    repeat([[B.OXYGEN,S.FLAT],N,[B.FUEL,S.FLAT],N,N, [B.FUEL,S.FLAT],N,N,N,[B.OXYGEN,S.FLAT], [B.OXYGEN,S.FLAT],N,N,N,[B.FUEL,S.FLAT], N,N,[B.FUEL,S.FLAT],N,[B.OXYGEN,S.FLAT]], 6),

    // === Final gauntlet: alternating stacked arches ===
    repeat([N,N,N,N, STACK(0,3),STACK(0,3),STACK(0,3),STACK(0,3), N,N,N,N, STACK(0,3),STACK(0,3),STACK(0,3),STACK(0,3), N,N,N,N], 2),
    repeat([N,N,N,N,H(3),H(3),H(3),H(3), N,N,N,N,H(3),H(3),H(3),H(3), N,N,N,N], 6),
    repeat([N,N,N,N, STACK(0,3),STACK(0,3),STACK(0,3),STACK(0,3), N,N,N,N, STACK(0,3),STACK(0,3),STACK(0,3),STACK(0,3), N,N,N,N], 2),
    repeat(F, 8),

    // === Win ===
    repeat([N,N,N,N,N, N,N,N,[B.WIN_TUNNEL,S.FLAT],[B.WIN_TUNNEL,S.FLAT], [B.WIN_TUNNEL,S.FLAT],[B.WIN_TUNNEL,S.FLAT],N,N,N, N,N,N,N,N], 1)
  )
});
