import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Button, Form, Spinner } from 'react-bootstrap';

import AuthFetcher from 'API/AuthService';
import Cookies from 'universal-cookie';
import Globals from 'Ressources/Globals';
import { UriEncoder } from 'helpers/utils';
import {
  BsFillEyeFill as FillEyeFilIcon,
  BsFillEyeSlashFill as BsFillEyeSlashFillIcon
} from 'react-icons/bs';

const LoginForm = ({ hasLabel, login }) => {
  const cookies = new Cookies();
  const [loading, setloading] = useState(false),
    [showPassword, setshowPassword] = React.useState(false);
  // State
  const [formData, setFormData] = useState({
    user_email: '',
    user_pass: '',
    remember: false
  });

  // Handler
  const handleSubmit = e => {
    e.preventDefault();
    go_signin(formData);
  };
  async function go_signin(values) {
    setloading(true);
    AuthFetcher.AuthSignin(UriEncoder(values))
      .then(res => {
        if (res.message) {
          setloading(false);
          toast.error(`${res.message}`);
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
          toast.success(`Bienvenu ${res.identity}`);
          setTimeout(() => {
            if (login) {
              login();
            } else {
              window.location.replace('/');
            }
          }, 2000);
        }
      })
      .catch(err => {
        setloading(false);
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
      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Adresse E-mail</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Email' : ''}
          value={formData.user_email}
          name="user_email"
          onChange={handleFieldChange}
          type="email"
        />
      </Form.Group>
      <Form.Group className="mb-3 d-inline">
        {hasLabel && <Form.Label>Mot de passe</Form.Label>}
        <div className="position-relative">
          <Form.Control
            className="col col-11"
            placeholder={!hasLabel ? '********' : ''}
            value={formData.user_pass}
            name="user_pass"
            onChange={handleFieldChange}
            type={showPassword ? 'text' : 'password'}
            vocab="cpssw"
          />
          <div
            style={{
              right: 10,
              top: 5
            }}
            className="btn position-absolute showpass_btn p-0 m-0 bg-transparent col col-1"
            onClick={() => {
              setshowPassword(!showPassword);
            }}
          >
            {showPassword ? (
              <FillEyeFilIcon className="m-0" color="#607D8B" size={15} />
            ) : (
              <BsFillEyeSlashFillIcon
                className="m-0"
                color="#607D8B"
                size={15}
              />
            )}
          </div>
        </div>
      </Form.Group>

      <Form.Group>
        <Button
          type="submit"
          color="primary"
          className="mt-3 w-100"
          disabled={!formData.user_email || !formData.user_pass || loading}
        >
          {loading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            'Connexion'
          )}
        </Button>
      </Form.Group>
    </Form>
  );
};

LoginForm.propTypes = {
  layout: PropTypes.string,
  hasLabel: PropTypes.bool,
  login: PropTypes.func
};

LoginForm.defaultProps = {
  layout: 'user',
  hasLabel: false
};

export default LoginForm;
