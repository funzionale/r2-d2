import _ from 'lodash';

const types = {
  EMPTY: 'EMPTY',
  R2D2: 'R2D2',
  TELEPORTAL: 'TELEPORTAL',
  OBSTACLE: 'OBSTACLE',
  ROCK: 'ROCK',
  PAD: 'PAD',
};

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

export const allocateGridCells = (unallocatedGrid) => {
    let allocatedGridCoordinates = [];
    let randomIndex = 0;
    let count = 0;
    
    randomIndex =  Math.floor(_.random(0, unallocatedGrid.length - 1));

    allocatedGridCoordinates = allocatedGridCoordinates.concat( constructItem({
      coordinates: _.pullAt(unallocatedGrid, [randomIndex])[0],
      type: types.R2D2
    }));
    
    randomIndex =  Math.floor(_.random(0, unallocatedGrid.length - 1));

    allocatedGridCoordinates = allocatedGridCoordinates.concat( constructItem({
      coordinates: _.pullAt(unallocatedGrid, [randomIndex])[0],
      type: types.TELEPORTAL
    }));

    count =  Math.floor(_.random(1, Math.floor(unallocatedGrid.length/2)));

    for (var i = 0; i < count; i++){
      randomIndex =  Math.floor(_.random(0, unallocatedGrid.length - 1));

      allocatedGridCoordinates = allocatedGridCoordinates.concat( constructItem({
      coordinates: _.pullAt(unallocatedGrid, [randomIndex])[0],
      type: types.PAD
      }));
     
      randomIndex =  Math.floor(_.random(0, unallocatedGrid.length - 1));

      allocatedGridCoordinates = allocatedGridCoordinates.concat( constructItem({
        coordinates: _.pullAt(unallocatedGrid, [randomIndex])[0],
        type: types.ROCK
      }));
    }

    count =  Math.floor(_.random(0, unallocatedGrid.length));

    for (i = 0; i < count; i++){
      randomIndex =  Math.floor(_.random(0, unallocatedGrid.length - 1));

      allocatedGridCoordinates = allocatedGridCoordinates.concat( constructItem({
      coordinates: _.pullAt(unallocatedGrid, [randomIndex])[0],
      type: types.OBSTACLE
      }));
    }

    unallocatedGrid.forEach(function(element) {
      allocatedGridCoordinates = allocatedGridCoordinates.concat(element);
      _.pull(unallocatedGrid, element);
    },this);

    return allocatedGridCoordinates;
}

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

  const allocateGrid = allocateGridCells(unallocatedGrid);

  console.log(allocateGrid);
   
   /**
   * Constraints:
   *   • Items count cannot be greater than grid cell count
   *   • Items cannot overlap on the same cells
   */
};
