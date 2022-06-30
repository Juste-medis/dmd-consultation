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
    user: "medisadido@gmail.com",
    pass: "fd",
  };
module.exports = {
  kkiapay: global.localmachine ? kkiapay2 : kkiapay1,
  mailconnect: mailauth,
};
