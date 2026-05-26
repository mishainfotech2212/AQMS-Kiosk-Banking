import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { useKiosk } from '@/context/kiosk-context';
import { KioskColors } from '@/constants/kiosk-theme';
import { GradientButton } from '@/components/kiosk/GradientButton';
import { GrayButton } from '@/components/kiosk/GrayButton';
import { KioskCard } from '@/components/kiosk/KioskCard';

export function StepTicketType() {
  const { width } = useWindowDimensions();
  const narrow = width < 480;
  const { ticketType, setTicketType, goNext, goBack } = useKiosk();

  return (
    <KioskCard style={narrow ? styles.cardTight : undefined}>
      <Text style={styles.title}>Select Ticket Type</Text>

      <View style={[styles.grid, narrow && styles.gridStack]}>
        <Pressable
          onPress={() => setTicketType('standard')}
          style={({ pressed }) => [
            styles.card,
            ticketType === 'standard' && styles.cardSel,
            { opacity: pressed ? 0.95 : 1 },
          ]}>
          <View style={styles.iconRing}>
            <Ionicons name="list-outline" size={28} color={KioskColors.greyMuted} />
          </View>
          <Text style={styles.cardTitle}>Standard</Text>
          <Text style={styles.cardDesc}>Regular queue for standard service</Text>
        </Pressable>

        <Pressable
          onPress={() => setTicketType('priority')}
          style={({ pressed }) => [
            styles.card,
            ticketType === 'priority' && styles.cardSel,
            { opacity: pressed ? 0.95 : 1 },
          ]}>
          <View style={styles.iconRing}>
            <Ionicons name="flash-outline" size={28} color={KioskColors.greyMuted} />
          </View>
          <Text style={styles.cardTitle}>Priority</Text>
          <Text style={styles.cardDesc}>Faster service with priority access</Text>
          <Text style={styles.priorityHelp}>
            For pregnant women, VIP customers, people with disabilities, and senior citizens
          </Text>
        </Pressable>
      </View>

      <View style={[styles.footer, narrow && styles.footerStack]}>
        <GrayButton
          title="Back"
          showBackArrow
          onPress={goBack}
          flex={narrow ? undefined : 1}
          style={narrow ? styles.btnFull : undefined}
        />
        <GradientButton
          title="Continue"
          disabled={!ticketType}
          onPress={goNext}
          flex={narrow ? undefined : 1.4}
          style={narrow ? styles.btnFull : undefined}
        />
      </View>
    </KioskCard>
  );
}

const styles = StyleSheet.create({
  cardTight: {
    paddingHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: KioskColors.navy,
    marginBottom: 24,
    fontFamily: Platform.select({
      web: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
      default: undefined,
    }),
  },
  grid: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 28,
  },
  gridStack: {
    flexDirection: 'column',
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: KioskColors.greyLine,
    borderRadius: 12,
    padding: 16,
    backgroundColor: KioskColors.white,
    alignItems: 'center',
    gap: 10,
  },
  cardSel: {
    borderColor: KioskColors.mediumBlue,
    backgroundColor: KioskColors.lightBlueSelect,
  },
  iconRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: KioskColors.cardGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: KioskColors.navyText,
  },
  cardDesc: {
    fontSize: 13,
    textAlign: 'center',
    color: KioskColors.greyMuted,
    lineHeight: 18,
  },
  priorityHelp: {
    fontSize: 12,
    fontWeight: '600',
    color: KioskColors.greyMuted,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  footerStack: {
    flexDirection: 'column',
  },
  btnFull: {
    width: '100%',
  },
});
