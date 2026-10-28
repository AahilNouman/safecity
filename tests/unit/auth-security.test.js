const test = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  if (!password || !storedPassword) return false;
  if (!storedPassword.includes(':')) {
    // Legacy plaintext support during migration
    return password === storedPassword;
  }
  const [salt, key] = storedPassword.split(':');
  if (!salt || !key) return false;
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

function isValidName(name) {
  if (typeof name !== 'string') return false;
  return name.trim().length >= 2 && name.trim().length <= 120;
}

test('Password Hashing: generates salted cryptographic scrypt hash', () => {
  const plain = 'SafeCityPass@2026';
  const hashed = hashPassword(plain);
  assert.ok(hashed.includes(':'));
  assert.notStrictEqual(plain, hashed);
  assert.strictEqual(verifyPassword(plain, hashed), true);
  assert.strictEqual(verifyPassword('WrongPassword', hashed), false);
});

test('Password Verification: preserves backwards compatibility with legacy plaintext seeds', () => {
  assert.strictEqual(verifyPassword('PlainLegacy123', 'PlainLegacy123'), true);
  assert.strictEqual(verifyPassword('Wrong', 'PlainLegacy123'), false);
});

test('Email Validator: accepts valid email formats and rejects malformed inputs', () => {
  assert.strictEqual(isValidEmail('commuter@safecity.in'), true);
  assert.strictEqual(isValidEmail('test.user+safety@sub.domain.org'), true);
  assert.strictEqual(isValidEmail('invalid'), false);
  assert.strictEqual(isValidEmail('missing@domain'), false);
  assert.strictEqual(isValidEmail(''), false);
  assert.strictEqual(isValidEmail(null), false);
  assert.strictEqual(isValidEmail(12345), false);
});

test('Name Validator: rejects whitespace-only or too short names', () => {
  assert.strictEqual(isValidName('Aahil Nouman'), true);
  assert.strictEqual(isValidName('Jo'), true);
  assert.strictEqual(isValidName(''), false);
  assert.strictEqual(isValidName('   '), false);
  assert.strictEqual(isValidName('A'), false);
  assert.strictEqual(isValidName(null), false);
});
