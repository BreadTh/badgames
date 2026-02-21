LEVELS.push({
  name: "Wall Run",
  rows: concat(
    repeat([N, N, N, N, N], 6),
    repeat([N, N, [B.FUEL, S.FLAT], N, N], 3),
    // Low walls - jump over
    repeat([N, N, N, N, N], 2),
    repeat([H(1), H(1), H(1), H(1), H(1)], 1),
    repeat([N, N, N, N, N], 2),
    repeat([H(1), H(1), H(1), H(1), H(1)], 1),
    repeat([N, N, N, N, N], 2),
    // Tall wall - find the gap
    repeat([H(3), H(3), 0, H(3), H(3)], 2),
    repeat([N, N, N, N, N], 2),
    // Gap switches sides
    repeat([H(3), H(3), H(3), 0, 0], 2),
    // Fuel + oxygen
    repeat([N, [B.FUEL, S.FLAT], N, [B.OXYGEN, S.FLAT], N], 4),
    // Platform jumping
    repeat([H(2), 0, H(2), 0, H(2)], 3),
    repeat([0, H(2), 0, H(2), 0], 3),
    // Raised walls to jump over
    repeat([H(3), H(3), H(3), H(3), H(3)], 2),
    repeat([N, N, N, N, N], 3),
    // Kill blocks with gaps
    repeat([N, [B.KILL, S.FLAT], N, N, [B.KILL, S.FLAT]], 3),
    repeat([N, N, N, N, N], 3),
    // Fuel for the finish
    repeat([N, [B.FUEL, S.FLAT], [B.FUEL, S.FLAT], [B.FUEL, S.FLAT], N], 3),
    repeat([N, N, N, N, N], 3),
    [makeRow([N, N, [B.WIN_TUNNEL, S.FLAT], N, N])]
  )
});
