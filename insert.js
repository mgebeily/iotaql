const converter = require('@iota/converter');

class IotaQLInsert {
  constructor(iota, seed, options) {
    this._iota = iota;
    this._seed = seed;
    this.options = options || {};
    this.options.valueField = this.options.valueField || "_iota_value";
    this.options.inputField = this.options.inputField || "_iota_input";

    this._values = {};
  }

  values(values) {
    this._values = values;
    return this;
  }

  fund(address) {
    for(index in this._values) {
      value[index][this.options.inputField] = address;
    }
    return this;
  }

  into(table) {
    let address = table, tag = null;
    if (this.options.address !== undefined) {
      address = this.options.address;
      tag = converter.asciiToTrytes(table);
    }

    // Get transactions for each value
    let transfers = this._values.map((value, index, values) => {
      return {
        address: address,
        value: value[this.options.valueField] || 0,
        message: converter.asciiToTrytes(JSON.stringify(value)),
        tag: tag,
        timestamp: Date.now(),
        currentIndex: index,
        lastIndex: values.length,
        options: {
          inputs: [{ keyIndex: 0, address: value[this.options.inputField] }]
        }
      };
    });

    return new Promise((resolve, reject) => {
      this._iota.prepareTransfers(this._seed, transfers).then((trytes) => {
        return this._iota.sendTrytes(trytes, 4, 14);
      }).then((trytes) => {
        resolve(trytes);
      }).catch((error) => {
        reject(error);
      });
    });
  }
}
module.exports = IotaQLInsert;