/** @flow */

import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
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

  componentDidMount() {
    const grid = generateRandomGrid();
    this.store.dispatch(actionCreators.setGrid(grid));
    const problem = {
      operators: ['NORTH', 'EAST', 'SOUTH', 'WEST', 'PUSH'],
      initialState: grid,
    };
    const node = generalSearch(problem);
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
