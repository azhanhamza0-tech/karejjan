import { createApiApp } from './app.ts';

const app = createApiApp();

export default function handler(req: any, res: any) {
  return app(req, res);
}
