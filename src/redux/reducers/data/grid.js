/** @flow */

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GRID':
      return action.grid;
    default:
      return state;
  }
};
