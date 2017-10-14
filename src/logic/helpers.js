/** @flow */

import _ from 'lodash';
import items from './items';

import type { Cell, Coordinates, Item } from '../flow';

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

export const moveR2D2 = (grid: Array<Cell>, operatorName: string) => {
  const newGrid = _.cloneDeep(grid);
  const r2D2Cell: Cell | void = findCellByItem(grid, items.R2D2); // @FIXME: Remove void

  if (r2D2Cell) {
    const { coordinates: currentR2D2Coordinates } = r2D2Cell;

    const newR2D2Cell = findCellByCoordinates(grid, {
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
    if (newR2D2Cell) {
      // Destination cell is wall or obstacle
      if (
        currentR2D2Coordinates.x === 0 ||
        doesCellContainItem(newR2D2Cell, items.OBSTACLE)
      ) {
        //go no where
      } else if (
        isCellEmpty(newR2D2Cell) ||
        (newR2D2Cell.items.length === 1 &&
          doesCellContainItem(newR2D2Cell, items.PAD)) ||
        doesCellContainItem(newR2D2Cell, items.TELEPORTAL)
      ) {
        // Destination cell is empty or teleportal or ONLY pad
        newGrid.find(item => doesCellContainItem(item, items.R2D2)).items.pop();
        newR2D2Cell.items.push(items.R2D2);
      } else if (
        newR2D2Cell.items.length === 1 &&
        doesCellContainItem(newR2D2Cell, items.ROCK)
      ) {
        // Destination cell has rock
        const cellNextToRock = findCellByCoordinates(newGrid, {
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
          // Do nothing
        } else {
          //push on empty or a pad
          newR2D2Cell.items.pop();
          cellNextToRock.items.push(items.ROCK);

          newGrid
            .find(item => doesCellContainItem(item, items.R2D2))
            .items.pop();
          newR2D2Cell.items.push(items.R2D2);
        }
      }
    }
  }

  return newGrid;
};

export const isCellEmpty: Cell => boolean = cell => cell.items.length === 0;

export const isTeleportalActivated = (grid: Array<Cell>): boolean => {
  const cellsContainingPads = grid.filter(cell =>
    cell.items.includes(items.PAD)
  );
  const cellsContainingRocks = grid.filter(cell =>
    cell.items.includes(items.ROCK)
  );
  return _.difference(cellsContainingPads, cellsContainingRocks).length === 0;
};

// @TODO: Convert 1D grid to 2D

// export const inactivatedPadsCount: Array<Cell> => number = () => {};

// export const isCellAdjacentToWall: Cell => boolean = () => {};

// export const gridStats: Array<Cell> => Object = () => {};

// export const moveItem: (
//   Grid,
//   Coordinates,
//   Coordinates,
//   Item,
// ) => Grid = () => {};
