import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { GrayButton } from '@/components/kiosk/GrayButton';
import { GradientButton } from '@/components/kiosk/GradientButton';
import { FieldError } from '@/components/kiosk/FieldError';
import { KioskCard } from '@/components/kiosk/KioskCard';
import { useKiosk } from '@/context/kiosk-context';
import { KioskColors } from '@/constants/kiosk-theme';
import { apiGenerateToken } from '@/services/api/kiosk-api';

export function StepCustomer() {
  const { width } = useWindowDimensions();
  const narrow = width < 400;
  const {
    branch,
    branchLabel,
    serviceName,
    serviceItemId,
    estimatedServiceTime,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    goNext,
    goBack,
    ticketType,
    applyTicketFromServer,
  } = useKiosk();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onContinue = async () => {
    if (!branch || !serviceItemId || !ticketType) return;
    setError(null);
    setLoading(true);
    try {
      const payload = {
        branch_id: branch,
        service_id: serviceItemId,
        counter_id: null as string | null,
        served_by: null as string | null,
        customer_name: customerName.trim() || 'Walk-in Customer',
        customer_phone: customerPhone.trim() || '+0000000000',
        priority: ticketType === 'priority' ? 1 : 0,
        source: 'api',
        auto_assign: true,
        notes: 'Created via kiosk',
      };
      const result = await apiGenerateToken(payload);
      applyTicketFromServer(result);
      goNext();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KioskCard style={narrow ? styles.cardTight : undefined}>
      <Text style={styles.title}>Customer Details</Text>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="business" size={22} color={KioskColors.mediumBlue} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoLabel}>Selected Branch</Text>
            <Text style={styles.infoValue}>{branchLabel}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="settings-outline" size={22} color={KioskColors.mediumBlue} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoLabel}>Selected Service</Text>
            <Text style={styles.infoValue}>{serviceName ?? '—'}</Text>
          </View>
        </View>

        <View style={[styles.infoRow, styles.timeRow]}>
          <View style={styles.infoIcon}>
            <Ionicons name="time-outline" size={22} color={KioskColors.mediumBlue} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.timeLabel}>Estimated Service Time</Text>
            <Text style={styles.timeValue}>{estimatedServiceTime}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.fieldLabel}>Name (Optional)</Text>
      <TextInput
        style={styles.input}
        value={customerName}
        onChangeText={setCustomerName}
        placeholder="Name"
        placeholderTextColor={KioskColors.greyMuted}
      />

      <Text style={styles.fieldLabel}>Phone Number (Optional)</Text>
      <TextInput
        style={styles.input}
        value={customerPhone}
        onChangeText={(t) => setCustomerPhone(t.replace(/[^\d+]/g, '').slice(0, 16))}
        keyboardType="phone-pad"
        placeholder="+91 9876543210"
        placeholderTextColor={KioskColors.greyMuted}
      />

      <FieldError message={error} />

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
          onPress={onContinue}
          disabled={loading || !ticketType || !serviceItemId}
          loading={loading}
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
    marginBottom: 20,
    fontFamily: Platform.select({
      web: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
      default: undefined,
    }),
  },
  info: {
    gap: 12,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KioskColors.cardGrey,
    borderRadius: 10,
    padding: 14,
    gap: 12,
  },
  timeRow: {
    backgroundColor: KioskColors.lightBlueBg,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: KioskColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: KioskColors.greyMuted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 17,
    fontWeight: '700',
    color: KioskColors.navy,
  },
  timeLabel: {
    fontSize: 13,
    color: KioskColors.mediumBlue,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 17,
    fontWeight: '700',
    color: KioskColors.mediumBlue,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: KioskColors.navy,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: KioskColors.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: KioskColors.white,
    color: KioskColors.navyText,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  footerStack: {
    flexDirection: 'column',
  },
  btnFull: {
    width: '100%',
  },
});
