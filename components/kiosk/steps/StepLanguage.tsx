import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { GrayButton } from '@/components/kiosk/GrayButton';
import { GradientButton } from '@/components/kiosk/GradientButton';
import { KioskCard } from '@/components/kiosk/KioskCard';
import { useKiosk } from '@/context/kiosk-context';
import { KIOSK_COPY } from '@/constants/kiosk-i18n';
import { KioskColors } from '@/constants/kiosk-theme';

/** Static language only — no API */
export function StepLanguage() {
  const { width } = useWindowDimensions();
  const narrow = width < 480;
  const { language, setLanguage, goNext, goBack } = useKiosk();
  const copy = KIOSK_COPY[language];

  return (
    <KioskCard style={narrow ? styles.cardTight : undefined}>
      <Text style={styles.title}>{copy.language.title}</Text>

      <View style={[styles.grid, narrow && styles.gridStack]}>
        <Pressable
          onPress={() => setLanguage('en')}
          style={[styles.opt, language === 'en' ? styles.optOn : styles.optOff]}>
          <Ionicons
            name="globe-outline"
            size={36}
            color={language === 'en' ? KioskColors.mediumBlue : KioskColors.grey}
          />
          <Text style={styles.optTitle}>English</Text>
          <Text style={styles.optSub}>{copy.language.englishSub}</Text>
        </Pressable>

        <Pressable
          onPress={() => setLanguage('hi')}
          style={[styles.opt, language === 'hi' ? styles.optOn : styles.optOff]}>
          <Ionicons
            name="globe-outline"
            size={36}
            color={language === 'hi' ? KioskColors.mediumBlue : KioskColors.grey}
          />
          <Text style={styles.optTitle}>हिंदी</Text>
          <Text style={styles.optSub}>{copy.language.hindiSub}</Text>
        </Pressable>
      </View>

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
  opt: {
    flex: 1,
    minHeight: 140,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  optOn: {
    backgroundColor: KioskColors.lightBlueSelect,
    borderColor: KioskColors.mediumBlue,
  },
  optOff: {
    backgroundColor: KioskColors.white,
    borderColor: KioskColors.greyLine,
  },
  optTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: KioskColors.navy,
  },
  optSub: {
    fontSize: 14,
    color: KioskColors.greyMuted,
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
