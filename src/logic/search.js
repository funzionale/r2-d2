/** @flow */

import _ from 'lodash';

import type { Operator, Node, Problem, State, QueueingFunction } from '../flow';

const initialState: Problem => State = problem => problem.initialState;

const makeNode: State => Node = state => ({
  state: state,
  parent: null,
  operator: null,
  depth: 0,
  pathCost: 0,
});

const makeQueue: Node => Array<Node> = node => [node];

const state: Node => State = node => node.state;

const goalTest: Problem => State => boolean = problem => state =>
  problem.goalTest(state);

const expand: (Node, Problem) => Array<Node> = (parentNode, problem) => {
  const { operators, stateSpace } = problem;
  const { state } = parentNode;

  const possibleStates = stateSpace(state, operators);

  const childrenNodes = possibleStates.map(({ state, operator }) => ({
    state,
    parent: parentNode,
    operator,
    depth: parentNode.depth + 1,
    pathCost: parentNode.pathCost + problem.pathCost([operator]),
  }));

  return childrenNodes;
};

/** Depth-first search */
export const enqueueAtFront: QueueingFunction = (oldNodes, newNodes) =>
  newNodes.concat(oldNodes);

/** Breadth-first search */
export const enqueueAtEnd: QueueingFunction = (oldNodes, newNodes) =>
  oldNodes.concat(newNodes);

/** Uniform-cost search */
export const orderedInsert: QueueingFunction = (oldNodes, newNodes) =>
  _.sortBy(oldNodes.concat(newNodes), 'pathCost');

/** @TODO: Implement iterative deepening search */

/** @TODO: Implement Greedy search (with at least two heuristics) */

/** @TODO: Implement A* search (with at least two admissible heuristics) */

export const generalSearch: (Problem, QueueingFunction) => Node | null = (
  problem,
  queueingFunction
) => {
  let nodes = makeQueue(makeNode(initialState(problem)));
  let expansionsCount = 0;
  while (!_.isEmpty(nodes)) {
    /** Guard against infinite loops */
    if (++expansionsCount === 10000) {
      console.log('♻️ Infinite loop!');
      break;
    }
    const [node] = _.pullAt(nodes, 0);
    if (goalTest(problem)(state(node))) {
      return node;
    }
    nodes = queueingFunction(nodes, expand(node, problem));
  }
  return null;
};

export const retrace: Node => Array<Operator> = goalNode => {
  // @TODO: Backtrack till search tree root node & construct sequence of operators that leads to goal node
  return [];
};
