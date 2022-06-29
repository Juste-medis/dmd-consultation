/* eslint-disable react/prop-types */
import React from 'react';
import './large2.css';
export default function SpinnerLarger2({ size = 150, viewportHeight }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center col-12"
      style={{
        height: viewportHeight || '100vh'
      }}
    >
      <div
        style={{ width: size, height: size }}
        className="spinner_type1"
      ></div>
    </div>
  );
}
