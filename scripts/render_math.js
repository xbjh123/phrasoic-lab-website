// Usage: node scripts/render_math.js input.html > output.html
const katex = require('katex');
const fs = require('fs');

const input = process.argv[2] === '-'
  ? fs.readFileSync('/dev/stdin', 'utf-8')
  : fs.readFileSync(process.argv[2], 'utf-8');

function renderBlock(m) {
  try { return katex.renderToString(m[1].trim(), { displayMode: true, throwOnError: false }); }
  catch { return m[0]; }
}
function renderInline(m) {
  try { return katex.renderToString(m[1], { displayMode: false, throwOnError: false }); }
  catch { return m[0]; }
}

let html = input;
html = html.replace(/\$\$\n?([\s\S]*?)\n?\$\$/g, renderBlock);
html = html.replace(/(?<!\$)\$(?!\$)([^$\n]+?)\$(?!\$)/g, renderInline);

process.stdout.write(html);
