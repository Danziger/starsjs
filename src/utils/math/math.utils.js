export function getRange(rangeOrMax) {
  return typeof rangeOrMax === 'number' ? [0, rangeOrMax] : rangeOrMax;
}

export function getRangeMin(rangeOrMax) {
  return getRange(rangeOrMax)[0];
}

export function getRangeMax(rangeOrMax) {
  return getRange(rangeOrMax)[1];
}

export function random(minOrMax, maxOrUndefined) {
  let min = maxOrUndefined === undefined ? 0 : minOrMax;
  let max = maxOrUndefined === undefined ? minOrMax : maxOrUndefined;

  if (min > max) [min, max] = [max, min];

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomInRange(rangeOrMax) {
  const [min, max] = getRange(rangeOrMax);

  return random(min, max);
}

export function randomDecimal(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

export function randomAngle(minOrMax, maxOrUndefined) {
  let min = maxOrUndefined === undefined ? 0 : (minOrMax ?? 0);
  // eslint-disable-next-line no-nested-ternary
  let max = maxOrUndefined === undefined ? (minOrMax === undefined ? 2 : minOrMax) : maxOrUndefined;

  if (min > max) [min, max] = [max, min];

  const minAngle = Math.PI * min;
  const maxAngle = Math.PI * max;

  return Math.random() * (maxAngle - minAngle) + minAngle;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
