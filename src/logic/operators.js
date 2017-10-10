/** @flow */

import type { Operator } from '../flow';

// @TODO: Convert to objects of { name, cost }

const NORTH: Operator = 'NORTH';
const SOUTH: Operator = 'SOUTH';
const EAST: Operator = 'EAST';
const WEST: Operator = 'WEST';

const operators = { NORTH, SOUTH, EAST, WEST };

export default operators;
