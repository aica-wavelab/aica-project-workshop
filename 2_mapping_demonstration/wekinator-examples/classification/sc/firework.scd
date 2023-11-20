s.boot;

(
SynthDef(\fireworks,{
    var sig;
    sig = Dust.ar([\densityleft.kr(3), \densityright.kr(3)-0.5]);
	sig = Ringz.ar(
		sig,
		freq: \freq.kr(300),
		decaytime: \decaytime.kr(0.1)) * \amp.kr(0.55);
    sig = FreeVerb.ar(sig, 0.6, 0.9, 0.8);
    sig = LPF.ar(in: sig, freq: \cutofffreq.kr(21000));
    Out.ar(0, sig);
}).add;
)

(
SynthDef(\drone_saws, {
    var sig, env, n = 8;

	var harms = Array.series(n, 1, 1) *.s [1.0, 1.01];
	var amps = (harms ** \exp.kr(0.4)).normalizeSum;
	var noise = {LFNoise2.kr(8).bipolar(\detune.kr(0.1)).midiratio}!harms.size;
	var vibrato = SinOsc.kr({LFNoise1.kr(1).range(0.1, Rand(0.5,1.0))}!harms.size).range(0.5, 0.9);
	var rq = {LFNoise1.kr(2).range(0.05, 0.4)}!(2*n);
	var trig = Dust.ar(15);

	sig = Saw.ar(\freq.kr(75) * harms * noise);
	sig = RLPF.ar(sig,
		freq: \freq.kr(75) * harms,
		rq: rq).tanh;
	sig = sig + (sig * Env.perc(0.01, 0.02).ar(gate: trig));
	sig = sig * amps;
	sig = Splay.ar(sig);

    /*env = EnvGen.kr(Env(
        levels: [0, 1, 1, 0],
        times: [\atk.kr(6.0), \sus.kr(4.0), \rel.kr(6.0)]), doneAction: Done.freeSelf);*/
	env = 1.0;

	sig = Balance2.ar(sig[0], sig[1], pos: LFNoise1.kr(0.2).bipolar(0.85));
    sig = sig * env * \amp.kr(1.0);
    Out.ar(0, sig);
}).add;
)

(
~drone = Synth(\drone_saws, [\freq: 120, \amp: 0.0, \exp: 0.2]);
~fireworks = Synth(\fireworks, [\amp: 1.0]);
)

~fireworks = Synth(\fireworks, [\amp: 1.0]);

(
OSCdef(
    \getClass,
    {
        arg val;
		val.postln;
		if(val[1] == 'class1',{
			~fireworks.set(\amp, 0.0);
			~drone.set(\amp, 0.7);
		}, {
			~fireworks.set(\amp, 1.0);
			~drone.set(\amp, 0.0);
		});

    },
    '/wek/outputs',
    recvPort: 7448
);
)

OSCFunc.trace(false);