import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';
import Layout from './layouts/Layout';
import SpinnerLarger7 from 'components/Spinners/large7';

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Suspense fallback={<SpinnerLarger7 viewtype={7} size={60} />}></Suspense>
      <Layout />
    </Router>
  );
};
export default App;
