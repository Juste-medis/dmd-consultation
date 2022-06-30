import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import Success from 'components/common/Sucesses/Success';

const RegistrationModal = ({ modal }) => {
  return (
    <Modal
      show={modal.connected || modal.loading}
      centered
      dialogClassName="wizard-modal"
    >
      {modal.connected ? (
        <Modal.Body className="p-4">
          <Flex justifyContent="center" alignItems="center">
            <Success candidate={true} reset={() => {}} />
          </Flex>
        </Modal.Body>
      ) : (
        <Modal.Body className="p-4">
          <Flex justifyContent="center" alignItems="center">
            <p className="mb-0 flex-1">Inscription en cours</p>
          </Flex>
        </Modal.Body>
      )}
    </Modal>
  );
};

RegistrationModal.propTypes = {
  modal: PropTypes.object.isRequired,
  setModal: PropTypes.func.isRequired
};

export default RegistrationModal;
