let kkiapay1 = {
    privatekey: "",
    publickey: "",
    secretkey: "",
  },
  kkiapay2 = {
    privatekey: "",
    publickey: "",
    secretkey: "",
    sandbox: true,
  },
  mailauth = {
    user: "",
    pass: "",
  };
module.exports = {
  kkiapay: global.localmachine ? kkiapay2 : kkiapay1,
  mailconnect: mailauth,
};
