import { Platform, StyleSheet, Text } from 'react-native';

import { KioskColors } from '@/constants/kiosk-theme';

export function FieldError({ message }: { message: string | null }) {
  if (!message) return null;
  return <Text style={styles.text}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: '#C0392B',
    fontSize: 14,
    marginBottom: 12,
    fontFamily: Platform.select({
      web: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
      default: undefined,
    }),
  },
});
