// Clockwork — build a Grand Orrery from three locked supply chests.
// Three interlocking paths with waste management and cross-capsule dependencies.

GAME_MODES.clockwork = {
  name: 'Clockwork',
  saveVersion: 1,
  winItem: 'grand_orrery',
  items: {
    // ── Starting Items ──
    skeleton_key:   { icon: 'lorc/skeleton-key',       color: '#c8b070', name: 'Skeleton Key', maxDur: 3 },
    foundry_chest:  { icon: 'lorc/locked-chest',       color: '#c07040', name: 'Foundry Chest' },
    workshop_chest: { icon: 'lorc/locked-chest',       color: '#80a050', name: 'Workshop Chest' },
    jeweler_chest:  { icon: 'lorc/locked-chest',       color: '#a060c0', name: "Jeweler's Chest" },

    // ── Foundry Raw Materials ──
    copper:    { icon: 'lorc/metal-disc',       color: '#d87040', name: 'Copper' },
    tin:       { icon: 'lorc/metal-disc',       color: '#a0a8b0', name: 'Tin' },
    iron:      { icon: 'delapouite/metal-plate', color: '#708090', name: 'Iron' },
    coal:      { icon: 'delapouite/coal-pile',  color: '#404048', name: 'Coal' },
    sand:      { icon: 'lorc/sands-of-time',    color: '#e0c850', name: 'Sand' },
    forge_kit: { icon: 'delapouite/bellows',    color: '#c08040', name: 'Forge Kit' },

    // ── Workshop Raw Materials ──
    oak:        { icon: 'delapouite/planks',       color: '#b08040', name: 'Oak' },
    wire:       { icon: 'delapouite/wire-coil',    color: '#a0a0a8', name: 'Wire' },
    gear_blank: { icon: 'darkzaitzev/big-gear',    color: '#707078', name: 'Gear Blank' },
    rubber:     { icon: 'lorc/dripping-goo',       color: '#404040', name: 'Rubber' },
    oil:        { icon: 'lorc/oily-spiral',        color: '#c0a030', name: 'Oil' },
    rasp:       { icon: 'delapouite/hand-saw',     color: '#888890', name: 'Rasp' },

    // ── Jeweler Raw Materials ──
    gold_dust: { icon: 'delapouite/gold-nuggets',  color: '#ffd700', name: 'Gold Dust' },
    silver:    { icon: 'lorc/metal-bar',            color: '#c0c0d0', name: 'Silver' },
    crystal:   { icon: 'lorc/crystal-cluster',      color: '#80d0e0', name: 'Crystal' },
    enamel:    { icon: 'delapouite/glass-ball',     color: '#d0d0e8', name: 'Enamel' },
    silk:      { icon: 'delapouite/rolled-cloth',   color: '#d0a0c0', name: 'Silk' },
    acid:      { icon: 'sbed/acid-tube',            color: '#a0e050', name: 'Acid' },

    // ── Foundry Intermediates ──
    forge:  { icon: 'delapouite/furnace',          color: '#e05838', name: 'Forge', maxDur: 2 },
    bronze: { icon: 'lorc/metal-bar',              color: '#cd7f32', name: 'Bronze' },
    steel:  { icon: 'lorc/metal-bar',              color: '#7888a0', name: 'Steel' },
    glass:  { icon: 'delapouite/glass-celebration', color: '#a0d8e8', name: 'Glass' },

    // ── Workshop Intermediates ──
    press:   { icon: 'lorc/anvil',              color: '#708090', name: 'Press', maxDur: 2 },
    plank:   { icon: 'delapouite/wood-beam',    color: '#c09050', name: 'Plank' },
    dowel:   { icon: 'lorc/stick-splitting',    color: '#b08040', name: 'Dowel' },
    spring:  { icon: 'delapouite/bouncing-spring', color: '#a0a0b0', name: 'Spring' },
    gear:    { icon: 'lorc/gear-hammer',        color: '#909098', name: 'Gear' },
    gasket:  { icon: 'lorc/cog',                color: '#404048', name: 'Gasket' },
    housing: { icon: 'delapouite/wood-frame',   color: '#b08040', name: 'Housing' },

    // ── Jeweler Intermediates ──
    crucible:      { icon: 'delapouite/foundry-bucket', color: '#d0c0a0', name: 'Crucible', maxDur: 2 },
    gold_bar:      { icon: 'willdabeast/gold-bar',  color: '#ffd700', name: 'Gold Bar' },
    gold_wire:     { icon: 'delapouite/wire-coil',  color: '#ffd700', name: 'Gold Wire' },
    silver_thread: { icon: 'delapouite/sewing-string', color: '#c0c0d0', name: 'Silver Thread' },
    crystal_cut:   { icon: 'lorc/cut-diamond',      color: '#80d0e0', name: 'Cut Crystal' },
    enamel_coat:   { icon: 'delapouite/paint-bucket', color: '#4080d0', name: 'Enamel Coat' },

    // ── Waste ──
    filings:  { icon: 'lorc/powder',      color: '#888890', name: 'Filings' },
    shavings: { icon: 'lorc/dust-cloud',  color: '#b0a070', name: 'Shavings' },
    tarnish:  { icon: 'lorc/spill',       color: '#706860', name: 'Tarnish' },

    // ── Waste Products (useful!) ──
    paste:  { icon: 'lorc/dripping-stone', color: '#c0b080', name: 'Paste' },
    flux:   { icon: 'delapouite/sparkles', color: '#f0e060', name: 'Flux' },
    polish: { icon: 'lorc/crystal-shine',  color: '#e0e0f0', name: 'Polish' },

    // ── Convergence Layer 1: Refined Components ──
    bronze_plate:    { icon: 'delapouite/metal-plate',  color: '#cd7f32', name: 'Bronze Plate' },
    bronze_armature: { icon: 'delapouite/ancient-screw', color: '#cd7f32', name: 'Bronze Armature' },
    glass_dome:      { icon: 'delapouite/glass-ball',   color: '#a0d8e8', name: 'Glass Dome' },
    gear_train:      { icon: 'lorc/gears',              color: '#909098', name: 'Gear Train' },
    mainspring:      { icon: 'delapouite/spring',       color: '#a0a0b0', name: 'Mainspring' },
    gold_leaf:       { icon: 'lorc/flamed-leaf',        color: '#ffd700', name: 'Gold Leaf' },
    gold_trim:       { icon: 'lorc/gem-chain',          color: '#ffd700', name: 'Gold Trim' },
    crystal_lens:    { icon: 'lorc/spectacle-lenses',   color: '#80d0e0', name: 'Crystal Lens' },
    enamel_dial:     { icon: 'skoll/pocket-watch',      color: '#d0d0e8', name: 'Enamel Dial' },

    // ── Convergence Layer 2: Assemblies ──
    armature_frame:  { icon: 'delapouite/i-beam',       color: '#cd7f32', name: 'Armature Frame' },
    star_display:    { icon: 'lorc/crystal-ball',       color: '#80d0e0', name: 'Star Display' },
    drive_mechanism: { icon: 'darkzaitzev/big-gear',    color: '#909098', name: 'Drive Mechanism' },
    gilded_bezel:    { icon: 'lorc/engagement-ring',    color: '#ffd700', name: 'Gilded Bezel' },
    dial_assembly:   { icon: 'caro-asercion/clock-tower', color: '#e0d070', name: 'Dial Assembly' },

    // ── Convergence Layer 3: Major Components ──
    celestial_frame: { icon: 'lorc/ringed-planet',      color: '#cd7f32', name: 'Celestial Frame' },
    clockwork_core:  { icon: 'lorc/clockwork',          color: '#c8a858', name: 'Clockwork Core' },
    orrery_body:     { icon: 'caro-asercion/gyroscope', color: '#c8a858', name: 'Orrery Body' },

    // ── Win Item ──
    grand_orrery: { icon: 'caro-asercion/orrery', color: '#ffd700', name: 'Grand Orrery' },
  },

  recipes: [
    // ── Chest Opening (skeleton_key dur:3, one per chest) ──
    { a: 'skeleton_key', b: 'foundry_chest', aCost: 1, give: [
      'copper', 'copper', 'copper', 'tin', 'tin',
      'iron', 'iron', 'coal', 'coal', 'sand', 'sand', 'forge_kit',
    ]},
    { a: 'skeleton_key', b: 'workshop_chest', aCost: 1, give: [
      'oak', 'oak', 'oak', 'wire', 'wire', 'wire',
      'gear_blank', 'gear_blank', 'rubber', 'rubber', 'oil', 'rasp',
    ]},
    { a: 'skeleton_key', b: 'jeweler_chest', aCost: 1, give: [
      'gold_dust', 'gold_dust', 'gold_dust', 'silver', 'silver',
      'crystal', 'crystal', 'enamel', 'enamel', 'silk', 'silk', 'acid',
    ]},

    // ── Foundry Path ──
    // copper x3 + tin x2 + iron x2 + coal x2 + sand x2 + forge_kit = 12
    { a: 'copper', b: 'tin',       give: ['bronze', 'filings'] },  // classic alloy! (x2)
    { a: 'iron',   b: 'coal',      give: ['steel'] },              // smelt steel (x2)
    { a: 'sand',   b: 'sand',      give: ['glass'] },              // fuse glass
    { a: 'copper', b: 'forge_kit', give: ['forge'] },              // assemble the forge

    // ── Workshop Path ──
    // oak x3 + wire x3 + gear_blank x2 + rubber x2 + oil + rasp = 12
    { a: 'oak',        b: 'oak',        give: ['plank', 'shavings'] },  // saw planks
    { a: 'oak',        b: 'rasp',       give: ['dowel', 'shavings'] },  // lathe a dowel
    { a: 'wire',       b: 'wire',       give: ['spring'] },             // coil a spring
    { a: 'wire',       b: 'gear_blank', give: ['gear'] },               // cut gear teeth
    { a: 'gear_blank', b: 'oil',        give: ['gear'] },               // precision gear
    { a: 'rubber',     b: 'rubber',     give: ['gasket'] },             // mold gasket
    { a: 'plank',      b: 'dowel',      give: ['housing'] },            // joinery
    { a: 'steel',      b: 'steel',      give: ['press'] },              // forge the press

    // ── Jeweler Path ──
    // gold_dust x3 + silver x2 + crystal x2 + enamel x2 + silk x2 + acid = 12
    { a: 'gold_dust', b: 'gold_dust', give: ['gold_bar', 'tarnish'] },  // refine gold
    { a: 'gold_dust', b: 'acid',      give: ['gold_wire', 'tarnish'] }, // etch gold wire
    { a: 'silver',    b: 'crystal',   give: ['crucible'] },             // crystal crucible
    { a: 'silver',    b: 'silk',      give: ['silver_thread'] },        // spin silver thread
    { a: 'crystal',   b: 'enamel',    give: ['crystal_cut'] },          // enamel-etched cut
    { a: 'enamel',    b: 'silk',      give: ['enamel_coat'] },          // silk-backed enamel

    // ── Waste Processing ──
    // forge (A, dur:2) processes shavings (from B) → paste
    // press (B, dur:2) processes filings (from A) → flux
    // crucible (C, dur:2) processes tarnish (from C) → polish
    { a: 'forge',    b: 'shavings', aCost: 1, give: ['paste'] },   // char shavings (x2)
    { a: 'press',    b: 'filings',  aCost: 1, give: ['flux'] },    // compress filings (x2)
    { a: 'crucible', b: 'tarnish',  aCost: 1, give: ['polish'] },  // refine tarnish (x2)

    // ── Convergence Layer 1: Refined Components ──
    // waste products (paste, flux, polish) consumed here
    { a: 'bronze',       b: 'paste',         give: ['bronze_plate'] },    // paste-bonded plate
    { a: 'bronze',       b: 'flux',          give: ['bronze_armature'] }, // flux-soldered armature
    { a: 'glass',        b: 'flux',          give: ['glass_dome'] },      // flux-polished dome
    { a: 'gear',         b: 'gear',          give: ['gear_train'] },      // mesh gears
    { a: 'spring',       b: 'gasket',        give: ['mainspring'] },      // sealed mainspring
    { a: 'gold_bar',     b: 'paste',         give: ['gold_leaf'] },       // pressed gold leaf
    { a: 'gold_wire',    b: 'polish',        give: ['gold_trim'] },       // polished filigree
    { a: 'crystal_cut',  b: 'polish',        give: ['crystal_lens'] },    // polished lens
    { a: 'enamel_coat',  b: 'silver_thread', give: ['enamel_dial'] },     // threaded dial face

    // ── Convergence Layer 2: Assemblies ──
    { a: 'bronze_plate',  b: 'bronze_armature', give: ['armature_frame'] },
    { a: 'glass_dome',    b: 'crystal_lens',    give: ['star_display'] },
    { a: 'gear_train',    b: 'mainspring',      give: ['drive_mechanism'] },
    { a: 'gold_leaf',     b: 'gold_trim',       give: ['gilded_bezel'] },
    { a: 'enamel_dial',   b: 'housing',         give: ['dial_assembly'] },

    // ── Convergence Layer 3: Final Assembly ──
    { a: 'armature_frame',  b: 'star_display',    give: ['celestial_frame'] },
    { a: 'drive_mechanism', b: 'dial_assembly',    give: ['clockwork_core'] },
    { a: 'gilded_bezel',    b: 'clockwork_core',   give: ['orrery_body'] },
    { a: 'celestial_frame', b: 'orrery_body',      give: ['grand_orrery'] },
  ],

  startItems: [
    'skeleton_key', 'foundry_chest', 'workshop_chest', 'jeweler_chest',
  ],
};
