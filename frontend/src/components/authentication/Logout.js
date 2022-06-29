import React from 'react';
import LogoutContent from 'components/authentication/LogoutContent';
import AuthFetcher from 'API/AuthService';
import Cookies from 'universal-cookie';
import SpinnerLarger5 from 'components/Spinners/large5';

const Logout = () => {
  const cookies = new Cookies();
  const [deconnected, setdeconnected] = React.useState(false);
  React.useEffect(() => {
    AuthFetcher.Signout()
      .then(resi => {
        resi = resi.data;
        setdeconnected(resi);
        cookies.remove('___lo_rery_yap');
        cookies.remove('___lo_rery_yap_adi');
      })
      .catch(err => {
        console.log('err1 => ', err);
      });
  }, []);

  return (
    <div className="text-center">
      {deconnected ? <LogoutContent user={deconnected} /> : <SpinnerLarger5 />}
    </div>
  );
};

export default Logout;
