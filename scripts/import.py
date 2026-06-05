#!/usr/bin/env python3
"""
Phrasoic Lab — Article Manager

Usage:
  # Import new article
  python3 scripts/import.py path/to/article.md

  # Update existing article (preserves metadata, replaces body + excerpt)
  python3 scripts/import.py path/to/article.md --update

  # Force overwrite (regenerates ALL metadata for existing article)
  python3 scripts/import.py path/to/article.md --force

  # Batch import/update folder
  python3 scripts/import.py path/to/folder/ --update
"""
import sys, os, re, json, argparse
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).parent.parent
POSTS_FILE = PROJECT_ROOT / "src/data/posts.ts"

CATEGORIES = {
    'system': 'SYSTEMS', 'distributed': 'SYSTEMS', 'infrastructure': 'SYSTEMS',
    'database': 'SYSTEMS', 'linux': 'SYSTEMS', 'network': 'SYSTEMS',
    'theory': 'THEORY', 'math': 'THEORY', 'principle': 'THEORY',
    'culture': 'CULTURE', 'philosophy': 'CULTURE', 'society': 'CULTURE',
    'engineer': 'ENGINEERING', 'tool': 'ENGINEERING', 'code': 'ENGINEERING',
    'programming': 'ENGINEERING', 'implementation': 'ENGINEERING',
    'design': 'DESIGN', 'ui': 'DESIGN', 'ux': 'DESIGN', 'visual': 'DESIGN',
    'typography': 'DESIGN',
}

LABELS = [
    ("LATEST TRANSMISSION", "最新传输"),
    ("INCOMING SIGNAL", "传入信号"),
    ("NEW DECLASSIFIED", "新解密档案"),
]

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    for stop in ['the','a','an','on','in','of','is','for','to','and','or']:
        text = re.sub(rf'\b{stop}\b', '', text)
    text = re.sub(r'-+', '-', text).strip('-')
    return text or 'untitled'

def detect_cat(title, body):
    combined = (title + ' ' + body[:500]).lower()
    for keyword, cat in CATEGORIES.items():
        if keyword in combined:
            return cat
    return 'SYSTEMS'

def extract_tags(title, body):
    words = re.findall(r'\b[a-z]{4,}\b', (title + ' ' + body[:1000]).lower())
    stop = {'this','that','with','from','they','have','been','when','what','which',
            'where','their','about','into','other','more','some','such','only','also',
            'very','just','like','over','than','then','them','these','those'}
    freq = {}
    for w in words:
        if w not in stop and w not in CATEGORIES:
            freq[w] = freq.get(w, 0) + 1
    return [t[0] for t in sorted(freq.items(), key=lambda x: -x[1])[:4]]

def md_to_html(md_text):
    lines = md_text.strip().split('\n')
    html = []
    in_code, in_ul, in_ol = False, False, False
    for line in lines:
        s = line.strip()
        if not s:
            if in_ul: html.append('</ul>'); in_ul = False
            if in_ol: html.append('</ol>'); in_ol = False
            continue
        if s.startswith('#'):
            if in_ul: html.append('</ul>'); in_ul = False
            if in_ol: html.append('</ol>'); in_ol = False
            level = len(s.split()[0])
            text = s[level:].strip()
            if level <= 3: html.append(f'<h{level}>{text}</h{level}>')
            continue
        if s.startswith('```'):
            if in_code: html.append('</code></pre>'); in_code = False
            else: html.append('<pre><code>'); in_code = True
            continue
        if in_code:
            html.append(s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'))
            continue
        if s.startswith('- '):
            if not in_ul: in_ul = True; html.append('<ul>')
            html.append(f'<li>{s[2:]}</li>'); continue
        if re.match(r'^\d+\.\s', s):
            if not in_ol: in_ol = True; html.append('<ol>')
            html.append(f'<li>{re.sub(r"^\d+\.\s+","",s)}</li>'); continue
        html.append(f'<p>{s}</p>')
    if in_ul: html.append('</ul>')
    if in_ol: html.append('</ol>')
    body = '\n'.join(html)
    body = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', body)
    body = re.sub(r'`([^`]+)`', lambda m: '<code>' + m.group(1).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;') + '</code>', body)
    return body

def generate_post(filepath):
    path = Path(filepath)
    with open(path) as f:
        content = f.read().strip()
    title_match = re.match(r'^#\s+(.+)$', content.split('\n')[0])
    title = title_match.group(1) if title_match else path.stem.replace('-',' ').title()
    body_md = content.split('\n',1)[1].strip() if title_match else content
    body_html = md_to_html(body_md)
    slug = slugify(path.stem)
    first_p = re.search(r'<p>(.+?)</p>', body_html)
    excerpt = first_p.group(1)[:150] if first_p else title
    mtime = datetime.fromtimestamp(path.stat().st_mtime)
    word_count = len(re.findall(r'\b\w+\b', content))
    minutes = max(1, round(word_count / 200))
    tags = extract_tags(title, content)
    cat = detect_cat(title, content)
    body_escaped = body_html.replace('\\','\\\\').replace('`','\\`').replace('${','\\${')
    return {
        'slug': slug, 'title': title, 'excerpt': excerpt,
        'body': body_escaped,
        'date': mtime.strftime('%Y.%m.%d') + ' — ' + mtime.strftime('%H:%M:%S'),
        'cat': cat, 'tags': tags, 'min': str(minutes),
        'docId': '', 'image': '', 'label': LABELS[0][0], 'labelZh': LABELS[0][1],
    }

def read_posts_file():
    return POSTS_FILE.read_text()

def write_posts_file(text):
    POSTS_FILE.write_text(text)

def find_post_index(content, slug):
    """Find the start position of a post by slug."""
    pattern = rf'slug:\s*"{re.escape(slug)}"'
    m = re.search(pattern, content)
    if not m:
        return None
    # Find opening brace before this slug
    pos = m.start()
    brace_start = content.rfind('\n  {', 0, pos)
    return brace_start

def update_post_body(slug, new_body, new_excerpt):
    """Update only the body and excerpt of an existing post."""
    content = read_posts_file()
    pos = find_post_index(content, slug)
    if not pos:
        return False
    # Find the body field start
    body_pos = content.index('body: `', pos)
    body_start = body_pos + 7  # skip 'body: `'
    body_end = content.index('`,\n', body_start)
    # Find the excerpt field
    ex_pos = content.index('excerpt: "', pos)
    ex_start = ex_pos + len('excerpt: "')
    ex_end = content.index('"', ex_start)
    # Replace
    new_content = content[:body_start] + new_body + content[body_end:]
    new_content = new_content[:ex_start] + new_excerpt + new_content[ex_end:]
    write_posts_file(new_content)
    return True

def format_post(p):
    img = f'\n    image: "",' if not p.get('image') else f'\n    image: "{p["image"]}",'
    return f'''  {{
    docId: "{p['docId']}",
    cat: "{p['cat']}",
    title: "{p['title']}",
    excerpt: "{p['excerpt']}",
    body: `{p['body']}`,
    date: "{p['date']}",
    min: "{p['min']}",
    tags: {json.dumps(p['tags'])},
    slug: "{p['slug']}",
    label: "{p['label']}",
    labelZh: "{p['labelZh']}",{img}
  }}'''

def append_post(p, doc_id):
    content = read_posts_file()
    last_close = content.rindex('\n  },\n];')
    new_content = content[:last_close] + ',\n' + format_post(p) + '\n];\n'
    write_posts_file(new_content)

def existing_slugs():
    content = read_posts_file()
    return set(re.findall(r'slug:\s*"([^"]+)"', content))

def next_doc_id():
    content = read_posts_file()
    nums = [int(m) for m in re.findall(r'docId:\s*"DOC-(\d+)"', content)]
    return f'DOC-{max(nums) + 1:04d}' if nums else 'DOC-0001'

def main():
    parser = argparse.ArgumentParser(description='Manage Phrasoic Lab articles')
    parser.add_argument('path', help='Path to .md file or folder')
    parser.add_argument('--update', action='store_true', help='Update existing article (body + excerpt only)')
    parser.add_argument('--force', action='store_true', help='Force regenerate ALL metadata for existing article')
    args = parser.parse_args()

    files = []
    target = Path(args.path)
    if target.is_dir():
        files = sorted(target.glob('*.md'))
    else:
        files = [target]

    existing = existing_slugs()
    updated_count = 0
    imported_count = 0

    for f in files:
        if not f.suffix == '.md':
            continue

        slug = slugify(f.stem)
        p = generate_post(str(f))
        p['slug'] = slug  # Use generated slug from filename

        if slug in existing:
            if args.update:
                # Update body + excerpt only
                if update_post_body(slug, p['body'], p['excerpt']):
                    print(f'UPDATE: {f.name}')
                    print(f'  → slug: {slug} (body + excerpt updated)')
                    updated_count += 1
                else:
                    print(f'ERROR: Could not update {f.name}')
            elif args.force:
                # Regenerate all metadata, keep docId
                content = read_posts_file()
                pos = find_post_index(content, slug)
                doc_id_match = re.search(r'docId:\s*"(DOC-\d+)"', content[pos:])
                p['docId'] = doc_id_match.group(1) if doc_id_match else next_doc_id()
                # Remove old entry and append new
                end = content.index("  },\n", pos) if '  },\n' in content[pos:] else content.index('  }\n]', pos)
                new_content = content[:pos] + content[end+2:]  # remove old
                write_posts_file(new_content)
                p['docId'] = p.get('docId') or next_doc_id()
                append_post(p, p['docId'])
                print(f'FORCE: {f.name}')
                print(f'  → slug: {slug} (all metadata regenerated)')
                updated_count += 1
            else:
                print(f'SKIP: {f.name} (slug "{slug}" already exists, use --update or --force)')
            continue

        # New article
        p['docId'] = next_doc_id()
        append_post(p, p['docId'])
        print(f'NEW: {f.name}')
        print(f'  → {p["docId"]} / {slug}')
        print(f'  → {p["title"]}')
        print(f'  → {p["cat"]} | {p["min"]} min | tags: {p["tags"]}')
        imported_count += 1

    new_count = []
    if imported_count: new_count.append(f'{imported_count} new')
    if updated_count: new_count.append(f'{updated_count} updated')

    if new_count:
        print(f'\n{" + ".join(new_count)} article(s) processed. Run `npm run build` to rebuild.')
    else:
        print('\nNo changes. Use --update to edit existing articles.')

if __name__ == '__main__':
    main()
