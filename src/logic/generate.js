/** @flow */

import _ from 'lodash';
import { types } from '.';

type Dimensions = {
  m: number,
  n: number,
};

type Coordinates = {
  x: number,
  y: number,
};

const constructItem = (type: string) => (coordinates: Coordinates) => ({
  ...coordinates,
  type,
});

export const constructGrid = ({ m, n }: Dimensions) =>
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

export const populateGrid = (unallocatedGrid: Array<Coordinates>) => {
  let allocatedGridCoordinates = [];
  let randomIndex = 0;
  let count = 0;
  let item = {};

  randomIndex = Math.floor(_.random(0, unallocatedGrid.length - 1));
  item = _.pullAt(unallocatedGrid, [randomIndex])[0];

  allocatedGridCoordinates = allocatedGridCoordinates.concat(
    constructItem(types.R2D2)(item)
  );

  randomIndex = Math.floor(_.random(0, unallocatedGrid.length - 1));
  item = _.pullAt(unallocatedGrid, [randomIndex])[0];

  allocatedGridCoordinates = allocatedGridCoordinates.concat(
    constructItem(types.TELEPORTAL)(item)
  );

  count = Math.floor(_.random(1, Math.floor(unallocatedGrid.length / 2)));

  for (var i = 0; i < count; i++) {
    randomIndex = Math.floor(_.random(0, unallocatedGrid.length - 1));
    item = _.pullAt(unallocatedGrid, [randomIndex])[0];

    allocatedGridCoordinates = allocatedGridCoordinates.concat(
      constructItem(types.PAD)(item)
    );

    randomIndex = Math.floor(_.random(0, unallocatedGrid.length - 1));
    item = _.pullAt(unallocatedGrid, [randomIndex])[0];

    allocatedGridCoordinates = allocatedGridCoordinates.concat(
      constructItem(types.ROCK)(item)
    );
  }

  count = Math.floor(_.random(0, unallocatedGrid.length));

  for (i = 0; i < count; i++) {
    randomIndex = Math.floor(_.random(0, unallocatedGrid.length - 1));
    item = _.pullAt(unallocatedGrid, [randomIndex])[0];

    allocatedGridCoordinates = allocatedGridCoordinates.concat(
      constructItem(types.OBSTACLE)(item)
    );
  }

  count = unallocatedGrid.length;

  for (i = 0; i < count; i++) {
    item = _.pullAt(unallocatedGrid, [0])[0];
    allocatedGridCoordinates = allocatedGridCoordinates.concat(item);
  }

  allocatedGridCoordinates = _.orderBy(
    allocatedGridCoordinates,
    ['y', 'x'],
    ['asc', 'asc']
  );

  return allocatedGridCoordinates;
};

export const generateRandomGrid = () => {
  const FIXME_LATER = _.random(5, 10);
  const gridDimensions = {
    m: FIXME_LATER,
    n: FIXME_LATER,
  };

  // const gridDimensions = {
  //   m: 3,
  //   n: 3,
  // };

  const unallocatedGrid = constructGrid(gridDimensions).map(
    constructItem(types.EMPTY)
  );

  const allocatedGrid = populateGrid(unallocatedGrid);

  return allocatedGrid;
};
