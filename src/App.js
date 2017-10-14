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

import type { Cell, Node, Problem, StateHistory } from './flow';

class App extends Component<void, void> {
  store = {};

  constructor() {
    super();
    this.store = createStore(rootReducer);
  }

  componentDidMount() {
    // @FIXME
    const m = 3;
    const n = 3;

    const randomlyGeneratedGrid: Array<Cell> = generateRandomGrid();
    this.store.dispatch(actionCreators.setGrid(randomlyGeneratedGrid));

    const stateSpace = (state, operators): Array<StateHistory> =>
      operators
        .map(operator => {
          const grid = moveR2D2(state.grid, operator.name);
          if (!grid) {
            return null;
          }

          return {
            state: {
              grid,
              isTeleportalActivated: isTeleportalActivated(grid),
            },
            operator,
          };
        })
        .filter(state => !_.isNull(state));

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
    const goalNode: Node | null = generalSearch(problem, enqueueAtFront);
    console.log('🔎 Search ended!');
    // const goalNode = generalSearch(problem, enqueueAtEnd);
    // const goalNode = generalSearch(problem, orderedInsert);

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
