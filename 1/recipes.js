// Crown — craft a crown from sticks & rocks
// Simple mode: all items durability 1, no stations.

GAME_MODES.crown = {
  name: 'Crown',
  saveVersion: 5,
  winItem: 'crown',
  items: {
    // ── Raw Materials ──
    stick:    { icon: 'delapouite/wood-stick', color: '#a07840', name: 'Stick' },
    rock:     { icon: 'lorc/rock', color: '#a0a0b8', name: 'Rock' },
    leaf:     { icon: 'lorc/falling-leaf', color: '#60a850', name: 'Leaf' },
    water:    { icon: 'lorc/drop', color: '#60b8e8', name: 'Water' },
    ember:    { icon: 'lorc/burning-embers', color: '#e85830', name: 'Ember' },
    clay:     { icon: 'delapouite/clay-brick', color: '#c4885a', name: 'Clay' },

    // ── Basic Tools ──
    hammer:   { icon: 'lorc/claw-hammer', color: '#b0a090', name: 'Hammer' },
    flint:    { icon: 'delapouite/flint-spark', color: '#c8b868', name: 'Flint' },
    axe:      { icon: 'lorc/hatchets', color: '#909898', name: 'Axe' },

    // ── Gathered Resources ──
    wood:     { icon: 'delapouite/wood-pile', color: '#c09050', name: 'Wood' },
    bark:     { icon: 'delapouite/spiked-trunk', color: '#8b6840', name: 'Bark' },
    ore:      { icon: 'faithtoken/ore', color: '#b87840', name: 'Ore' },
    gravel:   { icon: 'delapouite/stone-pile', color: '#989898', name: 'Gravel' },

    // ── Fire Tech ──
    fire:     { icon: 'carl-olsen/flame', color: '#ff6030', name: 'Fire' },
    ash:      { icon: 'lorc/powder', color: '#888890', name: 'Ash' },
    charcoal: { icon: 'lorc/thrown-charcoal', color: '#404048', name: 'Charcoal' },

    // ── Metalworking ──
    ingot:    { icon: 'lorc/metal-bar', color: '#a0a0b0', name: 'Ingot' },
    kiln:     { icon: 'delapouite/furnace', color: '#c07040', name: 'Kiln' },
    gold:     { icon: 'delapouite/gold-nuggets', color: '#ffd700', name: 'Gold' },
    slag:     { icon: 'lorc/spill', color: '#706860', name: 'Slag' },

    // ── Washing & Glass ──
    sand:     { icon: 'lorc/sands-of-time', color: '#e8d44d', name: 'Sand' },
    silt:     { icon: 'lorc/dust-cloud', color: '#a09070', name: 'Silt' },
    glass:    { icon: 'delapouite/glass-celebration', color: '#a0d8e8', name: 'Glass' },

    // ── Textile & Herbalism ──
    fiber:    { icon: 'delapouite/sewing-string', color: '#c8b880', name: 'Fiber' },
    herb:     { icon: 'delapouite/herbs-bundle', color: '#60a850', name: 'Herb' },
    cloth:    { icon: 'delapouite/rolled-cloth', color: '#d0c0a0', name: 'Cloth' },
    oil:      { icon: 'lorc/oily-spiral', color: '#c0a030', name: 'Oil' },
    polish:   { icon: 'delapouite/sparkles', color: '#f0e060', name: 'Polish' },
    gem:      { icon: 'lorc/cut-diamond', color: '#50c8e0', name: 'Gem' },

    // ── Construction ──
    cement:   { icon: 'delapouite/mortar', color: '#b0a898', name: 'Cement' },
    mold:     { icon: 'delapouite/ring-mould', color: '#c09868', name: 'Mold' },
    gold_band: { icon: 'lorc/engagement-ring', color: '#ffd050', name: 'Gold Band' },

    // ── Final Assembly ──
    wreath:   { icon: 'lorc/laurel-crown', color: '#80b060', name: 'Wreath' },
    steam:    { icon: 'delapouite/steam', color: '#b0d0e0', name: 'Steam' },
    putty:    { icon: 'lorc/dripping-goo', color: '#c0b890', name: 'Putty' },
    circlet:  { icon: 'delapouite/tiara', color: '#ffc840', name: 'Circlet' },
    jewel:    { icon: 'lorc/gem-pendant', color: '#50d0c0', name: 'Jewel' },
    crown:    { icon: 'delapouite/jewel-crown', color: '#ffd700', name: 'Crown' },
  },
  recipes: [
    // ── Basic Tools (raw + raw → tool) ──
    { a: 'rock',   b: 'rock',   give: ['flint'] },
    { a: 'stick',  b: 'rock',   give: ['hammer'] },
    { a: 'stick',  b: 'flint',  give: ['axe'] },

    // ── Resource Gathering (tool + raw → 2 resources) ──
    { a: 'axe',    b: 'stick',  give: ['wood', 'bark'] },
    { a: 'hammer', b: 'rock',   give: ['ore', 'gravel'] },

    // ── Fire Tech (ember loop: ember→fire→charcoal+ember) ──
    { a: 'ember',  b: 'stick',  give: ['fire', 'ash'] },
    { a: 'fire',   b: 'wood',   give: ['charcoal', 'ember'] },

    // ── Metalworking ──
    { a: 'ore',      b: 'charcoal', give: ['ingot'] },
    { a: 'rock',     b: 'clay',     give: ['kiln'] },
    { a: 'ingot',    b: 'kiln',     give: ['gold', 'slag'] },

    // ── Washing & Glass ──
    { a: 'gravel',   b: 'water',    give: ['sand', 'silt'] },
    { a: 'sand',     b: 'ash',      give: ['glass'] },

    // ── Textile & Herbalism ──
    { a: 'leaf',     b: 'water',    give: ['fiber', 'herb'] },
    { a: 'fiber',    b: 'leaf',     give: ['cloth'] },
    { a: 'herb',     b: 'bark',     give: ['oil'] },
    { a: 'oil',      b: 'cloth',    give: ['polish'] },
    { a: 'glass',    b: 'polish',   give: ['gem'] },

    // ── Construction ──
    { a: 'slag',     b: 'silt',     give: ['cement'] },
    { a: 'clay',     b: 'ember',    give: ['mold'] },
    { a: 'gold',     b: 'mold',     give: ['gold_band'] },

    // ── Final Assembly ──
    { a: 'stick',    b: 'leaf',     give: ['wreath'] },
    { a: 'ember',    b: 'water',    give: ['steam'] },
    { a: 'steam',    b: 'cement',   give: ['putty'] },
    { a: 'wreath',   b: 'gold_band', give: ['circlet'] },
    { a: 'putty',    b: 'gem',      give: ['jewel'] },
    { a: 'circlet',  b: 'jewel',    give: ['crown'] },
  ],
  startItems: [
    'stick', 'stick', 'stick', 'stick', 'stick',
    'rock', 'rock', 'rock', 'rock', 'rock',
    'leaf', 'leaf', 'leaf',
    'water', 'water', 'water',
    'ember', 'ember',
    'clay', 'clay',
  ],
};
