/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Form, Row, Button } from 'react-bootstrap';

const CustomersTableHeader = ({ selectedRowIds, go_update }) => {
  let action = 'active';
  return (
    <Row className="flex-between-center">
      <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
        <h5 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">Utilisateurs</h5>
      </Col>
      <Col xs={8} sm="auto" className="ms-auto text-end ps-0">
        {Object.keys(selectedRowIds).length > 0 ? (
          <div className="d-flex">
            <Form.Select
              placeholder="action groupée"
              size="sm"
              aria-label="Bulk actions"
              onChange={e => {
                action = e.currentTarget.value;
              }}
            >
              <option value="active">Valider</option>
              <option value="blocked">Bloquer</option>
            </Form.Select>
            <Button
              type="button"
              variant="falcon-default"
              size="sm"
              className="ms-2"
              // eslint-disable-next-line no-unused-vars
              onClick={e => {
                setTimeout(() => {
                  go_update(selectedRowIds, action);
                }, 400);
              }}
            >
              Appliquer
            </Button>
          </div>
        ) : (
          <div id="orders-actions"></div>
        )}
      </Col>
    </Row>
  );
};

CustomersTableHeader.propTypes = {
  selectedRowIds: PropTypes.object
};

export default CustomersTableHeader;
