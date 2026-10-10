"""Inspect the actual static build. This is not a browser/accessibility audit."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, re, os, xml.etree.ElementTree as ET
from html import unescape

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
ORIGIN = 'https://ignaciobelitzky.dev'
indexing_match = re.search(r'\bindexable:\s*(true|false)', (ROOT/'src/data/site.ts').read_text())
if not indexing_match: raise RuntimeError('Explicit indexing policy is required')
INDEXABLE = indexing_match.group(1) == 'true'
ROBOTS_META = 'index, follow' if INDEXABLE else 'noindex, nofollow'
checks = []
def check(name, passed, detail=None):
    checks.append({'check': name, 'pass': bool(passed), 'detail': detail})

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.tags=[]; self.ids=[]; self.refs=[]; self.lang=None; self.text=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs); self.tags.append((tag,a))
        if a.get('id'): self.ids.append(a['id'])
        if tag=='html': self.lang=a.get('lang')
        for key in ('src','href'):
            if key in a:self.refs.append((tag,key,a[key]))
        for target in a.get('srcset','').split(','):
            if target.strip():self.refs.append((tag,'srcset',target.strip().split()[0]))
    def handle_data(self,data):
        self.text.append(data)
    def meta(self, key, value):
        return next((a.get('content') for t,a in self.tags if t=='meta' and a.get(key)==value),None)
    def links(self, rel):
        return [a for t,a in self.tags if t=='link' and a.get('rel')==rel]

def resolve(url, current):
    u=urlsplit(url)
    if u.netloc and f'{u.scheme}://{u.netloc}'!=ORIGIN:return None
    if u.scheme and not u.netloc:return None
    path=unquote(u.path)
    target=(DIST/path.lstrip('/')) if path.startswith('/') else current.parent/path
    if not path:target=current
    if target.is_dir():target=target/'index.html'
    return target.resolve(),unquote(u.fragment)

pages={}
for file in DIST.rglob('*.html'):
    p=Page();p.feed(file.read_text());pages[file.resolve()]=p
projects = sorted([json.loads(p.read_text()) for p in (ROOT/'src/content/projects').glob('*.json')],key=lambda p:p['order'])
experiments = sorted([json.loads(p.read_text()) for p in (ROOT/'src/content/experiments').glob('*.json')],key=lambda e:e['order'])
check('32 localized core, project and error pages built',len(pages)==32,len(pages))
expected=['','projects','gallery','about','writing','contact'] + ['projects/'+p['slug'] for p in projects]
for lang in ('en','es'):
    prefix='es/' if lang=='es' else ''
    for path in expected:
        relative=prefix+(path+'/' if path else '')+'index.html'
        file=(DIST/relative).resolve();p=pages.get(file)
        check(relative+' exists',p is not None)
        if not p:continue
        canonical=ORIGIN+'/'+prefix+(path+'/' if path else '')
        check(relative+' canonical/locales',p.lang==lang and len(p.links('canonical'))==1 and p.links('canonical')[0]['href']==canonical and {a.get('hreflang'):a.get('href') for a in p.links('alternate')}=={'en':ORIGIN+'/'+(path+'/' if path else ''),'es':ORIGIN+'/es/'+(path+'/' if path else ''),'x-default':ORIGIN+'/'+(path+'/' if path else '')})
        check(relative+' metadata',bool(p.meta('name','description')) and p.meta('name','robots')==ROBOTS_META and p.meta('property','og:image:width')=='1200' and p.meta('property','og:image:height')=='630' and bool(p.meta('name','twitter:image')))

errors=[];refs=0
for file,p in pages.items():
    relative=str(file.relative_to(DIST.resolve()));text=file.read_text()
    check(relative+' semantic core',sum(t=='h1' for t,a in p.tags)==1 and sum(t=='main' for t,a in p.tags)==1 and sum(t=='header' for t,a in p.tags)==1 and sum(t=='footer' for t,a in p.tags)==1 and len(p.ids)==len(set(p.ids)))
    check(relative+' accessible shell hooks',any(t=='summary' for t,a in p.tags) and all(a.get('aria-label') for t,a in p.tags if t=='nav') and all('alt' in a and a.get('width') and a.get('height') for t,a in p.tags if t=='img') and any(t=='a' and a.get('href')=='#main' for t,a in p.tags))
    check(relative+' no unsupported public claims/content',not re.search(r'Moki|Software Engineer|Download CV|Internal notes|Notas internas|10x faster',text,re.I))
    check(relative+' no islands or remote runtime resources',not any(t in ('astro-island','iframe','form') for t,a in p.tags) and not any(t=='script' and urlsplit(a.get('src','')).netloc for t,a in p.tags) and not any(t=='link' and a.get('rel')=='stylesheet' and urlsplit(a.get('href','')).netloc for t,a in p.tags))
    for tag,key,url in p.refs:
        resolved=resolve(url,file)
        if resolved is None:continue
        refs+=1;target,fragment=resolved
        if not target.is_file():errors.append({'page':relative,'reference':url,'error':'missing file'})
        elif fragment and target in pages and fragment not in pages[target].ids:errors.append({'page':relative,'reference':url,'error':'missing fragment'})
    check(relative+' single header combobox and matching options', sum(a.get('role')=='combobox' for t,a in p.tags)==1 and sum(a.get('role')=='listbox' for t,a in p.tags)==1 and sum(a.get('role')=='option' for t,a in p.tags)==3)
    check(relative+' exact brand logo sizing',any(t=='img' and a.get('src')=='/brand/phosphor-web.svg' and a.get('width')=='48' and a.get('height')=='48' for t,a in p.tags))
    check(relative+' writing absent from empty-collection public navigation',not any(t=='a' and a.get('class')!='lang' and a.get('href') in ('/writing/','/es/writing/') for t,a in p.tags))
    social=resolve(p.meta('property','og:image') or '',file)
    check(relative+' local processed social asset',social is not None and social[0].is_file() and '/_astro/' in (p.meta('property','og:image') or ''))
check('All built internal page/asset/fragment references resolve',not errors,{'references':refs,'errors':errors})
check('GitHub Pages root 404 emitted',(DIST/'404.html').is_file())
check('Spanish explicit 404 page emitted',(DIST/'es/404/index.html').is_file() or (DIST/'es/404.html').is_file())
for file,p in pages.items():
    if '404' in str(file.relative_to(DIST.resolve())):
        check(str(file.relative_to(DIST.resolve()))+' excluded from canonicals',not p.links('canonical') and p.meta('name','robots')=='noindex, nofollow')
robots_text = (DIST/'robots.txt').read_text()
check('Built robots matches explicit indexing policy', ('Allow: /' in robots_text and 'Disallow: /' not in robots_text) if INDEXABLE else 'Disallow: /' in robots_text)
check('Built robots references the canonical sitemap', 'Sitemap: '+ORIGIN+'/sitemap-index.xml' in robots_text)
sitemap=DIST/'sitemap-0.xml';index=DIST/'sitemap-index.xml'
check('Sitemap generated',sitemap.is_file() and index.is_file())
if sitemap.is_file():
    xml=ET.parse(sitemap);ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls=[node.text for node in xml.findall('.//s:loc',ns)]
    check('Sitemap has exactly 30 core and project URLs, no 404/article routes',len(urls)==30 and len(set(urls))==30 and all(u.startswith(ORIGIN+'/') and '/404' not in u for u in urls),urls)
css='\n'.join(p.read_text() for p in (DIST/'_astro').glob('*.css'))
check('Tailwind v4 and approved design tokens compiled','tailwindcss' in css and '--bg:' in css and '--accent:' in css)
check('Responsive/reduced-motion/focus rules retained', 'prefers-reduced-motion' in css and 'prefers-color-scheme' in css and ':focus-visible' in css and '767px' in css)
check('No remote CSS/font requests',not re.search(r'@import\s+(?:url\()?\s*["\']?https?://|url\(["\']?https?://',css))
check('Astro social-image processing retained',any(p.suffix=='.png' for p in (DIST/'_astro').iterdir()))
check('No blog/post files published',not (DIST/'writing/rss.xml').exists() and all(not any(t=='article' for t,a in p.tags) for file,p in pages.items() if '/writing/' in str(file)))

for lang in ('en','es'):
    prefix='es/' if lang=='es' else ''
    gallery=(DIST/(prefix+'gallery/index.html')).read_text()
    index=(DIST/(prefix+'projects/index.html')).read_text()
    home=(DIST/(prefix+'index.html')).read_text()
    about=(DIST/(prefix+'about/index.html')).read_text()
    writing=(DIST/(prefix+'writing/index.html')).read_text()
    check(lang+' full index links all nine details and exact sources',all('/'+prefix+'projects/'+p['slug']+'/' in index and p['source'] in index for p in projects))
    check(lang+' home keeps the three approved featured projects',all('/'+prefix+'projects/'+p['slug']+'/' in home for p in projects[:3]) and '/'+prefix+'projects/periodic-table/' not in home)
    check(lang+' all six gallery entries and source directories',all(e['name'] in gallery and e['source'] in gallery and e['translations'][lang]['summary'] in unescape(gallery) for e in experiments))
    check(lang+' gallery experimental/prototype labels',('Experimental' if lang=='es' else 'Experimental') in gallery and ('Prototipo' if lang=='es' else 'Prototype') in gallery)
    check(lang+' practical work has approved ongoing period and confirmed responsibilities', ('2023–actualidad' if lang=='es' else '2023–present') in about and 'https://www.veterinariadacor.com/' in about and ('Reconstruir el logo existente' if lang=='es' else 'Reconstruct the existing logo') in about and '/'+prefix+'projects/veterinaria-dacor/' in about)
    check(lang+' real empty writing state',('Todavía no hay artículos publicados.' if lang=='es' else 'No articles published yet.') in writing and 'article:published_time' not in writing)
    for project in projects:
        file=(DIST/(prefix+'projects/'+project['slug']+'/index.html')).resolve()
        page=pages.get(file)
        if not page:continue
        html=file.read_text(); visible=' '.join(' '.join(page.text).split())
        copy=project['translations'][lang]
        check(lang+'/'+project['slug']+' full verified narrative',all(' '.join(v.split()) in visible for v in [copy['summary'],copy['context'],copy['engineeringFocus'],copy['role'],*copy['features']]))
        check(lang+'/'+project['slug']+' language switch stays on detail',any(t=='a' and a.get('class')=='lang' and a.get('href')=='/'+('es/' if lang=='en' else '')+'projects/'+project['slug']+'/' for t,a in page.tags))
        check(lang+'/'+project['slug']+' projects section navigation',any(t=='a' and a.get('href')=='/'+prefix+'projects/' and a.get('aria-current')=='location' for t,a in page.tags))
        if project.get('recording'):
            check(lang+'/'+project['slug']+' recording is an external link only',project['recording'] in html and not any(t=='iframe' for t,a in page.tags))
        if project.get('research'):
            authors=re.search(r'<ol[^>]*>(.*?)</ol>',html,re.S)
            check(lang+' modest research role and full ordered team credit',authors is not None and all(author in unescape(authors.group(1)) for author in project['research']['authors']) and [unescape(authors.group(1)).find(author) for author in project['research']['authors']]==sorted(unescape(authors.group(1)).find(author) for author in project['research']['authors']) and project['research']['preprint'] in html)
check('No authored articles introduced',not list((ROOT/'src/content/articles').rglob('*.md')))

report={'phase':'improvement-2','method':'Actual built HTML, CSS, routes, metadata, sitemap and local asset inspection. No browser execution.','passed':sum(c['pass'] for c in checks),'total':len(checks),'checks':checks,'browser_qa':'not run'}
evidence = ROOT / os.environ['QA_EVIDENCE_DIR'] if os.environ.get('QA_EVIDENCE_DIR') else ROOT / 'evidence'
evidence.mkdir(parents=True, exist_ok=True)
(evidence/('build-validation.json' if os.environ.get('QA_EVIDENCE_DIR') else 'phase5-build-validation.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
for c in checks:
    if not c['pass']:print('FAIL',c['check'],c['detail'])
print(f"{report['passed']}/{report['total']} actual-build static checks passed; {refs} local references checked; browser QA not run.")
raise SystemExit(0 if report['passed']==report['total'] else 1)
