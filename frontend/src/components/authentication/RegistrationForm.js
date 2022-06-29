import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Button, Form, Row, Col } from 'react-bootstrap';
import AuthFetcher from 'API/AuthService';
import RegistrationModal from './RegistrationModal';
import Cookies from 'universal-cookie';
import { UriEncoder } from 'helpers/utils';
import Globals from 'Ressources/Globals';

const RegistrationForm = ({ hasLabel, login }) => {
  const cookies = new Cookies();
  const [modal, setModal] = useState({
    loading: false,
    connected: false
  });
  // State
  const [formData, setFormData] = useState({
    identity: '',
    user_email: '',
    user_pass: '',
    confirmPassword: ''
  });

  // Handler
  const handleSubmit = e => {
    e.preventDefault();
    go_signup(formData);
  };
  async function go_signup(values) {
    setModal({ ...modal, loading: true });
    AuthFetcher.AuthSignupCandidate(UriEncoder(values))
      .then(res => {
        setTimeout(function () {
          res = res.data;
          if (res.message) {
            toast.error(`${res.message}`);
          } else if (res.ok) {
            go_signin(values);
          }
          setModal({ ...modal, loading: false });
        }, 1000);
      })
      .catch(err => {
        setModal({ ...modal, loading: false });
        toast.error(`${err}`);
      });
  }
  async function go_signin(values) {
    AuthFetcher.AuthSignin(UriEncoder(values))
      .then(res => {
        if (res.message) {
          toast.error(`${res.message}`);
          setModal({ ...modal, loading: false });
        } else {
          let { user_type, isadmin } = res;
          cookies.set(
            `___lo_rery_yap`,
            `jrun__752ztbze852hqsjeue28525vb825ujcfk${user_type}`,
            { path: '/', maxAge: Globals.COOKIE_DURATIONN.TOKEN_AUTHENTICATE }
          );
          if (isadmin) {
            cookies.set(
              '___lo_rery_yap_adi',
              `jrun__75jcfksjeuehq522ztbze8525vb825u28${isadmin}`,
              { path: '/', maxAge: Globals.COOKIE_DURATIONN.TOKEN_AUTHENTICATE }
            );
          }
          setModal({ ...modal, loading: false });
          if (login) {
            login();
          } else {
            setModal({ ...modal, connected: true });
          }
        }
      })
      .catch(err => {
        setModal({ ...modal, loading: false });
        toast.error(`${err}`);
      });
  }

  const handleFieldChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <RegistrationModal modal={modal} setModal={setModal} />
      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Identité</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Identité' : ''}
          value={formData.identity}
          name="identity"
          onChange={handleFieldChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>addresse Email </Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Addresse E-mail' : ''}
          value={formData.user_email}
          name="user_email"
          onChange={handleFieldChange}
          type="email"
        />
      </Form.Group>

      <Row className="g-2 mb-3">
        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>Mot de passe</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Mot de passe' : ''}
            value={formData.user_pass}
            name="user_pass"
            onChange={handleFieldChange}
            type="password"
          />
        </Form.Group>
        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>Confirmez le Mot de passe</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Confirmez Mot de passe' : ''}
            value={formData.confirmPassword}
            name="confirmPassword"
            onChange={handleFieldChange}
            type="password"
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-4">
        <Button
          className="w-100"
          type="submit"
          disabled={
            !formData.identity ||
            !formData.user_pass ||
            !formData.user_email ||
            !formData.confirmPassword
          }
        >
          Je m'enregistre
        </Button>
      </Form.Group>
    </Form>
  );
};

RegistrationForm.propTypes = {
  hasLabel: PropTypes.bool,
  login: PropTypes.func
};

export default RegistrationForm;
