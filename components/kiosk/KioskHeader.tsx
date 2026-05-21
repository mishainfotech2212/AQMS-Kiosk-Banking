import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KioskColors } from '@/constants/kiosk-theme';

export function KioskHeader() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={[KioskColors.headerGradientLeft, KioskColors.headerGradientRight]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[styles.bar, { paddingTop: insets.top + (Platform.OS === 'web' ? 0 : 6) }]}>
      <View style={styles.inner}>
        <Ionicons name="business" size={28} color={KioskColors.white} style={styles.icon} />
        <Text style={styles.title}>Banking Kiosk</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    paddingBottom: Platform.select({ web: 16, default: 14 }),
    paddingHorizontal: 16,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  icon: {
    marginTop: Platform.OS === 'ios' ? 2 : 0,
  },
  title: {
    color: KioskColors.white,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.select({
      web: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
      default: undefined,
    }),
  },
});
