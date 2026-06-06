#!/usr/bin/env python3
"""
Sync Decap CMS markdown files → posts.ts
Reads all .md files from src/content/blog/ and regenerates posts.ts.
"""
import sys, os, re, json, subprocess
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "src/content/blog"
POSTS_FILE = PROJECT_ROOT / "src/data/posts.ts"

def parse_frontmatter(filepath):
    with open(filepath) as f:
        content = f.read()

    if not content.startswith('---'):
        return None, content

    parts = content.split('---', 2)
    if len(parts) < 3:
        return None, content

    fm_text = parts[1].strip()
    body = parts[2].strip()

    # Simple YAML-like parser (handles basic types)
    data = {}
    current_key = None
    in_list = False
    list_values = []

    for line in fm_text.split('\n'):
        s = line.rstrip()
        if not s:
            continue

        # Check if this is a top-level key
        match = re.match(r'^(\w[\w_]*):\s*(.*)', s)
        if match and not s.startswith(' '):
            if in_list and current_key:
                data[current_key] = list_values
                in_list = False
                list_values = []

            key = match.group(1)
            value = match.group(2).strip()

            if value == '':
                # Could be start of list or multiline
                in_list = False
                current_key = key
                data[key] = ''
            elif value.startswith('"') and value.endswith('"'):
                data[key] = value[1:-1]
            elif value.startswith("'") and value.endswith("'"):
                data[key] = value[1:-1]
            else:
                # Try to parse as number or boolean
                if value.lower() == 'true':
                    data[key] = True
                elif value.lower() == 'false':
                    data[key] = False
                else:
                    try:
                        data[key] = json.loads(value)
                    except:
                        data[key] = value
        elif s.startswith('  - '):
            if not in_list:
                in_list = True
                list_values = []
                current_key = key
            val = s.strip()[2:].strip().strip('"').strip("'")
            list_values.append(val)
        else:
            # Continuation of previous value
            if current_key and isinstance(data.get(current_key), str):
                data[current_key] += '\n' + s

    if in_list and current_key:
        data[current_key] = list_values

    return data, body

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    for stop in ['the','a','an','on','in','of','is','for','to','and','or']:
        text = re.sub(rf'\b{stop}\b', '', text)
    text = re.sub(r'-+', '-', text).strip('-')
    return text or 'untitled'

def md_to_html(md_text):
    """Markdown to HTML with table, code block, blockquote, list support."""
    import re as _re
    lines = md_text.strip().split('\n')
    parts = []
    i = 0
    lt = None
    it = False
    ic = False

    def _inline(text):
        t = text
        t = _re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
        t = _re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
        t = _re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" target="_blank">\1</a>', t)
        return t

    def _cl():
        nonlocal lt
        if lt: parts.append(f'</{lt}>'); lt = None
    def _ct():
        nonlocal it
        if it: parts.append('</table>'); it = False

    while i < len(lines):
        s = lines[i].strip()
        if not s or s == '---': _cl(); _ct(); i += 1; continue
        if s.startswith('```'): _cl(); _ct(); parts.append('</code></pre>' if ic else '<pre><code>'); ic = not ic; i += 1; continue
        if ic: parts.append(s.replace('&','&amp;').replace('<','&lt;')); i += 1; continue
        if s == '$$' or s.startswith('$$'):
            _cl(); _ct()
            if s.count('$$') >= 2 and s.endswith('$$') and len(s) > 4:
                parts.append(s)
                i += 1; continue
            math_lines = [s]
            i += 1
            while i < len(lines):
                ml = lines[i].strip()
                math_lines.append(ml)
                if ml.endswith('$$') or ml == '$$':
                    i += 1; break
                i += 1
            parts.append('\n'.join(math_lines))
            continue
        if s.startswith('### '): _cl(); _ct(); parts.append('<h3>'+_inline(s[4:])+'</h3>'); i += 1; continue
        if s.startswith('## '): _cl(); _ct(); parts.append('<h2>'+_inline(s[3:])+'</h2>'); i += 1; continue
        if s.startswith('# '): _cl(); _ct(); parts.append('<h2>'+_inline(s[2:])+'</h2>'); i += 1; continue
        if s.startswith('|') and s.endswith('|'):
            if _re.match(r'^\|[-:\s|]+\|$', s): i += 1; continue
            cells = [c.strip() for c in s.split('|')[1:-1]]
            hdr = i+1 < len(lines) and _re.match(r'^\|[-:\s|]+\|$', lines[i+1].strip())
            tag = 'th' if hdr else 'td'
            row = '<tr>'+''.join('<'+tag+'>'+_inline(c)+'</'+tag+'>' for c in cells)+'</tr>'
            if not it: it = True; parts.append('<table>')
            parts.append(row); i += 1; continue
        if s.startswith('> '):
            _cl(); _ct()
            parts.append('<blockquote>'+_inline(s[2:])+'</blockquote>')
            i += 1
            while i < len(lines) and lines[i].strip().startswith('> '):
                parts[-1] = parts[-1].replace('</blockquote>','') + _inline(lines[i].strip()[2:]) + '</blockquote>'
                i += 1
            continue
        if _re.match(r'^\d+\.\s', s):
            if lt != 'ol': _cl(); lt = 'ol'; parts.append('<ol>')
            parts.append('<li>'+_inline(_re.sub(r'^\d+\.\s+','',s))+'</li>')
            i += 1
            while i < len(lines):
                nxt = lines[i].strip()
                if not nxt or nxt.startswith('#') or nxt.startswith('|') or nxt == '---' or _re.match(r'^\d+\.\s', nxt): break
                parts[-1] = parts[-1][:-5] + '<br>' + _inline(nxt) + '</li>'
                i += 1
            continue
        if s.startswith('- ') or s.startswith('* '):
            if lt != 'ul': _cl(); lt = 'ul'; parts.append('<ul>')
            parts.append('<li>'+_inline(s[2:])+'</li>'); i += 1; continue
        _cl(); _ct(); parts.append('<p>'+_inline(s)+'</p>'); i += 1

    _cl(); _ct()
    return '\n'.join(parts)

def generate_posts_ts(posts_data, metadata):
    """Generate posts.ts content from parsed data."""
    entries = []
    for i, (slug, data, body) in enumerate(posts_data):
        doc = str(i + 1).zfill(4)
        title = data.get('title', slug).replace('"', '\\"')
        excerpt = data.get('excerpt', '').replace('"', '\\"').replace('\n', ' ')[:150]
        body_html = md_to_html(body)
        # Pre-render math with KaTeX via Node.js
        import tempfile
        tmpfile = tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, dir='/tmp')
        tmpfile.write(body_html)
        tmpfile.close()
        result = subprocess.run(['node', 'scripts/render_math.mjs', tmpfile.name], capture_output=True, text=True, cwd=os.getcwd())
        body_html = open(tmpfile.name).read() if result.returncode == 0 else body_html
        try: os.unlink(tmpfile.name)
        except: pass
        # Protect math blocks from escaping
        math_store = []
        def save_math(m):
            math_store.append(m.group(0))
            return f'__MATH{len(math_store)-1}__'
        body_html = re.sub(r'\$\$[\s\S]*?\$\$', save_math, body_html)
        # Now safe to escape for template literal
        body_escaped = body_html.replace('`', '\\`').replace('${', '\\${')
        # Restore math blocks
        for idx, original in enumerate(math_store):
            body_escaped = body_escaped.replace(f'__MATH{idx}__', original)
        # Also protect code blocks — replace \ with &#92; inside <code> tags
        def fix_code(m):
            return '<code>' + m.group(1).replace('\\', '&#92;') + '</code>'
        body_escaped = re.sub(r'<code>([\s\S]*?)</code>', fix_code, body_escaped)
        date_str = data.get('date', datetime.now().strftime('%Y.%m.%d — %H:%M:%S'))
        cat = data.get('cat', 'SYSTEMS').upper()
        tags = data.get('tags', [])
        if isinstance(tags, str): tags = [tags]
        min_val = data.get('min', '5')
        image = data.get('image', '')
        label = data.get('label', 'LATEST TRANSMISSION')
        labelZh = data.get('labelZh', '最新传输')

        img_line = f'\n    image: "{image}",' if image else ''
        entry = f'''  {{
    docId: "DOC-{doc}",
    cat: "{cat}",
    title: "{title}",
    excerpt: "{excerpt}",
    body: `{body_escaped}`,
    date: "{date_str}",
    min: "{min_val}",
    tags: {json.dumps(tags)},
    slug: "{slug}",
    label: "{label}",
    labelZh: "{labelZh}",{img_line}
  }}'''
        entries.append(entry)

    return f'''// ============================================================
// PHRASOIC LAB · Blog Posts Data
// Auto-generated from src/content/blog/
// ============================================================
export interface Post {{
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  cat: string;
  tags: string[];
  min: string;
  docId: string;
  image?: string;
  label?: string;
  labelZh?: string;
}}

export const POSTS: Post[] = [
{',\n'.join(entries)},
];

export const SITE = {{
  name: "PHRASOIC LAB",
  tagline: "Research & Records",
  description: "个人知识库 · 设计笔记 · 技术档案",
  entries: POSTS.length,
  since: "2021.03",
  words: "~92K",
}};
'''

def sync():
    if not CONTENT_DIR.exists():
        print(f'Creating {CONTENT_DIR}')
        CONTENT_DIR.mkdir(parents=True)

    posts = []
    for md_file in sorted(CONTENT_DIR.glob('*.md')):
        data, body = parse_frontmatter(md_file)
        if data is None:
            print(f'SKIP: {md_file.name} (no frontmatter)')
            continue
        slug = md_file.stem
        print(f'  {md_file.name} → {slug}')
        posts.append((slug, data, body))

    if not posts:
        print('No posts found in src/content/blog/')
        return

    ts_content = generate_posts_ts(posts, {})
    POSTS_FILE.write_text(ts_content)
    print(f'\nSynced {len(posts)} post(s) → src/data/posts.ts')

if __name__ == '__main__':
    sync()
