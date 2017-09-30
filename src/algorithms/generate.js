import _ from 'lodash';

const types = {
  EMPTY: 'EMPTY',
  R2D2: 'R2D2',
  TELEPORTAL: 'TELEPORTAL',
  OBSTACLE: 'OBSTACLE',
  ROCK: 'ROCK',
  PAD: 'PAD',
};

const pickRandomIndex = array => _.random(0, array.length - 1);
const constructItem = type => coordinates => ({ ...coordinates, type });

export const constructGrid = ({ m, n }) =>
  _.chain(new Array(m))
    .fill(new Array(n))
    .map((innerArray, outerArrayIndex) =>
      _.chain(innerArray)
        .fill(0)
        .map((_, innerArrayIndex) => ({
          x: outerArrayIndex,
          y: innerArrayIndex,
        }))
        .value(),
    )
    .flattenDeep()
    .sortBy(['y', 'x'])
    .value();

/** Work-In-Progress */
export const generateRandomGrid = () => {
  // const gridDimensions = {
  //   m: _.random(5, 10),
  //   n: _.random(5, 10),
  // };

  const gridDimensions = {
    m: 3,
    n: 3,
  };

  const unallocatedGrid = constructGrid(gridDimensions).map(
    constructItem(types.EMPTY),
  );

  console.log(unallocatedGrid);

   /**
   * @TODO: Generate items & randomly assign them to grid cells
   * 
   * Constraints:
   *   • Items count cannot be greater than grid cell count
   *   • Items cannot overlap on the same cells
   */
};
