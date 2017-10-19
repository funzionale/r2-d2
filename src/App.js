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
  Coordinates,
  Node,
  Problem,
  State,
  Operator,
  StateWithOperator,
  QFunc,
} from './flow';

const runApp: ((any) => void) => Promise<void> = async dispatch => {
  const randomlyGeneratedGrid: Array<Cell> = generateRandomGrid();
  // dispatch(actionCreators.setGrid(randomlyGeneratedGrid));
  // dispatch(actionCreators.setGrid(randomlyGeneratedGrid));

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
  const heuristic: Node => number = node => {
    const state = node.state;
    const r2d2Cell: Cell | void = findCellByItem(state.grid, 'R2D2');
    const teleportalCell: Cell | void = findCellByItem(
      state.grid,
      'TELEPORTAL'
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
    heuristic(node) +
    filterCellsByItem(node.state.grid, items.PAD).filter(
      cell => !doesCellContainItem(cell, items.ROCK)
    ).length;

  const search: (
    Array<Cell>,
    QFunc,
    boolean
  ) => Array<StateWithOperator> | null = (grid, strategy, visualize) => {
    let goalNode: Node | null = null;
    // if (visualize)
    //   dispatch(actionCreators.setGrid(grid));
    switch (strategy) {
      case 'BF':
        goalNode = breadthFirst(problem);
        break;

      case 'DF':
        goalNode = depthFirst(problem);
        break;

      case 'UC':
        goalNode = uniformCost(problem);
        break;

      case 'ID':
        goalNode = deepeningSearch(problem);
        break;

      case 'GR1':
        goalNode = greedySearch(problem, heuristic);
        break;

      case 'GR2':
        goalNode = greedySearch(problem, heuristic2);
        break;

      case 'AS1':
        goalNode = aStarSearch(problem, heuristic);
        break;

      case 'AS2':
        goalNode = aStarSearch(problem, heuristic2);
        break;

      default:
        return null;
        break;
    }
    if (goalNode) {
      console.log(
        'Depth --> ',
        goalNode.depth,
        ' Path cost --> ',
        goalNode.pathCost
      );
      const retraced: Array<StateWithOperator> = retrace(goalNode);
      if (visualize) {
        for (let i = 0; i < retraced.length; i++) {
          //await sleep(500); //@FIXME
          dispatch(actionCreators.setGrid(retraced[i].state.grid));
        }
        console.log('✅ A solution was found!\n', JSON.stringify(retraced));
      }
      return retraced;
    } else {
      console.log(
        '⛔ A solution for this problem using the specified queueing function cannot be found.'
      );
    }
  };
  console.log(
    '🔎 Search started\n0️⃣ Initial state:\n',
    JSON.stringify(problem.initialState, null, 2)
  );
  //const goalNode: Node | null = breadthFirst(problem);
  // const goalNode: Node | null = uniformCost(problem);
  // const goalNode: Node | null = depthFirst(problem);
  // const goalNode: Node | null = deepeningSearch(problem);
  // const goalNode: Node | null = greedySearch(problem, heuristic);
  // const goalNode: Node | null = aStarSearch(problem, [heuristic]);
  //console.log('🔎 Search ended!');

  // if (goalNode) {
  //   const operatorsSequence: Array<StateWithOperator> = retrace(goalNode);

  //   for (let i = 0; i < operatorsSequence.length; i++) {
  //     await sleep(500);
  //     dispatch(actionCreators.setGrid(operatorsSequence[i].state.grid));
  //   }
  //   console.log('✅ A solution was found!\n', JSON.stringify(operatorsSequence));
  // } else {
  //   console.log(
  //     '⛔ A solution for this problem using the specified queueing function cannot be found.'
  //   );
  // }

  search(randomlyGeneratedGrid, 'AS1', true);
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
