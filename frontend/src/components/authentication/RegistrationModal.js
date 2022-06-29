import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Lottie from 'react-lottie';
import animationData from 'components/common/lotties/warning-light.json';
import animationDataLoading from 'components/common/lotties/spinner_earth.json';
import Flex from 'components/common/Flex';
import Success from 'components/common/Sucesses/Success';

const RegistrationModal = ({ modal }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
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
            <Lottie
              options={{
                ...defaultOptions,
                animationData: animationDataLoading
              }}
              style={{ width: '100px' }}
            />
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
