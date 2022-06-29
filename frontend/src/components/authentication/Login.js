/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import Flex from 'components/common/Flex';
import LoginForm from 'components/authentication/LoginForm';
import { Alert } from 'react-bootstrap';

const Login = ({ login }) => (
  <>
    <div className="top_container">
      {login && (
        <Alert
          className="col-12 d-flex align-items-center justify-content-center"
          variant="info"
        >
          <p className=" m-0">
            Vous devez vous connecter avant d'acceder à cette page
          </p>
        </Alert>
      )}
    </div>
    <Flex justifyContent="between" alignItems="center" className="mb-2">
      <h5>Se connecter</h5>
      <p className="fs--1 text-600 mb-0">
        ou <Link to="/authentication/user/register">creer un compte</Link>
      </p>
    </Flex>
    <LoginForm login={login} />
  </>
);

export default Login;
