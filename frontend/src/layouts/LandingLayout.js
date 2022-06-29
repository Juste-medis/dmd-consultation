import React from 'react';
import { Switch } from 'react-router-dom';
import NavbarStandard from './header/NavbarStandard';
import Landing from 'components/landing/home';
import 'components/css/land.css';
import { PrivateRoute } from './Layout';

const LandingLayout = () => {
  return (
    <div className="fluid">
      <NavbarStandard />
      <div
        className="landing_container"
        style={{
          marginTop: document.location.pathname === '/' ? '4rem' : '5.5rem'
        }}
      >
        <Switch>
          <PrivateRoute
            exact
            path="/"
            local="___lo_rery_yap"
            component={<Landing />}
          />
        </Switch>
      </div>
    </div>
  );
};

export default LandingLayout;
