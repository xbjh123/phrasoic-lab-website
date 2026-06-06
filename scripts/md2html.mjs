import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

const input = process.argv[2]; // file path or stdin

let md;
if (input && input !== '-') {
  const fs = await import('fs');
  md = fs.readFileSync(input, 'utf-8');
} else {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  md = Buffer.concat(chunks).toString('utf-8');
}

// Remove YAML frontmatter
md = md.replace(/^---[\s\S]*?---\s*/, '');

const result = await unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(rehypeKatex, { throwOnError: false, displayMode: true })
  .use(rehypeStringify)
  .process(md);

process.stdout.write(String(result));
