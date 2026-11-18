import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { GrayButton } from '@/components/kiosk/GrayButton';
import { GradientButton } from '@/components/kiosk/GradientButton';
import { FieldError } from '@/components/kiosk/FieldError';
import { KioskCard } from '@/components/kiosk/KioskCard';
import { KIOSK_COPY } from '@/constants/kiosk-i18n';
import { KioskColors } from '@/constants/kiosk-theme';
import { useKiosk } from '@/context/kiosk-context';
import { apiGetPriorityTypesByBranch } from '@/services/api/kiosk-api';
import type { ApiPriorityType } from '@/services/api/types';

function isRemoteIcon(icon: string | null): boolean {
  if (!icon) return false;
  return /^https?:\/\//i.test(icon) || icon.startsWith('data:');
}

function PriorityIcon({
  option,
  selected,
}: {
  option: ApiPriorityType;
  selected: boolean;
}) {
  const accent = option.color?.trim() || KioskColors.mediumBlue;
  const color = selected ? accent : KioskColors.greyMuted;

  if (isRemoteIcon(option.icon)) {
    return (
      <Image
        source={{ uri: option.icon! }}
        style={styles.remoteIcon}
        contentFit="contain"
      />
    );
  }

  return <Ionicons name="flash-outline" size={28} color={color} />;
}

/** Priority step — get-priority-types-by-branch */
export function StepPriorityType() {
  const { width } = useWindowDimensions();
  const narrow = width < 520;
  const { branch, priorityType, setPriorityType, language, goNext, goBack } = useKiosk();
  const copy = KIOSK_COPY[language];

  const [options, setOptions] = useState<ApiPriorityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!branch) {
      setOptions([]);
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      setPriorityType(null);
      try {
        const list = await apiGetPriorityTypesByBranch(branch);
        if (!cancelled) setOptions(list);
      } catch (e) {
        if (!cancelled) {
          setError(
            language === 'hi'
              ? copy.priorityType.loadError
              : e instanceof Error
                ? e.message
                : copy.priorityType.loadError,
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [branch, setPriorityType, copy.priorityType.loadError, language]);

  return (
    <KioskCard style={narrow ? styles.cardTight : undefined}>
      <Text style={styles.title}>{copy.priorityType.title}</Text>
      <Text style={styles.subtitle}>{copy.priorityType.subtitle}</Text>

      {loading ? (
        <ActivityIndicator
          color={KioskColors.mediumBlue}
          style={styles.loader}
          size="large"
        />
      ) : (
        <View style={[styles.grid, narrow && styles.gridStack]}>
          {options.map((option) => {
            const selected = priorityType?.id === option.id;
            const accent = option.color?.trim() || KioskColors.mediumBlue;

            return (
              <Pressable
                key={option.id}
                onPress={() => setPriorityType(option)}
                style={({ pressed }) => [
                  styles.option,
                  selected && styles.optionSelected,
                  selected && { borderColor: accent, backgroundColor: `${accent}14` },
                  { opacity: pressed ? 0.94 : 1 },
                ]}>
                <View
                  style={[
                    styles.iconRing,
                    selected && styles.iconRingSelected,
                    selected && { backgroundColor: KioskColors.white },
                  ]}>
                  <PriorityIcon option={option} selected={selected} />
                </View>
                <Text style={styles.optionTitle}>{option.name}</Text>
                {option.description ? (
                  <Text style={styles.optionDesc}>{option.description}</Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      )}

      {!loading && options.length === 0 && !error ? (
        <Text style={styles.empty}>{copy.priorityType.empty}</Text>
      ) : null}

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
          disabled={!priorityType || loading}
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
  loader: {
    marginVertical: 40,
  },
  empty: {
    textAlign: 'center',
    color: KioskColors.greyMuted,
    marginBottom: 16,
    fontSize: 14,
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
  remoteIcon: {
    width: 28,
    height: 28,
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
