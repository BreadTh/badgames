// Survival — complex crafting with durability, tools, stations, and resource loops.

GAME_MODES.survival = {
  name: 'Survival',
  saveVersion: 2,
  winItem: 'crown',
  items: {
    // Raw
    pebble:       { icon: 'lorc/rock', color: '#a0a0b8', name: 'Pebble' },
    twig:         { icon: 'lorc/tree-branch', color: '#a07840', name: 'Twig' },
    grass:        { icon: 'lorc/three-leaves', color: '#6abf5b', name: 'Grass' },
    flint:        { icon: 'delapouite/flint-spark', color: '#708898', name: 'Flint' },
    clay:         { icon: 'delapouite/potato', color: '#c4885a', name: 'Clay' },
    sand:         { icon: 'lorc/powder', color: '#e8d44d', name: 'Sand' },

    // Processed
    sharp_stone:  { icon: 'lorc/shatter', color: '#8aa0b0', name: 'Sharp Stone' },
    fiber:        { icon: 'delapouite/sewing-string', color: '#c4b088', name: 'Fiber' },
    twine:        { icon: 'delapouite/yarn', color: '#c4a060', name: 'Twine' },
    rope:         { icon: 'delapouite/rope-coil', color: '#b09050', name: 'Rope' },
    stick:        { icon: 'delapouite/wood-stick', color: '#b88a40', name: 'Stick' },
    thatch:       { icon: 'delapouite/herbs-bundle', color: '#c8b450', name: 'Thatch' },
    seed:         { icon: 'delapouite/plant-seed', color: '#7a9a50', name: 'Seed' },

    // Fire
    spark:        { icon: 'delapouite/sparkles', color: '#ffd750', name: 'Spark' },
    torch:        { icon: 'delapouite/torch', color: '#ff8c30', name: 'Torch', maxDur: 3 },
    campfire:     { icon: 'lorc/campfire', color: '#ff5533', name: 'Campfire', maxDur: 5 },

    // Nature
    sapling:      { icon: 'delapouite/seedling', color: '#60d060', name: 'Sapling' },
    tree:         { icon: 'lorc/pine-tree', color: '#2d8b46', name: 'Tree', maxDur: 5 },
    bush:         { icon: 'delapouite/broccoli', color: '#4aaa4a', name: 'Bush', maxDur: 3 },
    boulder:      { icon: 'lorc/stone-block', color: '#888898', name: 'Boulder', maxDur: 4 },

    // Crude Tools
    crude_knife:  { icon: 'delapouite/bone-knife', color: '#c0a880', name: 'Crude Knife', maxDur: 6 },
    crude_axe:    { icon: 'lorc/stone-axe', color: '#a09078', name: 'Crude Axe', maxDur: 5 },
    crude_hammer: { icon: 'lorc/claw-hammer', color: '#98908a', name: 'Crude Hammer', maxDur: 6 },
    crude_pick:   { icon: 'delapouite/war-pick', color: '#90888a', name: 'Crude Pick', maxDur: 5 },

    // Resources
    log:          { icon: 'delapouite/log', color: '#8B6030', name: 'Log' },
    stone:        { icon: 'delapouite/stone-pile', color: '#9090a0', name: 'Stone' },
    ore:          { icon: 'faithtoken/ore', color: '#c07848', name: 'Ore' },
    charcoal:     { icon: 'lorc/thrown-charcoal', color: '#606068', name: 'Charcoal' },

    // Stations
    kiln:         { icon: 'delapouite/furnace', color: '#cc5540', name: 'Kiln', maxDur: 8 },
    workbench:    { icon: 'delapouite/crafting', color: '#b89050', name: 'Workbench', maxDur: 10 },
    forge:        { icon: 'lorc/fire-bowl', color: '#e05838', name: 'Forge', maxDur: 8 },
    anvil:        { icon: 'lorc/anvil', color: '#7888a0', name: 'Anvil', maxDur: 12 },

    // Materials
    plank:        { icon: 'delapouite/planks', color: '#c8a858', name: 'Plank' },
    brick:        { icon: 'delapouite/brick-pile', color: '#c04838', name: 'Brick' },
    ingot:        { icon: 'willdabeast/gold-bar', color: '#ffc030', name: 'Ingot' },
    handle:       { icon: 'lorc/stick-splitting', color: '#b89060', name: 'Handle' },
    blade:        { icon: 'lorc/sword-smithing', color: '#a0b8d0', name: 'Blade' },
    glass:        { icon: 'lorc/cut-diamond', color: '#60c8e8', name: 'Glass' },
    nail:         { icon: 'lorc/nails', color: '#909098', name: 'Nail' },

    // Better Tools
    knife:        { icon: 'lorc/bowie-knife', color: '#b0c8e0', name: 'Knife', maxDur: 8 },
    axe:          { icon: 'lorc/battle-axe', color: '#98b0c8', name: 'Axe', maxDur: 8 },
    hammer:       { icon: 'lorc/flat-hammer', color: '#8898a8', name: 'Hammer', maxDur: 8 },
    pickaxe:      { icon: 'lorc/mining', color: '#8898a8', name: 'Pickaxe', maxDur: 8 },

    // Endgame
    sword:        { icon: 'lorc/broadsword', color: '#c8d8f0', name: 'Sword' },
    shield:       { icon: 'sbed/shield', color: '#c0903a', name: 'Shield' },
    crown:        { icon: 'lorc/crown', color: '#ffd700', name: 'Crown' },
    lantern:      { icon: 'lorc/lantern-flame', color: '#ffaa40', name: 'Lantern' },
  },
  recipes: [
    // ── Primitive Crafting (both consumed) ──
    { a: 'pebble', b: 'pebble', give: ['flint'] },
    { a: 'pebble', b: 'flint', give: ['sharp_stone'] },
    { a: 'grass', b: 'grass', give: ['fiber'] },
    { a: 'twig', b: 'twig', give: ['stick'] },
    { a: 'fiber', b: 'fiber', give: ['twine'] },
    { a: 'twine', b: 'twine', give: ['rope'] },
    { a: 'grass', b: 'twig', give: ['thatch'] },
    { a: 'flint', b: 'flint', give: ['spark'] },

    // ── Crude Tools (both consumed) ──
    { a: 'sharp_stone', b: 'stick', give: ['crude_knife'] },
    { a: 'pebble', b: 'stick', give: ['crude_hammer'] },
    { a: 'sharp_stone', b: 'twine', give: ['crude_axe'] },
    { a: 'flint', b: 'stick', give: ['crude_pick'] },

    // ── Fire (both consumed) ──
    { a: 'spark', b: 'thatch', give: ['campfire'] },
    { a: 'spark', b: 'stick', give: ['torch'] },

    // ── Knife Gathering (knife -1) ──
    { a: 'crude_knife', b: 'grass', aCost: 1, give: ['seed'] },
    { a: 'crude_knife', b: 'bush', aCost: 1, bCost: 1, give: ['seed', 'twig', 'grass'] },
    { a: 'crude_knife', b: 'tree', aCost: 1, bCost: 1, give: ['stick', 'seed'] },
    { a: 'crude_knife', b: 'log', aCost: 1, give: ['stick', 'twine'] },

    // ── Axe Gathering (axe -1) ──
    { a: 'crude_axe', b: 'tree', aCost: 1, bCost: 1, give: ['log', 'sapling'] },
    { a: 'crude_axe', b: 'log', aCost: 1, give: ['plank', 'plank'] },
    { a: 'crude_axe', b: 'bush', aCost: 1, bCost: 1, give: ['twig', 'twig', 'twig'] },
    { a: 'crude_axe', b: 'stick', aCost: 1, give: ['twig', 'twig'] },

    // ── Pick Gathering (pick -1) ──
    { a: 'crude_pick', b: 'boulder', aCost: 1, bCost: 1, give: ['stone', 'ore'] },
    { a: 'crude_pick', b: 'stone', aCost: 1, give: ['pebble', 'sand'] },
    { a: 'crude_pick', b: 'sand', aCost: 1, give: ['clay'] },
    { a: 'crude_pick', b: 'clay', aCost: 1, give: ['stone'] },

    // ── Hammer Work (hammer -1) ──
    { a: 'crude_hammer', b: 'pebble', aCost: 1, give: ['sand', 'flint'] },
    { a: 'crude_hammer', b: 'stone', aCost: 1, give: ['pebble', 'pebble'] },
    { a: 'crude_hammer', b: 'plank', aCost: 1, give: ['stick', 'stick'] },

    // ── Nature / Growing (both consumed) ──
    { a: 'seed', b: 'clay', give: ['sapling'] },
    { a: 'sapling', b: 'sapling', give: ['tree'] },
    { a: 'seed', b: 'sand', give: ['bush'] },
    { a: 'stone', b: 'stone', give: ['boulder'] },
    { a: 'seed', b: 'seed', give: ['grass', 'grass'] },

    // ── Campfire (campfire -1, input consumed) ──
    { a: 'campfire', b: 'clay', aCost: 1, give: ['brick'] },
    { a: 'campfire', b: 'log', aCost: 1, give: ['charcoal'] },

    // ── Building Stations (both consumed) ──
    { a: 'brick', b: 'brick', give: ['kiln'] },
    { a: 'plank', b: 'plank', give: ['workbench'] },
    { a: 'brick', b: 'charcoal', give: ['forge'] },
    { a: 'stone', b: 'ingot', give: ['anvil'] },

    // ── Kiln (kiln -1, input consumed) ──
    { a: 'kiln', b: 'sand', aCost: 1, give: ['glass'] },
    { a: 'kiln', b: 'ore', aCost: 1, give: ['ingot'] },

    // ── Workbench (workbench -1, input consumed) ──
    { a: 'workbench', b: 'plank', aCost: 1, give: ['handle'] },

    // ── Forge (forge -1, input consumed) ──
    { a: 'forge', b: 'ingot', aCost: 1, give: ['blade'] },

    // ── Anvil (anvil -1, input consumed) ──
    { a: 'anvil', b: 'ingot', aCost: 1, give: ['nail', 'nail'] },
    { a: 'anvil', b: 'blade', aCost: 1, give: ['sword'] },

    // ── Torch Actions (torch -1) ──
    { a: 'torch', b: 'tree', aCost: 1, bCost: 2, give: ['charcoal', 'charcoal', 'charcoal'] },
    { a: 'torch', b: 'bush', aCost: 1, bCost: 2, give: ['charcoal'] },

    // ── Knife Gathering (knife -1) ──
    { a: 'knife', b: 'grass', aCost: 1, give: ['seed'] },
    { a: 'knife', b: 'bush', aCost: 1, bCost: 1, give: ['seed', 'twig', 'grass'] },
    { a: 'knife', b: 'tree', aCost: 1, bCost: 1, give: ['stick', 'seed'] },
    { a: 'knife', b: 'log', aCost: 1, give: ['stick', 'twine'] },

    // ── Axe Gathering (axe -1) ──
    { a: 'axe', b: 'tree', aCost: 1, bCost: 1, give: ['log', 'sapling'] },
    { a: 'axe', b: 'log', aCost: 1, give: ['plank', 'plank'] },
    { a: 'axe', b: 'bush', aCost: 1, bCost: 1, give: ['twig', 'twig', 'twig'] },
    { a: 'axe', b: 'stick', aCost: 1, give: ['twig', 'twig'] },

    // ── Pick Gathering (pickaxe -1) ──
    { a: 'pickaxe', b: 'boulder', aCost: 1, bCost: 1, give: ['stone', 'ore'] },
    { a: 'pickaxe', b: 'stone', aCost: 1, give: ['pebble', 'sand'] },
    { a: 'pickaxe', b: 'sand', aCost: 1, give: ['clay'] },
    { a: 'pickaxe', b: 'clay', aCost: 1, give: ['stone'] },

    // ── Hammer Work (hammer -1) ──
    { a: 'hammer', b: 'pebble', aCost: 1, give: ['sand', 'flint'] },
    { a: 'hammer', b: 'stone', aCost: 1, give: ['pebble', 'pebble'] },
    { a: 'hammer', b: 'plank', aCost: 1, give: ['stick', 'stick'] },

    // ── Assembly (both consumed) ──
    { a: 'handle', b: 'blade', give: ['knife'] },
    { a: 'stick', b: 'blade', give: ['axe'] },
    { a: 'handle', b: 'ingot', give: ['hammer'] },
    { a: 'stick', b: 'ingot', give: ['pickaxe'] },
    { a: 'plank', b: 'ingot', give: ['shield'] },
    { a: 'ingot', b: 'glass', give: ['crown'] },
    { a: 'glass', b: 'torch', give: ['lantern'] },

    // ── Repair (both consumed → fresh item) ──
    { a: 'rope', b: 'crude_knife', give: ['crude_knife'] },
    { a: 'rope', b: 'crude_axe', give: ['crude_axe'] },
    { a: 'rope', b: 'crude_hammer', give: ['crude_hammer'] },
    { a: 'rope', b: 'crude_pick', give: ['crude_pick'] },
    { a: 'rope', b: 'knife', give: ['knife'] },
    { a: 'rope', b: 'axe', give: ['axe'] },
    { a: 'rope', b: 'hammer', give: ['hammer'] },
    { a: 'rope', b: 'pickaxe', give: ['pickaxe'] },
    { a: 'rope', b: 'campfire', give: ['campfire'] },
    { a: 'rope', b: 'kiln', give: ['kiln'] },
    { a: 'rope', b: 'workbench', give: ['workbench'] },
    { a: 'rope', b: 'forge', give: ['forge'] },
  ],
  startItems: [
    'pebble', 'pebble', 'pebble', 'pebble',
    'twig', 'twig', 'twig', 'twig',
    'grass', 'grass', 'grass', 'grass', 'grass',
    'flint', 'flint',
    'clay', 'clay', 'clay',
    'sand', 'sand',
  ],
};
