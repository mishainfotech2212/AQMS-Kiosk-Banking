import Constants from 'expo-constants';

/**
 * Supabase Edge Functions base URL.
 * Set in `.env` as EXPO_PUBLIC_API_BASE_URL or in app.config.js `extra.apiBaseUrl`.
 * Auth: EXPO_PUBLIC_SUPABASE_ANON_KEY (in `.env`) or `extra.supabaseAnonKey` from app.config.js.
 */
const DEFAULT_BASE = 'https://api.caribbargains.com/queueflow-api/functions/v1';

type Extra = {
  supabaseAnonKey?: string;
  apiBaseUrl?: string;
};

function getExtra(): Extra {
  return (Constants.expoConfig?.extra ?? {}) as Extra;
}

export const API_PATHS = {
  validateKioskCode: '/validate-kiosk-code',
  getServicesByBranch: '/get-services-by-branch',
  generateToken: '/generate-token',
} as const;

function getRemoteApiBaseUrl(): string {
  const fromExtra = getExtra().apiBaseUrl;
  const raw =
    fromExtra != null && String(fromExtra).trim() !== ''
      ? String(fromExtra).trim()
      : process.env.EXPO_PUBLIC_API_BASE_URL;
  const base =
    raw != null && String(raw).trim() !== '' ? String(raw).trim() : DEFAULT_BASE;
  return base.replace(/\/+$/, '');
}

export function getApiBaseUrl(): string {
  return getRemoteApiBaseUrl();
}

/** Supabase anon key — sent as Authorization + apikey on every request */
export function getSupabaseAnonKey(): string {
  const fromExtra = getExtra().supabaseAnonKey;
  const fromEnv = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  const key =
    fromExtra != null && String(fromExtra).trim() !== ''
      ? String(fromExtra).trim()
      : String(fromEnv ?? '').trim();
  return key;
}

export function isLiveApiEnabled(): boolean {
  return getSupabaseAnonKey().length > 0;
}

/** User-facing hint when calls are skipped */
export function getMissingApiKeyMessage(): string {
  return 'Supabase anon key missing. Add EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file, then restart Expo with: npx expo start -c';
}
