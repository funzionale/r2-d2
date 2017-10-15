/** @flow */

import type { Operator } from '../flow';

const NORTH: Operator = { name: 'NORTH', cost: 1 };
const SOUTH: Operator = { name: 'SOUTH', cost: 1 };
const EAST: Operator = { name: 'EAST', cost: 1 };
const WEST: Operator = { name: 'WEST', cost: 1 };

const operators = [NORTH, SOUTH, EAST, WEST];

export default operators;
