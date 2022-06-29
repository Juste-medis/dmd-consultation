import React from 'react';
import { Col, Row } from 'react-bootstrap';
import CrmStats from './CrmStats';
import ToDoList from './ToDoList';
import RecentLeads from './recent-leads/RecentLeads';
import DealForeCast from './deal-forecast/DealForeCast';

const index = () => {
  return (
    <>
      <Row className="g-3 mb-3">
        <Col xxl={9}>
          <CrmStats />
        </Col>
        <Col xxl={6}>
          <DealForeCast />
        </Col>
      </Row>
      <Row className="g-3 mb-3">
        <Col lg={5}>
          <ToDoList />
        </Col>
        <Col lg={7}>
          <RecentLeads />
        </Col>
      </Row>
    </>
  );
};

export default index;
