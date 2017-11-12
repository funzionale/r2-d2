/** @flow */

import type { Cell } from '../flow';

export const transformGridToPrologFacts: (
  Array<Cell>
) => Array<string> = grid =>
  grid.map(
    cell =>
      `cell(${cell.coordinates.x}, ${cell.coordinates.y}, ${JSON.stringify(
        cell.items
      ).replace(/"/g, "'")})`
  );
