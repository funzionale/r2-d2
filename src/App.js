/* @flow */

import _ from 'lodash';

import { store, actionCreators } from './redux';
import {
  generateRandomGrid,
  generateAwesomeGrid,
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
} from './logic';

import type {
  Cell,
  Node,
  Problem,
  State,
  Operator,
  StateWithOperator,
  QFunc,
  SearchReturn,
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

  type Search = (
    Array<Cell>,
    QFunc,
    boolean
  ) => {
    statesWithOperators: Array<StateWithOperator>,
    pathCost: number,
    nodesCount: number,
  } | null;

  const search: Search = (grid, strategy, visualize) => {
    if (visualize) {
      populateInitialGrid(randomlyGeneratedGrid);
    }

    let result: SearchReturn = { goalNode: null, expansionsCount: 0 };

    switch (strategy) {
      case 'BF':
        result = breadthFirst(problem);
        break;
      case 'DF':
        result = depthFirst(problem);
        break;
      case 'UC':
        result = uniformCost(problem);
        break;
      case 'ID':
        result = deepeningSearch(problem);
        break;
      case 'GR1':
        result = greedySearch(problem, heuristic1);
        break;
      case 'GR2':
        result = greedySearch(problem, heuristic2);
        break;
      case 'AS1':
        result = aStarSearch(problem, heuristic1);
        break;
      case 'AS2':
        result = aStarSearch(problem, heuristic3);
        break;
      default:
        return null;
    }

    if (result.goalNode) {
      const retraced: Array<StateWithOperator> = retrace(result.goalNode);

      if (visualize) {
        visualizeFunc(retraced);
      }

      return {
        statesWithOperators: retraced,
        pathCost: Number(result.goalNode && result.goalNode.pathCost),
        nodesCount: result.expansionsCount,
      };
    }
    console.log(
      '⛔ A solution for this problem using the specified queueing function cannot be found.'
    );
    return null;
  };

  console.log(
    '🔎 Search started\n0️⃣ Initial state:\n',
    JSON.stringify(problem.initialState, null, 2)
  );

  search(randomlyGeneratedGrid, 'BF', true);
  // search(randomlyGeneratedGrid, 'DF', true);
  // search(randomlyGeneratedGrid, 'UC', true);
  // search(randomlyGeneratedGrid, 'ID', true);
  // search(randomlyGeneratedGrid, 'GR1', true);
  // search(randomlyGeneratedGrid, 'GR2', true);
  // search(randomlyGeneratedGrid , 'AS1', true);
  // search(randomlyGeneratedGrid, 'AS2', true);
};
