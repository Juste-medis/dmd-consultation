/* eslint-disable react/prop-types */
import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Form, Row, Button } from 'react-bootstrap';

const DemandsTableHeader = wrapperprops => {
  return (
    <Row className="flex-between-center">
      <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
        <h5 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">
          Canditatures ( {wrapperprops.totalItems} résultats )
        </h5>
      </Col>
      <Col xs={8} sm="auto" className="ms-auto text-end ps-0">
        {Object.keys(wrapperprops.selectedRowIds).length > 0 ? (
          <div className="d-flex">
            <Form.Select
              placeholder="action groupée"
              size="sm"
              aria-label="Bulk actions"
            >
              <option value="delete">Supprimer</option>
              <option value="archive">Archiver</option>
            </Form.Select>
            <Button
              type="button"
              variant="falcon-default"
              size="sm"
              className="ms-2"
              // eslint-disable-next-line no-unused-vars
              onClick={e => {
                setTimeout(() => {}, 400);
              }}
            >
              Appliquer
            </Button>
          </div>
        ) : (
          <div id="orders-actions">
            <IconButton
              variant="falcon-default"
              size="sm"
              icon="plus"
              transform="shrink-3"
            >
              <span className="d-none d-sm-inline-block ms-1">Nouveau</span>
            </IconButton>
            <IconButton
              variant="falcon-default"
              size="sm"
              icon="filter"
              transform="shrink-3"
              className="mx-2"
            >
              <span className="d-none d-sm-inline-block ms-1">Filtrer</span>
            </IconButton>
            <IconButton
              variant="falcon-default"
              size="sm"
              icon="external-link-alt"
              transform="shrink-3"
            >
              <span className="d-none d-sm-inline-block ms-1">Exporter</span>
            </IconButton>
          </div>
        )}
      </Col>
    </Row>
  );
};

DemandsTableHeader.propTypes = {
  wrapperprops: PropTypes.object
};

export default DemandsTableHeader;
