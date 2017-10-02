/** @flow */

import { actions } from '.';

type Action = {
  action: string,
};

type State = {
  delta: Array<Object>,
};

type Node = {
  state: State,
  parent: Node,
  operator: Action,
  depth: number,
  pathCost: number,
};

type Problem = {
  operators: Array<Action>,
  initialState: State,
  stateSpace: Array<State>,
  goalTest: State => boolean,
  pathCost: (Array<Action>) => number,
};

const initialState: Problem => State = problem => problem.initialState;

/** @TODO: Implement */
const expand: (Node, Array<Action>) => Array<Node> = (node, actionsArray) => {
  actionsArray.forEach(function(action) {
    switch (action.action) {
    // according to the action and grid data or the stateSpace
    }
  }, this);
};

const makeNode: State => Node = state => {
  let intialNode: Node = {
    state: state,
    parent: null,
    operator: null,
    depth: 0,
    pathCost: 0,
  };
  return intialNode;
};

const makeQueue: Node => Array<Node> = node => [node];

const goalTest: Problem => State => boolean = problem => problem.goalTest;

const state: Node => State = node => node.state;

const operation: Problem => Array<Action> = problem => problem.operators;

export const generalSearch = (
  problem: Problem,
  queueingFunc: (Array<Node>, Array<Node>) => Array<Node>
) => {
  let nodes = makeQueue(makeNode(initialState(problem)));
  while (nodes.length > 0) {
    const [node] = nodes.splice(0, 1);
    if (goalTest(problem)(state(node))) {
      return node;
    }
    nodes = queueingFunc(nodes, expand(node, operation(problem)));
  }
  return [];
};

/** @TODO: Implement queueing functions */
