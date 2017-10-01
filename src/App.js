/** @flow */

import React, { Component } from 'react';
import { generateRandomGrid } from './logic';

console.log('> generateRandomGrid() =>', generateRandomGrid());

const add = (x, y) => x + y;

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello World</h1>
      </div>
    );
  }
}

export default App;
