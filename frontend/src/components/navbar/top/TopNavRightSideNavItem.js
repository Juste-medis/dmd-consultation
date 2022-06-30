import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import ProfileDropdown from 'components/navbar/top/ProfileDropdown';
import AppContext from 'context/Context';

const TopNavRightSideNavItem = () => {
  const {
    config: { userProfil }
  } = useContext(AppContext);
  return (
    <Nav
      navbar
      className="navbar-nav-icons ms-auto flex-row align-items-center"
      as="ul"
    >
      <ProfileDropdown userProfil={userProfil} />
    </Nav>
  );
};

export default TopNavRightSideNavItem;
