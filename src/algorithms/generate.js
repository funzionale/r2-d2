import _ from 'lodash';

const types = {
  EMPTY: 'empty',
  R2D2: 'r2d2',
  TELEPORTAL: 'teleportal',
  OBSTACLE: 'obstacle',
  ROCK: 'rock',
  PAD: 'pad',
};

/** @TODO: Decide on appropriate item object structure */
const constructItem = ({ coordinates, type }) => ({ ...coordinates, type });

const pickRandomArrayIndex = array => _.random(0, array.length - 1);

/** @FIXME: Find immutable alternative for splice() */
const removeFromArray = (array, index) => array.splice(index, index + 1)[0];

export const generateRandomGrid = () => {
  // const gridDimensions = {
  //   m: _.random(5, 10),
  //   n: _.random(5, 10),
  // };

  const gridDimensions = {
    m: 3,
    n: 3,
  };

  let unallocatedGridCoordinates = new Array(
    gridDimensions.m * gridDimensions.n,
  )
    .fill(0)
    .map((_, index) => ({
      type: types.EMPTY,
      x: index % gridDimensions.m,
      y: index % gridDimensions.n,
    }));

  unallocatedGridCoordinates = _.orderBy(
    unallocatedGridCoordinates,
    ['x'],
    ['asc'],
  );

  let allocatedGridCoordinates = [];
  let randomIndex = 0;
  let randomlyRemovedCoordinates = {};

  randomIndex = pickRandomArrayIndex(unallocatedGridCoordinates);
  randomlyRemovedCoordinates = removeFromArray(
    unallocatedGridCoordinates,
    randomIndex,
  );

  allocatedGridCoordinates = allocatedGridCoordinates.concat(
    constructItem({
      coordinates: randomlyRemovedCoordinates,
      type: types.R2D2,
    }),
  );

  randomIndex = pickRandomArrayIndex(unallocatedGridCoordinates);
  randomlyRemovedCoordinates = removeFromArray(
    unallocatedGridCoordinates,
    randomIndex,
  );

  allocatedGridCoordinates = allocatedGridCoordinates.concat(
    constructItem({
      coordinates: randomlyRemovedCoordinates,
      type: types.TELEPORTAL,
    }),
  );

  /**
   * Constraints:
   *   • Items count cannot be greater than grid cell count
   *   • Items cannot overlap on the same cells
   */

  return allocatedGridCoordinates;
};
