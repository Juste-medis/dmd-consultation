/* eslint-disable react/prop-types */
import React from 'react';
import { Spinner } from 'react-bootstrap';
import logo from 'assets/img/logos/tj-heigh-school.png';

import './large1.css';
export default function SpinnerLarger({
  size = 150,
  color = '#204b9bff',
  viewportHeight,
  animation,
  viewtype = 1
}) {
  return (
    <div
      className="d-flex justify-content-center align-items-center col-12"
      style={{
        height: viewportHeight || '100vh'
      }}
    >
      {viewtype === 1 ? (
        <Spinner
          style={{
            height: size,
            width: size,
            color
          }}
          className="sr sign_me_button p-3 col-12 col-md-6 m-4 "
          animation={animation || 'border'}
          role="status"
        ></Spinner>
      ) : (
        <img
          id="logo"
          src={logo}
          alt=""
          height="100"
          width="200"
          className="align-center spinner_loading"
        />
      )}
    </div>
  );
}
