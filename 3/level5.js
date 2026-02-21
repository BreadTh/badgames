LEVELS.push({
  name: "Fuel Crisis",
  rows: concat(
    repeat([N, N, N, N, N], 5),
    // Short fuel burst then nothing
    repeat([N, [B.FUEL, S.FLAT], N, [B.FUEL, S.FLAT], N], 2),
    // Drain fuel zones
    repeat([[B.DRAIN_FUEL, S.FLAT], N, N, N, [B.DRAIN_FUEL, S.FLAT]], 4),
    repeat([N, [B.DRAIN_FUEL, S.FLAT], N, [B.DRAIN_FUEL, S.FLAT], N], 4),
    // Only center has fuel, sides are kill
    repeat([[B.KILL, S.FLAT], 0, [B.FUEL, S.FLAT], 0, [B.KILL, S.FLAT]], 3),
    repeat([N, N, N, N, N], 3),
    // Oxygen drain gauntlet - gotta go fast
    repeat([[B.DRAIN_OXY, S.FLAT], [B.DRAIN_OXY, S.FLAT], N, [B.DRAIN_OXY, S.FLAT], [B.DRAIN_OXY, S.FLAT]], 6),
    // Refuel+reox
    repeat([N, [B.OXYGEN, S.FLAT], [B.FUEL, S.FLAT], [B.OXYGEN, S.FLAT], N], 3),
    // Stairs with drain blocks on flat
    repeat([[B.DRAIN_FUEL, S.FLAT], N, H(1), N, [B.DRAIN_FUEL, S.FLAT]], 3),
    repeat([[B.DRAIN_FUEL, S.FLAT], 0, H(2), 0, [B.DRAIN_FUEL, S.FLAT]], 3),
    // Fuel on top
    repeat([0, 0, HF(2), 0, 0], 3),
    repeat([N, N, N, N, N], 3),
    // Drain oxy blocks
    repeat([[B.DRAIN_OXY, S.FLAT], [B.DRAIN_OXY, S.FLAT], N, [B.DRAIN_OXY, S.FLAT], [B.DRAIN_OXY, S.FLAT]], 2),
    repeat([N, N, N, N, N], 2),
    // Sprint to finish - all drain
    repeat([[B.DRAIN_FUEL, S.FLAT], [B.DRAIN_OXY, S.FLAT], N, [B.DRAIN_OXY, S.FLAT], [B.DRAIN_FUEL, S.FLAT]], 8),
    repeat([N, N, N, N, N], 3),
    [makeRow([N, N, [B.WIN_TUNNEL, S.FLAT], N, N])]
  )
});
