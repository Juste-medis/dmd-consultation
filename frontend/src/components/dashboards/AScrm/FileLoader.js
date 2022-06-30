import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import React from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { AddConsultation, GetFileLines } from 'API/AFetcher';
import { toast } from 'react-toastify';
import Globals from 'Ressources/Globals';
const FileLoader = () => {
  const [connecting, setconnecting] = React.useState(false);
  const [nbrEr, setnbrEr] = React.useState(0);

  React.useEffect(() => {
    load_init();
  }, []);

  function load_init() {
    setconnecting(true);
    GetFileLines()
      .then(res => {
        setconnecting(false);
        res = res.data;
        if (res.message || res.error) {
          toast.error(`${res.message || res.error}`);
        } else {
          setnbrEr(`${res.lines < 10 ? '0' + res.lines : res.lines}`);
        }
      })
      .catch(err => {
        console.log('err1 => ', err);
      });
  }

  function _LoadExcelFile() {
    setconnecting(true);
    AddConsultation('', 'loadData')
      .then(res => {
        if (res.message) {
          toast.error(`${res.message}`);
        } else {
          toast.success(Globals.STRINGS.sucess_Update);
        }
        setconnecting(false);
      })
      .catch(err => {
        toast.error(`${err}`);
        setconnecting(false);
      });
  }

  return (
    <Card>
      <Card.Header className="pb-0">
        <Flex justifyContent="between">
          <div>
            <p className="mb-1 fs--2 text-500">Chargement dans la base </p>
            <h5 className="text-primary fs-0">Charger le fichier Excel </h5>
          </div>
          <div
            className="bg-soft-primary px-3 py-3 rounded-circle text-center"
            style={{ width: '60px', height: '60px' }}
          >
            <h5 className="text-primary mb-0 d-flex flex-column mt-n1">
              <span className="fs--1  mt-1">{nbrEr}</span>
              <small className="text-primary fs--2 lh-1">ENR</small>
            </h5>
          </div>
        </Flex>
      </Card.Header>

      <Card.Body as={Flex} alignItems="end">
        <Row className="g-3 justify-content-between">
          <Col xs={10} className="mt-0">
            <p className="fs--1 text-600 mb-0">
              Effectuez cette opération pour le chargement des données dans la
              base de données depuis le fichier Excel.
            </p>
          </Col>

          <Col xs="auto">
            <Button
              variant="success"
              className="w-100 fs--1"
              disabled={connecting}
              onClick={_LoadExcelFile}
            >
              <FontAwesomeIcon icon="file-excel" className="me-2" />
              Charger le fichier
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FileLoader;
