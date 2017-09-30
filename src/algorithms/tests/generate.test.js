import { constructGrid } from '../generate';

test('constructs grid of ascendingly sorted, non-repeating coordinates', () => {
  expect(constructGrid({ m: 0, n: 0 })).toEqual([]);
  expect(constructGrid({ m: 1, n: 1 })).toEqual([{ x: 0, y: 0 }]);
  expect(constructGrid({ m: 1, n: 0 })).toEqual([{ x: 0, y: 0 }]);
});
