import { createServer } from 'http';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const PORT = 3001;
const DIR = join(process.cwd(), 'src/content/blog');
if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });

function ok(res, data) {
  try {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(data));
  } catch(e) { console.error('Response error:', e); }
}

function err(res, code, msg) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ error: msg }));
}

const s = createServer((req, res) => {
  console.log(req.method, req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const p = req.url.replace(/^\/api/, '');

  try {
    if (req.method === 'GET' && p === '/posts.json') {
      const files = readdirSync(DIR).filter(f => f.endsWith('.md'));
      ok(res, files.map(f => ({ slug: f.replace('.md',''), title: f.replace('.md','').replace(/-/g,' ') })));
    } else if (req.method === 'GET' && p.startsWith('/posts/')) {
      const f = join(DIR, p.replace('/posts/',''));
      if (!existsSync(f)) return err(res, 404, 'Not found');
      const body = readFileSync(f, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(body);
    } else if (req.method === 'PUT' && p.startsWith('/posts/')) {
      const f = join(DIR, p.replace('/posts/',''));
      let body = '';
      req.on('data', c => body += c);
      req.on('end', () => { writeFileSync(f, body, 'utf-8'); ok(res, { ok: true }); });
    } else if (req.method === 'DELETE' && p.startsWith('/posts/')) {
      const f = join(DIR, p.replace('/posts/',''));
      if (existsSync(f)) unlinkSync(f);
      ok(res, { ok: true });
    } else if (req.method === 'POST' && p === '/build') {
      execSync('python3 scripts/sync.py', { cwd: process.cwd() });
      execSync('npm run build', { cwd: process.cwd() });
      ok(res, { ok: true });
    } else {
      err(res, 404, 'Unknown endpoint: ' + p);
    }
  } catch(e) {
    console.error(e);
    err(res, 500, e.message);
  }
});

s.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
