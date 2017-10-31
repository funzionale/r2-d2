/** @flow */

import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash';
import { rootReducer, actionCreators } from './redux';
import { Grid } from './components';
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
  generateSucceedingGrid,
  generateSucceedingGridRockOnTel,
  generateSucceedingGridPushRocksOnPads,
} from './logic';

import type {
  Cell,
  Node,
  Problem,
  State,
  Operator,
  StateWithOperator,
} from './flow';

const runApp: ((any) => void) => Promise<void> = async dispatch => {
  const randomlyGeneratedGrid: Array<Cell> = generateRandomGrid();
  dispatch(actionCreators.setGrid(randomlyGeneratedGrid));
  dispatch(actionCreators.setGrid(randomlyGeneratedGrid));

  const initialState: State = {
    grid: randomlyGeneratedGrid,
    isTeleportalActivated: false,
  };

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

  const pathCost: (Array<Operator>) => number = operators =>
    operators.reduce((accumulator, operator) => accumulator + operator.cost, 0);

  const problem: Problem = {
    operators,
    initialState,
    stateSpace,
    goalTest,
    pathCost,
  };

  /** block distance to teleportal */
  const heuristic1: Node => number = node => {
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
  const heuristic2: Node => number = node =>
    heuristic1(node) +
    filterCellsByItem(node.state.grid, items.PAD).filter(
      cell => !doesCellContainItem(cell, items.ROCK)
    ).length;

  /** rocks numberleft*/
  const heuristic3: Node => number = node =>
    filterCellsByItem(node.state.grid, items.PAD).filter(
      cell => !doesCellContainItem(cell, items.ROCK)
    ).length;

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
    const operatorsSequence: Array<StateWithOperator> = retrace(goalNode);

    for (let i = 0; i < operatorsSequence.length; i++) {
      await sleep(500);
      dispatch(actionCreators.setGrid(operatorsSequence[i].state.grid));
    }
    console.log('✅ A solution was found!\n', JSON.stringify(operatorsSequence));
  } else {
    console.log(
      '⛔ A solution for this problem using the specified queueing function cannot be found.'
    );
  }
};

class App extends Component<void, void> {
  store = {};

  constructor() {
    super();
    this.store = createStore(rootReducer);
  }

  componentDidMount() {
    runApp(this.store.dispatch);
  }

  render() {
    return (
      <Provider store={this.store}>
        <Grid />
      </Provider>
    );
  }
}

export default App;
