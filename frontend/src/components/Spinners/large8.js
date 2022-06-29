/* eslint-disable react/prop-types */
import React from 'react';
import './large8.css';
export default function SpinnerLarger8({ size = 150, viewportHeight }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center col-12"
      style={{
        height: viewportHeight || '100vh'
      }}
    >
      <div
        style={{
          height: size,
          width: size
        }}
        className="spinner_type8"
      ></div>
    </div>
  );
}
