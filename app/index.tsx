import { Redirect } from 'expo-router';

/**
 * Open Banking Kiosk (Kiosk ID welcome) immediately after splash instead of tab home.
 */
export default function RootIndex() {
  return <Redirect href="/kiosk" />;
}
