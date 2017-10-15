import items from '../items';
import { moveItem } from '../helpers';

/** moveItem() */
test('moveItem(): Mobilizes item correctly', () => {
  const grid = [
    { coordinates: { x: 0, y: 0 }, items: [items.R2D2] },
    { coordinates: { x: 1, y: 0 }, items: [] },
    { coordinates: { x: 2, y: 0 }, items: [] },
    { coordinates: { x: 0, y: 1 }, items: [] },
    { coordinates: { x: 1, y: 1 }, items: [] },
    { coordinates: { x: 2, y: 1 }, items: [] },
    { coordinates: { x: 0, y: 2 }, items: [] },
    { coordinates: { x: 1, y: 2 }, items: [] },
    { coordinates: { x: 2, y: 2 }, items: [] },
  ];

  expect(() =>
    moveItem(grid, { x: 0, y: 0 }, { x: 0, y: 0 }, items.R2D2)
  ).toThrowError(
    'moveItem(): Source & destination coordinates cannot be the same'
  );

  expect(() =>
    moveItem(grid, { x: -1, y: 0 }, { x: 1, y: 0 }, items.R2D2)
  ).toThrowError('moveItem(): Source coordinates cannot be negative');

  expect(() =>
    moveItem(grid, { x: 0, y: -1 }, { x: 1, y: 0 }, items.R2D2)
  ).toThrowError('moveItem(): Source coordinates cannot be negative');

  expect(() =>
    moveItem(grid, { x: 0, y: 0 }, { x: -1, y: 0 }, items.R2D2)
  ).toThrowError('moveItem(): Destination coordinates cannot be negative');

  expect(() =>
    moveItem(grid, { x: 0, y: 0 }, { x: 1, y: -1 }, items.R2D2)
  ).toThrowError('moveItem(): Destination coordinates cannot be negative');

  expect(() =>
    moveItem(grid, { x: 0, y: 0 }, { x: 2, y: 0 }, items.R2D2)
  ).toThrowError('moveItem(): Cannot mobilize item for more than 1 step');

  expect(() =>
    moveItem(grid, { x: 0, y: 0 }, { x: 1, y: 1 }, items.R2D2)
  ).toThrowError('moveItem(): Cannot mobilize item diagonally');

  expect(() =>
    moveItem(grid, { x: 3, y: 0 }, { x: 2, y: 0 }, items.R2D2)
  ).toThrowError('moveItem(): Source cell does not exist in the grid');

  expect(() =>
    moveItem(grid, { x: 2, y: 0 }, { x: 3, y: 0 }, items.R2D2)
  ).toThrowError('moveItem(): Destination cell does not exist in the grid');

  expect(() =>
    moveItem(grid, { x: 0, y: 0 }, { x: 1, y: 0 }, items.TELEPORTAL)
  ).toThrowError(
    'moveItem(): Source cell does not contain the item required to mobilize'
  );

  expect(moveItem(grid, { x: 0, y: 0 }, { x: 1, y: 0 }, items.R2D2)).toEqual([
    { coordinates: { x: 0, y: 0 }, items: [] },
    { coordinates: { x: 1, y: 0 }, items: [items.R2D2] },
    { coordinates: { x: 2, y: 0 }, items: [] },
    { coordinates: { x: 0, y: 1 }, items: [] },
    { coordinates: { x: 1, y: 1 }, items: [] },
    { coordinates: { x: 2, y: 1 }, items: [] },
    { coordinates: { x: 0, y: 2 }, items: [] },
    { coordinates: { x: 1, y: 2 }, items: [] },
    { coordinates: { x: 2, y: 2 }, items: [] },
  ]);

  expect(moveItem(grid, { x: 0, y: 0 }, { x: 0, y: 1 }, items.R2D2)).toEqual([
    { coordinates: { x: 0, y: 0 }, items: [] },
    { coordinates: { x: 1, y: 0 }, items: [] },
    { coordinates: { x: 2, y: 0 }, items: [] },
    { coordinates: { x: 0, y: 1 }, items: [items.R2D2] },
    { coordinates: { x: 1, y: 1 }, items: [] },
    { coordinates: { x: 2, y: 1 }, items: [] },
    { coordinates: { x: 0, y: 2 }, items: [] },
    { coordinates: { x: 1, y: 2 }, items: [] },
    { coordinates: { x: 2, y: 2 }, items: [] },
  ]);
});
