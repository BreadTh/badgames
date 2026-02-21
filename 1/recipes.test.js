GAME_MODES.clockwork = {
  name: 'Test',
  saveVersion: 1,
  winItem: 'rock',
  items: {
    a:   { icon: 'lorc/skeleton-key',       color: '#c8b070', name: 'Skeleton Key' },
    b:  { icon: 'lorc/locked-chest',       color: '#c07040', name: 'Foundry Chest' },
    c: { icon: 'caro-asercion/orrery', color: '#ffd700', name: 'Grand Orrery' },
  },

  recipes: [
    { a: 'skeleton_key', b: 'jeweler_chest', give: [
      'c',
    ]},
  ],

  startItems: [
    'a', 'b',
  ],
};
