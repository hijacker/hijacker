/* eslint-disable no-param-reassign, func-names */

const EventEmitter = require('events')

module.exports = (Hijacker) => {
  Hijacker.prototype._initEvents = function () {
    this._events = new EventEmitter()
  }

  Hijacker.prototype.on = function (eventName, cb) {
    this._events.on(eventName, cb)
  }

  Hijacker.prototype.once = function (eventName, cb) {
    this._events.once(eventName, cb)
  }

  Hijacker.prototype.off = function (eventName) {
    this._events.off(eventName)
  }

  Hijacker.prototype._emit = function (eventName, val) {
    this._events.emit(eventName, val)
  }
}
