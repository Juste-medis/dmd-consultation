/* eslint-disable react/prop-types */
import React from 'react';
const DescriptorTitle = ({ title, description }) => {
  return (
    <div className=" pb-3">
      <h3 className="text-dark mb-0 poppins-medium">{title}</h3>
      <p className="h6 fs--1 p-1 text-600">{description}</p>
    </div>
  );
};

export default DescriptorTitle;
