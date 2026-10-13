#!/usr/bin/env python3
"""Regenerate portable Markdown and the lightweight index from canonical JSON."""
from __future__ import annotations
import hashlib
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / 'content/articles.json'
bundle = json.loads(path.read_text(encoding='utf-8'))
articles = bundle['articles']
by_id = {a['id']: a for a in articles}
metadata_keys = ('id','route','country','language','hub','title','summary','status','publish','research_checked_at','version','human_reviewed','source_ref_ids','related_ids')
index_keys = ('id','route','country','language','hub','title','summary','kind','status','publish','launch_order','estimated_reading_minutes','related_ids')
for a in articles:
    body = a['body_markdown']
    a['content_sha256'] = hashlib.sha256(body.encode()).hexdigest()
    a['word_count'] = len(re.findall(r"\b[\w’'-]+\b", re.sub(r'\([^)]*https?[^)]*\)', '', body)))
    a['estimated_reading_minutes'] = max(1, math.ceil(a['word_count']/200))
    a['related'] = [{'id':k,'route':by_id[k]['route'],'title':by_id[k]['title']} for k in a['related_ids']]
    # JSON literals are valid YAML values; no third-party YAML dependency needed.
    frontmatter = '\n'.join(f'{k}: {json.dumps(a[k], ensure_ascii=False)}' for k in metadata_keys)
    tail = '\n\n## Try this\n\n'+a['reader_task']+'\n\n## Keep reading\n\n'
    tail += '\n'.join('- ['+x['title']+']('+x['route']+')' for x in a['related'])
    if a['sources']:
        tail += '\n\n## Sources and scope\n\n'
        for s in a['sources']:
            tail += str(s['number'])+'. ['+s['title']+']('+s['url']+'). '+s['publisher']+'. **Locator:** '+s['locator']+'.'
            for key,label in [('version','Edition'),('published_at','Published'),('reference_period','Reference period')]:
                if s[key]: tail += ' **'+label+':** '+s[key]+'.'
            if s['limitations']: tail += ' **Limits:** '+' '.join(s['limitations'])
            tail += '\n\n'
    tail += '\nResearch checked: '+a['research_checked_at']+'. This date is not a claim of continuous monitoring.\n'
    (ROOT/'content/articles'/(a['id']+'.md')).write_text('---\n'+frontmatter+'\n---\n\n# '+a['title']+'\n\n'+body+tail, encoding='utf-8')
bundle['article_count']=len(articles)
path.write_text(json.dumps(bundle, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
(ROOT/'content/article-index.json').write_text(json.dumps([{k:a[k] for k in index_keys} for a in articles],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Exported {len(articles)} articles. Source changes, evidence mappings and release metadata still need intentional updates when content changes.')
