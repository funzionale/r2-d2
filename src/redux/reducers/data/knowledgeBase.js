/** @flow */

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_KNOWLEDGE_BASE':
      return action.facts;
    case 'APPEND_TO_KNOWLEDGE_BASE':
      return initialState.concat(action.facts);
    default:
      return state;
  }
};
