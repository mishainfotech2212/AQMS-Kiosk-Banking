import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableStateCallbackType,
  type PressableProps,
} from 'react-native';

import { KioskColors } from '@/constants/kiosk-theme';

type Props = PressableProps & {
  title: string;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  flex?: number;
};

export function GradientButton({
  title,
  disabled,
  loading,
  leftIcon,
  flex,
  style,
  ...rest
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={(state: PressableStateCallbackType) => [
        styles.pressable,
        {
          flex: flex ?? undefined,
          opacity: disabled ? 0.5 : state.pressed ? 0.92 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      <LinearGradient
        colors={[KioskColors.mediumBlue, KioskColors.navy]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}>
        <View style={styles.row}>
          {loading ? <ActivityIndicator color={KioskColors.white} /> : null}
          {!loading && leftIcon}
          <Text style={styles.text}>{title}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 10,
    overflow: 'hidden',
    minHeight: 48,
    justifyContent: 'center',
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: KioskColors.white,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: Platform.select({
      web: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
      default: undefined,
    }),
  },
});
