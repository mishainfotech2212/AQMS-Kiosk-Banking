import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { KioskColors } from '@/constants/kiosk-theme';

const TOTAL = 7;

type Props = {
  current: number;
};

export function Stepper({ current }: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 560;
  const circleSize = compact ? 28 : 34;
  const fontSize = compact ? 12 : 14;

  return (
    <View style={styles.strip}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollInner}
        bounces={false}>
        {Array.from({ length: TOTAL }, (_, i) => {
          const n = i + 1;
          const isDone = current > n;
          const isActive = current === n;
          const lineActive = current > n;

          return (
            <View key={n} style={styles.segment}>
              {i > 0 ? (
                <View
                  style={[
                    styles.line,
                    { width: compact ? 16 : 28 },
                    lineActive ? styles.lineActive : styles.lineInactive,
                  ]}
                />
              ) : null}
              <View
                style={[
                  styles.circle,
                  {
                    width: circleSize,
                    height: circleSize,
                    borderRadius: circleSize / 2,
                  },
                  isDone && styles.circleDone,
                  isActive && styles.circleActive,
                  !isDone && !isActive && styles.circlePending,
                ]}>
                {isDone ? (
                  <Ionicons name="checkmark" size={compact ? 16 : 18} color={KioskColors.white} />
                ) : (
                  <Text style={[styles.num, { fontSize }, isActive && styles.numActive]}>
                    {n}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    width: '100%',
    backgroundColor: KioskColors.white,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: KioskColors.greyLine,
  },
  scrollInner: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    minWidth: '100%',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    height: 3,
    marginRight: 2,
    borderRadius: 2,
  },
  lineActive: {
    backgroundColor: KioskColors.completedBlue,
  },
  lineInactive: {
    backgroundColor: KioskColors.greyLine,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
    backgroundColor: KioskColors.completedBlue,
  },
  circleActive: {
    backgroundColor: KioskColors.navy,
    borderWidth: 3,
    borderColor: KioskColors.lightBlueSelect,
  },
  circlePending: {
    backgroundColor: '#ECECEC',
  },
  num: {
    color: KioskColors.grey,
    fontWeight: '600',
  },
  numActive: {
    color: KioskColors.white,
  },
});
