const serialize = require("serialize-javascript");
const sanitizeHtml = require("sanitize-html");

module.exports = {
  /**
   *
   * @param {shema} o1 fi
   * @param {raw} o2 fo
   * @returns object without not wanted keys
   */
  SimilObject: (o1, o2) => {
    var result = {};
    var keys = Object.keys(o1);
    for (var key in o2) {
      if (keys.includes(key)) {
        result[key] = o2[key];
      }
    }
    return result;
  },
  /**
   *
   * @param {shema} o1 fi
   * @returns object without html
   */ sanitizeObject: (o1) => {
    var result = {};
    var key = Object.keys(o1);
    for (var key in o1) {
      result[key] = sanitizeHtml(o1[key]);
    }
    return result;
  },
  /**
   *serealiser les donnéess @param {compar} a property
   */
  objectSerealizer: (res) => {
    var result = {};
    for (var key in res) {
      let safe = serialize(res[key]);
      safe = safe.substr(1, safe.length - 2);
      result[key] = safe;
    }
    return result;
  },
  /**
   *convetir en nombre les propriétés à valeurs numériques
   */ Numberrise: (res) => {
    for (var key in res) {
      let data = res[key];
      if (data?.length > 0 && !isNaN(res[key])) {
        res[key] = Number(res[key]);
      }
    }
    return res;
  },
  Booleanise: (res) => {
    for (var key in res) {
      let data = res[key];

      if (data == "true") res[key] = true;
      if (data == "false") res[key] = false;
    }
    return res;
  },
  /**
   *ordon list based on @param {compar} a property
   */ ordoner(res, compar, order = 1) {
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
  },
  /**
   *compare two array a and b
   */
  compareArray(a, b) {
    for (const v of new Set([...a, ...b]))
      if (a.filter((e) => e === v).length !== b.filter((e) => e === v).length)
        return false;
    return true;
  },

  /**
   *to convert data to strin date format "yyyy/mm/dd"
   * @param {conv} time the ms time
   */
  date_to_string(last_modified, whithHour) {
    if (last_modified) {
      last_modified = new Date(last_modified);
      let year = last_modified.getFullYear();
      let month = last_modified.getMonth() + 1;
      let dt = last_modified.getDate();

      if (dt < 10) {
        dt = "0" + dt;
      }
      if (month < 10) {
        month = "0" + month;
      }
      let strdate = year + "-" + month + "-" + dt;
      strdate += whithHour
        ? " , " + last_modified.getHours() + ":" + last_modified.getMinutes()
        : "";

      return strdate;
    }
  },
  /**
   *join les noms par des tirets @param {compar} a property
   */
  hypheny(res) {
    return res.replace(/\s+/g, "-");
  },
  /**
   * Returns a random integer between min (inclusive) and max (inclusive).
   * The value is no lower than min (or the next integer greater than min
   * if min isn't an integer) and no greater than max (or the next integer
   * lower than max if max isn't an integer).
   * Using Math.round() will give you a non-uniform distribution!
   */
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  /**
   *distibct element in array
   */ uniquize(res, po) {
    const result = [];
    const map = new Map();
    for (const item of res) {
      if (!map.has(item[po])) {
        map.set(item[po], true);
        result.push(item);
      }
    }
    return result;
  },

  /**
   *group array based on specified field
   */
  group_arr(data = [], field = "time") {
    // this gives an object with dates as keys
    const groups = data.reduce((groups, game) => {
      const date = game[field].split("T")[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    }, {});

    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map((date) => {
      return {
        [field]: date,
        games: groups[date],
      };
    });

    return groupArrays;
  },
};
