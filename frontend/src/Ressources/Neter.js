/* eslint-disable no-undef */
const os = require('os');
const Globals = {
    uri1:
      location.hostname === 'localhost'
        ? 'https://localhost:2857'
        : `https://${location.hostname}:2857`,
    uri3: 'https://141.94.16.251'
  },
  expGloal = {
    uri1: os.hostname().includes('141.94') ? Globals.uri3 : Globals.uri1
  };
export default expGloal;
