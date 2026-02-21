// Distill — a treasure-hunt puzzle with waste management.
// Ember loop produces ash (permanent waste). Smelting produces slag (partially disposable).
// Every useful item has exactly one destination. Ordering is the puzzle.

GAME_MODES.distill = {
  name: 'Treasure Hunt',
  saveVersion: 1,
  winItem: 'treasure',
  items: {
    // ── Starting Items ──
    stick:    { icon: 'delapouite/wood-stick',    color: '#a07840', name: 'Stick' },
    ember:    { icon: 'lorc/burning-embers',      color: '#e85830', name: 'Ember' },
    ore:      { icon: 'faithtoken/ore',           color: '#b87840', name: 'Ore' },
    herb:     { icon: 'delapouite/herbs-bundle',  color: '#60a850', name: 'Herb' },
    water:    { icon: 'lorc/drop',                color: '#60b8e8', name: 'Water' },
    rock:     { icon: 'lorc/rock',                color: '#a0a0b8', name: 'Rock' },
    wax:      { icon: 'lorc/wax-seal',            color: '#c8a040', name: 'Wax' },

    // ── Loop Products ──
    fire:     { icon: 'carl-olsen/flame',         color: '#ff6030', name: 'Fire' },
    ash:      { icon: 'lorc/powder',              color: '#888890', name: 'Ash' },
    charcoal: { icon: 'lorc/thrown-charcoal',     color: '#404048', name: 'Charcoal' },

    // ── Processing Products ──
    ingot:    { icon: 'lorc/metal-bar',           color: '#a0a0b0', name: 'Ingot' },
    slag:     { icon: 'lorc/spill',               color: '#706860', name: 'Slag' },
    string:   { icon: 'delapouite/sewing-string', color: '#c8b880', name: 'String' },
    paper:    { icon: 'lorc/scroll-unfurled',     color: '#e8dcc0', name: 'Paper' },
    ink:      { icon: 'lorc/ink-swirl',           color: '#303030', name: 'Ink' },
    sand:     { icon: 'lorc/sands-of-time',       color: '#e8d44d', name: 'Sand' },
    glass:    { icon: 'delapouite/glass-celebration', color: '#a0d8e8', name: 'Glass' },

    // ── Crafted Items ──
    candle:        { icon: 'lorc/candle-flame',    color: '#f0c830', name: 'Candle' },
    lantern:       { icon: 'lorc/lantern-flame',   color: '#ffaa40', name: 'Lantern' },
    map:           { icon: 'lorc/treasure-map',    color: '#c8b080', name: 'Map' },
    seal:          { icon: 'lorc/wax-seal',        color: '#c04040', name: 'Seal' },
    treasure_map:  { icon: 'lorc/treasure-map',    color: '#d4a030', name: 'Treasure Map' },
    shovel:        { icon: 'lorc/spade',           color: '#708890', name: 'Shovel' },
    expedition:    { icon: 'lorc/compass',         color: '#c09050', name: 'Expedition' },
    treasure:      { icon: 'delapouite/gold-nuggets', color: '#ffd700', name: 'Treasure' },
  },

  recipes: [
    // ── Ember Loop (run 3×, ember is catalyst) ──
    { a: 'ember', b: 'stick',    give: ['fire', 'ash'] },
    { a: 'fire',  b: 'stick',    give: ['charcoal', 'ember'] },

    // ── Processing ──
    { a: 'ore',      b: 'charcoal', give: ['ingot', 'slag'] },
    { a: 'herb',     b: 'herb',     give: ['string'] },
    { a: 'herb',     b: 'water',    give: ['paper'] },
    { a: 'charcoal', b: 'water',    give: ['ink'] },
    { a: 'rock',     b: 'rock',     give: ['sand'] },
    { a: 'slag',     b: 'sand',     give: ['glass'] },

    // ── Crafting ──
    { a: 'wax',    b: 'string',  give: ['candle'] },
    { a: 'candle', b: 'glass',   give: ['lantern'] },
    { a: 'ink',    b: 'paper',   give: ['map'] },
    { a: 'wax',    b: 'ingot',   give: ['seal'] },
    { a: 'map',    b: 'seal',    give: ['treasure_map'] },
    { a: 'stick',  b: 'ingot',   give: ['shovel'] },
    { a: 'treasure_map', b: 'lantern', give: ['expedition'] },
    { a: 'expedition',   b: 'shovel',  give: ['treasure'] },
  ],

  startItems: [
    'stick', 'stick', 'stick', 'stick', 'stick', 'stick', 'stick',
    'ember',
    'ore', 'ore',
    'herb', 'herb', 'herb',
    'water', 'water',
    'rock', 'rock',
    'wax', 'wax',
  ],
};
