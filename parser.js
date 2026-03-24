/**
 * parser.js — Parses query strings into nested JSON objects.
 * Supports bracket notation: user[name]=John&items[0][id]=5
 */

const NUMERIC_KEY  = /^\d+$/;
const BRACKET_KEYS = /[^\[\]]+/g;

/**
 * Set a value in a nested structure following the given key path.
 * Creates intermediate objects/arrays as needed.
 */
function setNested(target, keys, value) {
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextIsNumeric = NUMERIC_KEY.test(keys[i + 1]);

    if (!(key in target) || typeof target[key] !== 'object' || target[key] === null) {
      target[key] = nextIsNumeric ? [] : {};
    }

    target = target[key];
  }

  const lastKey = keys.at(-1);

  if (lastKey in target) {
    const existing = target[lastKey];
    target[lastKey] = Array.isArray(existing) ? [...existing, value] : [existing, value];
  } else {
    target[lastKey] = value;
  }
}

/**
 * Parse a raw query string into a nested object.
 * Handles both encoded (%5B) and literal bracket notation.
 */
function parseQueryString(raw) {
  const result = {};

  for (const [rawKey, value] of new URLSearchParams(raw).entries()) {
    const keys = rawKey.match(BRACKET_KEYS) || [rawKey];
    setNested(result, keys, value);
  }

  return result;
}
