/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Avatar from 'components/common/Avatar';
import { IoLogOut, IoPerson, IoPieChart, IoSettings } from 'react-icons/io5';
import { randomArrProp } from 'helpers/utils';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const _u = cookies.get('___lo_rery_yap')?.substring(39);
const _l = cookies.get('___lo_rery_yap_adi')?.substring(39);

const ProfileDropdown = ({ userProfil }) => {
  const { public_name, avatar } = userProfil;
  const macronyme =
    avatar?.length > 0
      ? avatar
      : public_name
      ? `${public_name[0] + ' ' + public_name[1]}`.toUpperCase()
      : '';
  const colors = ['primary', 'success', 'info', 'warning'];
  let color = randomArrProp(colors);
  return (
    <Dropdown navbar={true} as="li">
      <Dropdown.Toggle
        bsPrefix="toggle"
        as={Link}
        to="#!"
        className="pe-0 nav-link"
      >
        {avatar?.length > 0 ? (
          <Avatar src={avatar} />
        ) : (
          <div className="avatar avatar-xl me-3">
            <div className={`avatar-name rounded-circle bg-soft-${color}`}>
              <span className={`text-nowrap p-1 fs-0 text-${color}`}>
                {macronyme}
              </span>
            </div>
          </div>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-card  dropdown-menu-end">
        <div className="bg-white rounded-2 py-2 dark__bg-1000">
          <Dropdown.Item as={Link} to="/user/profil">
            <IoPerson className="me-1" size={20} />
            <span> Profil &amp; compte </span>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            as={Link}
            to={`${
              _l === 'super'
                ? '/dashboard/superadmin/default'
                : _u === 'candidate'
                ? '/dashboard/employee/default'
                : _u === 'company'
                ? '/dashboard/employer/default'
                : ''
            }`}
          >
            <IoPieChart className="me-1" size={20} />
            Tableau de bord
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as={Link} to="/user/settings">
            <IoSettings className="me-1" size={20} />
            <span> Paramètres</span>
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/authentication/logout">
            <IoLogOut className="text-danger me-1" size={20} />
            <span>Déconnexion </span>
          </Dropdown.Item>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
