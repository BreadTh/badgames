LEVELS.push({
  name: "Skyway",
  rows: concat(
    repeat([N, N, N, N, N], 5),
    repeat([N, N, [B.FUEL, S.FLAT], N, N], 3),
    // Rising platforms - each higher
    repeat([N, N, H(1), N, N], 2),
    repeat([N, N, H(2), N, N], 2),
    repeat([N, N, H(3), N, N], 2),
    repeat([N, N, H(4), N, N], 2),
    // Walk the high road
    repeat([0, 0, H(4), 0, 0], 5),
    // Jump to side platforms
    repeat([H(4), 0, 0, 0, H(4)], 3),
    // Oxygen up high
    repeat([0, HO(4), 0, HO(4), 0], 3),
    // Drop back down through fuel
    repeat([0, HF(3), 0, HF(3), 0], 2),
    repeat([0, HF(2), 0, HF(2), 0], 2),
    repeat([N, N, N, N, N], 3),
    // Wall then jump to high platform
    repeat([H(1), H(1), H(1), H(1), H(1)], 1),
    repeat([N, N, N, N, N], 2),
    repeat([0, H(3), H(3), H(3), 0], 6),
    // Big drop
    repeat([N, N, N, N, N], 3),
    // Final gauntlet: kill blocks with narrow safe path
    repeat([[B.KILL, S.FLAT], N, [B.KILL, S.FLAT], N, [B.KILL, S.FLAT]], 4),
    repeat([N, [B.KILL, S.FLAT], N, [B.KILL, S.FLAT], N], 4),
    repeat([N, N, N, N, N], 5),
    [makeRow([N, N, [B.WIN_TUNNEL, S.FLAT], N, N])]
  )
});
