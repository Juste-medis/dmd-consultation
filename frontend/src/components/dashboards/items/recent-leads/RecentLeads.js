/* eslint-disable react/prop-types */
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import FalconCardFooterLink from 'components/common/FalconCardFooterLink';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import React from 'react';
import { Card } from 'react-bootstrap';

const columns = [
  {
    accessor: 'Code',
    Header: 'Code',
    headerProps: {
      className: 'py-3'
    },
    Cell: rowData => {
      const { Code } = rowData.row.original;
      return (
        <Flex alignItems="center">
          <div className="flex-1">
            <h5 className="mb-0 fs--1">{Code}</h5>
          </div>
        </Flex>
      );
    }
  },
  {
    accessor: 'Label',
    Header: 'Label',
    Cell: rowData => {
      return <span className="mb-0">{rowData.row.original.Label}</span>;
    }
  },
  {
    accessor: 'Support',
    Header: 'Support',
    Cell: rowData => {
      return <span className="mb-0">{rowData.row.original.Support}</span>;
    }
  },
  {
    accessor: 'Management',
    Header: 'Management',
    Cell: rowData => {
      return <span className="mb-0">{rowData.row.original.Management}</span>;
    }
  },
  {
    accessor: 'Date',
    Header: 'Date',
    Cell: rowData => {
      return <span className="mb-0">{rowData.row.original.Date}</span>;
    }
  }
];

const RecentLeads = ({ consults, user_type }) => {
  return (
    <AdvanceTableWrapper
      columns={columns}
      data={consults}
      selectionColumnWidth={30}
      sortable
      pagination
      perPage={10}
    >
      <Card>
        <FalconCardHeader
          title="Consultations"
          titleTag="h6"
          className="py-3"
        />
        <Card.Body className="p-0">
          <AdvanceTable
            table
            headerClassName="bg-200 text-900 text-nowrap align-middle"
            rowClassName="align-middle white-space-nowrap"
            tableProps={{
              className: 'fs--1 mb-0 overflow-hidden'
            }}
          />
        </Card.Body>
        <Card.Footer className="p-0">
          <FalconCardFooterLink
            title="Voir la liste complète"
            to={
              user_type !== 'company'
                ? '/dashboard/sadmin/consults/candidate-list'
                : '/dashboard/admin/consults/company-list'
            }
            size="sm"
          />
        </Card.Footer>
      </Card>
    </AdvanceTableWrapper>
  );
};

export default RecentLeads;
