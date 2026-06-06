import katex from 'katex';
import { readFileSync, writeFileSync } from 'fs';

const file = process.argv[2] || 'src/data/posts.ts';
let content = readFileSync(file, 'utf-8');

// Render block math $$...$$
content = content.replace(/\$\$\n?([\s\S]*?)\n?\$\$/g, (m, tex) => {
  try {
    return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false });
  } catch (e) {
    return m;
  }
});

// Render inline math $...$  (not preceded or followed by $)
content = content.replace(/(?<!\$)\$(?!\$)([^$\n]+?)\$(?!\$)/g, (m, tex) => {
  try {
    return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
  } catch (e) {
    return m;
  }
});

writeFileSync(file, content, 'utf-8');
console.log('Math rendered in ' + file);
