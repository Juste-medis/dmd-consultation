/* eslint-disable react/prop-types */

import React from 'react';
import './large3.css';

export default function SpinnerLarger3({ viewportHeight }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center col-12"
      style={{
        height: viewportHeight || '100vh'
      }}
    >
      <div className="spinner_type2">
        <div className="cube2_1"></div>
        <div className="cube2_2"></div>
      </div>
    </div>
  );
}
