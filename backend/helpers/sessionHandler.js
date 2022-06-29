const SetCookie = (res, key, value, duration) => {
  res.cookie(key, value, {
    maxAge: duration,
    httpOnly: true,
    secure: true,
  });
};

const RemoveCookie = (res, key) => {
  res.cookie(key, "", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
  });
  res.clearCookie(key);
};
const getAppCookies = (req, res, name) => {
  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookies = {};
  rawCookies.forEach((rawCookie) => {
    const parsedCookie = rawCookie.split("=");
    parsedCookies[parsedCookie[0]] = parsedCookie[1];
  });
  return parsedCookies[name];
};

module.exports = {
  SetCookie,
  getAppCookies,
  RemoveCookie,
};
