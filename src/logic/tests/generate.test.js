import _ from 'lodash';
import items from '../items';
import { constructGrid, populateGrid } from '../generate';

/** constructGrid(): Trivial cases (empty grids: m === 0 || n === 0) */
test('constructGrid() with trivial grids: constructs grid of ascendingly sorted, non-repeating coordinates', () => {
  expect(constructGrid({ m: 0, n: 0 })).toEqual([]);
  expect(constructGrid({ m: 0, n: 1 })).toEqual([]);
  expect(constructGrid({ m: 1, n: 0 })).toEqual([]);
});

/** constructGrid(): Non-trivial cases (rectangular grids: m >= 1 && n >= 1 && m !== n) */
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

/** constructGrid(): Non-trivial cases (square grids: m >= 1 && n >= 1 && m === n) */
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

/** populateGrid() */
test('populateGrid() does not allocate redundant R2D2s or TELEPORTALs', () => {
  const filterR2D2 = cell =>
    cell.items.filter(item => item === items.R2D2).length === 1;
  const filterTeleportal = cell =>
    cell.items.filter(item => item === items.TELEPORTAL).length === 1;

  for (let i = 0; i < 1000; i++) {
    const grid = populateGrid(
      constructGrid({ m: _.random(5, 10), n: _.random(5, 10) })
    );

    expect(grid.filter(filterR2D2).length).toBe(1);
    expect(grid.filter(filterTeleportal).length).toBe(1);
  }
});
