import katex from 'katex';
import { readFileSync, writeFileSync } from 'fs';

const file = process.argv[2];
let content = readFileSync(file, 'utf-8');

// Block math: $$...$$
content = content.replace(/\$\$\n?([\s\S]*?)\n?\$\$/g, (m, tex) => {
  try {
    // Clean LaTeX: normalize whitespace and line breaks
    const clean = tex.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    return katex.renderToString(clean, { displayMode: true, throwOnError: false, trust: true });
  } catch (e) { return m; }
});

// Inline math: $...$
content = content.replace(/(?<!\$)\$(?!\$)([^$\n]+?)\$(?!\$)/g, (m, tex) => {
  try {
    return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false, trust: true });
  } catch (e) { return m; }
});

writeFileSync(file, content, 'utf-8');
console.log('Math rendered in ' + file);
