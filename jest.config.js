module.exports = {
  verbose: true,
  testEnvironment: "node",
  setupFiles: ["./src/test/env.js"],
  setupFilesAfterEnv: ["./src/test/setup.js"],
  moduleNameMapper: require("./src/start-up/getAliases")(),
};
