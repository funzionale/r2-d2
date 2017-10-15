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
  generalSearch,
  enqueueAtFront,
  enqueueAtEnd,
  orderedInsert,
  retrace,
  doesCellContainItem,
  findCellByItem,
  moveR2D2,
  isTeleportalActivated,
} from './logic';

import type {
  Cell,
  Node,
  Problem,
  State,
  Operator,
  StateHistory,
} from './flow';

class App extends Component<void, void> {
  store = {};

  constructor() {
    super();
    this.store = createStore(rootReducer);
  }

  componentDidMount() {
    const randomlyGeneratedGrid: Array<Cell> = generateRandomGrid();
    this.store.dispatch(actionCreators.setGrid(randomlyGeneratedGrid));

    const stateSpace: (State, Array<Operator>) => Array<StateHistory> = (
      state,
      operators
    ) => {
      let possibleStateHistories = [];

      operators.forEach(operator => {
        const grid: Array<Cell> | null = moveR2D2(state.grid, operator.name);
        if (grid) {
          possibleStateHistories = possibleStateHistories.concat({
            state: {
              grid,
              isTeleportalActivated: isTeleportalActivated(grid),
            },
            operator,
          });
        }
      });

      return possibleStateHistories;
    };

    const problem: Problem = {
      operators,
      initialState: {
        grid: randomlyGeneratedGrid,
        isTeleportalActivated: false,
      },
      stateSpace,
      goalTest: state => {
        const teleportalCell = findCellByItem(state.grid, 'TELEPORTAL');
        return Boolean(
          teleportalCell &&
            doesCellContainItem(teleportalCell, 'R2D2') &&
            state.isTeleportalActivated
        );
      },
      pathCost: operators =>
        operators.reduce(
          (accumulator, operator) => accumulator + operator.cost,
          0
        ),
    };

    console.log(
      '🔎 Search started\n0️⃣ Initial state:\n',
      JSON.stringify(problem.initialState, null, 2)
    );
    // const goalNode: Node | null = generalSearch(problem, enqueueAtFront);
    const goalNode: Node | null = generalSearch(problem, enqueueAtEnd);
    // const goalNode: Node | null = generalSearch(problem, orderedInsert);
    console.log('🔎 Search ended!');

    if (goalNode) {
      const operatorsSequence: Array<Operator> = retrace(goalNode);
      console.log(
        '✅ A solution was found!\n',
        JSON.stringify(operatorsSequence)
      );
    } else {
      console.log(
        '⛔ A solution for this problem using the specified queueing function cannot be found.'
      );
    }
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
