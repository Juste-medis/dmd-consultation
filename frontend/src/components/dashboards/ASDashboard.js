import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import RecentLeads from './items/recent-leads/RecentLeads';
import { GetConsultations } from 'API/AFetcher';
import { toast } from 'react-toastify';
import 'dayjs/locale/fr';
import { ordoner } from 'helpers/utils';
import Emptyser from 'components/JeriComponent/emptyser/emptyser';

let page = 1;

const ASDashboard = () => {
  const [consultations, setconsultations] = useState([]);
  const [sortBy, setsortBy] = useState({ find: [], sort: [], rfind: [] });
  const [connecting, setconnecting] = React.useState(false);

  const [waitingtime, setwaitingtime] = React.useState(0);
  const [waitingMessage, setwaitingMessage] = React.useState('');

  useEffect(() => {
    load_init();
  }, []);

  function load_init(query) {
    setconnecting(true);
    GetConsultations(query ? JSON.stringify(query) : null, page)
      .then(res => {
        setconnecting(false);
        res = res.data;
        if (res.message || res.error) {
          toast.error(`${res.message || res.error}`);
        } else if (res.wait_message) {
          setwaitingMessage(res.wait_message);
          setwaitingtime(res.duration);
          setTimeout(() => {
            handlesortage('all');
            setwaitingtime(0);
          }, res.duration);
        } else {
          page++;
          res = ordoner(res, 'code', -1);
          if (page === 2) {
            setconsultations(res);
          } else {
            setconsultations([...consultations, ...res]);
          }
        }
      })
      .catch(err => {
        console.log('err1 => ', err);
      });
  }

  function handlesortage(action, data, rdata) {
    page = 1;
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
  function _LoadMore() {
    load_init();
  }

  return (
    <>
      <Row className="g-3 mb-3">
        <Col xxl={12}>
          {waitingtime > 0 ? (
            <div>
              <Emptyser
                time={waitingtime}
                action="waiting"
                message={waitingMessage}
              />
            </div>
          ) : (
            <RecentLeads
              connecting={connecting}
              handlesortage={handlesortage}
              consults={consultations}
              _LoadMore={_LoadMore}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default ASDashboard;
