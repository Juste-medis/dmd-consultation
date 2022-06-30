/* eslint-disable react/prop-types */
import React from 'react';
import { IoAlertCircle } from 'react-icons/io5';
import { BiTimer } from 'react-icons/bi';
import { msToTime } from 'helpers/utils';

const Emptyser = ({ message, action, time }) => {
  const [counter, setCounter] = React.useState(time);

  // Third Attempts
  React.useEffect(() => {
    const timer =
      counter > 0 &&
      setInterval(() => {
        setCounter(counter - 1000);
      }, 1000);
    return () => clearInterval(timer);
  }, [counter]);
  return (
    <div className="d-flex justify-content-center col-12 mt-5">
      <div className="d-flex flex-column justify-content-center rounded-2 p-3 bg-light text-center shadow-sm col-10 col-sm-6 text-700">
        <div
          className="icon-item bg-soft-secondary shadow-none align-center align-self-center"
          style={{ height: '10rem', width: '10rem' }}
        >
          {action === 'waiting' ? (
            <BiTimer size={100} className="text-secondary" />
          ) : (
            <IoAlertCircle size={100} className="text-secondary" />
          )}
        </div>
        <h5 className="text-secondary fs-0 mb-0 my-2 py-4 fst-italic">
          {message}
          <br />
        </h5>
        {time && <div>Réessayer dans : {msToTime(counter)}</div>}
      </div>
    </div>
  );
};

export default Emptyser;
