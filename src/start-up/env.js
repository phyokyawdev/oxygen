module.exports = {
  check: (arr) => {
    arr.forEach((element) => {
      if (!process.env[element]) {
        throw new Error(`${element} must be defined`);
      }
    });
  },
};
