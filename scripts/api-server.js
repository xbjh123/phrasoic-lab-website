// Simple API server for the admin page
// Run: node scripts/api-server.js
import { createServer } from 'http';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, extname } from 'path';
import { execSync } from 'child_process';

const PORT = 3001;
const CONTENT_DIR = join(process.cwd(), 'src/content/blog');

if (!existsSync(CONTENT_DIR)) mkdirSync(CONTENT_DIR, { recursive: true });

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, 'http://localhost');

  // GET /api/posts.json — list all posts
  if (req.method === 'GET' && url.pathname === '/api/posts.json') {
    try {
      const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
      const posts = files.map(f => ({
        slug: f.replace('.md', ''),
        title: f.replace('.md', '').replace(/-/g, ' '),
      }));
      json(res, posts);
    } catch (e) {
      json(res, { error: e.message }, 500);
    }
    return;
  }

  // GET /api/posts/:slug.md — read post
  if (req.method === 'GET' && url.pathname.startsWith('/api/posts/')) {
    const slug = url.pathname.replace('/api/posts/', '');
    const file = join(CONTENT_DIR, slug);
    try {
      if (!existsSync(file)) { json(res, { error: 'Not found' }, 404); return; }
      const content = readFileSync(file, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(content);
    } catch (e) {
      json(res, { error: e.message }, 500);
    }
    return;
  }

  // PUT /api/posts/:slug.md — save post
  if (req.method === 'PUT' && url.pathname.startsWith('/api/posts/')) {
    const slug = url.pathname.replace('/api/posts/', '');
    const file = join(CONTENT_DIR, slug);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        writeFileSync(file, body, 'utf-8');
        json(res, { ok: true, slug: slug.replace('.md', '') });
      } catch (e) {
        json(res, { error: e.message }, 500);
      }
    });
    return;
  }

  // DELETE /api/posts/:slug.md — delete post
  if (req.method === 'DELETE' && url.pathname.startsWith('/api/posts/')) {
    const slug = url.pathname.replace('/api/posts/', '');
    const file = join(CONTENT_DIR, slug);
    try {
      if (existsSync(file)) unlinkSync(file);
      json(res, { ok: true });
    } catch (e) {
      json(res, { error: e.message }, 500);
    }
    return;
  }

  // POST /api/build — run sync + build
  if (req.method === 'POST' && url.pathname === '/api/build') {
    try {
      execSync('python3 scripts/sync.py', { cwd: process.cwd(), stdio: 'pipe' });
      execSync('npm run build', { cwd: process.cwd(), stdio: 'pipe' });
      json(res, { ok: true });
    } catch (e) {
      json(res, { error: e.message }, 500);
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Admin API server running on http://localhost:${PORT}`);
  console.log(`Content dir: ${CONTENT_DIR}`);
});
