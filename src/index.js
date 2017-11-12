/** @flow */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { store } from './redux';
import { Grid } from './components';
import runApp from './App';

class App extends Component<void> {
  componentDidMount() {
    runApp();
  }

  render() {
    return (
      <Provider store={store}>
        <Grid />
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
