import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

export const DIST = join(import.meta.dirname, '..', 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

async function readHeaderRules() {
  const rawHeaders = await readFile(join(DIST, '_headers'), 'utf8');
  const rules = [];
  let current = null;

  for (const line of rawHeaders.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    if (/^\S/.test(line)) {
      current = { pattern: line.trim(), headers: {} };
      rules.push(current);
      continue;
    }
    if (!current) continue;

    const match = line.match(/^\s+([A-Za-z-]+):\s*(.+)$/);
    if (match) current.headers[match[1]] = match[2];
  }

  return rules;
}

function matches(pattern, path) {
  const rx = new RegExp(
    '^' + pattern.split('*').map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$',
  );
  return rx.test(path);
}

/* Отдаёт dist так же, как Cloudflare Pages: с заголовками из _headers
   и адресами без .html. Возвращает базовый адрес и сам сервер. */
export async function serveDist(port) {
  const rules = await readHeaderRules();

  const headersFor = (path) => {
    const out = {};
    for (const rule of rules) {
      if (matches(rule.pattern, path)) Object.assign(out, rule.headers);
    }
    return out;
  };

  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const headers = headersFor(path);

    for (const candidate of [path, `${path}.html`, join(path, 'index.html')]) {
      const file = normalize(join(DIST, candidate));
      if (!file.startsWith(DIST)) continue;
      try {
        const body = await readFile(file);
        res.writeHead(200, {
          ...headers,
          'Content-Type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
        });
        return res.end(body);
      } catch {

      }
    }
    res.writeHead(404, { ...headers, 'Content-Type': 'text/html' }).end('404');
  });

  await new Promise((resolve) => server.listen(port, resolve));

  return { base: `http://127.0.0.1:${port}`, server, rules };
}
