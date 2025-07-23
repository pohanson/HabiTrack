// get color b/w red and green based on percentage
export function getColorForPercentage(percentage: number) {
  // red rgb: 255 0 0
  // green rgb: 0 180 60

  const r = Math.round(255 - 255 * (percentage / 100));
  const g = Math.round(180 * (percentage / 100));
  const b = Math.round(60 * (percentage / 100));

  const rx = isNaN(r) ? '00' : Math.max(0, Math.min(255, r)).toString(16).padStart(2, '0');
  const gx = isNaN(g) ? '00' : Math.max(0, Math.min(255, g)).toString(16).padStart(2, '0');
  const bx = isNaN(b) ? '00' : Math.max(0, Math.min(255, b)).toString(16).padStart(2, '0');

  return `#${rx}${gx}${bx}`;
}

// blue -> purple transition
export function getProgressBarColorForPercentage(percentage: number) {
  // blue: 0 170 200
  // purple: 140 60 220

  const r = Math.round(140 * (percentage / 100));
  const g = Math.round(170 - (percentage * 110) / 100);
  const b = Math.round(200 + (percentage * 20) / 100);

  const rx = isNaN(r) ? '00' : Math.max(0, Math.min(255, r)).toString(16).padStart(2, '0');
  const gx = isNaN(g) ? '00' : Math.max(0, Math.min(255, g)).toString(16).padStart(2, '0');
  const bx = isNaN(b) ? '00' : Math.max(0, Math.min(255, b)).toString(16).padStart(2, '0');

  return `#${rx}${gx}${bx}`;
}
