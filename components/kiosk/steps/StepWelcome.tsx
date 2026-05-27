import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { FieldError } from '@/components/kiosk/FieldError';
import { GradientButton } from '@/components/kiosk/GradientButton';
import { KioskCard } from '@/components/kiosk/KioskCard';
import { useKiosk } from '@/context/kiosk-context';
import { KIOSK_COPY } from '@/constants/kiosk-i18n';
import { KioskColors } from '@/constants/kiosk-theme';
import { isLiveApiEnabled } from '@/services/api/config';
import { apiValidateKioskCode } from '@/services/api/kiosk-api';

/** Alphanumeric kiosk code (e.g. ABCD12) */
const KIOSK_CODE_RE = /^[A-Za-z0-9]{4,32}$/;

export function StepWelcome() {
  const { width } = useWindowDimensions();
  const narrow = width < 400;
  const { kioskId, setKioskId, language, setLanguage, goNext, setBranchList, setOrganization } =
    useKiosk();
  const copy = KIOSK_COPY[language];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(
    () => KIOSK_CODE_RE.test(kioskId.trim()),
    [kioskId],
  );

  const onContinue = async () => {
    setError(null);
    if (!isLiveApiEnabled()) {
      setError(copy.welcome.missingApiKey);
      return;
    }
    setLoading(true);
    try {
      const res = await apiValidateKioskCode(kioskId);
      if (!res.ok) {
        setError(
          language === 'hi'
            ? copy.welcome.invalidKioskCode
            : (res.message ?? copy.welcome.invalidKioskCode),
        );
        return;
      }
      setOrganization(res.organization);
      setBranchList(res.branches);
      goNext();
    } catch (e) {
      setError(
        language === 'hi'
          ? copy.welcome.networkError
          : e instanceof Error
            ? e.message
            : copy.welcome.networkError,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KioskCard style={narrow ? styles.cardTight : undefined}>
      <View style={styles.iconCircle}>
        <Ionicons name="business" size={36} color={KioskColors.white} />
      </View>
      <Text style={styles.heading}>{copy.welcome.heading}</Text>
      <Text style={styles.sub}>{copy.welcome.subtitle}</Text>

      <Text style={styles.label}>{copy.welcome.label}</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="characters"
        value={kioskId}
        onChangeText={(t) => {
          setKioskId(t.replace(/[^A-Za-z0-9]/g, '').slice(0, 32));
          setError(null);
        }}
        keyboardType="default"
        maxLength={32}
        placeholder="ABCD12"
        placeholderTextColor={KioskColors.greyMuted}
      />

      <FieldError message={error} />

      <GradientButton
        title={copy.common.continue}
        disabled={!valid || loading}
        loading={loading}
        onPress={onContinue}
        style={styles.cta}
      />

      <View style={styles.langPill}>
        <Pressable onPress={() => setLanguage('en')} hitSlop={8}>
          <Text style={[styles.langText, language === 'en' && styles.langActive]}>English</Text>
        </Pressable>
        <Text style={styles.langSep}> | </Text>
        <Pressable onPress={() => setLanguage('hi')} hitSlop={8}>
          <Text style={[styles.langText, language === 'hi' && styles.langActive]}>हिंदी</Text>
        </Pressable>
      </View>
    </KioskCard>
  );
}

const styles = StyleSheet.create({
  cardTight: {
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: KioskColors.navy,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heading: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: KioskColors.navy,
    marginBottom: 8,
    fontFamily: Platform.select({
      web: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
      default: undefined,
    }),
  },
  sub: {
    textAlign: 'center',
    fontSize: 15,
    color: KioskColors.grey,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: KioskColors.greyMuted,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: KioskColors.greyLine,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 20,
    letterSpacing: 2,
    color: KioskColors.navyText,
    marginBottom: 24,
    fontFamily: Platform.select({ web: 'Consolas, monospace', default: 'monospace' }),
  },
  cta: {
    marginBottom: 20,
  },
  langPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: KioskColors.cardGrey,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  langText: {
    color: KioskColors.grey,
    fontSize: 14,
  },
  langActive: {
    color: KioskColors.navy,
    fontWeight: '700',
  },
  langSep: {
    color: KioskColors.greyLine,
  },
});
