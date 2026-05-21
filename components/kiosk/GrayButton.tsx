import { Ionicons } from '@expo/vector-icons';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type PressableStateCallbackType,
} from 'react-native';

import { KioskColors } from '@/constants/kiosk-theme';

type Props = PressableProps & {
  title: string;
  showBackArrow?: boolean;
  bordered?: boolean;
  flex?: number;
  leftIcon?: React.ReactNode;
};

export function GrayButton({
  title,
  showBackArrow,
  bordered,
  flex,
  leftIcon,
  style,
  ...rest
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      style={(state: PressableStateCallbackType) => [
        styles.base,
        bordered && styles.bordered,
        { flex: flex ?? undefined, opacity: state.pressed ? 0.9 : 1 },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      <View style={styles.row}>
        {showBackArrow ? (
          <Ionicons name="arrow-back" size={18} color={KioskColors.navy} />
        ) : null}
        {leftIcon}
        <Text style={styles.text}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: KioskColors.cardGrey,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bordered: {
    backgroundColor: KioskColors.white,
    borderWidth: 1,
    borderColor: KioskColors.greyLine,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    color: KioskColors.navy,
    fontWeight: '600',
    fontSize: 15,
    fontFamily: Platform.select({
      web: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
      default: undefined,
    }),
  },
});
