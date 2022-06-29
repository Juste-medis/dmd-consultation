/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardDropdown from 'components/common/CardDropdown';
import { statsData as statsDatai } from 'data/dashboard/crm';
import classNames from 'classnames';
import IconItem from 'components/common/icon/IconItem';
import StatsChart from './StatsChart';
import { getColor, group_arr } from 'helpers/utils';

const StatsItem = ({ stat }) => {
  const { icon, color, title, amount, caret, caretColor, target, data } = stat;
  return (
    <>
      <Flex justifyContent="center" alignItems="center" className="mb-3">
        <IconItem
          tag="div"
          icon={icon}
          bg={`soft-${color}`}
          color={color}
          size="sm"
          iconClass="fs--2"
          className="me-2 shadow-none"
        />
        <h6 className="mb-0 flex-1">{title}</h6>
        <CardDropdown />
      </Flex>
      <Flex>
        <p className="font-sans-serif lh-1 mb-1 fs-4 pe-2">{amount}</p>
        <div className="d-flex flex-column">
          <FontAwesomeIcon
            icon={caret}
            className={`me-1 mb-0 text-${caretColor}`}
          />
          <p className="fs--2 mb-0 mt-0 text-nowrap">{target}</p>
        </div>
        <div className="w-100 ms-2">
          <StatsChart color={getColor(color)} data={data} />
        </div>
      </Flex>
    </>
  );
};

const DemmandCrmStats = ({ statsData = statsDatai }) => {
  let actives = statsData.filter(
    mes => mes.response.date === null && mes.targetDelete === false
  );
  let responded = statsData.filter(mes => mes.response.date !== null);

  let resarr = [
    {
      id: 1,
      title: 'General',
      amount: statsData.length,
      target: `${statsData.length} sur ${statsData.length}`,
      icon: 'capsules',
      caret: 'caret-up',
      color: 'primary',
      caretColor: 'success',
      data: group_arr(statsData, 'post_date').map(mes => mes.games.length)
    },
    {
      id: 2,
      title: 'En cour',
      amount: actives.length,
      target: `${actives.length} sur ${statsData.length}`,
      icon: 'circle',
      caret: 'caret-up',
      color: 'success',
      caretColor: 'success',
      data: group_arr(actives, 'post_date').map(mes => mes.games.length)
    },
    {
      id: 3,
      title: 'Repondu',
      amount: responded.length,
      target: `${responded.length} sur ${statsData.length}`,
      icon: 'circle',
      caret: 'caret-up',
      color: 'secondary',
      caretColor: 'secondary',
      data: group_arr(responded, 'post_date').map(mes => mes.games.length)
    }
  ];
  const [stats] = useState(resarr);
  return (
    <Card>
      <Card.Body>
        <Row>
          {stats.map((stat, index) => (
            <Col
              lg={4}
              key={stat.id}
              className={classNames({
                'border-bottom border-lg-0 border-lg-end':
                  index !== stats.length - 1,
                'pb-3 pb-lg-0': index === 0,
                'py-3 py-lg-0': index === 1,
                'pt-3 pt-lg-0': index === 2
              })}
            >
              <StatsItem stat={stat} />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};
StatsItem.propTypes = {
  stat: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    caret: PropTypes.string.isRequired,
    caretColor: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    icon: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    target: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })
};

DemmandCrmStats.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.shape(StatsItem.propTypes.stat))
};

export default DemmandCrmStats;
