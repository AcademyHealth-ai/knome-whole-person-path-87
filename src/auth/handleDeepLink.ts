// Deep link handling for Supabase auth on web and Capacitor native
// Supports custom scheme: knome://auth/callback and web path: /auth/callback
import { App } from '@capacitor/app';
import { supabase } from '@/integrations/supabase/client';

let initialized = false;

function parseHashParams(hash: string) {
  const clean = hash.startsWith('#') ? hash.slice(1) : hash;
  return new URLSearchParams(clean);
}

async function processAuthCallback(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    const isCustomScheme = url.protocol === 'knome:';
    const isWebCallback = url.pathname.startsWith('/auth/callback');

    if (!isCustomScheme && !isWebCallback) return;

    // 1) OAuth code flow (recommended for native)
    const code = url.searchParams.get('code');
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        window.location.href = '/dashboard';
        return;
      }
      // If exchange fails, fall back to token fragment parsing below
    }

    // 2) Token fragment (magic links or some providers)
    const params = parseHashParams(url.hash);
    const access_token = params.get('access_token') || undefined;
    const refresh_token = params.get('refresh_token') || undefined;

    if (access_token && refresh_token) {
      const { error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (!error) {
        window.location.href = '/dashboard';
        return;
      }
    }

    // If nothing matched, send user to auth page
    if (isWebCallback) {
      window.location.href = '/auth';
    }
  } catch (e) {
    // On parsing errors, route to auth
    window.location.href = '/auth';
  }
}

export function setupAuthDeepLinks() {
  if (initialized) return;
  initialized = true;

  // Handle native deep links when the app is opened via custom scheme
  try {
    App.addListener('appUrlOpen', (event) => {
      if (event?.url) processAuthCallback(event.url);
    });
  } catch {}

  // Handle direct web-based callbacks
  processAuthCallback(window.location.href);
  window.addEventListener('hashchange', () => processAuthCallback(window.location.href));
}
