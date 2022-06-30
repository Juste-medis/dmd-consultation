/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { toast } from 'react-toastify';
import { AddConsultation } from 'API/AFetcher';
import { UriEncoder } from 'helpers/utils';
import Globals from 'Ressources/Globals';
import FileLoader from './AScrm/FileLoader';

const SAFormulaire = () => {
  const [formData, setFormData] = useState({
    cons_label: '',
    cons_description: '',
    cons_management: '',
    cons_support: ''
  });
  const [connecting, setconnecting] = React.useState(false);
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    go_add(formData);
  };
  async function go_add(values) {
    setconnecting(true);
    AddConsultation(UriEncoder(values), 'addbyForm')
      .then(res => {
        if (res.message) {
          toast.error(`${res.message}`);
        } else {
          Globals.load_init();
          toast.success(Globals.STRINGS.sucess_add);
        }
        setconnecting(false);
      })
      .catch(err => {
        toast.error(`${err}`);
        setconnecting(false);
      });
  }
  return (
    <>
      <Row className="g-3 mb-3">
        <Col xxl={3} md={6} className="">
          <Card>
            <FalconCardHeader title="Paramètre du profil" />
            <Card.Body className="bg-light">
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3 g-3">
                  <Form.Group as={Col} lg={6} controlId="cons_label">
                    <Form.Label>Label</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="label"
                      value={formData.cons_label}
                      name="cons_label"
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} lg={6} controlId="ent_civility">
                    <Form.Label>Management</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="TelePhone"
                      value={formData.cons_management}
                      name="cons_management"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3 g-3">
                  <Form.Group as={Col} lg={12} controlId="cons_support">
                    <Form.Label>Support</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Support"
                      value={formData.cons_support}
                      name="cons_support"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="cons_description">
                  <Form.Label>Description </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={13}
                    placeholder="description"
                    value={formData.cons_description}
                    name="cons_description"
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="text-end">
                  <Button disabled={connecting} variant="primary" type="submit">
                    Ajouter
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={3} md={6}>
          <FileLoader />
        </Col>
      </Row>
    </>
  );
};

export default SAFormulaire;
