import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Nav, NavDropdown } from 'react-bootstrap';
import Login from 'components/authentication/Login';
import TopNavRightSideNavItem from 'components/navbar/top/TopNavRightSideNavItem';

const LandingRightSideNavItem = ({ userProfil }) => {
  if (userProfil.user_email && userProfil.user_email !== 1) {
    return (
      <div className="d-flex col flex-row-reverse">
        <TopNavRightSideNavItem />
      </div>
    );
  } else if (userProfil.user_email === 1) {
    return (
      <Nav navbar className="ms-auto">
        <NavDropdown className="pt-lg-3" title="Connexion" align="end">
          <Card className="navbar-card-login shadow-none">
            <Card.Body className="fs--1 fw-normal p-4">
              <Login />
            </Card.Body>
          </Card>
        </NavDropdown>
        <Nav.Item className="pt-lg-3">
          <Nav.Link as={Link} to="/authentication/user/register">
            Inscription
          </Nav.Link>
        </Nav.Item>
      </Nav>
    );
  } else {
    return <span></span>;
  }
};

export default LandingRightSideNavItem;
