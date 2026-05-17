import { supabase } from './supabase';

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Handles all Supabase auth callback URL patterns:
//   ?code=...             → PKCE OAuth code exchange
//   ?token_hash=...&type= → email verification / password reset
//   #access_token=...     → implicit OAuth flow
// Returns { type } so callers can react to 'recovery' etc.
export async function handleAuthCallbackUrl(url: string): Promise<{ type?: string }> {
  if (!url) return {};

  const queryPart = url.split('?')[1]?.split('#')[0] ?? '';
  const query: Record<string, string> = queryPart
    ? Object.fromEntries(
        queryPart.split('&').map((p) => {
          const idx = p.indexOf('=');
          return [decodeURIComponent(p.slice(0, idx)), decodeURIComponent(p.slice(idx + 1))];
        })
      )
    : {};

  const hashPart = url.split('#')[1] ?? '';
  const hash: Record<string, string> = hashPart
    ? Object.fromEntries(
        hashPart.split('&').map((p) => {
          const idx = p.indexOf('=');
          return [decodeURIComponent(p.slice(0, idx)), decodeURIComponent(p.slice(idx + 1))];
        })
      )
    : {};

  if (query.code) {
    await supabase.auth.exchangeCodeForSession(query.code);
    return {};
  }
  if (query.token_hash && query.type) {
    await supabase.auth.verifyOtp({ token_hash: query.token_hash, type: query.type as any });
    return { type: query.type };
  }
  if (hash.access_token && hash.refresh_token) {
    await supabase.auth.setSession({ access_token: hash.access_token, refresh_token: hash.refresh_token });
    return {};
  }
  return {};
}
