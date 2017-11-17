/** @flow */
import _ from 'lodash';

import type { Cell } from '../flow';

export const transformGridToPrologFacts: (
  Array<Cell>
) => Array<string> = grid =>
  grid
    .map(
      cell =>
        cell.items.map(
          item =>
            `${item.toLowerCase()}(${cell.coordinates.x}, ${cell.coordinates
              .y}, s0).`
        )[0]
    )
    .filter(fact => !_.isUndefined(fact));
