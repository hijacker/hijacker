
class Logger {
  constructor(options) {
    this._options = options
  }

  log() {
    if (!this._options.disabled) {
      console.log(...arguments)
    }
  }
}

module.exports = Logger
