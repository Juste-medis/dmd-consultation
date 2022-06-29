import React, { useState, useEffect } from 'react';
import { Card, Col, Button, Dropdown, Collapse } from 'react-bootstrap';
import CardDropdown from 'components/common/CardDropdown';
import { Link } from 'react-router-dom';
import Flex from 'components/common/Flex';
import Avatar from 'components/common/Avatar';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import DemandsTableHeader from './TablesHeaderrs/DemandsTableHeader';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import { SAGetMyOptions } from 'API/AFetcher';
import { toast } from 'react-toastify';
import Globals from 'Ressources/Globals';
import dayjs from 'dayjs';
import Emptyser from 'components/JeriComponent/emptyser/emptyser';
import DemmandCrmStats from './AScrm/DemandCrmStats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IoCloseCircle } from 'react-icons/io5';
import { ADemandtrieur } from 'components/dashboards/AdminDashboard/Items/apaginateur-trieur/Atrieur.js';
dayjs.locale('fr');

const columns = [
  {
    accessor: 'ID',
    Header: 'Demande',
    headerProps: { className: 'pe-1' },
    cellProps: {
      className: 'py-2'
    },
    Cell: rowData => {
      const { ID } = rowData.row.original;
      return (
        <Link to={`/demand/details/${ID}-casper`}>
          <h5 className="mb-0 fs--1">Demande {ID}</h5>
        </Link>
      );
    }
  },
  {
    accessor: 'company',
    Header: 'Entreprise',
    headerProps: { className: 'pe-1' },
    cellProps: {
      className: 'py-2'
    },
    Cell: rowData => {
      const { company } = rowData.row.original,
        { name, avatar, ID } = company;
      return (
        <Link to={`/candidate/user-details/${ID}-${name}`}>
          <Flex alignItems="center">
            {avatar.img ? (
              <Avatar src={avatar.img} size="xl" className="me-2" />
            ) : (
              <Avatar size="xl" name={name} className="me-2" />
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
    accessor: 'candidate',
    Header: 'Candidat',
    headerProps: { className: 'pe-1' },
    cellProps: {
      className: 'py-2'
    },
    Cell: rowData => {
      const { candidate } = rowData.row.original,
        { name, avatar, ID } = candidate;
      return (
        <Link to={`/candidate/user-details/${ID}-${name}`}>
          <Flex alignItems="center">
            {avatar.img ? (
              <Avatar src={avatar.img} size="xl" className="me-2" />
            ) : (
              <Avatar size="xl" name={name} className="me-2" />
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
    accessor: 'offer_title',
    Header: 'Offre',
    Cell: rowData => {
      const { offer_title, offerID } = rowData.row.original;
      return (
        <Link
          className="text-black fw-bold"
          to={`/offers/offer-details/${offerID}-${offer_title}?casper=casper`}
        >
          {offer_title}
        </Link>
      );
    }
  },
  {
    accessor: 'post_date',
    Header: 'Date',
    Cell: rowData => {
      const { post_date } = rowData.row.original;
      return (
        <span className=" fw-bold">
          {dayjs(post_date).format('DD MMM YYYY')}
        </span>
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

const SDemands = () => {
  const [customers, setcustomers] = useState([]);
  const [collapsede, setCollapsede] = useState(true);
  const [sortBy, setsortBy] = useState({ find: [], sort: [], rfind: [] });

  useEffect(() => {
    load_init();
  }, []);

  function load_init(query) {
    SAGetMyOptions('demands', query ? JSON.stringify(query) : null).then(
      res => {
        if (res) {
          res = res.data;
          if (res.message || res.error) {
            toast.error(`${res.message || res.error}`);
          } else {
            setcustomers(res);
          }
        }
      }
    );
  }

  function handlesortage(action, data, rdata) {
    let tdata = sortBy,
      { find, sort, rfind } = sortBy;
    if (action === 'find') {
      let concerned_key = find.findIndex(mes => mes.key === data.key),
        concerned_keyr;
      if (rdata) {
        concerned_keyr = rfind.findIndex(mes => mes.key === rdata?.key);
      }
      if (concerned_key !== -1) {
        find[concerned_key].value = data.value;
        if (rdata) {
          rfind[concerned_keyr].value = rdata.value;
        }
      } else {
        find.push(data);
        if (rdata) {
          rfind.push(rdata);
        }
      }
      tdata.find = find;
      if (rdata) {
        tdata.rfind = rfind;
      }
    } else if (action === 'sort') {
      let concerned_key = sort.findIndex(mes => mes.key === data.key);
      if (concerned_key !== -1) {
        sort[concerned_key].value = data.value;
      } else {
        sort.push(data);
      }
      tdata.sort = sort;
    } else if (action === 'all') {
      tdata = { find: [], sort: [], rfind: [] };
    }
    setsortBy(tdata);
    load_init(tdata);
  }
  Globals.load_init = load_init;
  const isSorting = sortBy.find.length > 0 || sortBy.sort.length > 0;

  return (
    <>
      <Col className="mb-3" xxl={12}>
        {customers.length > 0 && <DemmandCrmStats statsData={customers} />}
      </Col>
      <Card className="bg-100 shadow-none border mb-3">
        <Card.Body className="">
          <ADemandtrieur handlesortage={handlesortage} />
          {isSorting && (
            <Collapse in={collapsede}>
              <p className="mt-3 pb-3 border-top pt-3">
                <span className="pe-3 text-primary">
                  <Button
                    variant="light"
                    size="sm"
                    className="mx-1 shadow-none border-0"
                    onClick={() => {
                      setsortBy({ find: [], sort: [], rfind: [] });
                      load_init();
                    }}
                  >
                    <IoCloseCircle size={20} color="red" />
                  </Button>
                  Filtre :{' '}
                </span>
                {sortBy.rfind.map(mes => (
                  <span className="pe-3" key={mes.key}>
                    <span>
                      {mes.key}:
                      <strong className="fw-bold text-dark ps-2">
                        {mes.value}
                      </strong>
                    </span>
                  </span>
                ))}
              </p>
            </Collapse>
          )}
        </Card.Body>
        {isSorting && (
          <Card.Footer className="p-0 border-top d-grid">
            <Button
              className="p-0 shadow-none"
              variant="link"
              onClick={() => setCollapsede(!collapsede)}
            >
              <FontAwesomeIcon
                icon="chevron-down"
                className="ms-2 fs--2"
                transform={collapsede ? 'rotate-180' : ''}
              />
            </Button>
          </Card.Footer>
        )}
      </Card>
      <AdvanceTableWrapper
        columns={columns}
        data={customers}
        selection
        sortable
        pagination
        perPage={10}
      >
        <Card className="mb-3">
          <Card.Header>
            <DemandsTableHeader totalItems={customers.length} table />
          </Card.Header>
          <Card.Body className="p-0">
            {customers.length === 0 ? (
              <div>
                <Emptyser message="Aucune Demande" />
              </div>
            ) : (
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
            )}
          </Card.Body>
          <Card.Footer>
            <AdvanceTablePagination table />
          </Card.Footer>
        </Card>
      </AdvanceTableWrapper>
    </>
  );
};

export default SDemands;
