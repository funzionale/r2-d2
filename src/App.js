import React, { Component } from 'react';
import { generateRandomGrid } from './algorithms';

console.log('> generateRandomGrid() =>', generateRandomGrid());

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
