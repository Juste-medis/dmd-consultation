import React from 'react';
import { IoKeySharp } from 'react-icons/io5';

const LockScreen = () => {
  return (
    <div className="text-center">
      <IoKeySharp size={40} color="grey" />
      <h5 className="mt-3 mb-0">Bonjour</h5>
      <small>Vous n'êtes pas autorisé à accéder à cette page</small>
    </div>
  );
};

export default LockScreen;
