"""Local static server for the Playpen sample (site/), for rehearsals and QA.

Why not plain `python -m http.server`: it answers HTTP/1.0 (a new TCP connection per file) with a
5-deep listen backlog, so on Windows the page's start-up burst (fonts, modules, hero AVIF, crest) can
get a connection refused and a refused module import leaves the page static. This server keeps
connections alive (HTTP/1.1), accepts a 128-deep backlog, serves byte ranges for the two videos and
sends the right MIME types. It serves files only; nothing is executed.

    python -I tools/serve.py [port] [--dir site] [--bind 127.0.0.1]

Then open http://127.0.0.1:<port>/ (default port 5173).
"""
import argparse
import os
import re
import sys
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

MIME = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4',
    '.webm': 'video/webm', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm', '.woff2': 'font/woff2',
    '.woff': 'font/woff', '.ico': 'image/x-icon', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
}
RANGE_RE = re.compile(r'bytes=(\d*)-(\d*)$')


class Handler(SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def guess_type(self, path):
        return MIME.get(os.path.splitext(path)[1].lower()) or super().guess_type(path)

    def send_head(self):
        """Like the parent, plus single byte ranges (206) for media and Accept-Ranges on every file."""
        path = self.translate_path(self.path)
        if os.path.isdir(path) or not os.path.isfile(path):
            return super().send_head()
        rng = self.headers.get('Range')
        m = RANGE_RE.match(rng.strip()) if rng else None
        size = os.path.getsize(path)
        if not m:
            # No Cache-Control header on purpose: forcing revalidation makes Chrome warn that the two font
            # preloads were "not used" on repeat loads (a 304 on a preload does not match the later font use).
            self._extra_headers = [('Accept-Ranges', 'bytes')]
            return super().send_head()
        start = int(m.group(1)) if m.group(1) else max(0, size - int(m.group(2) or 0))
        end = int(m.group(2)) if m.group(1) and m.group(2) else size - 1
        end = min(end, size - 1)
        if start > end or start >= size:
            self.send_response(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
            self.send_header('Content-Range', 'bytes */%d' % size)
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        f = open(path, 'rb')
        f.seek(start)
        self.send_response(HTTPStatus.PARTIAL_CONTENT)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Range', 'bytes %d-%d/%d' % (start, end, size))
        self.send_header('Content-Length', str(end - start + 1))
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()
        self._range_len = end - start + 1
        return f

    def copyfile(self, source, outputfile):
        n = getattr(self, '_range_len', None)
        if n is None:
            return super().copyfile(source, outputfile)
        self._range_len = None
        while n > 0:
            chunk = source.read(min(65536, n))
            if not chunk:
                break
            outputfile.write(chunk)
            n -= len(chunk)

    def end_headers(self):
        for k, v in getattr(self, '_extra_headers', None) or []:
            self.send_header(k, v)
        self._extra_headers = []
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write('%s - - [%s] %s\n' % (self.address_string(), self.log_date_time_string(), fmt % args))


class Server(ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True
    allow_reuse_address = True


def main():
    ap = argparse.ArgumentParser(description='Static server for site/ with keep-alive, byte ranges and a deep backlog.')
    ap.add_argument('port', nargs='?', type=int, default=5173)
    ap.add_argument('--dir', default='site')
    ap.add_argument('--bind', default='127.0.0.1')
    a = ap.parse_args()
    root = os.path.abspath(a.dir)
    if not os.path.isfile(os.path.join(root, 'index.html')):
        sys.exit('no index.html in %s (run from the project root, or pass --dir)' % root)
    handler = partial(Handler, directory=root)
    with Server((a.bind, a.port), handler) as httpd:
        print('serving %s at http://%s:%d/ (HTTP/1.1 keep-alive, backlog %d)' % (root, a.bind, a.port, Server.request_queue_size), flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == '__main__':
    main()
