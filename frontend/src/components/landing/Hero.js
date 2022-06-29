/* eslint-disable react/prop-types */
import React from 'react';
import Typed from 'react-typed';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bg1 from 'assets/img/generic/bg-2.jpg';
import dashboard from 'assets/img/generic/dashboard-alt.png';
import Section from 'components/common/Section';

const Hero = () => {
  const [ft, fts, fa, st, obt, obtl] = [
    'SATIS FINTECH est le Spécialiste panafricain ',
    'Satis met la gestion des plaintes au service de la rentabilité des institutions financières.',
    ['de la gestion', 'du mobile', 'de solution Saas', 'de supervision'],
    'Nos solutions s’adaptent à tous les écosystèmes en Banque, Microfinance et Assurance',
    "Version d'essaie",
    '/'
  ];

  return (
    <Section
      className="py-0 overflow-hidden light"
      image={bg1}
      position="center bottom"
      overlay
    >
      <Row className="justify-content-center align-items-center pt-8 pt-lg-10 pb-lg-9 pb-xl-0">
        <Col
          md={11}
          lg={8}
          xl={6}
          className="pb-7 pb-xl-9 text-center text-xl-start align-center"
        >
          <h1 className="text-white fw-light fs-3  align-center">
            {ft}
            <br />
            <Typed
              strings={fa}
              typeSpeed={40}
              backSpeed={50}
              className="fw-bold px-2 fs-5  align-center text-info"
              loop
            />
            <br /> {fts}
          </h1>
          <p className="lead text-white opacity-75">{st}</p>
          <Button
            as={Link}
            variant="outline-light"
            size="lg"
            className="border-2 rounded-pill mt-4 fs-0 py-2"
            to={obtl}
          >
            {obt}
            <FontAwesomeIcon icon="play" transform="shrink-6 down-1 right-5" />
          </Button>
        </Col>
        <Col xl={{ span: 6 }} className="align-self-end mt-4 mt-xl-0">
          <Link to="/" className="img-landing-banner">
            <img className="img-fluid" src={dashboard} alt="" />
          </Link>
        </Col>
      </Row>
    </Section>
  );
};

export default Hero;
