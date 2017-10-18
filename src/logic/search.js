/** @flow */

import _ from 'lodash';

import type {
  Node,
  Problem,
  State,
  StateWithOperator,
  QueueingFunction,
} from '../flow';

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

const expand: (Node, Problem, Array<State>) => Array<Node> = (
  parentNode,
  problem,
  history
) => {
  const { operators, stateSpace } = problem;
  const { state } = parentNode;

  const possibleNextStatesWithOperators: Array<StateWithOperator> = stateSpace(
    state,
    operators
  );

  const childrenNodes: Array<Node> = possibleNextStatesWithOperators
    .map(({ state, operator }) => ({
      state,
      parent: parentNode,
      operator,
      depth: parentNode.depth + 1,
      pathCost: parentNode.pathCost + problem.pathCost([operator]),
    }))
    .filter(node => !history.find(hist => _.isEqual(node.state, hist)));

  return childrenNodes;
};

/** Depth-first search */
const enqueueAtFront: QueueingFunction = (oldNodes, newNodes) =>
  newNodes.concat(oldNodes);

/** Breadth-first search */
const enqueueAtEnd: QueueingFunction = (oldNodes, newNodes) =>
  oldNodes.concat(newNodes);

/** Uniform-cost search */
const orderedInsert: QueueingFunction = (oldNodes, newNodes) =>
  _.sortBy(oldNodes.concat(newNodes), 'pathCost');

/** Deepening-iterative search */
const enqueueAtFrontWithL: number => QueueingFunction = l => (
  oldNodes,
  newNodes
) => newNodes.concat(oldNodes).filter(node => node.depth <= l);

/** Greedy search */
const greedyInsert: ((Node) => number) => QueueingFunction = heuristic => (
  oldNodes,
  newNodes
) => _.sortBy(oldNodes.concat(newNodes), heuristic);

/** A* search */
const aStarInsert: ((Node) => number) => QueueingFunction = heuristic => (
  oldNodes,
  newNodes
) =>
  _.sortBy(oldNodes.concat(newNodes), node => heuristic(node) + node.pathCost);

export const breadthFirst: Problem => Node | null = problem =>
  generalSearch(problem, enqueueAtEnd);

export const depthFirst: Problem => Node | null = problem =>
  generalSearch(problem, enqueueAtFront);

export const uniformCost: Problem => Node | null = problem =>
  generalSearch(problem, orderedInsert);

export const deepeningSearch: Problem => Node | null = problem => {
  let l = 1;
  while (l <= 30) {
    const node = generalSearch(problem, enqueueAtFrontWithL(l));
    if (node) {
      return node;
    }
    l++;
  }
  return null;
};

export const greedySearch: (Problem, (Node) => number) => Node | null = (
  problem,
  heuristic
) => generalSearch(problem, greedyInsert(heuristic));

export const aStarSearch: (Problem, (Node) => number) => Node | null = (
  problem,
  heuristic
) => generalSearch(problem, aStarInsert(heuristic));

export const generalSearch: (Problem, QueueingFunction) => Node | null = (
  problem,
  queueingFunction
) => {
  let nodes: Array<Node> = makeQueue(makeNode(initialState(problem)));
  let history: Array<State> = [];
  let expansionsCount: number = 0;
  while (!_.isEmpty(nodes)) {
    /** Guard against infinite loops */
    if (expansionsCount++ === 10000) {
      console.log('♻️ Infinite loop!');
      break;
    }
    const [node] = _.pullAt(nodes, 0);
    if (goalTest(problem)(state(node))) {
      return node;
    }
    const expandedNodes = expand(node, problem, history);
    nodes = queueingFunction(nodes, expandedNodes);
    history = history.concat(expandedNodes.map(node => node.state));
  }
  return null;
};

export const retrace: Node => Array<StateWithOperator> = goalNode => {
  return trace(goalNode).map(({ state, operator }) => ({ state, operator }));
};

const trace: (Node | null) => Array<Node> = node => {
  if (!node) return [];
  return trace(node.parent).concat(node);
};
