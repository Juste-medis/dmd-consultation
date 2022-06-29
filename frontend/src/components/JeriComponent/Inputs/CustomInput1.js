/* eslint-disable react/prop-types */
import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CustomDateInput = forwardRef(
  (
    { value, onClick, isInvalid, isValid, formControlProps, errorMessage },
    ref
  ) => {
    return (
      <>
        <Form.Control
          ref={ref}
          isInvalid={isInvalid}
          isValid={isValid}
          value={value}
          onClick={onClick}
          {...formControlProps}
        />
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      </>
    );
  }
);

const CustomInput1 = ({
  label,
  name,
  errors,
  tips,
  type = 'text',
  options = [],
  placeholder,
  formControlProps,
  labelProps = { className: '' },
  formGroupProps,
  setValue,
  datepickerProps
}) => {
  const [date, setDate] = useState(null);

  if (type === 'date') {
    return (
      <Form.Group {...formGroupProps}>
        {!!label && <Form.Label>{label}</Form.Label>}

        <DatePicker
          selected={date}
          onChange={date => {
            setDate(date);
            setValue(name, date);
          }}
          customInput={
            <CustomDateInput
              formControlProps={formControlProps}
              errorMessage={errors[name]?.message}
              isInvalid={errors[name]}
              isValid={Object.keys(errors).length > 0 && !errors[name]}
            />
          }
          {...datepickerProps}
        />
      </Form.Group>
    );
  }

  if (type === 'checkbox' || type === 'switch' || type === 'radio') {
    return (
      <Form.Check type={type} {...formGroupProps}>
        <Form.Check.Input
          type={type}
          isInvalid={errors[name]}
          {...formControlProps}
          isValid={Object.keys(errors).length > 0 && !errors[name]}
        />
        <Form.Check.Label
          htmlFor={formControlProps.id}
          className={`${labelProps.className} ms-1 me-2 mb-0`}
        >
          {label}
          {tips && (
            <OverlayTrigger placement="top" overlay={<Tooltip>{tips}</Tooltip>}>
              <span>
                <FontAwesomeIcon
                  icon={['far', 'question-circle']}
                  transform="shrink-1"
                  className="ms-1 text-400"
                  id="weeklySalesTooltip"
                />
              </span>
            </OverlayTrigger>
          )}
        </Form.Check.Label>
        <Form.Control.Feedback type="invalid" className="mt-0">
          {errors[name]?.message}
        </Form.Control.Feedback>
      </Form.Check>
    );
  }
  if (type === 'selectsep') {
    return (
      <Form.Group {...formGroupProps}>
        {label && <h5 className=" fw-bold">{label}</h5>}
        <Form.Select
          type="select"
          {...formControlProps}
          isInvalid={errors[name]}
          isValid={Object.keys(errors).length > 0 && !errors[name]}
          placeholder={placeholder}
        >
          {options.map((option, index) => (
            <React.Fragment key={`ok${option.value || option}${index}`}>
              <option
                value={option}
                key={`ok${option.value || option}${index}`}
              >
                {option}
              </option>
              {index > 0 && index % 3 === 0 && (
                <option
                  value={option}
                  key={`oksep${option.value || option}${index}`}
                  disabled={true}
                >
                  **************************
                </option>
              )}
            </React.Fragment>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors[name]?.message}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }
  if (type === 'select') {
    return (
      <Form.Group {...formGroupProps}>
        {label && <h5 className=" fw-bold">{label}</h5>}
        <Form.Select
          type={type}
          {...formControlProps}
          isInvalid={errors[name]}
          isValid={Object.keys(errors).length > 0 && !errors[name]}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors[name]?.message}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }
  if (type === 'smartselect') {
    return (
      <Form.Group>
        <div className="my-3">
          {label && (
            <h5 className=" fw-bold">
              {label}

              {tips && (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{tips}</Tooltip>}
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
              )}
            </h5>
          )}
          <Select {...formGroupProps} />
        </div>
        <Form.Control.Feedback type="invalid">
          {errors[name]?.message}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }
  if (type === 'textarea') {
    return (
      <Form.Group {...formGroupProps}>
        {label && (
          <h5 className=" fw-bold">
            {label}
            {tips && (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{tips}</Tooltip>}
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
            )}
          </h5>
        )}
        <Form.Control
          as="textarea"
          placeholder={placeholder}
          {...formControlProps}
          isValid={Object.keys(errors).length > 0 && !errors[name]}
          isInvalid={errors[name]}
          rows={4}
        />
        <Form.Control.Feedback type="invalid">
          {errors[name]?.message}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }
  return (
    <Form.Group {...formGroupProps}>
      {label && (
        <h5 className=" fw-bold">
          {label}
          {tips && (
            <OverlayTrigger placement="top" overlay={<Tooltip>{tips}</Tooltip>}>
              <span>
                <FontAwesomeIcon
                  icon={['far', 'question-circle']}
                  transform="shrink-1"
                  className="ms-1 text-400"
                  id="weeklySalesTooltip"
                />
              </span>
            </OverlayTrigger>
          )}
        </h5>
      )}
      <Form.Control
        type={type}
        placeholder={placeholder}
        {...formControlProps}
        isInvalid={errors[name]}
        isValid={Object.keys(errors).length > 0 && !errors[name]}
      />
      <Form.Control.Feedback type="invalid">
        {errors[name]?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

CustomDateInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  isInvalid: PropTypes.bool,
  isValid: PropTypes.bool,
  formControlProps: PropTypes.object,
  errorMessage: PropTypes.string
};

CustomInput1.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  errors: PropTypes.object,
  type: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  labelProps: PropTypes.object,
  formControlProps: PropTypes.object,
  formGroupProps: PropTypes.object,
  isMulti: PropTypes.bool,
  setValue: PropTypes.func,
  datepickerProps: PropTypes.object
};

CustomInput1.defaultProps = { required: false };

export default CustomInput1;
