/** @flow */

import _ from 'lodash';
import items from './items';

import type { Cell, Coordinates, Item, Dimensions } from '../flow';

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
         * or contains only a TELEPORTAL
         * or contains only a PAD? */
        isCellEmpty(newR2D2Cell) ||
        (newR2D2Cell.items.length === 1 &&
          (doesCellContainItem(newR2D2Cell, items.PAD) ||
            doesCellContainItem(newR2D2Cell, items.TELEPORTAL)))
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

export const sleep: number => Promise<void> = (time: number = 2000) =>
  new Promise(resolve => setTimeout(resolve, time));

/** Get m & n of 1D grid */
export const get1DGridDimensions: (Array<Cell>) => Dimensions = grid =>
  grid.reduce(
    (maxSoFar, cell) => ({
      m: Math.max(maxSoFar.m, cell.coordinates.x + 1),
      n: Math.max(maxSoFar.n, cell.coordinates.y + 1),
    }),
    { m: 0, n: 0 }
  );

export const generateSucceedingGrid = () => [
  {
    items: [],
    coordinates: {
      x: 0,
      y: 0,
    },
  },
  {
    items: [],
    coordinates: {
      x: 1,
      y: 0,
    },
  },
  {
    items: [],
    coordinates: {
      x: 2,
      y: 0,
    },
  },
  {
    items: [],
    coordinates: {
      x: 3,
      y: 0,
    },
  },
  {
    items: [],
    coordinates: {
      x: 0,
      y: 1,
    },
  },
  {
    items: ['OBSTACLE'],
    coordinates: {
      x: 1,
      y: 1,
    },
  },
  {
    items: ['ROCK'],
    coordinates: {
      x: 2,
      y: 1,
    },
  },
  {
    items: [],
    coordinates: {
      x: 3,
      y: 1,
    },
  },
  {
    items: [],
    coordinates: {
      x: 0,
      y: 2,
    },
  },
  {
    items: ['R2D2'],
    coordinates: {
      x: 1,
      y: 2,
    },
  },
  {
    items: [],
    coordinates: {
      x: 2,
      y: 2,
    },
  },
  {
    items: [],
    coordinates: {
      x: 3,
      y: 2,
    },
  },
  {
    items: [],
    coordinates: {
      x: 0,
      y: 3,
    },
  },
  {
    items: ['TELEPORTAL'],
    coordinates: {
      x: 1,
      y: 3,
    },
  },
  {
    items: ['PAD'],
    coordinates: {
      x: 2,
      y: 3,
    },
  },
  {
    items: [],
    coordinates: {
      x: 3,
      y: 3,
    },
  },
];

export const generateSucceedingGridRockOnTel = () => [
  {
    items: [],
    coordinates: {
      x: 0,
      y: 0,
    },
  },
  {
    items: ['R2D2'],
    coordinates: {
      x: 1,
      y: 0,
    },
  },
  {
    items: ['OBSTACLE'],
    coordinates: {
      x: 2,
      y: 0,
    },
  },
  {
    items: ['OBSTACLE'],
    coordinates: {
      x: 3,
      y: 0,
    },
  },
  {
    items: [],
    coordinates: {
      x: 0,
      y: 1,
    },
  },
  {
    items: [],
    coordinates: {
      x: 1,
      y: 1,
    },
  },
  {
    items: ['OBSTACLE'],
    coordinates: {
      x: 2,
      y: 1,
    },
  },
  {
    items: [],
    coordinates: {
      x: 3,
      y: 1,
    },
  },
  {
    items: [],
    coordinates: {
      x: 0,
      y: 2,
    },
  },
  {
    items: ['TELEPORTAL'],
    coordinates: {
      x: 1,
      y: 2,
    },
  },
  {
    items: ['ROCK'],
    coordinates: {
      x: 2,
      y: 2,
    },
  },
  {
    items: [],
    coordinates: {
      x: 3,
      y: 2,
    },
  },
  {
    items: [],
    coordinates: {
      x: 0,
      y: 3,
    },
  },
  {
    items: ['PAD'],
    coordinates: {
      x: 1,
      y: 3,
    },
  },
  {
    items: [],
    coordinates: {
      x: 2,
      y: 3,
    },
  },
  {
    items: [],
    coordinates: {
      x: 3,
      y: 3,
    },
  },
];

export const generateSucceedingGridPushRocksOnPads = () => [
  {
    items: [],
    coordinates: {
      x: 0,
      y: 0,
    },
  },
  {
    items: [],
    coordinates: {
      x: 1,
      y: 0,
    },
  },
  {
    items: ['ROCK'],
    coordinates: {
      x: 2,
      y: 0,
    },
  },
  {
    items: ['PAD'],
    coordinates: {
      x: 3,
      y: 0,
    },
  },
  {
    items: [],
    coordinates: {
      x: 0,
      y: 1,
    },
  },
  {
    items: [],
    coordinates: {
      x: 1,
      y: 1,
    },
  },
  {
    items: ['ROCK'],
    coordinates: {
      x: 2,
      y: 1,
    },
  },
  {
    items: [],
    coordinates: {
      x: 3,
      y: 1,
    },
  },
  {
    items: ['PAD'],
    coordinates: {
      x: 0,
      y: 2,
    },
  },
  {
    items: ['PAD'],
    coordinates: {
      x: 1,
      y: 2,
    },
  },
  {
    items: ['ROCK'],
    coordinates: {
      x: 2,
      y: 2,
    },
  },
  {
    items: [],
    coordinates: {
      x: 3,
      y: 2,
    },
  },
  {
    items: ['OBSTACLE'],
    coordinates: {
      x: 0,
      y: 3,
    },
  },
  {
    items: [],
    coordinates: {
      x: 1,
      y: 3,
    },
  },
  {
    items: ['R2D2'],
    coordinates: {
      x: 2,
      y: 3,
    },
  },
  {
    items: ['TELEPORTAL'],
    coordinates: {
      x: 3,
      y: 3,
    },
  },
];

export const generateAwesomeGrid = () => [
  {
    items: ['R2D2'],
    coordinates: {
      x: 0,
      y: 0,
    },
  },
  {
    items: [],
    coordinates: {
      x: 1,
      y: 0,
    },
  },
  {
    items: [],
    coordinates: {
      x: 2,
      y: 0,
    },
  },
  {
    items: [],
    coordinates: {
      x: 3,
      y: 0,
    },
  },
  {
    items: [],
    coordinates: {
      x: 4,
      y: 0,
    },
  },
  {
    items: [],
    coordinates: {
      x: 5,
      y: 0,
    },
  },
  {
    items: ['OBSTACLE'],
    coordinates: {
      x: 0,
      y: 1,
    },
  },
  {
    items: [],
    coordinates: {
      x: 1,
      y: 1,
    },
  },
  {
    items: ['PAD'],
    coordinates: {
      x: 2,
      y: 1,
    },
  },
  {
    items: ['TELEPORTAL'],
    coordinates: {
      x: 3,
      y: 1,
    },
  },
  {
    items: ['OBSTACLE'],
    coordinates: {
      x: 4,
      y: 1,
    },
  },
  {
    items: ['OBSTACLE'],
    coordinates: {
      x: 5,
      y: 1,
    },
  },
  {
    items: [],
    coordinates: {
      x: 0,
      y: 2,
    },
  },
  {
    items: [],
    coordinates: {
      x: 1,
      y: 2,
    },
  },
  {
    items: [],
    coordinates: {
      x: 2,
      y: 2,
    },
  },
  {
    items: ['OBSTACLE'],
    coordinates: {
      x: 3,
      y: 2,
    },
  },
  {
    items: [],
    coordinates: {
      x: 4,
      y: 2,
    },
  },
  {
    items: ['OBSTACLE'],
    coordinates: {
      x: 5,
      y: 2,
    },
  },
  {
    items: [],
    coordinates: {
      x: 0,
      y: 3,
    },
  },
  {
    items: ['ROCK'],
    coordinates: {
      x: 1,
      y: 3,
    },
  },
  {
    items: ['ROCK'],
    coordinates: {
      x: 2,
      y: 3,
    },
  },
  {
    items: [],
    coordinates: {
      x: 3,
      y: 3,
    },
  },
  {
    items: [],
    coordinates: {
      x: 4,
      y: 3,
    },
  },
  {
    items: ['OBSTACLE'],
    coordinates: {
      x: 5,
      y: 3,
    },
  },
  {
    items: ['OBSTACLE'],
    coordinates: {
      x: 0,
      y: 4,
    },
  },
  {
    items: [],
    coordinates: {
      x: 1,
      y: 4,
    },
  },
  {
    items: [],
    coordinates: {
      x: 2,
      y: 4,
    },
  },
  {
    items: ['PAD'],
    coordinates: {
      x: 3,
      y: 4,
    },
  },
  {
    items: [],
    coordinates: {
      x: 4,
      y: 4,
    },
  },
  {
    items: [],
    coordinates: {
      x: 5,
      y: 4,
    },
  },
];
