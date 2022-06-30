/* eslint-disable react/prop-types */
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ASDashboard from 'components/dashboards/ASDashboard';
import SAFormulaire from 'components/dashboards/SAFormulaire';
import Users from 'components/dashboards/Users';

const MainRoutes = () => (
  <Switch>
    {/*Dashboard*/}
    <Route path="/dashboard/default" exact component={ASDashboard} />

    <Route path={`/dashboard/admin/users`} exact component={Users} />
    <Route
      path={`/dashboard/admin/formulaire`}
      exact
      component={SAFormulaire}
    />

    <Redirect to="/errors/404" />
  </Switch>
);

export default MainRoutes;
