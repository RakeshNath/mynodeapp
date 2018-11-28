const assert = require('chai').assert;
const sayHello = require('../src/app').sayHello;

describe("App", () => {
  it("app should return hello", () => {
    assert.equal(sayHello(), "Hello Node");
  });
});
