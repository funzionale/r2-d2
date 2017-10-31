/** @flow */

import _ from 'lodash';
import { store, actionCreators } from './redux';
import {
  generateRandomGrid,
  operators,
  items,
  breadthFirst,
  depthFirst,
  uniformCost,
  deepeningSearch,
  greedySearch,
  aStarSearch,
  retrace,
  doesCellContainItem,
  findCellByItem,
  filterCellsByItem,
  moveR2D2,
  isTeleportalActivated,
  sleep,
  generateAwesomeGrid,
} from './logic';

import type {
  Cell,
  Node,
  Problem,
  State,
  Operator,
  StateWithOperator,
} from './flow';

const stateSpace: (State, Array<Operator>) => Array<StateWithOperator> = (
  state,
  operators
) => {
  let possibleNextStatesWithOperators: Array<StateWithOperator> = [];

  operators.forEach(appliedOperator => {
    const newGrid: Array<Cell> = moveR2D2(state.grid, appliedOperator.name);

    if (
      /** Is there a state change? */
      !_.isEqual(state.grid, newGrid) ||
      isTeleportalActivated(newGrid) !== state.isTeleportalActivated
    ) {
      const possibleNextState: State = {
        grid: newGrid,
        isTeleportalActivated:
          Boolean(newGrid) && isTeleportalActivated(newGrid),
      };

      const possibleStateWithOperator: StateWithOperator = {
        state: possibleNextState,
        operator: appliedOperator,
      };

      possibleNextStatesWithOperators = possibleNextStatesWithOperators.concat(
        possibleStateWithOperator
      );
    }
  });

  return possibleNextStatesWithOperators;
};

const goalTest: State => boolean = state => {
  const teleportalCell: Cell | void = findCellByItem(
    state.grid,
    items.TELEPORTAL
  );

  return Boolean(
    teleportalCell &&
      doesCellContainItem(teleportalCell, items.R2D2) &&
      state.isTeleportalActivated
  );
};

const pathCost: (Array<Operator | null>) => number = operators =>
  operators.reduce((accumulator, operator) => accumulator + operator.cost, 0);

/** block distance to teleportal */
export const heuristic1: Node => number = node => {
  const state = node.state;
  const r2d2Cell: Cell | void = findCellByItem(state.grid, items.R2D2);
  const teleportalCell: Cell | void = findCellByItem(
    state.grid,
    items.TELEPORTAL
  );
  if (r2d2Cell && teleportalCell) {
    return (
      Math.abs(r2d2Cell.coordinates.x - teleportalCell.coordinates.x) +
      Math.abs(r2d2Cell.coordinates.y - teleportalCell.coordinates.y)
    );
  }
  return 0;
};

/** block distance to teleportal + rocks numberleft*/
export const heuristic2: Node => number = node =>
  heuristic1(node) +
  filterCellsByItem(node.state.grid, items.PAD).filter(
    cell => !doesCellContainItem(cell, items.ROCK)
  ).length;

/** rocks numberleft*/
export const heuristic3: Node => number = node =>
  filterCellsByItem(node.state.grid, items.PAD).filter(
    cell => !doesCellContainItem(cell, items.ROCK)
  ).length;

const populateInitialGrid: (Array<Cell>) => void = grid =>
  store.dispatch(actionCreators.setGrid(grid));

const visualizeFunc: (
  Array<StateWithOperator>
) => Promise<void> = async retraced => {
  for (let i = 0; i < retraced.length; i++) {
    await sleep(300);
    store.dispatch(actionCreators.setGrid(retraced[i].state.grid));
  }
  console.log('✅ A solution was found!');
};

export default () => {
  const randomlyGeneratedGrid: Array<Cell> = generateRandomGrid();
  // const randomlyGeneratedGrid: Array<Cell> = generateAwesomeGrid();

  const initialState: State = {
    grid: randomlyGeneratedGrid,
    isTeleportalActivated: false,
  };

  const problem: Problem = {
    operators,
    initialState,
    stateSpace,
    goalTest,
    pathCost,
  };

  populateInitialGrid(randomlyGeneratedGrid);

  console.log(
    '🔎 Search started\n0️⃣ Initial state:\n',
    JSON.stringify(problem.initialState, null, 2)
  );

  const goalNode: Node | null = breadthFirst(problem);
  // const goalNode: Node | null = uniformCost(problem);
  // const goalNode: Node | null = depthFirst(problem);
  // const goalNode: Node | null = deepeningSearch(problem);
  // const goalNode: Node | null = greedySearch(problem, heuristic1);
  // const goalNode: Node | null = aStarSearch(problem, heuristic1);
  console.log('🔎 Search ended!');

  if (goalNode) {
    const retraced: Array<StateWithOperator> = retrace(goalNode);
    // console.log('✅ A solution was found!\n', JSON.stringify(retraced));
    visualizeFunc(retraced);
  } else {
    console.log(
      '⛔ A solution for this problem using the specified queueing function cannot be found.'
    );
  }
};
