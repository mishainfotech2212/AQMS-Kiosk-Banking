import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { GrayButton } from '@/components/kiosk/GrayButton';
import { GradientButton } from '@/components/kiosk/GradientButton';
import { KioskCard } from '@/components/kiosk/KioskCard';
import { useKiosk, type BranchId } from '@/context/kiosk-context';
import { KIOSK_COPY } from '@/constants/kiosk-i18n';
import { KioskColors } from '@/constants/kiosk-theme';

/** Branches come from validate-kiosk-code response (step 1) — no extra API */
export function StepBranch() {
  const { width } = useWindowDimensions();
  const narrow = width < 400;
  const { branch, setBranch, branchList, language, goNext, goBack } = useKiosk();
  const copy = KIOSK_COPY[language];
  const [local, setLocal] = useState<BranchId | null>(branch);

  useEffect(() => {
    setLocal(branch);
  }, [branch]);

  const list = branchList;

  return (
    <KioskCard style={narrow ? styles.cardTight : undefined}>
      <Text style={styles.title}>{copy.branch.title}</Text>

      <View style={styles.list}>
        {list.map((b) => {
          const selected = local === b.id;
          return (
            <Pressable
              key={b.id}
              onPress={() => {
                setLocal(b.id);
                setBranch(b.id);
              }}
              style={({ pressed }) => [
                styles.item,
                selected && styles.itemSelected,
                { opacity: pressed ? 0.92 : 1 },
              ]}>
              <View style={styles.iconSq}>
                <Ionicons name="business-outline" size={22} color={KioskColors.grey} />
              </View>
              <Text style={styles.itemText}>{b.name}</Text>
              <Ionicons name="chevron-forward" size={20} color={KioskColors.greyLine} />
            </Pressable>
          );
        })}
      </View>

      {list.length === 0 ? (
        <Text style={styles.empty}>{copy.branch.empty}</Text>
      ) : null}

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
          disabled={!local || list.length === 0}
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
  empty: {
    textAlign: 'center',
    color: KioskColors.greyMuted,
    marginBottom: 16,
  },
  list: {
    gap: 12,
    marginBottom: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: KioskColors.greyLine,
    borderRadius: 10,
    padding: 14,
    backgroundColor: KioskColors.white,
    gap: 12,
  },
  itemSelected: {
    borderColor: KioskColors.mediumBlue,
    backgroundColor: KioskColors.lightBlueSelect,
  },
  iconSq: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: KioskColors.cardGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: KioskColors.navy,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
  },
  footerStack: {
    flexDirection: 'column',
  },
  btnFull: {
    width: '100%',
  },
});
