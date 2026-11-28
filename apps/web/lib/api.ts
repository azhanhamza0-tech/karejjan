import { auth } from './firebase';

export class ApiError extends Error {
  status: number;
  code?: string;
  payload?: unknown;

  constructor(message: string, status: number, code?: string, payload?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

export async function apiFetch<T>(
  path: string,
  options: { method?: 'GET' | 'POST' | 'DELETE'; body?: unknown; requireAuth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.requireAuth !== false) {
    const user = auth.currentUser;
    if (!user) {
      throw new ApiError('Please sign in to continue.', 401, 'UNAUTHENTICATED');
    }
    const idToken = await user.getIdToken();
    headers.Authorization = `Bearer ${idToken}`;
  }

  const response = await fetch(path, {
    method: options.method || 'GET',
    headers,
    body:
      options.body !== undefined
        ? typeof options.body === 'string'
          ? options.body
          : JSON.stringify(options.body)
        : undefined,
  });

  const rawText = await response.text();
  let data: any = {};
  try {
    data = JSON.parse(rawText);
  } catch {
    data = { error: rawText.length > 300 ? `Server returned status ${response.status}` : rawText };
  }

  if (!response.ok) {
    const message =
      (typeof data?.error === 'string' && data.error.trim()) ||
      (typeof data?.message === 'string' && data.message.trim()) ||
      `Request failed (${response.status})`;

    throw new ApiError(
      message,
      response.status,
      data?.code,
      data
    );
  }
  return data as T;
}
