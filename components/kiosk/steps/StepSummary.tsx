import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { GrayButton } from '@/components/kiosk/GrayButton';
import { GradientButton } from '@/components/kiosk/GradientButton';
import { KioskCard } from '@/components/kiosk/KioskCard';
import { useKiosk } from '@/context/kiosk-context';
import { KIOSK_COPY } from '@/constants/kiosk-i18n';
import { KioskColors } from '@/constants/kiosk-theme';

/** Summary shows generate-token response; Print/Send — no backend API in spec (local only) */
export function StepSummary() {
  const { width } = useWindowDimensions();
  const narrow = width < 520;
  const {
    summaryBranchLabel,
    summaryServiceLabel,
    ticketType,
    priorityType,
    ticketNumber,
    qrCodeUrl,
    language,
    goNext,
    goBack,
  } = useKiosk();
  const copy = KIOSK_COPY[language];

  const typeLabel =
    ticketType === 'priority' ? copy.ticketType.priority : copy.ticketType.standard;
  const priorityTypeLabel = priorityType ? copy.priorityType[priorityType].title : null;
  const [busy, setBusy] = useState<'print' | 'send' | null>(null);

  const onPrint = async () => {
    setBusy('print');
    try {
      Alert.alert(copy.summary.printAlertTitle, copy.summary.printAlertMessage);
    } finally {
      setBusy(null);
    }
  };

  const onSend = async () => {
    setBusy('send');
    try {
      Alert.alert(copy.summary.sendAlertTitle, copy.summary.sendAlertMessage);
    } finally {
      setBusy(null);
    }
  };

  return (
    <KioskCard style={[styles.card, narrow && styles.cardTight]}>
      <Text style={styles.title}>{copy.summary.title}</Text>

      <View style={styles.dashed}>
        <LinearGradient
          colors={[KioskColors.mediumBlue, KioskColors.navy]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.innerHeader}>
          <Text style={styles.innerHeaderText}>{copy.header.title}</Text>
        </LinearGradient>

        <View style={styles.rows}>
          <Row label={copy.summary.branchName} value={summaryBranchLabel} />
          <Row label={copy.summary.serviceName} value={summaryServiceLabel} />
          <Row label={copy.summary.ticketType} value={typeLabel} />
          {ticketType === 'priority' && priorityTypeLabel ? (
            <Row label={copy.priorityType.label} value={priorityTypeLabel} />
          ) : null}
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.rowLabel}>{copy.summary.ticketNumber}</Text>
            <Text style={styles.ticketNum}>{ticketNumber}</Text>
          </View>
        </View>

        <View style={styles.qr}>
          {qrCodeUrl ? (
            <Image source={{ uri: qrCodeUrl }} style={styles.qrImg} contentFit="contain" />
          ) : (
            <Text style={styles.qrText}>{copy.summary.qrCode}</Text>
          )}
        </View>
      </View>

      <View style={[styles.actions, narrow && styles.actionsStack]}>
        <GradientButton
          title={copy.summary.printTicket}
          leftIcon={<Ionicons name="print-outline" size={18} color={KioskColors.white} />}
          onPress={onPrint}
          loading={busy === 'print'}
          disabled={busy !== null}
          flex={narrow ? undefined : 1}
          style={narrow ? styles.btnFull : undefined}
        />
        <GrayButton
          title={copy.summary.sendToMobile}
          bordered
          flex={narrow ? undefined : 1}
          style={narrow ? styles.btnFull : undefined}
          leftIcon={<Ionicons name="phone-portrait-outline" size={18} color={KioskColors.navy} />}
          onPress={onSend}
          disabled={busy !== null}
        />
        <GrayButton
          title={copy.summary.finish}
          bordered
          flex={narrow ? undefined : 1}
          style={narrow ? styles.btnFull : undefined}
          leftIcon={
            <Ionicons name="checkmark-circle-outline" size={18} color={KioskColors.navy} />
          }
          onPress={goNext}
          disabled={busy !== null}
        />
      </View>

      <GrayButton title={copy.common.back} showBackArrow onPress={goBack} style={styles.backOnly} />
    </KioskCard>
  );
}

function Row({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: 620,
  },
  cardTight: {
    paddingHorizontal: 14,
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
  dashed: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#B8D4F0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  innerHeader: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  innerHeaderText: {
    color: KioskColors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  rows: {
    backgroundColor: KioskColors.white,
    paddingHorizontal: 16,
  },
  row: {
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: KioskColors.greyLine,
  },
  rowLabel: {
    fontSize: 13,
    color: KioskColors.grey,
    marginBottom: 4,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '700',
    color: KioskColors.navyText,
  },
  ticketNum: {
    fontSize: 22,
    fontWeight: '800',
    color: KioskColors.ticketBlue,
  },
  qr: {
    margin: 16,
    height: 120,
    borderRadius: 10,
    backgroundColor: KioskColors.cardGrey,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  qrImg: {
    width: 120,
    height: 120,
  },
  qrText: {
    color: KioskColors.grey,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  actionsStack: {
    flexDirection: 'column',
  },
  btnFull: {
    width: '100%',
  },
  backOnly: {
    alignSelf: 'center',
    minWidth: 120,
  },
});
