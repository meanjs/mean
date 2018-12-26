(() => {
  /* Creates a mock of socket.io for the browser.
   * Functionality of the service is tested through
   * the chat controller tests.
   */

  const ngInjector = angular.injector(['ng']);

  const $window = ngInjector.get('$window');

  const mock = () => {
    const io = {
      cbs: {},
      connect,
      emit,
      on,
      removeListener
    };

    connect();

    return io;

    function connect() {
      io.socket = {};
    }

    function emit(msg, data) {
      io.cbs[msg](data);
    }

    function on(msg, cb) {
      io.cbs[msg] = cb;
    }

    function removeListener(msg) {
      delete io.cbs[msg];
    }
  };

  $window.io = mock;
})();
