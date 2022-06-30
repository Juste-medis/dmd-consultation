import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logoutImg from 'assets/img/illustrations/45.png';

const LogoutContent = ({ titleTag: TitleTag, user }) => {
  return (
    <>
      <img
        className="d-block mx-auto mb-4"
        src={logoutImg}
        alt="shield"
        width={100}
      />
      <TitleTag>À bientôt {user.public_name}</TitleTag>
      <p>
        Revenez quand vous voulez. Vous êtes
        <br className="d-none d-sm-block" />
        maintenant déconnecté avec succès.
      </p>
      <Button
        as={Link}
        color="primary"
        size="sm"
        className="mt-3"
        to={`/authentication/user/login`}
      >
        <FontAwesomeIcon
          icon="chevron-left"
          transform="shrink-4 down-1"
          className="me-1"
        />
        Reconnexion
      </Button>
    </>
  );
};

LogoutContent.propTypes = {
  layout: PropTypes.string,
  user: PropTypes.object,
  titleTag: PropTypes.string
};

LogoutContent.defaultProps = {
  layout: 'simple',
  titleTag: 'h4'
};

export default LogoutContent;
