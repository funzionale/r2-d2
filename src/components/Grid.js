import React from 'react';
import { connect } from 'react-redux';

/** @TODO: Do your magic */
const Grid = ({ grid }) => {
  const cells = Math.sqrt(grid.length);
  return grid.map(grid => (
    <div
      style={{
        background: 'rgba(0,0,0,0.08)',
        margin: 2,
        width: `${100 / cells - 0.67}%`,
        height: `${100 / cells - 0.67}%`,
        borderRadius: 9,
        boxShadow: '1px 2px 2px 0 rgba(0,0,0,0.16)',
      }}
    />
  ));
};

const mapStateToProps = state => ({
  grid: state.data.grid,
});

export default connect(mapStateToProps)(Grid);
