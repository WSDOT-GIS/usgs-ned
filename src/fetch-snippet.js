if (typeof global !== "undefined" && !global.fetch) {
  global.fetch = require("node-fetch");
}