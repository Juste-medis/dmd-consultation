import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';

import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import CustomersTableHeader from './TablesHeaderrs/UsersTableHeader';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import { GetOptions, UpdateUserLevel, UpdateUserStatus } from 'API/AFetcher';
import { toast } from 'react-toastify';
import { UriEncoder } from 'helpers/utils';
import Globals from 'Ressources/Globals';
import dayjs from 'dayjs';
import Emptyser from 'components/JeriComponent/emptyser/emptyser';

dayjs.locale('fr');

const columns = [
  {
    accessor: 'ID',
    Header: 'ID',
    headerProps: { className: 'pe-1' },
    cellProps: {
      className: 'py-2'
    },
    Cell: rowData => {
      const { ID } = rowData.row.original;
      return (
        <div className="flex-1">
          <h5 className="mb-0 fs--1">{ID}</h5>
        </div>
      );
    }
  },
  {
    accessor: 'name',
    Header: 'Nom',
    headerProps: { className: 'pe-1' },
    cellProps: {
      className: 'py-2'
    },
    Cell: rowData => {
      const { name } = rowData.row.original;
      return (
        <div className="flex-1">
          <h5 className="mb-0 fs--1">{name}</h5>
        </div>
      );
    }
  },
  {
    accessor: 'email',
    Header: 'E-mail',
    Cell: rowData => {
      const { email } = rowData.row.original;
      return <a href={`mailto:${email}`}>{email}</a>;
    }
  },

  {
    accessor: 'isConnected',
    Header: 'Activité',
    Cell: rowData => {
      const { isConnected } = rowData.row.original;
      let connectedText = '',
        connectedColor = '';

      if (isConnected) {
        connectedText = 'En ligne';
        connectedColor = 'success';
      } else {
        connectedText = 'Hors ligne';
        connectedColor = 'muted';
      }
      return (
        <span className={`text-${connectedColor} fw-bold`}>
          {connectedText}
        </span>
      );
    }
  },
  {
    accessor: 'visibility',
    Header: 'Status',
    headerProps: { style: { minWidth: '200px' }, className: 'ps-5' },
    cellProps: { className: 'ps-5' },
    Cell: rowData => {
      const { ID } = rowData.row.original;
      const [visibility, setvisibility] = React.useState(
        rowData.row.original.visibility
      );

      function go_update(values) {
        UpdateUserStatus(UriEncoder(values))
          .then(res => {
            res = res.data;
            if (res.message) {
              toast.error(`${res.message}`);
            } else {
              toast.success(`${Globals.STRINGS.sucess_Update}`);
              setvisibility(values.visibility);
            }
          })
          .catch(err => {
            toast.error(`${err}`);
          });
      }

      return (
        <Form.Select
          onChange={e => {
            let val = e.currentTarget.value;
            setTimeout(() => {
              go_update({ visibility: val, ID });
            }, 400);
          }}
          className={`fw-bold ${
            visibility === 'active'
              ? 'text-success'
              : visibility === 'blocked'
              ? 'text-danger'
              : 'text-secondary'
          }`}
          size="sm"
          aria-label="Bulk actions"
          defaultValue={visibility}
        >
          <option value="active" className="text-success fw-bold">
            Active
          </option>
          <option value="blocked" className="text-danger fw-bold">
            Désactivé
          </option>
        </Form.Select>
      );
    }
  },
  {
    accessor: 'user_status',
    Header: 'Niveau',
    headerProps: { style: { minWidth: '200px' }, className: 'ps-5' },
    cellProps: { className: 'ps-5' },
    Cell: rowData => {
      const { ID } = rowData.row.original;
      const [user_status, setStatus] = React.useState(
        rowData.row.original.user_status
      );
      function go_update(values) {
        UpdateUserLevel(UriEncoder(values))
          .then(res => {
            res = res.data;
            if (res.message) {
              toast.error(`${res.message}`);
            } else {
              toast.success(`${Globals.STRINGS.sucess_Update}`);
              setStatus(values.visibility);
            }
          })
          .catch(err => {
            toast.error(`${err}`);
          });
      }
      return (
        <Form.Select
          onChange={e => {
            let val = e.currentTarget.value;
            setTimeout(() => {
              go_update({ user_status: val, ID });
            }, 400);
          }}
          className={`fw-bold ${
            user_status != 1
              ? 'text-info rounded border border-top-2 border-info'
              : 'text-secondary'
          }`}
          size="sm"
          aria-label="Bulk actions"
          defaultValue={user_status}
        >
          <option value={4} className="fw-bold text-secondary">
            Administrateur
          </option>
          <option value={1} className="fw-bold text-primary">
            Simple
          </option>
        </Form.Select>
      );
    }
  },
  {
    accessor: 'joined',
    Header: 'Incrit le',
    Cell: rowData => {
      const { joined } = rowData.row.original;
      return (
        <span className=" fw-bold">{dayjs(joined).format('DD MMM YYYY')}</span>
      );
    }
  }
];
const Users = () => {
  const [customers, setcustomers] = useState([]);

  useEffect(() => {
    load_init();
  }, []);

  function load_init() {
    GetOptions('users').then(res => {
      if (res) {
        res = res.data;
        if (res.message || res.error) {
          toast.error(`${res.message || res.error}`);
        } else {
          setcustomers(res);
        }
      }
    });
  }

  Globals.load_init = load_init;
  function go_bulkpdate(selectedRowIds, visibility) {
    selectedRowIds = Object.keys(selectedRowIds).map(
      m => customers[Number(m)].ID
    );

    UpdateUserStatus(UriEncoder({ visibility, ids: selectedRowIds }), 'bulk')
      .then(res => {
        res = res.data;
        if (res.message) {
          toast.error(`${res.message}`);
        } else {
          toast.success(`${Globals.STRINGS.sucess_Update}`);
          Globals.load_init();
        }
      })
      .catch(err => {
        toast.error(`${err}`);
      });
  }
  return (
    <AdvanceTableWrapper
      columns={columns}
      data={customers}
      selection
      sortable
      pagination
      perPage={10}
    >
      {customers.length === 0 ? (
        <div>
          <Emptyser message={'Aucun Utilisateur'} />
        </div>
      ) : (
        <Card className="mb-3">
          <Card.Header>
            <CustomersTableHeader go_update={go_bulkpdate} table />
          </Card.Header>
          <Card.Body className="p-0">
            <AdvanceTable
              table
              headerClassName="bg-200 text-900 text-nowrap align-middle"
              rowClassName="align-middle white-space-nowrap"
              tableProps={{
                size: 'sm',
                striped: true,
                className: 'fs--1 mb-0 overflow-hidden'
              }}
            />
          </Card.Body>
          <Card.Footer>
            <AdvanceTablePagination table />
          </Card.Footer>
        </Card>
      )}
    </AdvanceTableWrapper>
  );
};

export default Users;
