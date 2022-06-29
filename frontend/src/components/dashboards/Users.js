import React, { useState, useEffect } from 'react';
import { Card, Dropdown, Form } from 'react-bootstrap';
import CardDropdown from 'components/common/CardDropdown';
import { Link } from 'react-router-dom';
import Flex from 'components/common/Flex';
import Avatar from 'components/common/Avatar';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import CustomersTableHeader from './TablesHeaderrs/UsersTableHeader';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import {
  SAGetMyOptions,
  UpdateUserLevel,
  UpdateUserStatus
} from 'API/AFetcher';
import { toast } from 'react-toastify';
import { UriEncoder } from 'helpers/utils';
import Globals from 'Ressources/Globals';
import dayjs from 'dayjs';
import Emptyser from 'components/JeriComponent/emptyser/emptyser';

dayjs.locale('fr');

const columns = [
  {
    accessor: 'name',
    Header: 'Nom',
    headerProps: { className: 'pe-1' },
    cellProps: {
      className: 'py-2'
    },
    Cell: rowData => {
      const { name, avatar, ID } = rowData.row.original;
      return (
        <Link to={`/candidate/user-details/${ID}-${name}`}>
          <Flex alignItems="center">
            {avatar.img ? (
              <Avatar src={avatar.img} size="xl" className="me-2" />
            ) : (
              <Avatar size="xl" name={avatar.name} className="me-2" />
            )}
            <div className="flex-1">
              <h5 className="mb-0 fs--1">{name}</h5>
            </div>
          </Flex>
        </Link>
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
    accessor: 'user_type',
    Header: 'Type',
    Cell: rowData => {
      const { user_type } = rowData.row.original;
      return <span className="text-black fw-bold">{user_type}</span>;
    }
  },
  {
    accessor: 'visibility',
    Header: 'Niveau',
    headerProps: { style: { minWidth: '200px' }, className: 'ps-5' },
    cellProps: { className: 'ps-5' },
    Cell: rowData => {
      const { ID } = rowData.row.original;
      const [user_status, setvisibility] = React.useState(
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
          <option value={5} className="fw-bold text-secondary">
            Super Administrateur
          </option>
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
  },
  {
    accessor: 'none',
    Header: '',
    disableSortBy: true,
    cellProps: {
      className: 'text-end'
    },
    Cell: () => {
      return (
        <CardDropdown iconClassName="fs--1">
          <div className="py-2">
            <Dropdown.Item href="#!">Modifier</Dropdown.Item>
            <Dropdown.Item href="#!">Suprimer</Dropdown.Item>
          </div>
        </CardDropdown>
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
    SAGetMyOptions('users').then(res => {
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
