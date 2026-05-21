import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { KioskColors } from '@/constants/kiosk-theme';

type Props = ViewProps & {
  children: React.ReactNode;
  maxWidth?: number;
};

export function KioskCard({ children, style, maxWidth = 560, ...rest }: Props) {
  return (
    <View style={[styles.wrap, { maxWidth }, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: KioskColors.white,
    borderRadius: 12,
    padding: Platform.select({ web: 28, default: 20 }),
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 51, 102, 0.12)',
      },
      default: {
        shadowColor: '#003366',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
});
