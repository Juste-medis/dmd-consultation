/* eslint-disable no-unused-vars */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import NavbarTopDropDownMenus from 'components/navbar/top/NavbarTopDropDownMenus';
import LandingRightSideNavItem from './LandingRightSideNavItem';
import { topNavbarBreakpoint } from 'config';
import AppContext from 'context/Context';
import AuthFetcher from 'API/AuthService';
import Globals from 'Ressources/Globals';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const NavbarStandard = () => {
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const {
    config: { isDark, userProfil },
    setConfig
  } = React.useContext(AppContext);
  React.useEffect(() => {
    load_init();
    return () => {};
  }, []);
  function load_init() {
    AuthFetcher.CheckAuth(20)
      .then(res => {
        if (res.user_email) {
          Globals.PROFIL_INFO = res;
          setConfig('userProfil', res);
        } else {
          if (res.error) {
            cookies.remove('___lo_rery_yap');
            cookies.remove('___lo_rery_yap_adi');
          }
          setConfig('userProfil', { user_email: 1 });
        }
      })
      .catch(e => {
        setConfig('userProfil', { user_email: 1 });
      });
  }

  return (
    <Navbar
      variant={isDark ? 'light' : 'dark'}
      fixed="top"
      expand={topNavbarBreakpoint}
      className={classNames('navbar-standard navbar-theme', {
        'bg-100': !navbarCollapsed && isDark,
        'bg-dark': !navbarCollapsed && !isDark
      })}
      style={{
        backgroundColor: `rgba(11, 23, 39, ${0.9})`
      }}
    >
      <Container>
        <a href="/" className="position-relative text-decoration-none">
          <Navbar.Brand className="text-white dark__text-white">
            Dmd
          </Navbar.Brand>
        </a>
        <Navbar.Toggle onClick={() => setNavbarCollapsed(!navbarCollapsed)} />
        <Navbar.Collapse className="scrollbar">
          <Nav>
            <NavbarTopDropDownMenus
              userProfil={userProfil}
              setNavbarCollapsed={setNavbarCollapsed}
            />
          </Nav>
          <LandingRightSideNavItem userProfil={userProfil} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarStandard;
