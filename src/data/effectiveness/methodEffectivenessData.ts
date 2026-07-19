// Method-effectiveness data. Numbers are the verified Gate D4/D5 results
// (see /Users/os/mathresearch/gate_d4_exact_orbit and gate_d5_uniform_prime).
export type EffGateStatus = "pass" | "partial" | "active" | "blocked";

export const effectivenessData = {
  scope: "k=13 tight interface, all primes p>182 (D5)",
  evidence: "SUPPORTED-INTERNAL · I2",
  rawDomain: 793_714_773_254_144, // 14^13
  naiveLift: 96_889_010_407, // 7^13
  countVectors: 77_520, // C(20,7) folded count-vectors
  orbitClasses: 16_171, // exact residual orbit representatives
  mass: {
    b0: 302_875_106_592_253, // 13^13
    b1: 1_145_298_905_011,
    residual: 489_694_367_756_880,
    total: 793_714_773_254_144,
  },
  producerSeconds: 6.25, // D4 orbit-certificate producer
  peakRamMb: 43, // measured D4 producer peak RSS
  verifiers: 2,
  corruptionD4: 16,
  corruptionD5: 18,
  uniformThresholdP0: 78, // D5 aggregate threshold; 0 in-scope exceptions
  gates: [
    ["SCAN", "pass"],
    ["A", "pass"],
    ["B", "pass"],
    ["C", "partial"],
    ["D0", "partial"],
    ["D1", "partial"],
    ["D2", "partial"],
    ["D3", "partial"],
    ["D4", "pass"],
    ["D5", "pass"],
    ["D6", "blocked"],
    ["D7", "partial"],
    ["D7R", "pass"],
    ["D8", "partial"],
    ["D9", "partial"],
    ["D10", "partial"],
    ["D11", "partial"],
    ["D12", "partial"],
    ["D13", "partial"],
    ["D14", "partial"],
    ["D15", "partial"],
    ["D16", "partial"],
    ["D17", "pass"],
  ] as Array<[string, EffGateStatus]>,
};

export const representationRows = [
  { key: "full", value: effectivenessData.rawDomain },
  { key: "lift", value: effectivenessData.naiveLift },
  { key: "vectors", value: effectivenessData.countVectors },
  { key: "orbits", value: effectivenessData.orbitClasses },
];
