// Voyage — coastal survival crafting. Build a ship, sail away.
// Elastic budget via 3 resource loops + non-renewable wreckage shortcut.
// Food repairs tools. Rope repairs stations. Waste items create grid pressure.

GAME_MODES.voyage = {
  name: 'Voyage',
  saveVersion: 1,
  winItem: 'voyage',
  items: {
    // ── Starting / Raw ──
    driftwood:    { icon: 'delapouite/wood-stick', color: '#a07840', name: 'Driftwood' },
    pebble:       { icon: 'lorc/rock', color: '#a0a0b8', name: 'Pebble' },
    kelp:         { icon: 'delapouite/algae', color: '#3a8a4a', name: 'Kelp' },
    seashell:     { icon: 'lorc/spiral-shell', color: '#d8c8b0', name: 'Seashell' },
    flint:        { icon: 'delapouite/flint-spark', color: '#708898', name: 'Flint' },
    sand:         { icon: 'lorc/sands-of-time', color: '#e8d44d', name: 'Sand' },
    vine:         { icon: 'lorc/curling-vines', color: '#4a8a3a', name: 'Vine' },
    wreckage:     { icon: 'delapouite/sinking-ship', color: '#8a7060', name: 'Wreckage', maxDur: 6 },
    nail:         { icon: 'lorc/nails', color: '#909098', name: 'Nail' },

    // ── Processed ──
    sharp_stone:  { icon: 'lorc/shatter', color: '#8aa0b0', name: 'Sharp Stone' },
    fiber:        { icon: 'delapouite/sewing-string', color: '#c4b088', name: 'Fiber' },
    twine:        { icon: 'delapouite/yarn', color: '#c4a060', name: 'Twine' },
    rope:         { icon: 'delapouite/rope-coil', color: '#b09050', name: 'Rope' },
    stick:        { icon: 'delapouite/wood-stick', color: '#b88a40', name: 'Stick' },
    plank:        { icon: 'delapouite/planks', color: '#c8a858', name: 'Plank' },
    spark:        { icon: 'delapouite/sparkles', color: '#ffd750', name: 'Spark' },

    // ── Crude Tools ──
    crude_knife:  { icon: 'delapouite/bone-knife', color: '#c0a880', name: 'Crude Knife', maxDur: 6 },
    crude_hammer: { icon: 'lorc/claw-hammer', color: '#98908a', name: 'Crude Hammer', maxDur: 6 },
    crude_net:    { icon: 'lorc/fishing-net', color: '#c4a060', name: 'Crude Net', maxDur: 4 },
    crude_saw:    { icon: 'delapouite/hand-saw', color: '#90888a', name: 'Crude Saw', maxDur: 5 },

    // ── Upgraded Tool ──
    ship_saw:     { icon: 'delapouite/crosscut-saw', color: '#8898a8', name: 'Ship Saw', maxDur: 8 },

    // ── Fire ──
    campfire:     { icon: 'lorc/campfire', color: '#ff5533', name: 'Campfire', maxDur: 5 },
    torch:        { icon: 'delapouite/torch', color: '#ff8c30', name: 'Torch', maxDur: 3 },

    // ── Nature ──
    seed:         { icon: 'delapouite/plant-seed', color: '#7a9a50', name: 'Seed' },
    seagrass:     { icon: 'delapouite/algae', color: '#60b860', name: 'Seagrass' },
    kelp_bed:     { icon: 'delapouite/vines', color: '#2a7a3a', name: 'Kelp Bed', maxDur: 3 },
    coral:        { icon: 'delapouite/coral', color: '#e06060', name: 'Coral' },
    tide_pool:    { icon: 'lorc/waves', color: '#4090c0', name: 'Tide Pool', maxDur: 4 },
    boulder:      { icon: 'lorc/stone-block', color: '#888898', name: 'Boulder', maxDur: 4 },
    stone:        { icon: 'delapouite/stone-pile', color: '#9090a0', name: 'Stone' },
    ore:          { icon: 'faithtoken/ore', color: '#c07848', name: 'Ore' },

    // ── Sea Harvest ──
    fish:         { icon: 'delapouite/circling-fish', color: '#6090b0', name: 'Fish' },
    cooked_fish:  { icon: 'darkzaitzev/fish-cooked', color: '#d08040', name: 'Cooked Fish' },
    fillet:       { icon: 'darkzaitzev/fried-fish', color: '#e0a070', name: 'Fillet' },

    // ── Waste (no consumer recipes) ──
    bone:         { icon: 'lorc/bone-gnawer', color: '#e0d8c0', name: 'Bone' },
    bark:         { icon: 'delapouite/half-log', color: '#7a5a30', name: 'Bark' },
    ash:          { icon: 'lorc/powder', color: '#888890', name: 'Ash' },

    // ── Metal / Processing ──
    iron_scrap:   { icon: 'lorc/metal-bar', color: '#7888a0', name: 'Iron Scrap' },
    clay:         { icon: 'delapouite/potato', color: '#c4885a', name: 'Clay' },
    glass:        { icon: 'lorc/cut-diamond', color: '#60c8e8', name: 'Glass' },
    brick:        { icon: 'delapouite/brick-pile', color: '#c04838', name: 'Brick' },

    // ── Stations ──
    fire_pit:     { icon: 'lorc/fire-bowl', color: '#e05838', name: 'Fire Pit', maxDur: 8 },
    workbench:    { icon: 'delapouite/crafting', color: '#b89050', name: 'Workbench', maxDur: 10 },
    dry_rack:     { icon: 'delapouite/stakes-fence', color: '#a08060', name: 'Dry Rack', maxDur: 6 },

    // ── Advanced Materials ──
    ingot:        { icon: 'willdabeast/gold-bar', color: '#a0a0b0', name: 'Ingot' },
    blade:        { icon: 'lorc/sword-smithing', color: '#a0b8d0', name: 'Blade' },
    beam:         { icon: 'delapouite/wood-beam', color: '#a08040', name: 'Beam' },
    peg:          { icon: 'delapouite/coiled-nail', color: '#b89060', name: 'Peg' },
    sail_cloth:   { icon: 'delapouite/rolled-cloth', color: '#e8dcc0', name: 'Sail Cloth' },

    // ── Compass Chain ──
    lodestone:    { icon: 'faithtoken/minerals', color: '#606068', name: 'Lodestone' },
    hot_stone:    { icon: 'lorc/fire-ring', color: '#e07040', name: 'Hot Stone' },
    needle:       { icon: 'lorc/sewing-needle', color: '#c0c0d0', name: 'Needle' },

    // ── Ship Parts ──
    hull_rib:     { icon: 'delapouite/wood-beam', color: '#7a6030', name: 'Hull Rib' },
    hull_frame:   { icon: 'delapouite/wood-frame', color: '#8a7040', name: 'Hull Frame' },
    sealed_hull:  { icon: 'delapouite/boat-fishing', color: '#6a5a3a', name: 'Sealed Hull' },
    sail:         { icon: 'delapouite/sail', color: '#f0e8d0', name: 'Sail' },
    rudder:       { icon: 'delapouite/ship-wheel', color: '#8a7050', name: 'Rudder' },
    anchor:       { icon: 'lorc/anchor', color: '#607080', name: 'Anchor' },
    compass:      { icon: 'lorc/compass', color: '#c09050', name: 'Compass' },

    // ── Ship Assembly ──
    rigged_ship:  { icon: 'delapouite/sailboat', color: '#a08050', name: 'Rigged Ship' },
    steered_ship: { icon: 'delapouite/sailboat', color: '#8a9050', name: 'Steered Ship' },
    ready_ship:   { icon: 'delapouite/sailboat', color: '#6a8a50', name: 'Ready Ship' },
    voyage:       { icon: 'lorc/at-sea', color: '#40a0e0', name: 'Voyage!' },
  },

  recipes: [
    // ── Primitive Processing (8) ──
    { a: 'pebble', b: 'pebble', give: ['flint'] },
    { a: 'pebble', b: 'flint', give: ['sharp_stone'] },
    { a: 'kelp', b: 'kelp', give: ['fiber'] },
    { a: 'fiber', b: 'fiber', give: ['twine'] },
    { a: 'twine', b: 'twine', give: ['rope'] },
    { a: 'vine', b: 'driftwood', give: ['stick'] },
    { a: 'driftwood', b: 'driftwood', give: ['plank'] },
    { a: 'flint', b: 'flint', give: ['spark'] },

    // ── Crude Tools (4) ──
    { a: 'sharp_stone', b: 'stick', give: ['crude_knife'] },
    { a: 'pebble', b: 'stick', give: ['crude_hammer'] },
    { a: 'twine', b: 'stick', give: ['crude_net'] },
    { a: 'sharp_stone', b: 'plank', give: ['crude_saw'] },

    // ── Fire (2) ──
    { a: 'spark', b: 'fiber', give: ['campfire'] },
    { a: 'spark', b: 'stick', give: ['torch'] },

    // ── Nature / Growing (5) ──
    { a: 'seed', b: 'sand', give: ['seagrass'] },
    { a: 'seagrass', b: 'seagrass', give: ['kelp_bed'] },
    { a: 'seashell', b: 'seashell', give: ['coral'] },
    { a: 'coral', b: 'stone', give: ['tide_pool'] },
    { a: 'stone', b: 'stone', give: ['boulder'] },

    // ── Knife Gathering (4, knife -1) ──
    { a: 'crude_knife', b: 'kelp', aCost: 1, give: ['fiber', 'seed'] },
    { a: 'crude_knife', b: 'kelp_bed', aCost: 1, bCost: 1, give: ['kelp', 'seed'] },
    { a: 'crude_knife', b: 'fish', aCost: 1, give: ['fillet', 'bone'] },
    { a: 'crude_knife', b: 'driftwood', aCost: 1, give: ['stick', 'bark'] },

    // ── Hammer Work (2, hammer -1) ──
    { a: 'crude_hammer', b: 'pebble', aCost: 1, give: ['stone', 'stone', 'flint'] },
    { a: 'crude_hammer', b: 'boulder', aCost: 1, bCost: 1, give: ['stone', 'ore', 'sand'] },

    // ── Net Fishing (1, net -1) ──
    { a: 'crude_net', b: 'tide_pool', aCost: 1, bCost: 1, give: ['fish', 'seashell', 'kelp'] },

    // ── Saw Work (1, saw -1) ──
    { a: 'crude_saw', b: 'plank', aCost: 1, give: ['beam', 'peg'] },

    // ── Wreckage Salvage (2, tool -1 + wreck -1) ──
    { a: 'crude_hammer', b: 'wreckage', aCost: 1, bCost: 1, give: ['iron_scrap', 'plank'] },
    { a: 'crude_saw', b: 'wreckage', aCost: 1, bCost: 1, give: ['beam', 'rope'] },

    // ── Campfire Recipes (4, campfire -1) ──
    { a: 'campfire', b: 'fish', aCost: 1, give: ['cooked_fish'] },
    { a: 'campfire', b: 'sand', aCost: 1, give: ['glass'] },
    { a: 'campfire', b: 'clay', aCost: 1, give: ['brick'] },
    { a: 'campfire', b: 'ore', aCost: 1, give: ['iron_scrap'] },

    // ── Torch (1, torch -1) ──
    { a: 'torch', b: 'kelp_bed', aCost: 1, bCost: 3, give: ['seed', 'seed', 'ash'] },

    // ── Misc Processing (1) ──
    { a: 'kelp', b: 'sand', give: ['clay'] },

    // ── Stations (3) ──
    { a: 'plank', b: 'nail', give: ['workbench'] },
    { a: 'brick', b: 'brick', give: ['fire_pit'] },
    { a: 'rope', b: 'beam', give: ['dry_rack'] },

    // ── Station Recipes (5, station -1) ──
    { a: 'fire_pit', b: 'iron_scrap', aCost: 1, give: ['ingot'] },
    { a: 'fire_pit', b: 'sand', aCost: 1, give: ['glass'] },
    { a: 'workbench', b: 'plank', aCost: 1, give: ['beam'] },
    { a: 'workbench', b: 'ingot', aCost: 1, give: ['nail', 'nail'] },
    { a: 'dry_rack', b: 'kelp', aCost: 1, give: ['sail_cloth'] },

    // ── Tool Upgrade (2) ──
    { a: 'fire_pit', b: 'ingot', aCost: 1, give: ['blade'] },
    { a: 'blade', b: 'beam', give: ['ship_saw'] },

    // ── Ship Saw Recipes (3, ship_saw -1) ──
    { a: 'ship_saw', b: 'plank', aCost: 1, give: ['beam', 'beam'] },
    { a: 'ship_saw', b: 'beam', aCost: 1, give: ['hull_rib', 'peg'] },
    { a: 'ship_saw', b: 'wreckage', aCost: 1, bCost: 1, give: ['beam', 'rope'] },

    // ── Compass Chain (4) ──
    { a: 'ore', b: 'ore', give: ['lodestone'] },
    { a: 'fire_pit', b: 'lodestone', aCost: 1, give: ['hot_stone'] },
    { a: 'workbench', b: 'hot_stone', aCost: 1, give: ['needle'] },
    { a: 'needle', b: 'glass', give: ['compass'] },

    // ── Ship Building (5) ──
    { a: 'hull_rib', b: 'hull_rib', give: ['hull_frame'] },
    { a: 'hull_frame', b: 'nail', give: ['sealed_hull'] },
    { a: 'sail_cloth', b: 'rope', give: ['sail'] },
    { a: 'peg', b: 'plank', give: ['rudder'] },
    { a: 'stone', b: 'rope', give: ['anchor'] },

    // ── Final Assembly (4) ──
    { a: 'sealed_hull', b: 'sail', give: ['rigged_ship'] },
    { a: 'rigged_ship', b: 'rudder', give: ['steered_ship'] },
    { a: 'steered_ship', b: 'anchor', give: ['ready_ship'] },
    { a: 'ready_ship', b: 'compass', give: ['voyage'] },

    // ── Food Repair — cooked_fish (5) ──
    { a: 'cooked_fish', b: 'crude_knife', give: ['crude_knife'] },
    { a: 'cooked_fish', b: 'crude_net', give: ['crude_net'] },
    { a: 'cooked_fish', b: 'crude_hammer', give: ['crude_hammer'] },
    { a: 'cooked_fish', b: 'crude_saw', give: ['crude_saw'] },
    { a: 'cooked_fish', b: 'ship_saw', give: ['ship_saw'] },

    // ── Food Repair — fillet (5) ──
    { a: 'fillet', b: 'crude_knife', give: ['crude_knife'] },
    { a: 'fillet', b: 'crude_net', give: ['crude_net'] },
    { a: 'fillet', b: 'crude_hammer', give: ['crude_hammer'] },
    { a: 'fillet', b: 'crude_saw', give: ['crude_saw'] },
    { a: 'fillet', b: 'ship_saw', give: ['ship_saw'] },

    // ── Rope Repair (4) ──
    { a: 'rope', b: 'campfire', give: ['campfire'] },
    { a: 'rope', b: 'fire_pit', give: ['fire_pit'] },
    { a: 'rope', b: 'workbench', give: ['workbench'] },
    { a: 'rope', b: 'dry_rack', give: ['dry_rack'] },
  ],

  startItems: [
    'driftwood', 'driftwood', 'driftwood', 'driftwood',
    'pebble', 'pebble', 'pebble',
    'kelp', 'kelp', 'kelp',
    'seashell', 'seashell', 'seashell',
    'flint', 'flint',
    'sand', 'sand',
    'vine',
    'wreckage',
    'nail',
  ],
};
