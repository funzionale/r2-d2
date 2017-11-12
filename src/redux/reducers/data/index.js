/** @flow */

import { combineReducers } from 'redux';
import grid from './grid';
import knowledgeBase from './knowledgeBase';

export default combineReducers({
  grid,
  knowledgeBase,
});
