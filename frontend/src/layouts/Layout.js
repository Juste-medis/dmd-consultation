/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import is from 'is_js';
import AuthSimpleLayout from './AuthSimpleLayout';
import ErrorLayout from './ErrorLayout';
import { ToastContainer } from 'react-toastify';
import Logout from 'components/authentication/Logout';
import LandingLayout from './LandingLayout';
import MainLayout from './MainLayout';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

//const MainLayout = lazy(() => import('./MainLayout'));
//const SignIn = lazy(() => import('../Components/Menu-Main/Auth/signin'));

const Layout = () => {
  const HTMLClassList = document.getElementsByTagName('html')[0].classList;

  useEffect(() => {
    if (is.windows()) {
      HTMLClassList.add('windows');
    }
    if (is.chrome()) {
      HTMLClassList.add('chrome');
    }
    if (is.firefox()) {
      HTMLClassList.add('firefox');
    }
  }, [HTMLClassList]);

  return (
    <>
      <Switch>
        <Route path="/errors" component={ErrorLayout} />
        <Route path="/authentication/user" component={AuthSimpleLayout} />
        <Route path="/authentication/logout" component={Logout} />
        <PrivateRouteAdmin
          local="___lo_rery_yap_adi"
          path="/dashboard/admin"
          component={<MainLayout />}
        />
        <PrivateRoute
          local="___lo_rery_yap"
          path="/dashboard"
          component={<MainLayout />}
        />

        <Route component={LandingLayout} />
        <Redirect to="/errors/404" />
      </Switch>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ToastContainer />
    </>
  );
};

export function PrivateRoute({ component, local, ...rest }) {
  const isAuthenticated = cookies.get(local);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          component
        ) : (
          <Redirect
            to={{
              pathname: '/authentication/user/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
export function PrivateRouteAdmin({ component, local, ...rest }) {
  const isAuthenticated = cookies.get(local);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          component
        ) : (
          <Redirect
            to={{
              pathname: '/authentication/user/lock-screen',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
export default Layout;
