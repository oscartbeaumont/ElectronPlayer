const Application = require('spectron').Application;
const assert = require('assert');
const path = require('path');

describe('Application Launch', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.app = new Application({
      path: path.join(__dirname, "../dist/mac/Netflix.app/Contents/MacOS/Netflix"),
      args: [path.join(__dirname, '..')]
    });
    return this.app.start();
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1);
      // Please note that getWindowCount() will return 2 if `dev tools` are opened.
      // assert.equal(count, 2)
    });
  });
});
