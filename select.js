const converter = require("@iota/converter");

class IotaQLSelect {
  constructor(iota, seed, options) {
    this._iota = iota;
    this._values = {};
    this.options = options || {};
    this.options.valueField = this.options.valueField || "_iota_value";
    this.options.inputField = this.options.inputField || "_iota_input";
  }

  from(table) {
    let address = table, tag = null;
    if (this.options.address !== undefined) {
      address = this.options.address;
      tag = converter.asciiToTrytes(table);
    }

    return new Promise((resolve, reject) => {
      this._iota.findTransactionObjects({
        addresses: [address],
        tags: [tag]
      }).then((transactions) => {
        let values = transactions.map((value) => {
          let message = value.signatureMessageFragment;

          if(message.length % 2 === 1) {
            message = message + "9";
          }

          message = converter.trytesToAscii(message);
          try {
            return JSON.parse(message.replace(/\0/g, ""));
          } catch(error) {
            return null;
          }
        });

        resolve(values, transactions);
      }).catch((error) => {
        reject(error);
      });
    })
  }
}
module.exports = IotaQLSelect;