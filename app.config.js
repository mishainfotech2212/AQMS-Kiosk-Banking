/* eslint-env node */
/**
 * Loads `.env` at config time so EXPO_PUBLIC_* is available in extra → expo-constants.
 * Without this, process.env in the JS bundle is often empty and no API calls run (offline mode).
 */
require('dotenv').config();

const appJson = require('./app.json');

module.exports = {
  expo: {
    ...appJson.expo,
    android: {
      ...appJson.expo.android,
      package: 'com.bankkiosk.app',
      versionCode: 1,
    },
    extra: {
      ...(appJson.expo.extra ?? {}),
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
    },
  },
};
