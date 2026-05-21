import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { GradientButton } from '@/components/kiosk/GradientButton';
import { KioskCard } from '@/components/kiosk/KioskCard';
import { useKiosk } from '@/context/kiosk-context';
import { KioskColors } from '@/constants/kiosk-theme';

export function StepSuccess() {
  const { width } = useWindowDimensions();
  const narrow = width < 400;
  const { resetFlow } = useKiosk();

  return (
    <KioskCard style={narrow ? styles.cardTight : undefined}>
      <View style={styles.iconWrap}>
        <LinearGradient
          colors={['#0096D6', KioskColors.navy]}
          style={styles.iconGrad}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}>
          <View style={styles.iconInner}>
            <Ionicons name="checkmark" size={36} color={KioskColors.white} />
          </View>
        </LinearGradient>
      </View>

      <Text style={styles.headline}>Your Ticket has been Generated Successfully</Text>
      <Text style={styles.sub}>Thank you for using our Banking Kiosk</Text>

      <GradientButton
        title="Generate Another Ticket"
        leftIcon={<Ionicons name="refresh" size={20} color={KioskColors.white} />}
        onPress={resetFlow}
        style={styles.cta}
      />
    </KioskCard>
  );
}

const styles = StyleSheet.create({
  cardTight: {
    paddingHorizontal: 16,
  },
  iconWrap: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  iconGrad: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: KioskColors.navyText,
    marginBottom: 12,
    lineHeight: 30,
    fontFamily: Platform.select({
      web: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
      default: undefined,
    }),
  },
  sub: {
    textAlign: 'center',
    fontSize: 15,
    color: KioskColors.greyMuted,
    marginBottom: 28,
  },
  cta: {
    marginTop: 8,
  },
});
