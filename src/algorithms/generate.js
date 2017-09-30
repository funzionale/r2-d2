import _ from 'lodash';

const types = {
  EMPTY: 'EMPTY',
  R2D2: 'R2D2',
  TELEPORTAL: 'TELEPORTAL',
  OBSTACLE: 'OBSTACLE',
  ROCK: 'ROCK',
  PAD: 'PAD',
};

const pickRandomArrayIndex = array => _.random(0, array.length - 1);

export const constructGrid = ({ m, n }) =>
  _.chain(new Array(m * n))
    .fill(0)
    .map((_, index) => ({
      x: index % m,
      y: index % n,
    }))
    .sortBy('x')
    .value();
