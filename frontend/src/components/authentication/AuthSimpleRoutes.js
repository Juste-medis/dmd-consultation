import React from 'react';
import {
  Redirect,
  Route,
  useLocation,
  Switch,
  useRouteMatch
} from 'react-router-dom';
import Login from 'components/authentication/Login';
import Logout from 'components/authentication/Logout';
import Registration from 'components/authentication/Registration';
import LockScreen from 'components/authentication/LockScreen';

const AuthSimpleRoutes = () => {
  const { url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${url}/login`} exact component={LoginPage} />
      <Route path={`${url}/register`} exact component={Registration} />
      <Route path={`${url}/logout`} exact component={Logout} />
      <Route path={`${url}/lock-screen`} exact component={LockScreen} />
      <Redirect to="/errors/404" />
    </Switch>
  );
};

function LoginPage() {
  let location = useLocation();
  let { from } = location.state || {},
    login;
  if (from) {
    login = () => {
      window.location.replace(from.pathname);
    };
  }

  return <Login auth0={1} login={login} />;
}

export default AuthSimpleRoutes;
