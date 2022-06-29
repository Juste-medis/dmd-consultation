/* eslint-disable react/prop-types */
import React from 'react';
import './large4.css';
export default function SpinnerLarger4({ viewportHeight }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center col-12"
      style={{
        height: viewportHeight || '100vh'
      }}
    >
      <div className="spinner_type3">
        <div className="dot1"></div>
        <div className="dot2"></div>
      </div>
    </div>
  );
}
