export async function safeFetchJson(url: string, options?: RequestInit) {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (err: any) {
    throw new Error(err?.message || 'Network connection error. Please check your internet connection.');
  }

  const contentType = res.headers.get('content-type') || '';
  
  if (!contentType.includes('application/json')) {
    const text = await res.text().catch(() => '');
    if (res.status === 503 || res.status === 502 || res.status === 504 || res.status === 500) {
      throw new Error('AI service is temporarily experiencing high demand or maintenance. Please try again in a moment.');
    }
    if (text.trim().startsWith('<!doctype') || text.trim().startsWith('<html')) {
      throw new Error('AI service is currently initializing or restarting. Please try again in a moment.');
    }
    throw new Error(`Server error (${res.status}): ${text.substring(0, 120) || 'Service temporarily unavailable'}`);
  }

  let data: any;
  try {
    data = await res.json();
  } catch (err: any) {
    throw new Error('Failed to parse server response as JSON.');
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `API Error ${res.status}`);
  }

  return data;
}
