
class Logger {
  constructor (options) {
    this._options = options
  }

  log (...args) {
    if (!this._options.disabled) {
      console.log(...args)
    }
  }
}

module.exports = Logger
