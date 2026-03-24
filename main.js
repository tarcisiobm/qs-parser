/**
 * main.js — DOM interactions for QS Decoder.
 */

let examples = [];
let exampleIndex = 0;

fetch('examples.json')
  .then(r => r.json())
  .then(data => { examples = data; });

// -- DOM refs -----------------------------------------------------------------

const $input       = document.getElementById('input');
const $output      = document.getElementById('output');
const $badge       = document.getElementById('badge');
const $copyConfirm = document.getElementById('copy-confirm');
const $statKeys    = document.getElementById('stat-keys');
const $statDepth   = document.getElementById('stat-depth');
const $statParams  = document.getElementById('stat-params');

// -- Regex --------------------------------------------------------------------

const JSON_TOKEN    = /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;
const BOOLEAN_VALUE = /true|false/;

// -- Helpers ------------------------------------------------------------------

function maxDepth(obj, depth = 0) {
  if (typeof obj !== 'object' || obj === null) return depth;
  return Math.max(depth, ...Object.values(obj).map(v => maxDepth(v, depth + 1)));
}

/** Escape HTML using the DOM instead of manual replace chains. */
const escapeHTML = (() => {
  const el = document.createElement('span');
  return str => { el.textContent = str; return el.innerHTML; };
})();

/** Syntax-highlight a JSON string. Escapes HTML first to prevent XSS. */
function highlightJSON(json) {
  return escapeHTML(json).replace(JSON_TOKEN, match => {
    let cls = 'json-number';
    if (match.startsWith('"'))           cls = match.endsWith(':') ? 'json-key' : 'json-string';
    else if (BOOLEAN_VALUE.test(match))  cls = 'json-bool';
    else if (match === 'null')           cls = 'json-null';
    return `<span class="${cls}">${match}</span>`;
  });
}

function showBadge(type) {
  $badge.className = type;
  $badge.textContent = type === 'ok' ? 'ok' : 'error';
  $badge.hidden = false;
}

function resetStats() {
  $statKeys.textContent = $statDepth.textContent = $statParams.textContent = '—';
}

// -- Actions ------------------------------------------------------------------

function decode() {
  const raw = $input.value.trim();

  if (!raw) {
    $output.innerHTML = '<span class="placeholder">Paste a query string in the input field.</span>';
    $badge.hidden = true;
    resetStats();
    return;
  }

  try {
    const result = parseQueryString(raw);
    const json = JSON.stringify(result, null, 2);

    $output.innerHTML = highlightJSON(json);
    showBadge('ok');

    $statKeys.textContent   = Object.keys(result).length;
    $statDepth.textContent  = maxDepth(result);
    $statParams.textContent = new URLSearchParams(raw).size;
  } catch (err) {
    $output.innerHTML = `<span class="error">Error: ${err.message}</span>`;
    showBadge('err');
    resetStats();
  }
}

function clear() {
  $input.value = '';
  $output.innerHTML = '<span class="placeholder">JSON output will appear here</span>';
  $badge.hidden = true;
  resetStats();
}

function loadExample() {
  if (!examples.length) return;
  $input.value = examples[exampleIndex % examples.length];
  exampleIndex++;
  decode();
}

function copyOutput() {
  const text = $output.innerText;
  if (!text || $output.querySelector('.placeholder')) return;

  navigator.clipboard.writeText(text).then(() => {
    $copyConfirm.hidden = false;
    setTimeout(() => { $copyConfirm.hidden = true; }, 1800);
  });
}

// -- Events -------------------------------------------------------------------

document.getElementById('btn-decode').addEventListener('click', decode);
document.getElementById('btn-clear').addEventListener('click', clear);
document.getElementById('btn-example').addEventListener('click', loadExample);
document.getElementById('btn-copy').addEventListener('click', copyOutput);

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Enter') decode();
});
