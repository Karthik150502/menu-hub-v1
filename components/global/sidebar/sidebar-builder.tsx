import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { SidebarOption, SidebarProps } from '@/types/sidebar';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 320);


// ─── Component ────────────────────────────────────────────────────────────────
const SidebarBuilder: React.FC<SidebarProps> = ({
  visible,
  onClose,
  header,
  footer,
  optionGroups = [],
  side = 'left',
  overlayOpacity = 0.6,
  containerStyle,
}) => {
  const translateX = useRef(
    new Animated.Value(side === 'left' ? -SIDEBAR_WIDTH : SIDEBAR_WIDTH),
  ).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef<Animated.Value[]>([]).current;

  // Pre-build item stagger animations
  const allOptions = optionGroups.flatMap((g) => g.options);
  while (itemAnimations.length < allOptions.length + 10) {
    itemAnimations.push(new Animated.Value(0));
  }

  const openSidebar = useCallback(() => {
    // Reset stagger values
    itemAnimations.forEach((v) => v.setValue(0));

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 340,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: overlayOpacity,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Stagger items after panel arrives
      const staggered = itemAnimations
        .slice(0, allOptions.length)
        .map((v, i) =>
          Animated.timing(v, {
            toValue: 1,
            delay: i * 45,
            duration: 220,
            easing: Easing.out(Easing.back(1.4)),
            useNativeDriver: true,
          }),
        );
      Animated.stagger(40, staggered).start();
    });
  }, [translateX, backdropOpacity, itemAnimations, allOptions.length, overlayOpacity]);

  const closeSidebar = useCallback(
    (callback?: () => void) => {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: side === 'left' ? -SIDEBAR_WIDTH : SIDEBAR_WIDTH,
          duration: 280,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 240,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        callback?.();
      });
    },
    [translateX, backdropOpacity, side],
  );

  useEffect(() => {
    if (visible) {
      openSidebar();
    } else {
      closeSidebar();
    }
  }, [visible, openSidebar, closeSidebar]);

  const handleClose = () => {
    closeSidebar(onClose);
  };

  const sidebarStyle: ViewStyle =
    side === 'left'
      ? { left: 0, borderTopRightRadius: 20, borderBottomRightRadius: 20 }
      : { right: 0, borderTopLeftRadius: 20, borderBottomLeftRadius: 20 };

  // Flatten all options with their indices for stagger
  let flatIndex = 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      {/* Sidebar panel */}
      <Animated.View
        style={[
          styles.sidebar,
          sidebarStyle,
          {
            backgroundColor: DESIGN_TOKENS.background_1,
            transform: [{ translateX }]
          },
          containerStyle,
        ]}
      >
        {/* Edge accent line */}
        <View
          style={[
            styles.accentLine,
            side === 'left' ? styles.accentRight : styles.accentLeft,
          ]}
        />

        {/* Header slot */}
        {header && (
          <View style={styles.headerSlot}>
            {header}
            <View style={styles.headerDivider} />
          </View>
        )}

        {/* Body: option groups */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {optionGroups.map((group, groupIdx) => (
            <View key={groupIdx} style={groupIdx > 0 ? styles.groupSpacing : undefined}>
              {groupIdx > 0 && <View style={styles.groupDivider} />}

              {group.groupLabel ? (
                <Text style={styles.groupLabel}>{group.groupLabel.toUpperCase()}</Text>
              ) : null}

              {group.options.map((option) => {
                const animValue = itemAnimations[flatIndex++];
                return (
                  <AnimatedOption
                    key={option.key}
                    option={option}
                    animValue={animValue}
                    onPress={() => {
                      if (option.disabled) return;
                      handleClose();
                      // small delay so close animation starts before action
                      setTimeout(option.onPress, 80);
                    }}
                  />
                );
              })}
            </View>
          ))}
        </ScrollView>

        {/* Footer slot */}
        {footer && (
          <View style={styles.footerSlot}>
            <View style={styles.footerDivider} />
            {footer}
          </View>
        )}
      </Animated.View>
    </Modal >
  );
};

// ─── Animated Option Item ─────────────────────────────────────────────────────

interface AnimatedOptionProps {
  option: SidebarOption;
  animValue: Animated.Value;
  onPress: () => void;
}

const AnimatedOption: React.FC<AnimatedOptionProps> = ({ option, animValue, onPress }) => {
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const itemStyle = {
    opacity: animValue,
    transform: [
      {
        translateX: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-18, 0],
        }),
      },
      { scale: pressAnim },
    ],
  };

  return (
    <Animated.View style={itemStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={option.disabled}
        activeOpacity={1}
        style={[styles.optionRow, option.disabled && styles.optionDisabled]}
      >
        {option.icon && <View style={styles.optionIcon}>{option.icon}</View>}
        <Text
          style={[
            styles.optionLabel,
            option.danger && styles.optionDanger,
            option.disabled && styles.optionLabelDisabled,
          ]}
          numberOfLines={1}
        >
          {option.label}
        </Text>
        <View style={styles.optionChevron}>
          <Text style={styles.chevronText}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
    overflow: 'hidden',
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(99,179,237,0.18)',
  },
  accentRight: { right: 0 },
  accentLeft: { left: 0 },

  // Header
  headerSlot: {
    paddingTop: Platform.OS === 'ios' ? 56 : 32,
    paddingHorizontal: 24,
    paddingBottom: 0,
  },
  headerDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginTop: 16,
  },

  // Body
  body: { flex: 1 },
  bodyContent: { paddingVertical: 12 },

  groupSpacing: { marginTop: 4 },
  groupDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 20,
    marginVertical: 8,
  },
  groupLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },

  // Option rows
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 12,
  },
  optionDisabled: { opacity: 0.58 },
  optionIcon: { marginRight: 14, width: 22, alignItems: 'center' },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.87)',
    letterSpacing: 0.2,
  },
  optionLabelDisabled: { color: 'rgba(255,255,255,0.35)' },
  optionDanger: { color: DESIGN_TOKENS.subNegativeDark },
  optionChevron: { marginLeft: 8 },
  chevronText: { fontSize: 20, color: 'rgba(255,255,255,0.2)', lineHeight: 22 },

  // Footer
  footerSlot: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginBottom: 16,
  },
});

export default SidebarBuilder;