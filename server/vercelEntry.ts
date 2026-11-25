import { createApiApp } from './app.ts';

const app = createApiApp();

export default function handler(req: any, res: any) {
  if (typeof req.url === 'string') {
    const parsed = new URL(req.url, 'http://localhost');
    const rewrittenPath = parsed.searchParams.get('__karejan_path');
    if (rewrittenPath !== null) {
      parsed.searchParams.delete('__karejan_path');
      const remainingQs = parsed.searchParams.toString();
      req.url = `/api/${rewrittenPath.replace(/^\/+/, '')}${remainingQs ? `?${remainingQs}` : ''}`;
    }
  }
  return app(req, res);
}
