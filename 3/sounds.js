// ZzFXMicro - Zuper Zmall Zound Zynth - v1.3.2 by Frank Force ~ MIT License
// Adapted: lazy AudioContext init, var instead of let for global compat
var zzfxV = 0.3;
var zzfxX;
function zzfxInit() {
  if (!zzfxX) {
    try { zzfxX = new AudioContext; } catch(e) {}
  }
}
function zzfx(p,k,b,e,r,t,q,D,u,y,v,z,l,E,A,F,c,w,m,B,N) {
  zzfxInit();
  if (!zzfxX) return;
  if (p===undefined) p=1;
  if (k===undefined) k=.05;
  if (b===undefined) b=220;
  if (e===undefined) e=0;
  if (r===undefined) r=0;
  if (t===undefined) t=.1;
  if (q===undefined) q=0;
  if (D===undefined) D=1;
  if (u===undefined) u=0;
  if (y===undefined) y=0;
  if (v===undefined) v=0;
  if (z===undefined) z=0;
  if (l===undefined) l=0;
  if (E===undefined) E=0;
  if (A===undefined) A=0;
  if (F===undefined) F=0;
  if (c===undefined) c=0;
  if (w===undefined) w=1;
  if (m===undefined) m=0;
  if (B===undefined) B=0;
  if (N===undefined) N=0;
  var M=Math,d=2*M.PI,R=44100,G,C,g=0,H=0,a=0,n=1,I=0,J=0,f=0,s,h,x,L,Z,K,O,X,Y,P,Q,S,T=0,U=0,V=0,W=0;
  u*=500*d/R/R; G=u;
  b*=(1-k+2*k*M.random(k=[]))*d/R; C=b;
  h=N<0?-1:1; x=d*h*N*2/R; L=M.cos(x); Z=M.sin; K=Z(x)/4; O=1+K;
  X=-2*L/O; Y=(1-K)/O; P=(1+h*L)/2/O; Q=-(h+L)/O; S=P;
  e=R*e+9; m*=R; r*=R; t*=R; c*=R;
  y*=500*d/M.pow(R,3); A*=d/R; v*=d/R; z*=R; l=R*l|0; p*=zzfxV;
  for(h=e+m+r+t+c|0;a<h;k[a++]=f*p)
    ++J%(100*F|0)||(
      f=q?1<q?2<q?3<q?4<q?(g/d%1<D/2)*2-1:Z(M.pow(g,3)):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2)%2:1-4*M.abs(M.round(g/d)-g/d):Z(g),
      s=f,
      f=(l?1-B+B*Z(d*a/l):1)*(4<q?s:(f<0?-1:1)*M.pow(M.abs(f),D))*(a<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),
      f=c?f/2+(c>a?0:(a<h-c?1:(h-a)/c)*k[a-c|0]/2/p):f,
      N?f=W=S*T+Q*(T=U)+P*(U=f)-Y*V-X*(V=W):0
    ),
    x=(b+=u+=y)*M.cos(A*H++),
    g+=x+x*E*Z(M.pow(a,5)),
    n&&++n>z&&(b+=v,C+=v,n=0),
    !l||++I%l||(b=C,u=G,n=n||1);
  X=zzfxX; p=X.createBuffer(1,h,R); p.getChannelData(0).set(k);
  b=X.createBufferSource(); b.buffer=p; b.connect(X.destination); b.start();
}

// ---- SOUND DEFINITIONS ----
var SFX = {
  jump:       function() { zzfx(.8,.03,280,.02,.01,.1,1,1,.3,0,50,.02,0,0,0,0,0,1,0,.08); },
  bounce:     function() { zzfx(.6,.05,150,.01,.01,.05,0,1,0,0,0,0,0,0,0,0,0,1,0,.1); },
  bonk:       function() { zzfx(.8,.1,200,.01,.02,.1,2,1,-5,0,0,0,0,0,0,0,0,1,0,.1); },
  wallTap:    function() { zzfx(.5,.1,800,.005,.005,.03,2,1,0,0,0,0,0,0,0,0,0,1,0,.1); },
  collide:    function() {
    zzfx(.8,.1,300,.01,.05,.15,3,1,-2,0,0,0,0,2,0,0,0,1,0,.1);
    zzfx(.5,.02,250,.01,.05,.2,2,.8,-3,0,-20,.03,0,1,0,0,0,1,0,.06);
    zzfx(.7,0,500,0,0,.03,4,1,0,0,0,0,0,0,0,0,0,1,0,0);
  },
  explode:    function() {
    zzfx(1,.1,50,.01,.2,.5,4,1,0,0,-50,.05,.1,5,0,0,.1,1,0,0);
    zzfx(.6,.02,120,.01,.15,.5,2,.9,-4,0,-40,.04,.08,3,0,0,.05,1,0,.04);
    zzfx(.8,0,400,0,0,.04,4,1,0,0,0,0,0,0,0,0,0,1,0,0);
  },
  fuelWarn:   function() { zzfx(.5,.05,600,.01,.05,.05,0,1,0,0,200,.1,.15,0,0,0,0,1,0,0); },
  oxyWarn:    function() { zzfx(.5,.05,900,.01,.05,.05,0,1,0,0,300,.1,.12,0,0,0,0,1,0,0); },
  win:        function() {
    zzfx(1,.05,500,.02,.15,.3,0,1,.1,0,200,.1,.15,0,0,0,0,1,0,0);
    zzfx(.25,.05,250,.02,.15,.35,1,.7,.1,0,100,.1,.15,0,0,0,0,1,0,0);
  },
  start:      function() { zzfx(.8,.05,100,.1,.15,.2,2,1,.3,.1,0,0,0,0,0,0,0,1,0,.1); },
  fuelPickup: function() { zzfx(.4,.05,300,.01,.03,.05,0,1,.1,0,0,0,0,0,0,0,0,1,0,0); },
  oxyPickup:  function() { zzfx(.4,.05,500,.01,.03,.05,0,1,.15,0,0,0,0,0,0,0,0,1,0,0); },
  jumpPad:    function() { zzfx(.8,.05,250,.01,.05,.15,0,1,1,0,0,0,0,0,0,0,0,1,0,.1); },
  falling:    function() { zzfx(.2,.06,300,.01,.12,.25,0,.7,-.3,0,-15,.04,0,0,0,0,0,1,0,.04); },
  drain:      function() { zzfx(.3,.1,100,.01,.05,.1,3,.5,0,0,0,0,0,0,0,0,0,1,0,.1); }
};

// ---- CONTINUOUS SOUND NODES ----
// Each sound uses 2 detuned oscillators for chorus/texture
var sndEngine = null, sndAccel = null, sndDecel = null, sndSustain = null, sndGlide = null, sndBoost = null;

function makeDistortionCurve(amount) {
  var n = 256, curve = new Float32Array(n);
  for (var i = 0; i < n; i++) {
    var x = (i * 2) / n - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

function startContinuousSound(freq, type, type2, detuneCents, distort, lfoRate) {
  zzfxInit();
  if (!zzfxX) return null;
  var gain = zzfxX.createGain();
  gain.gain.value = 0;
  gain.connect(zzfxX.destination);
  // optional LFO tremolo for roughness
  var lfo = null, lfoGain = null;
  if (lfoRate) {
    lfoGain = zzfxX.createGain();
    lfoGain.gain.value = 0; // tremolo depth, set dynamically
    lfoGain.connect(gain.gain);
    lfo = zzfxX.createOscillator();
    lfo.type = 'square';
    lfo.frequency.value = lfoRate;
    lfo.connect(lfoGain);
    lfo.start();
  }
  // optional waveshaper distortion
  var shaper = null;
  var target = gain; // what oscillators connect to
  if (distort) {
    shaper = zzfxX.createWaveShaper();
    shaper.curve = makeDistortionCurve(distort);
    shaper.oversample = '2x';
    shaper.connect(gain);
    target = shaper;
  }
  var osc1 = zzfxX.createOscillator();
  osc1.type = type;
  osc1.frequency.value = freq;
  osc1.detune.value = -detuneCents;
  osc1.connect(target);
  osc1.start();
  var osc2 = zzfxX.createOscillator();
  osc2.type = type2;
  osc2.frequency.value = freq;
  osc2.detune.value = detuneCents;
  osc2.connect(target);
  osc2.start();
  return { oscs: [osc1, osc2], gain: gain, lfo: lfo, lfoGain: lfoGain };
}

function ensureContinuousSounds() {
  if (sndEngine) return;
  // Engine: distorted sawtooth+triangle, LFO tremolo for stressed chug
  sndEngine = startContinuousSound(40, 'sawtooth', 'triangle', 12, 20, 18);
  if (!sndEngine) return;
  // Accel: heavy distortion + fast LFO for raw, pressed throttle
  sndAccel = startContinuousSound(120, 'sawtooth', 'square', 10, 30, 22);
  // Decel/brake: sawtooth + triangle, moderate distortion — mechanical friction
  sndDecel = startContinuousSound(180, 'sawtooth', 'triangle', 15, 15, 14);
  // Sustain (jump extend): airy hum above engine range — clean, pressurized
  sndSustain = startContinuousSound(240, 'sine', 'triangle', 6, 5, 8);
  // Glide: stressed whine above engine — harsher than sustain
  sndGlide = startContinuousSound(200, 'triangle', 'square', 12, 18, 20);
  // Boost: tense overtone when over max speed
  sndBoost = startContinuousSound(260, 'triangle', 'square', 15, 15, 20);
}

function stopContinuousNode(snd) {
  if (!snd) return;
  snd.oscs[0].stop(); snd.oscs[1].stop();
  if (snd.lfo) snd.lfo.stop();
}

function stopContinuousSounds() {
  stopContinuousNode(sndEngine); sndEngine = null;
  stopContinuousNode(sndAccel); sndAccel = null;
  stopContinuousNode(sndDecel); sndDecel = null;
  stopContinuousNode(sndSustain); sndSustain = null;
  stopContinuousNode(sndGlide); sndGlide = null;
  stopContinuousNode(sndBoost); sndBoost = null;
}

// ---- SOUND STATE ----
var sndFuelWarnTimer = 0;
var sndOxyWarnTimer = 0;
var sndHitLeftWas = false;
var sndHitRightWas = false;
var sndBonkWas = false;
var sndFuelPickupTimer = 0;
var sndOxyPickupTimer = 0;
var sndDrainTimer = 0;
var sndFallingWas = false;

function setSndFreq(snd, freq) {
  snd.oscs[0].frequency.value = freq;
  snd.oscs[1].frequency.value = freq;
}

function updateSounds(dt) {
  if (state !== 'playing' || !alive) {
    // Silence continuous sounds when not playing
    if (sndEngine) sndEngine.gain.gain.value = 0;
    if (sndAccel) sndAccel.gain.gain.value = 0;
    if (sndDecel) sndDecel.gain.gain.value = 0;
    if (sndSustain) sndSustain.gain.gain.value = 0;
    if (sndGlide) sndGlide.gain.gain.value = 0;
    if (sndBoost) sndBoost.gain.gain.value = 0;
    return;
  }

  ensureContinuousSounds();

  // Engine: pitch, volume, and roughness scale with speed
  if (sndEngine) {
    var speedPct = playerSpeed / MAX_SPEED;
    if (playerSpeed > 0.5) {
      setSndFreq(sndEngine, 40 + speedPct * 80);
      sndEngine.gain.gain.value = 0.025 + speedPct * 0.04;
      // LFO tremolo depth — rougher at higher speed
      if (sndEngine.lfoGain) sndEngine.lfoGain.gain.value = 0.008 + speedPct * 0.02;
      if (sndEngine.lfo) sndEngine.lfo.frequency.value = 16 + speedPct * 12;
    } else {
      sndEngine.gain.gain.value = 0;
      if (sndEngine.lfoGain) sndEngine.lfoGain.gain.value = 0;
    }
  }

  // Accel: raw pressed throttle — heavy roughness
  var accelHeld = (keys['ArrowUp'] || keys['KeyW']) && fuel > 0 && oxygen > 0;
  if (sndAccel) {
    if (accelHeld && (grounded || !grounded)) {
      var aPct = playerSpeed / MAX_SPEED;
      var aVol = grounded ? 1.0 : 0.60;
      setSndFreq(sndAccel, 100 + aPct * 60);
      sndAccel.gain.gain.value = 0.04 * aVol;
      if (sndAccel.lfoGain) sndAccel.lfoGain.gain.value = (0.012 + aPct * 0.025) * aVol;
      if (sndAccel.lfo) sndAccel.lfo.frequency.value = 20 + aPct * 15;
    } else {
      sndAccel.gain.gain.value = 0;
      if (sndAccel.lfoGain) sndAccel.lfoGain.gain.value = 0;
    }
  }

  // Boost: tense scream when over max speed — pitch climbs with boost amount
  if (sndBoost) {
    if (playerSpeed > MAX_SPEED) {
      var boostPct = (playerSpeed - MAX_SPEED) / (MAX_SPEED * BOOST_SPEED_PCT);
      setSndFreq(sndBoost, 240 + boostPct * 120);
      sndBoost.gain.gain.value = 0.012 + boostPct * 0.018;
      if (sndBoost.lfoGain) sndBoost.lfoGain.gain.value = 0.005 + boostPct * 0.012;
      if (sndBoost.lfo) sndBoost.lfo.frequency.value = 18 + boostPct * 8;
    } else {
      sndBoost.gain.gain.value = 0;
      if (sndBoost.lfoGain) sndBoost.lfoGain.gain.value = 0;
    }
  }

  // Decel: mechanical friction — pitch and volume rise with speed
  var decelHeld = (keys['ArrowDown'] || keys['KeyS']);
  if (sndDecel) {
    var brakePct = playerSpeed / MAX_SPEED;
    if (decelHeld && playerSpeed > 0) {
      var dVol = grounded ? 1.0 : 0.30;
      setSndFreq(sndDecel, 140 + brakePct * 120);
      sndDecel.gain.gain.value = (0.015 + brakePct * 0.025) * dVol;
      if (sndDecel.lfoGain) sndDecel.lfoGain.gain.value = 0.008 + brakePct * 0.015;
    } else {
      sndDecel.gain.gain.value = 0;
      if (sndDecel.lfoGain) sndDecel.lfoGain.gain.value = 0;
    }
  }

  // Sustain (jump extend): airy pressurized hum, pitch rises with VY
  if (sndSustain) {
    if (isSustaining) {
      setSndFreq(sndSustain, 220 + playerVY * 3);
      sndSustain.gain.gain.value = 0.022;
      if (sndSustain.lfoGain) sndSustain.lfoGain.gain.value = 0.006;
    } else {
      sndSustain.gain.gain.value = 0;
      if (sndSustain.lfoGain) sndSustain.lfoGain.gain.value = 0;
    }
  }

  // Glide: stressed whine, more aggressive than sustain
  if (sndGlide) {
    if (isGliding) {
      setSndFreq(sndGlide, 210);
      sndGlide.gain.gain.value = 0.03;
      if (sndGlide.lfoGain) sndGlide.lfoGain.gain.value = 0.014;
    } else {
      sndGlide.gain.gain.value = 0;
      if (sndGlide.lfoGain) sndGlide.lfoGain.gain.value = 0;
    }
  }

  // Fuel warning
  if (fuel < 20 && fuel > 0) {
    sndFuelWarnTimer -= dt;
    if (sndFuelWarnTimer <= 0) {
      SFX.fuelWarn();
      sndFuelWarnTimer = 1.0;
    }
  } else {
    sndFuelWarnTimer = 0;
  }

  // Oxygen warning
  if (oxygen < 20 && oxygen > 0) {
    sndOxyWarnTimer -= dt;
    if (sndOxyWarnTimer <= 0) {
      SFX.oxyWarn();
      sndOxyWarnTimer = 1.2;
    }
  } else {
    sndOxyWarnTimer = 0;
  }
}

function resetSoundState() {
  sndFuelWarnTimer = 0;
  sndOxyWarnTimer = 0;
  sndHitLeftWas = false;
  sndHitRightWas = false;
  sndBonkWas = false;
  sndFuelPickupTimer = 0;
  sndOxyPickupTimer = 0;
  sndDrainTimer = 0;
  sndFallingWas = false;
}
