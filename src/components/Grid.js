/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import type { Cell, Item } from '../flow';

const Pad = () => <div>'PAD'</div>;
const Rock = () => <img className="rock" src="./rock.png" alt="Rock" />;
const Teleportal = () => <div>'TELEPORTAL'</div>;
const Obstacle = () => <div>'OBSTACLE'</div>;
const R2D2 = () => <img className="r2d2" src="./R2D2.svg" alt="Robot" />;

const Grid = ({ grid }: { grid: Array<Cell> }) => {
  const numOfRows = Math.sqrt(grid.length);
  const widthAndHeight = Math.floor(100 / numOfRows);
  return grid.map(gridCell => [
    <div
      style={{
        width: `${widthAndHeight}%`,
        maxWidth: `${widthAndHeight}%`,
        height: `${widthAndHeight}%`,
        maxHeight: `${widthAndHeight}%`,
        padding: 4,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.08)',
          borderRadius: 9,
          boxShadow: '1px 2px 2px 0 rgba(0,0,0,0.16)',
          height: '100%',
          width: '100%',
        }}
      />
    </div>,
    [
      gridCell.items.map((item: Item) => {
        const translateX = 600 / numOfRows * gridCell.coordinates.x;
        const translateY = 600 / numOfRows * gridCell.coordinates.y;
        const width = `${Math.floor(100 / numOfRows)}%`;
        const height = `${Math.floor(100 / numOfRows)}%`;
        let comp;
        let zIndex = 0;
        switch (item) {
          case 'R2D2':
            comp = <R2D2 />;
            zIndex = 2;
            break;
          case 'TELEPORTAL':
            comp = <Teleportal />;
            zIndex = 1;
            break;
          case 'OBSTACLE':
            comp = <Obstacle />;
            zIndex = 2;
            break;
          case 'ROCK':
            comp = <Rock />;
            zIndex = 2;
            break;
          case 'PAD':
            comp = <Pad />;
            zIndex = 1;
            break;
          default:
            return null;
        }
        return (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex,
              width,
              height,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: `translate(${translateX}px, ${translateY}px)`,
              transition: 'translate 1s ease',
            }}
          >
            {comp}
          </div>
        );
      }),
    ],
  ]);
};

const mapStateToProps = state => ({
  grid: state.data.grid,
});

export default connect(mapStateToProps)(Grid);