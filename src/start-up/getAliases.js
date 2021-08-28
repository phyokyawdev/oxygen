function getAliases() {
  // <rootDir> is directory containing jest.config.js
  if (process.env.NODE_ENV === "test")
    return {
      "@root": "<rootDir>",
      "@app": "<rootDir>/src/app.js",
      "@shared/(.*)": "<rootDir>/src/shared/$1",
      "@models/(.*)": "<rootDir>/src/models/$1",
    };

  // __dirname is relative path to current file
  const root = __dirname + "/../../";
  return {
    "@root": root,
    "@app": root + "/src/app.js",
    "@shared/*": root + "/src/shared/*",
    "@models/*": root + "/src/models/*",
  };
}

module.exports = getAliases;
