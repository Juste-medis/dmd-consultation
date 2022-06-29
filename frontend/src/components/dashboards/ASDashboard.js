import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import RecentLeads from './items/recent-leads/RecentLeads';
import { GetConsultations } from 'API/AFetcher';
import { toast } from 'react-toastify';
import 'dayjs/locale/fr';

const ASDashboard = () => {
  const [statistics, setstatistics] = useState([]);

  useEffect(() => {
    load_init();
  }, []);

  function load_init(query) {
    GetConsultations(query ? JSON.stringify(query) : null)
      .then(res => {
        res = res.data;
        console.log(res);
        if (res.message || res.error) {
          toast.error(`${res.message || res.error}`);
        } else {
          setstatistics(res);
        }
      })
      .catch(err => {
        console.log('err1 => ', err);
      });
  }

  return (
    <>
      <Row className="g-3 mb-3">
        <Col xxl={12}>
          <RecentLeads consults={statistics} />
        </Col>
      </Row>
    </>
  );
};

export default ASDashboard;
