// Grove — forest herbalism with an infinite growth cycle and tool maintenance.
// Bush (dur 2) is a renewable source: harvest → crop+seed → process → regrow.
// Every cycle input regenerates. Only knife charges are consumed.
// Knife (dur 2) breaks mid-run, must be rebuilt from stone+stick.
// Converge fruit, fiber, and botanicals into the Elixir of Life.

GAME_MODES.grove = {
  name: 'Grove',
  saveVersion: 1,
  winItem: 'elixir',
  items: {
    // ── Starting / Raw ──
    knife:    { icon: 'lorc/plain-dagger',      color: '#7a8a6a', name: 'Knife', maxDur: 2 },
    bush:     { icon: 'lorc/three-leaves',      color: '#408838', name: 'Bush', maxDur: 2 },
    stone:    { icon: 'lorc/stone-crafting',    color: '#808898', name: 'Stone' },
    stick:    { icon: 'delapouite/bamboo',      color: '#7a8a40', name: 'Stick' },
    bark:     { icon: 'delapouite/wood-pile',   color: '#7a5a30', name: 'Bark' },
    rain:     { icon: 'lorc/droplets',          color: '#60a0d0', name: 'Rain' },
    root:     { icon: 'delapouite/tree-roots',  color: '#8a6a40', name: 'Root' },
    petal:    { icon: 'lorc/flower-twirl',      color: '#e080a0', name: 'Petal' },
    wax:      { icon: 'lorc/bee',               color: '#e8c040', name: 'Wax' },
    nectar:   { icon: 'lorc/drop',              color: '#d8a020', name: 'Nectar' },

    // ── Cycle Intermediates ──
    seed:     { icon: 'lorc/acorn',             color: '#8a6830', name: 'Seed' },
    crop:     { icon: 'lorc/wheat',             color: '#b8a848', name: 'Crop' },
    fruit:    { icon: 'delapouite/pear',        color: '#90b030', name: 'Fruit' },
    mulch:    { icon: 'lorc/leaf-swirl',        color: '#6a5a30', name: 'Mulch' },
    seedling: { icon: 'lorc/beanstalk',         color: '#60a050', name: 'Seedling' },

    // ── Tool Crafting ──
    blade:    { icon: 'lorc/deadly-strike',     color: '#8898a0', name: 'Blade' },

    // ── Processing ──
    fiber:    { icon: 'delapouite/cotton-flower', color: '#c0b890', name: 'Fiber' },

    // ── Convergence ──
    cordial:  { icon: 'lorc/pouring-chalice',   color: '#d8a030', name: 'Cordial' },
    tincture: { icon: 'lorc/potion-ball',       color: '#60a060', name: 'Tincture' },
    wreath:   { icon: 'lorc/oak',               color: '#70a850', name: 'Wreath' },
    balm:     { icon: 'lorc/standing-potion',   color: '#e0a070', name: 'Balm' },
    compress: { icon: 'lorc/tied-scroll',       color: '#c4b090', name: 'Compress' },
    tonic:    { icon: 'lorc/heart-bottle',      color: '#d06060', name: 'Tonic' },
    salve:    { icon: 'skoll/pestle-mortar',    color: '#b090d0', name: 'Salve' },
    draught:  { icon: 'lorc/drink-me',          color: '#40a0a0', name: 'Draught' },
    elixir:   { icon: 'lorc/glass-heart',       color: '#ffd700', name: 'Elixir!' },
  },

  recipes: [
    // ── Infinite Growth Cycle (4 recipes) ──
    // bush(2) → 2 harvests → 2 crop + 2 seed → process → fruit + mulch
    // seed + mulch → seedling → seedling + seed → bush(2) — fully regenerated!
    // Net per bush cycle: 2 knife charges → 1 fruit
    { a: 'knife', b: 'bush',  aCost: 1, bCost: 1, give: ['crop', 'seed'] },  // harvest
    { a: 'crop',  b: 'crop',  give: ['fruit', 'mulch'] },                     // thresh & compost
    { a: 'seed',  b: 'mulch', give: ['seedling'] },                           // plant
    { a: 'seedling', b: 'seed', give: ['bush'] },                             // grow

    // ── Tool Rebuild (2 recipes) ──
    // knife breaks after 2 harvests — rebuild from stone + stick
    { a: 'stone', b: 'stone', give: ['blade'] },              // knap a blade
    { a: 'blade', b: 'stick', give: ['knife'] },              // haft the knife

    // ── Fiber Processing (1 recipe, run 2×) ──
    { a: 'bark', b: 'rain', give: ['fiber'] },                // ret bark into fiber

    // ── Convergence Layer 1 (5 recipes, pair all 10 products) ──
    { a: 'fruit', b: 'nectar', give: ['cordial'] },           // sweeten fruit
    { a: 'fruit', b: 'root',   give: ['tincture'] },          // steep root in juice
    { a: 'fruit', b: 'fiber',  give: ['wreath'] },            // weave fruited wreath
    { a: 'petal', b: 'wax',    give: ['balm'] },              // infuse petal oil
    { a: 'fiber', b: 'root',   give: ['compress'] },          // bind root poultice

    // ── Convergence Layer 2 (2 recipes) ──
    { a: 'cordial',  b: 'tincture', give: ['tonic'] },        // blend tonic
    { a: 'balm',     b: 'compress', give: ['salve'] },        // fold salve

    // ── Convergence Layer 3 ──
    { a: 'tonic', b: 'wreath', give: ['draught'] },           // crown the tonic

    // ── Win ──
    { a: 'draught', b: 'salve', give: ['elixir'] },           // Elixir of Life!
  ],

  startItems: [
    'knife',
    'bush',
    'stone', 'stone', 'stone', 'stone',
    'stick', 'stick',
    'bark', 'bark',
    'rain', 'rain',
    'root', 'root',
    'petal',
    'wax',
    'nectar',
  ],
};
