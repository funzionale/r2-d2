/** @flow */

import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash';
import { rootReducer, actionCreators } from './redux';
import { generateRandomGrid } from './logic';
import { Grid } from './components';
import { generalSearch } from './logic';

class App extends Component<void, void> {
  store = {};

  constructor() {
    super();
    this.store = createStore(rootReducer);
  }

  // TODO: moveItem()

  componentDidMount() {
    const grid = generateRandomGrid();
    // this.store.dispatch(actionCreators.setGrid(grid));
    const problem = {
      operators: ['NORTH', 'EAST', 'SOUTH', 'WEST', 'PUSH'],
      initialState: grid,
      stateSpace: function(state, actions) {
        const newState = _.cloneDeep(state);

        const oldPosition = state.find(function(item) {
          return item.type === 'R2D2';
        });

        let newPosition;

        actions.forEach(function(action) {
          switch (action.action) {
            // according to the action and grid data or the stateSpace
            // TODO: Convert type to types[0]
            case 'NORTH':
              newPosition = state.find(function(item) {
                return item.x === oldPosition.x && item.y === oldPosition.y - 1;
              });
              if (
                oldPosition.y !== 0 &&
                newPosition.type !== 'OBSTACLE' &&
                newPosition.type !== 'ROCK'
              ) {
                newState.find(item => item.type === 'R2D2').type = 'EMPTY';
                newState.find(
                  item => newPosition.x === item.x && newPosition.y === item.y
                ).type =
                  'R2D2';
              }
              break;
            case 'EAST':
              newPosition = state.find(function(item) {
                return item.x === oldPosition.x + 1 && item.y === oldPosition.y;
              });
              break;
            case 'SOUTH':
              newPosition = state.find(function(item) {
                return item.x === oldPosition.x && item.y === oldPosition.y + 1;
              });
              break;
            case 'WEST':
              newPosition = state.find(function(item) {
                return item.x === oldPosition.x - 1 && item.y === oldPosition.y;
              });
              break;
            case 'PUSH':
              // Identify pushing direction
              // Disallow if not rock
              // Disallow if at corner or pushing against edge
              break;
            default:
              return state;
          }
        }, this);
      },
      goalTest: function() {},
      pathCost: function() {},
    };
    // const node = generalSearch(problem, () => {});
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
