/** @flow */

import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { rootReducer, actionCreators } from './redux';
import { generateRandomGrid } from './logic';
import { Grid } from './components';

class App extends Component {
  constructor() {
    super();
    this.store = createStore(rootReducer);
  }

  componentDidMount() {
    this.store.dispatch(actionCreators.setGrid(generateRandomGrid()));
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
