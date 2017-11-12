/** @flow */

import _ from 'lodash';
import { items } from '.';

import type { Cell, Coordinates, Dimensions, Item } from '../flow';

const constructCell: (?Item) => Coordinates => Cell = item => coordinates => ({
  items: item ? [item] : [],
  coordinates,
});

export const constructGrid: Dimensions => Array<Coordinates> = ({ m, n }) =>
  _.chain(new Array(m))
    .fill(new Array(n))
    .map((innerArray, outerArrayIndex) =>
      _.chain(innerArray)
        .fill(0)
        .map((_, innerArrayIndex) => ({
          x: outerArrayIndex,
          y: innerArrayIndex,
        }))
        .value()
    )
    .flattenDeep()
    .sortBy(['y', 'x'])
    .value();

export const populateGrid: (
  Array<Coordinates>
) => Array<Cell> = coordinates => {
  const unallocatedGrid: Array<Coordinates> = _.cloneDeep(coordinates);
  let allocatedGrid: Array<Cell> = [];
  let randomCoordinates: Coordinates | null = null;
  let randomIndex: number = 0;
  let count: number = 0;

  randomIndex = Math.floor(_.random(0, unallocatedGrid.length - 1));
  [randomCoordinates] = _.pullAt(unallocatedGrid, randomIndex);

  allocatedGrid = allocatedGrid.concat(
    constructCell(items.R2D2)(randomCoordinates)
  );

  randomIndex = Math.floor(_.random(0, unallocatedGrid.length - 1));
  [randomCoordinates] = _.pullAt(unallocatedGrid, randomIndex);

  allocatedGrid = allocatedGrid.concat(
    constructCell(items.TELEPORTAL)(randomCoordinates)
  );

  count = Math.floor(_.random(1, Math.floor(unallocatedGrid.length / 4)));

  for (var i = 0; i < count; i++) {
    randomIndex = Math.floor(_.random(0, unallocatedGrid.length - 1));
    [randomCoordinates] = _.pullAt(unallocatedGrid, randomIndex);

    allocatedGrid = allocatedGrid.concat(
      constructCell(items.PAD)(randomCoordinates)
    );

    randomIndex = Math.floor(_.random(0, unallocatedGrid.length - 1));
    [randomCoordinates] = _.pullAt(unallocatedGrid, randomIndex);

    allocatedGrid = allocatedGrid.concat(
      constructCell(items.ROCK)(randomCoordinates)
    );
  }

  count = Math.floor(_.random(0, unallocatedGrid.length / 2));

  for (i = 0; i < count; i++) {
    randomIndex = Math.floor(_.random(0, unallocatedGrid.length - 1));
    [randomCoordinates] = _.pullAt(unallocatedGrid, randomIndex);

    allocatedGrid = allocatedGrid.concat(
      constructCell(items.OBSTACLE)(randomCoordinates)
    );
  }

  allocatedGrid = allocatedGrid.concat(unallocatedGrid.map(constructCell()));
  allocatedGrid = _.sortBy(allocatedGrid, ['coordinates.y', 'coordinates.x']);

  return allocatedGrid;
};

export const generateRandomGrid = () => {
  const gridDimensions: Dimensions = {
    m: _.random(3, 6),
    n: _.random(3, 6),
  };

  const unallocatedGrid: Array<Coordinates> = constructGrid(gridDimensions);
  const allocatedGrid: Array<Cell> = populateGrid(unallocatedGrid);

  return allocatedGrid;
};
