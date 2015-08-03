(function() {
  'use strict';

  /* Creates a mock of socket.io for the browser.
   * Functionality of the service is tested through
   * the chat controller tests.
   */
  window.io = function() {
    this.cbs = {};
    this.on = function(msg, cb) {
      this.cbs[msg] = cb;
    };
    this.emit = function(msg, data) {
      this.cbs[msg](data);
    };
    this.removeListener = function(msg) {
      delete this.cbs[msg];
    };
    this.connect = function() {
      this.socket = {};
    };
    return this;
  };
})();
