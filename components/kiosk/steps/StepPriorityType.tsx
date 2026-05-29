import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { GrayButton } from '@/components/kiosk/GrayButton';
import { GradientButton } from '@/components/kiosk/GradientButton';
import { KioskCard } from '@/components/kiosk/KioskCard';
import { KIOSK_COPY } from '@/constants/kiosk-i18n';
import { KioskColors } from '@/constants/kiosk-theme';
import { useKiosk, type PriorityTypeId } from '@/context/kiosk-context';

type PriorityOptionId = NonNullable<PriorityTypeId>;
type IconName = ComponentProps<typeof Ionicons>['name'];

const PRIORITY_OPTIONS: { id: PriorityOptionId; icon: IconName }[] = [
  { id: 'pregnant', icon: 'heart-outline' },
  { id: 'vip', icon: 'star-outline' },
  { id: 'disabled', icon: 'accessibility-outline' },
  { id: 'senior', icon: 'person-outline' },
];

export function StepPriorityType() {
  const { width } = useWindowDimensions();
  const narrow = width < 520;
  const { priorityType, setPriorityType, language, goNext, goBack } = useKiosk();
  const copy = KIOSK_COPY[language];

  return (
    <KioskCard style={narrow ? styles.cardTight : undefined}>
      <Text style={styles.title}>{copy.priorityType.title}</Text>
      <Text style={styles.subtitle}>{copy.priorityType.subtitle}</Text>

      <View style={[styles.grid, narrow && styles.gridStack]}>
        {PRIORITY_OPTIONS.map((option) => {
          const selected = priorityType === option.id;
          const optionCopy = copy.priorityType[option.id];

          return (
            <Pressable
              key={option.id}
              onPress={() => setPriorityType(option.id)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                { opacity: pressed ? 0.94 : 1 },
              ]}>
              <View style={[styles.iconRing, selected && styles.iconRingSelected]}>
                <Ionicons
                  name={option.icon}
                  size={28}
                  color={selected ? KioskColors.mediumBlue : KioskColors.greyMuted}
                />
              </View>
              <Text style={styles.optionTitle}>{optionCopy.title}</Text>
              <Text style={styles.optionDesc}>{optionCopy.desc}</Text>
            </Pressable>
          );
        })}
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
          disabled={!priorityType}
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
    marginBottom: 8,
    fontFamily: Platform.select({
      web: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
      default: undefined,
    }),
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: KioskColors.greyMuted,
    marginBottom: 22,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 28,
  },
  gridStack: {
    flexDirection: 'column',
  },
  option: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 150,
    borderWidth: 1,
    borderColor: KioskColors.greyLine,
    borderRadius: 12,
    padding: 16,
    backgroundColor: KioskColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  optionSelected: {
    borderColor: KioskColors.mediumBlue,
    backgroundColor: KioskColors.lightBlueSelect,
  },
  iconRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: KioskColors.cardGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingSelected: {
    backgroundColor: KioskColors.white,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: KioskColors.navyText,
    textAlign: 'center',
  },
  optionDesc: {
    fontSize: 12,
    color: KioskColors.greyMuted,
    textAlign: 'center',
    lineHeight: 17,
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

