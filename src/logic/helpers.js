/** @flow */

import type { Cell, Coordinates, Item, Operator } from '../flow';

export const doesCellContainItem: (Cell, Item) => boolean = (cell, item) =>
  Boolean(cell.items.find(cellItem => cellItem === item));

export const findCellByItem: (Array<Cell>, Item) => Cell | void = (
  grid,
  item
) => grid.find(cell => doesCellContainItem(cell, item));

export const findCellByCoordinates: (
  Array<Cell>,
  Coordinates
) => Cell | void = (grid, coordinates) =>
  grid.find(
    cell =>
      cell.coordinates.x === coordinates.x &&
      cell.coordinates.y === coordinates.y
  );

export const filterCellsByItem: (Array<Cell>, Item) => Array<Cell> = (
  grid,
  item
) => grid.filter(cell => doesCellContainItem(cell, item));

export const moveR2D2: (Array<Cell>, Operator) => Array<Cell> = (
  grid,
  operator
) => {
  // @TODO: Apply operator & return new grid
  // @TODO: If illegal action, return same grid
  return grid;
};
