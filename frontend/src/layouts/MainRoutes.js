/* eslint-disable react/prop-types */
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import routes from 'routes/routes';
import { flatRoutes } from 'helpers/utils';
import ComingSoon from 'components/pages/ComingSoon';
import ASDashboard from 'components/dashboards/ASDashboard';
const inActiveRoutes = flatRoutes(routes).filter(route => !route.active);

const MainRoutes = () => (
  <Switch>
    {/*Dashboard*/}
    <Route path="/dashboard/default" exact component={ASDashboard} />

    <Route
      path={inActiveRoutes.map(route => route.to)}
      exact
      component={ComingSoon}
    />

    {/*Redirect*/}
    <Redirect to="/errors/404" />
  </Switch>
);

export default MainRoutes;
