/** @flow */

import _ from 'lodash';
import items from './items';

import type { Cell, Coordinates, Item } from '../flow';

export const isCellEmpty: Cell => boolean = cell => cell.items.length === 0;

export const doesCellContainItem: (Cell, Item) => boolean = (cell, item) =>
  cell.items.includes(item);

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

export const isTeleportalActivated: (Array<Cell>) => boolean = grid => {
  const cellsContainingPads = filterCellsByItem(grid, items.PAD);

  const cellsContainingPadsWithoutRocks = cellsContainingPads.filter(
    cell => !doesCellContainItem(cell, items.ROCK)
  );

  return cellsContainingPadsWithoutRocks.length === 0;
};

export const moveItem: (
  Array<Cell>,
  Coordinates,
  Coordinates,
  Item
) => Array<Cell> = (grid, sourceCoordinates, destinationCoordinates, item) => {
  if (
    sourceCoordinates.x === destinationCoordinates.x &&
    sourceCoordinates.y === destinationCoordinates.y
  ) {
    throw new Error(
      'moveItem(): Source & destination coordinates cannot be the same'
    );
  }

  if (sourceCoordinates.x < 0 || sourceCoordinates.y < 0) {
    throw new Error('moveItem(): Source coordinates cannot be negative');
  }
  if (destinationCoordinates.x < 0 || destinationCoordinates.y < 0) {
    throw new Error('moveItem(): Destination coordinates cannot be negative');
  }

  const deltaX = Math.abs(destinationCoordinates.x - sourceCoordinates.x);
  const deltaY = Math.abs(destinationCoordinates.y - sourceCoordinates.y);

  if (deltaX > 1 || deltaY > 1) {
    throw new Error('moveItem(): Cannot mobilize item for more than 1 step');
  }
  if (deltaX === 1 && deltaY === 1) {
    throw new Error('moveItem(): Cannot mobilize item diagonally');
  }

  const newGrid = _.cloneDeep(grid);

  const sourceCell: Cell | void = findCellByCoordinates(
    newGrid,
    sourceCoordinates
  );
  const destinationCell: Cell | void = findCellByCoordinates(
    newGrid,
    destinationCoordinates
  );

  if (!sourceCell) {
    throw new Error('moveItem(): Source cell does not exist in the grid');
  }
  if (!destinationCell) {
    throw new Error('moveItem(): Destination cell does not exist in the grid');
  }
  if (!doesCellContainItem(sourceCell, item)) {
    throw new Error(
      'moveItem(): Source cell does not contain the item required to mobilize'
    );
  }

  /** Mutation: Remove item from source cell */
  _.remove(sourceCell.items, cellItem => cellItem === item);
  /** Mutation: Add item to destination cell */
  destinationCell.items.push(item);

  return newGrid;
};

export const moveR2D2: (Array<Cell>, string) => Array<Cell> = (
  grid,
  operatorName
) => {
  let newGrid: Array<Cell> = _.cloneDeep(grid);
  const r2D2Cell: Cell | void = findCellByItem(grid, items.R2D2);

  if (r2D2Cell) {
    const { coordinates: currentR2D2Coordinates } = r2D2Cell;

    const newR2D2Cell: Cell | void = findCellByCoordinates(grid, {
      x:
        operatorName === 'WEST'
          ? currentR2D2Coordinates.x - 1
          : operatorName === 'EAST'
            ? currentR2D2Coordinates.x + 1
            : currentR2D2Coordinates.x,
      y:
        operatorName === 'NORTH'
          ? currentR2D2Coordinates.y - 1
          : operatorName === 'SOUTH'
            ? currentR2D2Coordinates.y + 1
            : currentR2D2Coordinates.y,
    });

    if (
      /** Is destination cell not a WALL? */
      newR2D2Cell
    ) {
      if (
        /** Does destination cell contain an OBSTACLE? */
        doesCellContainItem(newR2D2Cell, items.OBSTACLE)
      ) {
        /** Do nothing */
      } else if (
        /** Is destination cell EMPTY
         * or contains a TELEPORTAL
         * or contains only a PAD? */
        isCellEmpty(newR2D2Cell) ||
        (newR2D2Cell.items.length === 1 &&
          doesCellContainItem(newR2D2Cell, items.PAD)) ||
        doesCellContainItem(newR2D2Cell, items.TELEPORTAL)
      ) {
        /** Move R2D2 */
        newGrid = moveItem(
          newGrid,
          r2D2Cell.coordinates,
          newR2D2Cell.coordinates,
          items.R2D2
        );
      } else if (
        /** Does destination cell contain a ROCK? */
        newR2D2Cell.items.length === 1 &&
        doesCellContainItem(newR2D2Cell, items.ROCK)
      ) {
        const cellNextToRock: Cell | void = findCellByCoordinates(newGrid, {
          x:
            operatorName === 'WEST'
              ? newR2D2Cell.coordinates.x - 1
              : operatorName === 'EAST'
                ? newR2D2Cell.coordinates.x + 1
                : newR2D2Cell.coordinates.x,
          y:
            operatorName === 'NORTH'
              ? newR2D2Cell.coordinates.y - 1
              : operatorName === 'SOUTH'
                ? newR2D2Cell.coordinates.y + 1
                : newR2D2Cell.coordinates.y,
        });
        if (
          !cellNextToRock ||
          doesCellContainItem(cellNextToRock, items.OBSTACLE) ||
          doesCellContainItem(cellNextToRock, items.ROCK)
        ) {
          /** Do nothing */
        } else {
          /** Push ROCK towards EMPTY cell or cell containing PAD */
          newGrid = moveItem(
            newGrid,
            newR2D2Cell.coordinates,
            cellNextToRock.coordinates,
            items.ROCK
          );

          /** Move R2D2 */
          newGrid = moveItem(
            newGrid,
            r2D2Cell.coordinates,
            newR2D2Cell.coordinates,
            items.R2D2
          );
        }
      }
    }
  }

  return newGrid;
};

// @TODO: Convert 1D grid to 2D

// export const inactivatedPadsCount: Array<Cell> => number = () => {};

// export const isCellAdjacentToWall: Cell => boolean = () => {};

// export const gridStats: Array<Cell> => Object = () => {};
