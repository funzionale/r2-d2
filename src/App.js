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
  generalSearch,
  enqueueAtFront,
  enqueueAtEnd,
  orderedInsert,
  retrace,
  doesCellContainItem,
  findCellByItem,
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
} from './flow';

class App extends Component<void, void> {
  store = {};

  constructor() {
    super();
    this.store = createStore(rootReducer);
  }

  async componentDidMount() {
    const randomlyGeneratedGrid: Array<Cell> = generateRandomGrid();
    this.store.dispatch(actionCreators.setGrid(randomlyGeneratedGrid));

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
            isTeleportalActivated: isTeleportalActivated(newGrid),
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
      operators.reduce(
        (accumulator, operator) => accumulator + operator.cost,
        0
      );

    // const ops = _.cloneDeep(operators);
    // ops[0].cost = 2;
    // ops[1].cost =2;
    const problem: Problem = {
      operators,
      initialState,
      stateSpace,
      goalTest,
      pathCost,
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
      await sleep();

      this.store.dispatch(actionCreators.setGrid(goalNode.state.grid));

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
