// Crucible — cyclic resource production tutorial.
// The ember acts as a catalyst: ember+log→flame+ash, flame+log→coal+ember.
// Run the cycle 3× to stockpile coal and ash, then smelt and shape into a Sunstone.
// Teaches the loop pattern needed for Voyage.

GAME_MODES.crucible = {
  name: 'Crucible',
  saveVersion: 1,
  winItem: 'sunstone',
  items: {
    // ── Starting / Raw ──
    ember:   { icon: 'sbed/fire',              color: '#ff6030', name: 'Ember' },
    log:     { icon: 'delapouite/log',         color: '#8a6830', name: 'Log' },
    ore:     { icon: 'faithtoken/ore',         color: '#c07848', name: 'Ore' },
    sand:    { icon: 'lorc/sands-of-time',     color: '#e8d44d', name: 'Sand' },
    quartz:  { icon: 'lorc/crystal-cluster',   color: '#d0a8d8', name: 'Quartz' },

    // ── Tier 1: Ember Cycle ──
    flame:   { icon: 'carl-olsen/flame',       color: '#ff8c30', name: 'Flame' },
    ash:     { icon: 'lorc/powder',            color: '#888890', name: 'Ash' },
    coal:    { icon: 'delapouite/coal-pile',   color: '#404048', name: 'Coal' },

    // ── Tier 2: Processing ──
    ingot:   { icon: 'willdabeast/gold-bar',   color: '#a0a0b0', name: 'Ingot' },
    glass:   { icon: 'lorc/cut-diamond',       color: '#60c8e8', name: 'Glass' },
    crystal: { icon: 'lorc/crystal-shine',     color: '#c080e0', name: 'Crystal' },

    // ── Tier 3: Shaping ──
    lens:    { icon: 'lorc/magnifying-glass',  color: '#80c0e8', name: 'Lens' },
    mirror:  { icon: 'willdabeast/round-shield', color: '#c0c0d0', name: 'Mirror' },
    frame:   { icon: 'delapouite/wood-frame',  color: '#b08850', name: 'Frame' },
    prism:   { icon: 'delapouite/prism',       color: '#ff80a0', name: 'Prism' },

    // ── Tier 4: Convergence ──
    reflector: { icon: 'lorc/sunbeams',        color: '#e0c040', name: 'Reflector' },
    beacon:    { icon: 'delapouite/lighthouse', color: '#ffa040', name: 'Beacon' },

    // ── Win ──
    sunstone:  { icon: 'lorc/sun',             color: '#ffd700', name: 'Sunstone!' },
  },

  recipes: [
    // ── Tier 1: Ember Cycle (2 recipes, run 3×) ──
    // ember + log → flame + ash;  flame + log → coal + ember
    // Net per cycle: 2 log → 1 coal + 1 ash (ember returns)
    { a: 'ember', b: 'log',   give: ['flame', 'ash'] },
    { a: 'flame', b: 'log',   give: ['coal', 'ember'] },

    // ── Tier 2: Processing (3 recipes, 2→1) ──
    { a: 'coal',   b: 'ore',    give: ['ingot'] },    // smelt ore
    { a: 'ash',    b: 'sand',   give: ['glass'] },    // fuse glass
    { a: 'quartz', b: 'quartz', give: ['crystal'] },  // refine crystal

    // ── Tier 3: Shaping (4 recipes, 2→1) ──
    { a: 'glass',  b: 'crystal', give: ['lens'] },    // grind lens
    { a: 'ingot',  b: 'glass',   give: ['mirror'] },  // polish mirror
    { a: 'ingot',  b: 'ingot',   give: ['frame'] },   // forge frame
    { a: 'glass',  b: 'ember',   give: ['prism'] },   // capture ember light

    // ── Tier 4: Convergence (2 recipes, 2→1) ──
    { a: 'lens',   b: 'mirror',  give: ['reflector'] },
    { a: 'frame',  b: 'prism',   give: ['beacon'] },

    // ── Tier 5: Win ──
    { a: 'reflector', b: 'beacon', give: ['sunstone'] },
  ],

  startItems: [
    'ember',
    'log', 'log', 'log', 'log', 'log', 'log',
    'ore', 'ore', 'ore',
    'sand', 'sand', 'sand',
    'quartz', 'quartz',
  ],
};
