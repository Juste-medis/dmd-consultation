let mailauth = {
  user: "medisadido@gmail.com",
  pass: "fd",
};
module.exports = {
  kkiapay: global.localmachine ? kkiapay2 : kkiapay1,
  mailconnect: mailauth,
};
