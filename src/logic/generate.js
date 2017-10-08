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
  const unallocatedGrid = _.cloneDeep(coordinates);
  let allocatedGrid = [];
  let randomCoordinates = {};
  let randomIndex = 0;
  let count = 0;

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

  count = Math.floor(_.random(1, Math.floor(unallocatedGrid.length / 2)));

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

  count = Math.floor(_.random(0, unallocatedGrid.length));

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
  // const gridDimensions = {
  //   m: _.random(5, 10),
  //   n: _.random(5, 10),
  // };

  const gridDimensions = {
    m: 3,
    n: 3,
  };

  const unallocatedGrid = constructGrid(gridDimensions);
  const allocatedGrid = populateGrid(unallocatedGrid);

  return allocatedGrid;
};
