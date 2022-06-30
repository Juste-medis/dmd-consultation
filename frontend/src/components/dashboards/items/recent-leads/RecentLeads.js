/* eslint-disable react/prop-types */
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableSearchBox from 'components/common/advance-table/AdvanceTableSearchBox';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

const columns = [
  {
    accessor: 'code',
    Header: 'Code',
    headerProps: {
      className: 'py-3'
    },
    Cell: rowData => {
      const { code } = rowData.row.original;
      return (
        <Flex alignItems="center">
          <div className="flex-1">
            <h5 className="mb-0 fs--1">{code}</h5>
          </div>
        </Flex>
      );
    }
  },
  {
    accessor: 'cons_label',
    Header: 'Label',
    Cell: rowData => {
      return <span className="mb-0">{rowData.row.original.cons_label}</span>;
    }
  },
  {
    accessor: 'cons_support',
    Header: 'Support',
    Cell: rowData => {
      return <span className="mb-0">{rowData.row.original.cons_support}</span>;
    }
  },
  {
    accessor: 'cons_management',
    Header: 'Management',
    Cell: rowData => {
      return (
        <span className="mb-0">{rowData.row.original.cons_management}</span>
      );
    }
  },
  {
    accessor: 'cons_date',
    Header: 'Date',
    Cell: rowData => {
      return <span className="mb-0">{rowData.row.original.cons_date}</span>;
    }
  }
];

const RecentLeads = ({ consults, _LoadMore, connecting, handlesortage }) => {
  return (
    <AdvanceTableWrapper
      columns={columns}
      data={consults}
      selectionColumnWidth={30}
      sortable
      pagination
      perPage={99999}
    >
      <Card>
        <FalconCardHeader
          title="Consultations"
          titleTag="h6"
          className="py-3"
        />
        <Row className="m-3">
          <Col />
          <Col xs="auto" sm={6} lg={4}>
            <AdvanceTableSearchBox handlesortage={handlesortage} table />
          </Col>
        </Row>
        <Card.Body className="p-0">
          <AdvanceTable
            table
            headerClassName="bg-200 text-900 text-nowrap align-middle"
            rowClassName="align-middle white-space-nowrap"
            tableProps={{
              className: 'fs--1 mb-0 overflow-hidden',
              bordered: true
            }}
          />
        </Card.Body>
      </Card>
      <div className="p-0 d-flex justify-content-end mt-3">
        <Button
          variant="success"
          className="fs--1"
          disabled={connecting}
          onClick={_LoadMore}
        >
          VOIR PLUS
        </Button>
      </div>
    </AdvanceTableWrapper>
  );
};

export default RecentLeads;
