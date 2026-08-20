/**
 * Display-only rounding for OVR and OVR-derived values (deltas, peaks).
 *
 * OVR can legitimately be fractional internally — the hidden career-
 * ceiling taper multiplies growth by fractions like 0.15/0.3/0.55, and
 * partial-progress deltas accumulate over many seasons. That precision is
 * exactly what we want to KEEP internally, since it's what makes small
 * partial gains add up correctly over a career. But the player should
 * only ever see whole numbers — this rounds to the nearest integer for
 * display and never touches the stored value.
 */
export function formatOvr(value: number): string {
  return Math.round(value).toString();
}

/** Same whole-number rounding, but with an explicit "+" sign for positive deltas. */
export function formatOvrDelta(value: number): string {
  const rounded = Math.round(Math.abs(value));
  return value >= 0 ? `+${rounded}` : `-${rounded}`;
}
