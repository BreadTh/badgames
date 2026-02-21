LEVELS.push({
  name: "The Gauntlet",
  rows: concat(
    repeat([N, N, N, N, N], 5),
    repeat([N, N, [B.FUEL, S.FLAT], N, N], 3),
    // Walled corridor - walls on edges, path in center
    repeat([H(3), N, N, N, H(3)], 6),
    repeat([N, N, N, N, N], 2),
    // Walls to weave through
    repeat([H(2), H(2), H(2), N, N], 2),
    repeat([N, N, N, N, N], 1),
    repeat([N, N, H(2), H(2), H(2)], 2),
    repeat([N, N, N, N, N], 1),
    repeat([H(2), H(2), H(2), N, N], 2),
    // Refuel
    repeat([N, [B.FUEL, S.FLAT], N, [B.OXYGEN, S.FLAT], N], 3),
    // Kill block slalom
    repeat([[B.KILL, S.FLAT], [B.KILL, S.FLAT], N, N, N], 3),
    repeat([N, N, N, [B.KILL, S.FLAT], [B.KILL, S.FLAT]], 3),
    repeat([[B.KILL, S.FLAT], [B.KILL, S.FLAT], N, N, N], 3),
    repeat([N, N, N, N, N], 2),
    // Rising kill platforms
    repeat([N, [B.KILL, S.FLAT], H(1), [B.KILL, S.FLAT], N], 3),
    repeat([[B.KILL, S.FLAT], N, H(2), N, [B.KILL, S.FLAT]], 3),
    repeat([0, 0, H(3), 0, 0], 2),
    // Jump gaps
    repeat([0, 0, 0, 0, 0], 2),
    repeat([N, N, N, N, N], 2),
    repeat([0, 0, 0, 0, 0], 2),
    repeat([[B.OXYGEN, S.FLAT], [B.FUEL, S.FLAT], N, [B.FUEL, S.FLAT], [B.OXYGEN, S.FLAT]], 3),
    // Narrow path between kill blocks
    repeat([[B.KILL, S.FLAT], N, N, N, [B.KILL, S.FLAT]], 4),
    repeat([N, N, N, N, N], 3),
    // Narrow corridor with kill walls
    repeat([[B.KILL, S.FLAT], H(3), N, H(3), [B.KILL, S.FLAT]], 5),
    repeat([N, N, N, N, N], 3),
    [makeRow([N, N, [B.WIN_TUNNEL, S.FLAT], N, N])]
  )
});
