/* eslint-disable react/prop-types */
import React from 'react';
import './large5.css';
export default function SpinnerLarger5({ viewportHeight }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center col-12"
      style={{
        height: viewportHeight || '100vh'
      }}
    >
      <div className="spinner_type4">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  );
}
