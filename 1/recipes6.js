// Hearth — banquet preparation with a pure lifeline mechanic.
// The hearth (dur 8) is the only heat source and cannot be repaired.
// Every charge is spoken for. Zero margin. The puzzle is sequencing.

GAME_MODES.hearth = {
  name: 'Hearth',
  saveVersion: 1,
  winItem: 'feast',
  items: {
    // ── Starting / Raw ──
    hearth:  { icon: 'delapouite/fireplace',      color: '#e05838', name: 'Hearth', maxDur: 8 },
    flour:   { icon: 'delapouite/flour',           color: '#e8dcc0', name: 'Flour' },
    egg:     { icon: 'delapouite/nest-eggs',       color: '#d8c8a0', name: 'Egg' },
    milk:    { icon: 'delapouite/jug',             color: '#e8e0d0', name: 'Milk' },
    herb:    { icon: 'delapouite/herbs-bundle',    color: '#60a850', name: 'Herb' },
    berry:   { icon: 'delapouite/berry-bush',      color: '#c04880', name: 'Berry' },
    honey:   { icon: 'delapouite/honey-jar',       color: '#e8a830', name: 'Honey' },
    clay:    { icon: 'delapouite/clay-brick',      color: '#c4885a', name: 'Clay' },
    tallow:  { icon: 'delapouite/bottled-shadow',  color: '#b0a078', name: 'Tallow' },
    salt:    { icon: 'lorc/powder',                color: '#d0d0d8', name: 'Salt' },
    string:  { icon: 'delapouite/sewing-string',   color: '#c4b088', name: 'String' },

    // ── Tier 1: Cold Prep (no hearth needed) ──
    dough:        { icon: 'delapouite/dough-roller',    color: '#d8c8a0', name: 'Dough' },
    filling:      { icon: 'delapouite/berries-bowl',    color: '#c04880', name: 'Filling' },
    custard:      { icon: 'lorc/bowl-spiral',           color: '#e8d080', name: 'Custard' },
    broth:        { icon: 'delapouite/camp-cooking-pot', color: '#80a850', name: 'Broth' },
    spice:        { icon: 'lorc/cool-spices',           color: '#d0a040', name: 'Spice' },
    jam:          { icon: 'delapouite/covered-jar',     color: '#c04060', name: 'Jam' },
    bowl_raw:     { icon: 'delapouite/dog-bowl',        color: '#b08860', name: 'Raw Bowl' },
    plate_raw:    { icon: 'delapouite/metal-plate',     color: '#c09870', name: 'Raw Plate' },
    wick:         { icon: 'lorc/candle-flame',          color: '#c4a060', name: 'Wick' },
    incense_raw:  { icon: 'lorc/cool-spices',           color: '#908060', name: 'Raw Incense' },

    // ── Tier 2: Hearth Products ──
    bread:        { icon: 'delapouite/bread',           color: '#c8a050', name: 'Bread' },
    pie:          { icon: 'delapouite/full-pizza',      color: '#d09850', name: 'Pie' },
    pudding:      { icon: 'delapouite/cupcake',         color: '#e8c080', name: 'Pudding' },
    soup:         { icon: 'delapouite/cooking-pot',     color: '#80b850', name: 'Soup' },
    fired_bowl:   { icon: 'delapouite/painted-pottery', color: '#c07048', name: 'Fired Bowl' },
    fired_plate:  { icon: 'delapouite/broken-pottery',  color: '#c08858', name: 'Fired Plate' },
    candle:       { icon: 'delapouite/candles',         color: '#f0c830', name: 'Candle' },
    incense:      { icon: 'lorc/incense',               color: '#b090d0', name: 'Incense' },

    // ── Tier 3: Assembly ──
    toast:           { icon: 'delapouite/butter-toast',    color: '#c8a050', name: 'Jam Toast' },
    spiced_pie:      { icon: 'delapouite/chicken-oven',    color: '#d09040', name: 'Spiced Pie' },
    served_soup:     { icon: 'lorc/bubbling-bowl',         color: '#80b850', name: 'Served Soup' },
    served_pudding:  { icon: 'lorc/cake-slice',            color: '#e8c080', name: 'Served Pudding' },
    first_course:    { icon: 'delapouite/hot-meal',        color: '#d09850', name: 'First Course' },
    main_course:     { icon: 'delapouite/meal',            color: '#c8a850', name: 'Main Course' },
    blessing:        { icon: 'delapouite/candles',         color: '#e0b0f0', name: 'Blessing' },
    banquet:         { icon: 'delapouite/table',           color: '#b09050', name: 'Banquet' },
    feast:           { icon: 'delapouite/coronation',      color: '#ffd700', name: 'Feast!' },
  },

  recipes: [
    // ── Tier 1: Cold Prep (10 recipes, all 2→1, no hearth) ──
    { a: 'flour',  b: 'egg',    give: ['dough'] },       // mixing dough
    { a: 'flour',  b: 'berry',  give: ['filling'] },     // fruit filling
    { a: 'egg',    b: 'milk',   give: ['custard'] },     // custard base
    { a: 'herb',   b: 'milk',   give: ['broth'] },       // herbal broth
    { a: 'herb',   b: 'honey',  give: ['spice'] },       // honey-herb spice
    { a: 'honey',  b: 'berry',  give: ['jam'] },         // berry preserves
    { a: 'clay',   b: 'clay',   give: ['bowl_raw'] },    // shape a bowl
    { a: 'clay',   b: 'salt',   give: ['plate_raw'] },   // salt-pressed plate
    { a: 'tallow', b: 'string', give: ['wick'] },        // dip a wick
    { a: 'tallow', b: 'herb',   give: ['incense_raw'] }, // herbal incense cone

    // ── Tier 2: Hearth Recipes (8 recipes, hearth aCost:1 each) ──
    { a: 'hearth', b: 'dough',       aCost: 1, give: ['bread'] },       // bake bread
    { a: 'hearth', b: 'filling',     aCost: 1, give: ['pie'] },         // bake pie
    { a: 'hearth', b: 'custard',     aCost: 1, give: ['pudding'] },     // set custard
    { a: 'hearth', b: 'broth',       aCost: 1, give: ['soup'] },        // cook soup
    { a: 'hearth', b: 'bowl_raw',    aCost: 1, give: ['fired_bowl'] },  // fire pottery
    { a: 'hearth', b: 'plate_raw',   aCost: 1, give: ['fired_plate'] }, // fire pottery
    { a: 'hearth', b: 'wick',        aCost: 1, give: ['candle'] },      // light candle
    { a: 'hearth', b: 'incense_raw', aCost: 1, give: ['incense'] },     // burn incense

    // ── Tier 3: Assembly (9 recipes, all 2→1, no hearth) ──
    { a: 'bread',   b: 'jam',          give: ['toast'] },          // jam on bread
    { a: 'pie',     b: 'spice',        give: ['spiced_pie'] },     // season the pie
    { a: 'soup',    b: 'fired_bowl',   give: ['served_soup'] },    // soup in bowl
    { a: 'pudding', b: 'fired_plate',  give: ['served_pudding'] }, // plated pudding
    { a: 'toast',   b: 'served_soup',  give: ['first_course'] },   // starter course
    { a: 'spiced_pie', b: 'served_pudding', give: ['main_course'] }, // main + dessert
    { a: 'candle',  b: 'incense',      give: ['blessing'] },       // ritual light
    { a: 'first_course', b: 'main_course', give: ['banquet'] },    // full meal
    { a: 'banquet', b: 'blessing',     give: ['feast'] },          // WIN
  ],

  startItems: [
    'hearth',
    'flour', 'flour',
    'egg', 'egg',
    'milk', 'milk',
    'herb', 'herb', 'herb',
    'berry', 'berry',
    'honey', 'honey',
    'clay', 'clay', 'clay',
    'tallow', 'tallow',
    'salt',
    'string',
  ],
};
