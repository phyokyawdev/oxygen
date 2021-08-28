const { scrypt, randomBytes } = require("crypto");
const { promisify } = require("util");

const scryptAsync = promisify(scrypt);

/**
 * Hash password
 * @param {string} password - Password to be hashed.
 * @returns {Promise<string>} - Hashed password.
 */
async function toHash(password) {
  const salt = randomBytes(8).toString("hex");
  const buf = await scryptAsync(password, salt, 64);

  return `${buf.toString("hex")}l${salt}`;
}

/**
 * Compare passwords
 * @param {string} storedPassword - Password stored in db.
 * @param {string} suppliedPassword - Password supplied by user.
 * @returns {Promise<boolean>} - Boolean
 */
async function compare(storedPassword, suppliedPassword) {
  const [hashedPassword, salt] = storedPassword.split("l");
  const buf = await scryptAsync(suppliedPassword, salt, 64);

  return buf.toString("hex") === hashedPassword;
}

module.exports = { toHash, compare };
