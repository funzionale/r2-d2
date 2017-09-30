import { constructGrid } from '../generate';

/** Trivial cases (empty grids: m === 0 || n === 0) */
test('constructGrid() with trivial grids: constructs grid of ascendingly sorted, non-repeating coordinates', () => {
  expect(constructGrid({ m: 0, n: 0 })).toEqual([]);
  expect(constructGrid({ m: 0, n: 1 })).toEqual([]);
  expect(constructGrid({ m: 1, n: 0 })).toEqual([]);
});

/** Non-trivial cases (rectangular grids: m >= 1 && n >= 1 && m !== n) */
test('constructGrid() with rectangular grids: constructs grid of ascendingly sorted, non-repeating coordinates', () => {
  expect(constructGrid({ m: 1, n: 2 })).toEqual([
    { x: 0, y: 0 },
    { x: 0, y: 1 },
  ]);
  expect(constructGrid({ m: 2, n: 1 })).toEqual([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ]);
  expect(constructGrid({ m: 1, n: 3 })).toEqual([
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
  ]);
  expect(constructGrid({ m: 3, n: 1 })).toEqual([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ]);
  expect(constructGrid({ m: 2, n: 3 })).toEqual([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ]);
  expect(constructGrid({ m: 3, n: 2 })).toEqual([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ]);
});

/** Non-trivial cases (square grids: m >= 1 && n >= 1 && m === n) */
test('constructGrid() with square grids: constructs grid of ascendingly sorted, non-repeating coordinates', () => {
  expect(constructGrid({ m: 1, n: 1 })).toEqual([{ x: 0, y: 0 }]);
  expect(constructGrid({ m: 2, n: 2 })).toEqual([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ]);
  expect(constructGrid({ m: 3, n: 3 })).toEqual([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ]);
});
