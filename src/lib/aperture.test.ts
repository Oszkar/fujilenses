import { describe, expect, it } from 'vitest';
import { allLenses } from './data';
import { apertureDisplay, telephotoAperture } from './aperture';
import { sortLenses } from './filters';

describe('maximum aperture', () => {
 it('shows catalog variable ranges and preserves constant apertures', () => {
  for (const [model, expected] of [['XF 18-55mm F2.8-4 R LM OIS', 'f/2.8–4'], ['XF 70-300mm F4-5.6 R LM OIS WR', 'f/4–5.6'], ['XF 35mm F2 R WR', 'f/2']]) {
   const lens = allLenses.find(l => l.model === model)!;
   expect(lens).toBeDefined();
   expect(apertureDisplay(lens)).toBe(expected);
  }
 });
 it('supports slash notation and does not mistake focal ranges for aperture', () => {
  const lens = { ...allLenses[0], lensType: 'Zoom' as const, maxAperture: 3.5, model: '18-300mm F/3.5-6.3' };
  expect(telephotoAperture(lens)).toBe(6.3);
  expect(apertureDisplay({ ...lens, model: '18-300mm F/3.5' })).toBe('f/3.5');
 });
 it('sorts by wide end then telephoto in both directions without mutating input', () => {
  const base = { ...allLenses[0], lensType: 'Zoom' as const, maxAperture: 2.8 };
  const lenses = [{ ...base, model: '18-55mm F2.8-4' }, { ...base, model: '16-55mm F2.8' }, { ...base, model: '18-50mm F2-4', maxAperture: 2 }];
  expect(sortLenses(lenses, 'maxAperture', 'asc').map(apertureDisplay)).toEqual(['f/2–4', 'f/2.8', 'f/2.8–4']);
  expect(sortLenses(lenses, 'maxAperture', 'desc').map(apertureDisplay)).toEqual(['f/2.8–4', 'f/2.8', 'f/2–4']);
  expect(lenses[0].model).toBe('18-55mm F2.8-4');
 });
});
