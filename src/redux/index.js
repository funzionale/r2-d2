/* @flow */
import { createStore } from 'redux';

import rootReducer from './reducers';

export const store = createStore(rootReducer);
export { default as actionCreators } from './actionCreators';
