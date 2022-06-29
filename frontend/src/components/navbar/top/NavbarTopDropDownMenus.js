import React, { useContext } from 'react';
import NavbarDropdown from './NavbarDropdown';
import { dashboardRoutes } from 'routes/routes';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppContext from 'context/Context';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const _u = cookies.get('___lo_rery_yap')?.substring(39);
const NavbarTopDropDownMenus = () => {
  const {
    config: { navbarCollapsed, showBurgerMenu },
    setConfig
  } = useContext(AppContext);

  const handleDropdownItemClick = () => {
    if (navbarCollapsed) {
      setConfig('navbarCollapsed', !navbarCollapsed);
    }
    if (showBurgerMenu) {
      setConfig('showBurgerMenu', !showBurgerMenu);
    }
  };
  return ['administrator', 'simple'].includes(_u) ? (
    <>
      <NavbarDropdown title="dashboard">
        {dashboardRoutes.children[0].children.map(route => (
          <Dropdown.Item
            key={route.name}
            as={Link}
            className={route.active ? 'link-600' : 'text-500'}
            to={route.to}
            onClick={handleDropdownItemClick}
          >
            {route.name}
          </Dropdown.Item>
        ))}
      </NavbarDropdown>
    </>
  ) : (
    <></>
  );
};

export default NavbarTopDropDownMenus;
