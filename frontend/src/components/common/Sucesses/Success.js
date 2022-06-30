import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
const Success = () => {
  const emptyData = () => {
    window.location.replace('/');
  };

  return (
    <>
      <Row>
        <Col className="text-center">
          <h4 className="mb-1">Votre Profil à Bien été configuré!</h4>
          <p className="fs-0">
            Maintenant vous pouvez avoir accès à votre compte
          </p>
          <Button color="primary" className="px-5 my-3" onClick={emptyData}>
            Commencer
          </Button>
        </Col>
      </Row>
    </>
  );
};

Success.propTypes = {
  reset: PropTypes.func.isRequired,
  candidate: PropTypes.bool,
  wizardcomplete: PropTypes.bool
};

export default Success;
