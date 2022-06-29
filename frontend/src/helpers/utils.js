import serialize from 'serialize-javascript';
import DOMPurify from 'dompurify';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/fr';
dayjs.extend(duration);

export const isIterableArray = array => Array.isArray(array) && !!array.length;

//===============================
// Breakpoints
//===============================
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1540
};

//===============================
// Store
//===============================
export const getItemFromStore = (key, defaultValue, store = localStorage) => {
  const elmnt = store.getItem(key) || defaultValue;
  try {
    const ret = JSON.parse(elmnt);
    return ret;
  } catch (e) {
    return elmnt;
  }
};

export const setItemToStore = (key, payload, store = localStorage) =>
  store.setItem(key, JSON.stringify(payload));

export const getStoreSpace = (store = localStorage) =>
  parseFloat(
    (
      escape(encodeURIComponent(JSON.stringify(store))).length /
      (1024 * 1024)
    ).toFixed(2)
  );

//===============================
// Cookie
//===============================
export const getCookieValue = name => {
  const value = document.cookie.match(
    '(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)'
  );
  return value ? value.pop() : null;
};

export const createCookie = (name, value, cookieExpireTime) => {
  const date = new Date();
  date.setTime(date.getTime() + cookieExpireTime);
  const expires = '; expires=' + date.toUTCString();
  document.cookie = name + '=' + value + expires + '; path=/';
};

export const numberFormatter = (number, fixed = 2) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(number)) >= 1.0e9
    ? (Math.abs(Number(number)) / 1.0e9).toFixed(fixed) + 'B'
    : // Six Zeroes for Millions
    Math.abs(Number(number)) >= 1.0e6
    ? (Math.abs(Number(number)) / 1.0e6).toFixed(fixed) + 'M'
    : // Three Zeroes for Thousands
    Math.abs(Number(number)) >= 1.0e3
    ? (Math.abs(Number(number)) / 1.0e3).toFixed(fixed) + 'K'
    : Math.abs(Number(number)).toFixed(fixed);
};

//===============================
// Colors
//===============================
export const hexToRgb = hexValue => {
  let hex;
  hexValue.indexOf('#') === 0
    ? (hex = hexValue.substring(1))
    : (hex = hexValue);
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
  );
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : null;
};

export const rgbColor = (color = colors[0]) => `rgb(${hexToRgb(color)})`;
export const rgbaColor = (color = colors[0], alpha = 0.5) =>
  `rgba(${hexToRgb(color)},${alpha})`;

export const colors = [
  '#2c7be5',
  '#00d97e',
  '#e63757',
  '#39afd1',
  '#fd7e14',
  '#02a8b5',
  '#727cf5',
  '#6b5eae',
  '#ff679b',
  '#f6c343'
];

export const themeColors = {
  primary: '#2c7be5',
  secondary: '#748194',
  success: '#00d27a',
  info: '#27bcfd',
  warning: '#f5803e',
  danger: '#e63757',
  light: '#f9fafd',
  dark: '#0b1727'
};

export const grays = {
  white: '#fff',
  100: '#f9fafd',
  200: '#edf2f9',
  300: '#d8e2ef',
  400: '#b6c1d2',
  500: '#9da9bb',
  600: '#748194',
  700: '#5e6e82',
  800: '#4d5969',
  900: '#344050',
  1000: '#232e3c',
  1100: '#0b1727',
  black: '#000'
};

export const darkGrays = {
  white: '#fff',
  1100: '#f9fafd',
  1000: '#edf2f9',
  900: '#d8e2ef',
  800: '#b6c1d2',
  700: '#9da9bb',
  600: '#748194',
  500: '#5e6e82',
  400: '#4d5969',
  300: '#344050',
  200: '#232e3c',
  100: '#0b1727',
  black: '#000'
};

export const getGrays = isDark => (isDark ? darkGrays : grays);

export const rgbColors = colors.map(color => rgbColor(color));
export const rgbaColors = colors.map(color => rgbaColor(color));

export const getColor = (name, dom = document.documentElement) => {
  return getComputedStyle(dom).getPropertyValue(`--falcon-${name}`).trim();
};

//===============================

// Echarts
//===============================
export const getPosition = (pos, params, dom, rect, size) => ({
  top: pos[1] - size.contentSize[1] - 10,
  left: pos[0] - size.contentSize[0] / 2
});
//===============================
// E-Commerce
//===============================
export const calculateSale = (base, less = 0, fix = 2) =>
  (base - base * (less / 100)).toFixed(fix);
export const getTotalPrice = (cart, baseItems) =>
  cart.reduce((accumulator, currentValue) => {
    const { id, quantity } = currentValue;
    const { price, sale } = baseItems.find(item => item.id === id);
    return accumulator + calculateSale(price, sale) * quantity;
  }, 0);
export const getSubtotal = items =>
  items.reduce((acc, curr) => curr.price * curr.quantity + acc, 0);
export const getDiscountPrice = (total, discount) =>
  total - total * (discount / 100);

export const getProductsQuantity = products =>
  products.reduce((acc, product) => product.quantity + acc, 0);

//===============================
// Helpers
//===============================
export const getPaginationArray = (totalSize, sizePerPage) => {
  const noOfPages = Math.ceil(totalSize / sizePerPage);
  const array = [];
  let pageNo = 1;
  while (pageNo <= noOfPages) {
    array.push(pageNo);
    pageNo = pageNo + 1;
  }
  return array;
};

export const capitalize = str =>
  (str.charAt(0).toUpperCase() + str.slice(1)).replace(/-/g, ' ');

export const camelize = str => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

export const dashed = str => {
  return str.toLowerCase().replaceAll(' ', '-');
};

//routes helper

export const flatRoutes = childrens => {
  const allChilds = [];

  const flatChild = childrens => {
    childrens.forEach(child => {
      if (child.children) {
        flatChild(child.children);
      } else {
        allChilds.push(child);
      }
    });
  };
  flatChild(childrens);

  return allChilds;
};

export const getFlatRoutes = children =>
  children.reduce(
    (acc, val) => {
      if (val.children) {
        return {
          ...acc,
          [camelize(val.name)]: flatRoutes(val.children)
        };
      } else {
        return {
          ...acc,
          unTitled: [...acc.unTitled, val]
        };
      }
    },
    { unTitled: [] }
  );

export const routesSlicer = ({ routes, columns = 3, rows }) => {
  const routesCollection = [];
  routes.map(route => {
    if (route.children) {
      return route.children.map(item => {
        if (item.children) {
          return routesCollection.push(...item.children);
        }
        return routesCollection.push(item);
      });
    }
    return routesCollection.push(route);
  });

  const totalRoutes = routesCollection.length;
  const calculatedRows = rows || Math.ceil(totalRoutes / columns);
  const routesChunks = [];
  for (let i = 0; i < totalRoutes; i += calculatedRows) {
    routesChunks.push(routesCollection.slice(i, i + calculatedRows));
  }
  return routesChunks;
};

export const getPageName = pageName => {
  return window.location.pathname.split('/').slice(-1)[0] === pageName;
};

export const copyToClipBoard = textFieldRef => {
  const textField = textFieldRef.current;
  textField.focus();
  textField.select();
  document.execCommand('copy');
};

export const reactBootstrapDocsUrl = 'https://react-bootstrap.github.io';

export const pagination = (currentPage, size) => {
  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let prev = currentPage - 1 - Math.floor(size / 2);

  if (currentPage - 1 - Math.floor(size / 2) < 0) {
    prev = 0;
  }
  if (currentPage - 1 - Math.floor(size / 2) > pages.length - size) {
    prev = pages.length - size;
  }
  const next = prev + size;

  return pages.slice(prev, next);
};

export const tooltipFormatter = params => {
  let tooltipItem = ``;
  params.forEach(el => {
    tooltipItem =
      tooltipItem +
      `<div class='ms-1'> 
        <h6 class="text-700"><span class="fas fa-circle me-1 fs--2" style="color:${
          el.borderColor ? el.borderColor : el.color
        }"></span>
          ${el.seriesName} : ${
        typeof el.value === 'object' ? el.value[1] : el.value
      }
        </h6>
      </div>`;
  });
  return `<div>
            <p class='mb-2 text-600'>
              ${
                dayjs(params[0].axisValue).isValid()
                  ? dayjs(params[0].axisValue).format('MMMM DD')
                  : params[0].axisValue
              }
            </p>
            ${tooltipItem}
          </div>`;
};

export const addIdField = items => {
  return items.map((item, index) => ({
    id: index + 1,
    ...item
  }));
};

// get file size

export const getSize = size => {
  if (size < 1024) {
    return `${size} Byte`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
};

/* Get A Random Number */
export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/* get Dates between */

export const getDates = (
  startDate,
  endDate,
  interval = 1000 * 60 * 60 * 24
) => {
  const duration = endDate - startDate;
  const steps = duration / interval;
  return Array.from(
    { length: steps + 1 },
    (v, i) => new Date(startDate.valueOf() + interval * i)
  );
};

/* Get Past Dates */
export const getPastDates = duration => {
  let days;

  switch (duration) {
    case 'week':
      days = 7;
      break;
    case 'month':
      days = 30;
      break;
    case 'year':
      days = 365;
      break;

    default:
      days = duration;
  }

  const date = new Date();
  const endDate = date;
  const startDate = new Date(new Date().setDate(date.getDate() - (days - 1)));
  return getDates(startDate, endDate);
};

// Add id to items in array
export const addId = items =>
  items.map((item, index) => ({
    id: index + 1,
    ...item
  }));

//
export const getTimeDuration = (startDate, endDate, format = '') => {
  return dayjs.duration(endDate.diff(startDate)).format(format);
};

// Get Percentage
export const getPercentage = (number, percent) => {
  return (Number(number) / 100) * Number(percent);
};

//get chunk from array
export const chunk = (arr, chunkSize = 1, cache = []) => {
  const tmp = [...arr];
  if (chunkSize <= 0) return cache;
  while (tmp.length) cache.push(tmp.splice(0, chunkSize));
  return cache;
};
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//--------------------------------------------------------------

/**
 *to convert ms to date
 * @param {conv} time the ms time
 */
export function secondTotime(time) {
  return ~~(time / 60) + ':' + (time % 60 < 10 ? '0' : '') + (time % 60);
}

/**
 *to convert object to hour
 * @param {conv} time the ms time
 */
export function computeTime(time) {
  let car = {
    1: 24,
    2: 1,
    3: 0.017
  };
  //"duration": "{\"dur\":66,\"unit\":1}"
  return time.dur * car[time.unit];
}

/**
 *to convert object to hour
 * @param {conv} time the ms time
 */
export function hour_to_string(time, separator = ' h ', limit = ' min') {
  let plain = Math.trunc(time);
  let minute = Math.trunc(60 * (time - plain));
  return `${
    plain.toString().length === 1 ? '0' + plain : plain
  } ${separator.toString()} ${
    minute.toString().length === 1 ? '0' + minute : minute
  } ${limit.toString()} `;
}

/**
 *to random a value from an object
 * @param {conv} time the ms time
 */
export function randomObjProp(obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
}
export function randomArrProp(arr) {
  const random = Math.floor(Math.random() * arr.length);
  return arr[random];
}

/**
 *to random a value from an object
 * @param {conv} time the ms time
 */
export function date_stringer(last_modified) {
  let year = last_modified.getFullYear(),
    month = last_modified.getMonth() + 1,
    dt = last_modified.getDate();
  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return year + '-' + month + '-' + dt;
}

export function duration_stringer(date) {
  let year = Number(date.substr(0, 2)),
    month = Number(date.substr(3, 5)),
    dt = Number(date.substr(6, 8));
  year = year > 0 ? `${year} ans` : '';
  month = month > 0 ? `${month} mois` : '';
  dt = dt > 0 ? `${dt} jours` : '';
  return year + ' ' + month + ' ' + dt;
}

/**
 *deleteAllCookies
 * @param {conv} time the ms time
 */

export function deleteAllCookies() {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

export function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

/**
 *to convert data to strin date format "yyyy/mm/dd"
 * @param {conv} time the ms time
 */
export function date_to_string(last_modified, whithHour) {
  if (last_modified) {
    last_modified = new Date(last_modified);
    let year = last_modified.getFullYear();
    let month = last_modified.getMonth() + 1;
    let dt = last_modified.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    let strdate = year + '-' + month + '-' + dt;
    strdate += whithHour
      ? ' , ' + last_modified.getHours() + ':' + last_modified.getMinutes()
      : '';

    return strdate;
  }
}
/**
 *ordon list based on @param {compar} a property
 */
export function ordoner(res, compar, order = 1) {
  return res.sort(function compare(a, b) {
    let fi = compar ? a[compar] : a;
    let se = compar ? b[compar] : b;
    if (fi < se) {
      return -order || -1;
    }
    if (fi > se) {
      return order || 1;
    }
    return 0;
  });
}

/**
 *join les noms par des tirets @param {compar} a property
 */

export function hypheny(res) {
  return res ? res.replace(/\s+/g, '-') : '';
}
/**
 *casse un string de forme "a_b_c_ ou les clés prrécèdent les valeurs
  en objet key-value"
 @param {compar} a property
 */
export function CookiePersonalizer(res) {
  let votea = res.split('_');
  let tt = {};
  for (let ci = 0; ci < votea.length - 1; ci++) {
    tt[votea[ci]] = Number(votea[ci + 1]);
    ci++;
  }
  return tt;
}
/**
 *serealiser les donnéess @param {compar} a property
 */

export function ObjectSerealizer(res) {
  var result = {};
  for (var key in res) {
    result[key] = serialize(res[key]);
  }
  return result;
}
/**
 *serealiser les donnéess @param {compar} a property
 */

export function UriEncoder(obj) {
  var formBody = [];
  for (var property in obj) {
    formBody.push(
      encodeURIComponent(property) + '=' + encodeURIComponent(obj[property])
    );
  }
  formBody = formBody.join('&');
  return formBody;
}
/**
 *purifier les html @param {compar} a property
 */
export const createMarkup = html => {
  return {
    __html: DOMPurify.sanitize(html)
  };
};
/**
 *purifier les textes @param {compar} a property
 */
export const dom_purify = text => {
  return DOMPurify.sanitize(text);
};
/*
function deserialize(serializedJavascript) {
  // eslint-disable-next-line no-eval
  return eval("(" + serializedJavascript + ")");
}
*/
/**
 *verifie la presence d'un id dans un itm array@param {compar} a property
 */
/*determine la présence de l'id dans un tableau d'option*/

export const is_itemed = (arr, s, id) => {
  if (arr[s])
    return (
      arr[s] &&
      (arr[s].findIndex(item => item === id) !== -1 ||
        arr[s].findIndex(item => Number(item.id) === id) !== -1)
    );
};

/**
 *join  @param {compar} a property
 *aide a inflater un array state
/**/

export const actonlist_inflater = (
  pre_ret,
  setpre_ret,
  intex,
  type = 'string',
  schema = ''
) => {
  let pre_reti = pre_ret;
  const itemIndex = pre_ret[intex];
  if (typeof itemIndex === type) {
    pre_reti = pre_reti.filter((item, index) => index !== intex);
  } else {
    pre_reti = [...pre_reti, schema];
  }
  return setpre_ret([...pre_reti]);
};

/**
 *join  @param {compar} a property
 *aide a reccuperer les change de la liste inflater
/**/

export const inflater_changeGetter = (pre_ret, setpre_ret, val, intex) => {
  let pre_reti = pre_ret;
  pre_reti[intex] = val;
  setpre_ret(pre_reti);
  return setpre_ret(pre_reti);
};

/**
 *Compare deux objets par valeurs
 */

export const object_comparer = (o1, o2) => {
  for (var key in o1) {
    if (o1[key] !== o2[key]) {
      return true;
    }
  }
  return false;
};

/**
 *distibct element in array
 */
export const uniquize = (res, po) => {
  const result = [];
  const map = new Map();
  for (const item of res) {
    if (!map.has(item[po])) {
      map.set(item[po], true);
      result.push(item);
    }
  }
  return result;
};

/**
 *group array based on specified field
 */
export const group_arr = (data = [], field = 'time') => {
  // this gives an object with dates as keys
  const groups = data.reduce((groups, game) => {
    const date = game[field].split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(game);
    return groups;
  }, {});

  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map(date => {
    return {
      [field]: date,
      games: groups[date]
    };
  });

  return groupArrays;
};

/**
 *get start and end date of week month or year
 */
export const getMomentInterval = (moment = 'week') => {
  let start, end;
  var curr = new Date();

  function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getnumberfromString(txt) {
    var numb = txt.match(/\d/g);
    numb = numb.join('');
    return Number(numb);
  }

  switch (moment) {
    case 'day':
      start = new Date(curr.setUTCHours(0, 0, 0, 0)).toUTCString();
      end = new Date(curr.setUTCHours(23, 59, 59, 999)).toUTCString();
      break;
    case 'week':
      start = curr.getDate() - curr.getDay();
      end = start + 7;
      start = new Date(curr.setDate(start)).toISOString();
      end = new Date(curr.setDate(end)).toISOString();
      break;
    case 'month':
      start = new Date(curr.setDate(1)).toISOString();
      end = new Date(
        curr.setDate(daysInMonth(curr.getMonth(), curr.getFullYear()))
      ).toISOString();
      break;
    case 'year':
      start = new Date(curr.setMonth(0, 1)).toISOString();
      end = new Date(curr.setMonth(11, 31)).toISOString();
      break;
    default:
      start = curr.getDate() - getnumberfromString(moment);
      start = new Date(curr.setDate(start)).toISOString();
      end = new Date().toISOString();
      break;
  }
  return [start, end];
};

/**
 *distibct element in array
 */
export const reorder_draggable = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const eventFire = (el, etype) => {
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
};
