/* eslint-disable react/prop-types */
import React from 'react';
import { Tooltip, Popover, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DescriptorTooltip = ({ tips, type }) => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        type === 1 ? (
          <Popover className="p-2 pop_main_dep" id="popover-basic">
            <div className="car_tooltip value_tiny_cate_top p-2">{tips}</div>
          </Popover>
        ) : (
          <Tooltip>{tips}</Tooltip>
        )
      }
    >
      <span>
        <FontAwesomeIcon
          icon={['far', 'question-circle']}
          transform="shrink-1"
          className="ms-1 text-400"
          id="weeklySalesTooltip"
        />
      </span>
    </OverlayTrigger>
  );
};

export default DescriptorTooltip;
