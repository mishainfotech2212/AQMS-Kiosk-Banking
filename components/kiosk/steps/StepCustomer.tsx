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
import { KIOSK_COPY } from '@/constants/kiosk-i18n';
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
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    goNext,
    goBack,
    ticketType,
    applyTicketFromServer,
    language,
  } = useKiosk();
  const copy = KIOSK_COPY[language];
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
        customer_name: customerName.trim() || copy.customer.walkInCustomer,
        customer_phone: customerPhone.trim() || '+0000000000',
        priority: ticketType === 'priority' ? 1 : 0,
        source: 'api',
        auto_assign: true,
        notes: copy.customer.notes,
      };
      const result = await apiGenerateToken(payload);
      applyTicketFromServer(result);
      goNext();
    } catch (e) {
      setError(
        language === 'hi'
          ? copy.customer.createError
          : e instanceof Error
            ? e.message
            : copy.customer.createError,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KioskCard style={narrow ? styles.cardTight : undefined}>
      <Text style={styles.title}>{copy.customer.title}</Text>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="business" size={22} color={KioskColors.mediumBlue} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoLabel}>{copy.customer.selectedBranch}</Text>
            <Text style={styles.infoValue}>{branchLabel}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="settings-outline" size={22} color={KioskColors.mediumBlue} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoLabel}>{copy.customer.selectedService}</Text>
            <Text style={styles.infoValue}>{serviceName ?? '—'}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.fieldLabel}>{copy.customer.nameLabel}</Text>
      <TextInput
        style={styles.input}
        value={customerName}
        onChangeText={setCustomerName}
        placeholder={copy.customer.namePlaceholder}
        placeholderTextColor={KioskColors.greyMuted}
      />

      <Text style={styles.fieldLabel}>{copy.customer.phoneLabel}</Text>
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
          title={copy.common.back}
          showBackArrow
          onPress={goBack}
          flex={narrow ? undefined : 1}
          style={narrow ? styles.btnFull : undefined}
        />
        <GradientButton
          title={copy.common.continue}
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
