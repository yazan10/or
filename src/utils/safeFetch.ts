/**
 * Safe fetch and JSON parsing utilities
 * Prevents "JSON.parse: unexpected character at line 1 column 1" errors
 * when a backend endpoint returns an HTML error page, empty body, or non-JSON text.
 */

export interface SafeJsonResult<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
}

export async function parseSafeJson<T = any>(res: Response): Promise<SafeJsonResult<T>> {
  const status = res.status;
  try {
    const rawText = await res.text();
    const trimmed = rawText.trim();

    if (!trimmed) {
      return {
        ok: res.ok,
        status,
        data: null,
        error: res.ok ? undefined : `Empty response (HTTP ${status})`,
      };
    }

    // Check if the response is HTML or text rather than JSON
    if (trimmed.startsWith('<') || trimmed.toLowerCase().startsWith('<!doctype')) {
      return {
        ok: false,
        status,
        data: null,
        error: `Server returned HTML (${status}) instead of JSON. Please check server connection.`,
      };
    }

    // Attempt clean JSON parse
    let parsed: any;
    try {
      parsed = JSON.parse(trimmed);
    } catch (e: any) {
      // If starts with markdown fences, attempt clean
      if (trimmed.startsWith('```')) {
        const cleaned = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        parsed = JSON.parse(cleaned);
      } else {
        return {
          ok: false,
          status,
          data: null,
          error: e.message || 'Invalid JSON format received from server',
        };
      }
    }

    return {
      ok: res.ok,
      status,
      data: parsed,
      error: !res.ok ? (parsed?.error || parsed?.message || `HTTP ${status}`) : undefined,
    };
  } catch (err: any) {
    return {
      ok: false,
      status,
      data: null,
      error: err.message || 'Network error while reading response',
    };
  }
}

export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<SafeJsonResult<T>> {
  try {
    const res = await fetch(input, init);
    return await parseSafeJson<T>(res);
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: err.message || 'Failed to connect to server',
    };
  }
}
