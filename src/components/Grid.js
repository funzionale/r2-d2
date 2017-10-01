import React from 'react';
import { connect } from 'react-redux';

/** @TODO: Do your magic */
const Grid = ({ grid }) => <p>{JSON.stringify(grid, null, 2)}</p>;

const mapStateToProps = state => ({
  grid: state.data.grid,
});

export default connect(mapStateToProps)(Grid);
