/** @flow */

export type Item = 'R2D2' | 'TELEPORTAL' | 'OBSTACLE' | 'ROCK' | 'PAD';

export type QFunc = 'BF' | 'DF' | 'UC' | 'ID' | 'GR1' | 'GR2' | 'AS1' | 'AS2';

export type Operator = {
  name: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST',
  cost: number,
};

export type Dimensions = {
  m: number, // Columns
  n: number, // Row
};

export type Coordinates = {
  x: number,
  y: number,
};

export type Cell = {
  items: Array<Item>,
  coordinates: Coordinates,
};

export type State = {
  grid: Array<Cell>,
  isTeleportalActivated: boolean,
};

export type StateWithOperator = {
  state: State,
  operator: Operator | null,
};

export type Node = {
  state: State,
  parent: Node | null,
  operator: Operator | null,
  depth: number,
  pathCost: number,
};

export type Problem = {
  operators: Array<Operator>,
  initialState: State,
  stateSpace: (State, Array<Operator>) => Array<StateWithOperator>,
  goalTest: State => boolean,
  pathCost: (Array<Operator>) => number,
};

export type QueueingFunction = (Array<Node>, Array<Node>) => Array<Node>;
