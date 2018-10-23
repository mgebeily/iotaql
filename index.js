const IOTA = require("@iota/core");
const IotaQLSelect = require("./select");
const IotaQLInsert = require("./insert");

class IotaQL {
  constructor(seed, options) {
    this._iota = this._initializeIOTA(options || {});

    this.select = new IotaQLSelect(this._iota, seed, options);
    this.insert = new IotaQLInsert(this._iota, seed, options);
  }

  insert(values) {
    return insert.values(values);
  }

  _initializeIOTA(options) {
    if(options.provider === undefined && options.host === undefined) {
      throw new TypeError('You must specify a host node.');
    }

    var iota = null;
    if(options.host !== undefined && options.port !== undefined) {
      iota = IOTA.composeAPI({ provider: options.host + ":" + options.port });
    } else if (options.provider !== undefined) {
      iota = IOTA.composeAPI({ provider: options.provider });
    }

    return iota;
  }
}
module.exports = IotaQL;
