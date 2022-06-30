/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FalconCloseButton from 'components/common/FalconCloseButton';

const SearchBox = ({ onFormSubmited }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');

  useEffect(() => {
    // eslint-disable-next-line
  }, [searchInputValue]);
  function _loadConsultation(e) {
    e.preventDefault();
    console.log();
    if (onFormSubmited) {
      onFormSubmited(searchInputValue);
    }
  }

  return (
    <Dropdown className="search-box">
      <Dropdown.Toggle
        as="div"
        data-toggle="dropdown"
        aria-expanded={dropdownOpen}
        bsPrefix="toggle"
      >
        <Form onSubmit={_loadConsultation} className="position-relative">
          <Form.Control
            type="search"
            placeholder="Rechercher..."
            aria-label="Search"
            className="rounded-pill search-input"
            value={searchInputValue}
            onChange={({ target }) => setSearchInputValue(target.value)}
            onClick={() => setDropdownOpen(false)}
          />
          <FontAwesomeIcon
            icon="search"
            className="position-absolute text-400 search-box-icon"
          />
          {searchInputValue && (
            <div
              className="search-box-close-btn-container"
              // style={{ right: '10px', top: '8px' }}
            >
              <FalconCloseButton
                size="sm"
                noOutline
                onClick={() => setSearchInputValue('')}
              />
            </div>
          )}
        </Form>
      </Dropdown.Toggle>
    </Dropdown>
  );
};

export default SearchBox;
