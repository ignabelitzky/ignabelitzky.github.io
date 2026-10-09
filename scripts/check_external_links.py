"""Read-only external URL checks. Network denial is not classified as a dead URL."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from concurrent.futures import ThreadPoolExecutor
import json, datetime, socket

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'evidence/phase5/external-links.json'
ORIGIN = 'https://ignabelitzky.github.io'
sources = {}
class Links(HTMLParser):
    def __init__(self, page): super().__init__(); self.page=page
    def handle_starttag(self, tag, attrs):
        data=dict(attrs)
        if tag != 'a': return
        url=data.get('href','')
        if url.startswith('https://') and not url.startswith(ORIGIN+'/'):
            sources.setdefault(url,[]).append(self.page)
for path in (ROOT/'dist').rglob('*.html'):
    Links(str(path.relative_to(ROOT/'dist'))).feed(path.read_text())
def inspect(item):
    url,pages=item
    record={'url':url,'source_pages':sorted(set(pages)),'checked_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'GET, first 64 KiB maximum, 12s timeout'}
    try:
        request=Request(url,headers={'User-Agent':'IgnacioPortfolio-LinkAudit/0.5','Range':'bytes=0-65535'})
        with urlopen(request,timeout=12) as response:
            sample=response.read(65536).decode('utf-8','replace').lower()
            record.update(http_status=response.status,final_url=response.url)
            host=urlsplit(response.url).hostname or ''
            if 'youtube' in host and any(message in sample for message in ['this video is unavailable','video unavailable','this video has been removed']):
                record['status']='unavailable_media';record['reason']='Returned page explicitly reports unavailable video'
            elif 'accounts.google.com' in host or 'consent.youtube' in host:
                record['status']='unverified';record['reason']='Sign-in/consent redirect; playback is not verified'
            else:
                record['status']='reachable_http';record['reason']='HTTP reachability only; no browser/media playback or semantic-content verification'
    except HTTPError as error:
        status=error.code;record['http_status']=status
        if status in (404,410):record['status']='broken_http';record['reason']='Server returned missing/gone resource'
        else:record['status']='unverified';record['reason']=f'HTTP {status}: access restriction, rate limit, or upstream error; not classified as dead'
    except (URLError,TimeoutError,socket.timeout,OSError) as error:
        record['status']='unverified';record['reason']=f'Network/timeout restriction: {type(error).__name__}'
    return record
with ThreadPoolExecutor(max_workers=4) as pool: results=list(pool.map(inspect,sorted(sources.items())))
OUT.parent.mkdir(parents=True,exist_ok=True)
summary={status:sum(r['status']==status for r in results) for status in sorted({r['status'] for r in results})}
OUT.write_text(json.dumps({'phase':5,'summary':summary,'results':results,'media_playback_verified':False},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'unique_external_urls':len(results),'summary':summary,'report':str(OUT.relative_to(ROOT))}))
raise SystemExit(1 if any(r['status'] in ('broken_http','unavailable_media') for r in results) else 0)
