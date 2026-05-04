import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
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
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 220);

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

  const allOptions = optionGroups.flatMap((g) => g.options);
  while (itemAnimations.length < allOptions.length + 10) {
    itemAnimations.push(new Animated.Value(0));
  }

  const openSidebar = useCallback(() => {
    itemAnimations.forEach((v) => v.setValue(0));
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0, duration: 340,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: overlayOpacity, duration: 280,
        easing: Easing.out(Easing.quad), useNativeDriver: true,
      }),
    ]).start(() => {
      const staggered = itemAnimations
        .slice(0, allOptions.length)
        .map((v, i) =>
          Animated.timing(v, {
            toValue: 1, delay: i * 50, duration: 240,
            easing: Easing.out(Easing.back(1.2)), useNativeDriver: true,
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
          duration: 280, easing: Easing.in(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0, duration: 240,
          easing: Easing.in(Easing.quad), useNativeDriver: true,
        }),
      ]).start(() => callback?.());
    },
    [translateX, backdropOpacity, side],
  );

  useEffect(() => {
    if (visible) openSidebar();
    else closeSidebar();
  }, [visible, openSidebar, closeSidebar]);

  const handleClose = () => closeSidebar(onClose);

  const sidebarStyle: ViewStyle =
    side === 'left'
      ? { left: 0, borderTopRightRadius: 24, borderBottomRightRadius: 24 }
      : { right: 0, borderTopLeftRadius: 24, borderBottomLeftRadius: 24 };

  let flatIndex = 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sidebar,
          sidebarStyle,
          { backgroundColor: DESIGN_TOKENS.background_1, transform: [{ translateX }] },
          containerStyle,
        ]}
      >
        {/* Subtle right-edge glow line */}
        <View style={[styles.accentLine, side === 'left' ? styles.accentRight : styles.accentLeft]} />

        {/* Header */}
        {header && (
          <View style={styles.headerSlot}>
            {header}
            <View style={styles.headerDivider} />
          </View>
        )}

        {/* Option groups */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {optionGroups.map((group, groupIdx) => (
            <View key={groupIdx} style={styles.group}>
              {/* Group label */}
              {group.groupLabel && (
                <Text style={styles.groupLabel}>
                  {group.groupLabel.toUpperCase()}
                </Text>
              )}

              {/* Top border of the group block */}
              <View style={styles.groupEdgeBorder} />

              {group.options.map((option, optIdx) => {
                const animValue = itemAnimations[flatIndex++];
                const isLast = optIdx === group.options.length - 1;
                return (
                  <AnimatedOption
                    key={option.key}
                    option={option}
                    animValue={animValue}
                    showSeparator={!isLast}
                    onPress={() => {
                      if (option.disabled) return;
                      handleClose();
                      setTimeout(option.onPress, 80);
                    }}
                  />
                );
              })}

              {/* Bottom border of the group block */}
              <View style={styles.groupEdgeBorder} />
            </View>
          ))}
        </ScrollView>

        {/* Footer */}
        {footer && (
          <View style={styles.footerSlot}>
            <View style={styles.footerDivider} />
            {footer}
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

// ─── Animated Option ──────────────────────────────────────────────────────────

interface AnimatedOptionProps {
  option: SidebarOption;
  animValue: Animated.Value;
  onPress: () => void;
  showSeparator: boolean;
}

const AnimatedOption: React.FC<AnimatedOptionProps> = ({
  option, animValue, onPress, showSeparator,
}) => {
  const pressAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: true, speed: 40, bounciness: 0 }),
      Animated.timing(bgAnim, { toValue: 1, duration: 80, useNativeDriver: false }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 4 }),
      Animated.timing(bgAnim, { toValue: 0, duration: 160, useNativeDriver: false }),
    ]).start();
  };

  const rowBg = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.04)'],
  });

  const itemStyle = {
    opacity: animValue,
    transform: [
      {
        translateX: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0],
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
      >
        <Animated.View
          style={[
            styles.optionRow,
            option.disabled && styles.optionDisabled,
            { backgroundColor: rowBg },
          ]}
        >
          {/* Leading icon */}
          {option.icon && (
            <View style={styles.optionIconWrap}>{option.icon}</View>
          )}

          {/* Label */}
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
        </Animated.View>
      </TouchableOpacity>

      {/* Inset separator — only between items, full width */}
      {showSeparator && <View style={styles.itemSeparator} />}
    </Animated.View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: DESIGN_TOKENS.primaryBlack,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    shadowColor: DESIGN_TOKENS.primaryBlack,
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    elevation: 24,
    overflow: 'hidden',
  },

  // Subtle accent line on the open edge
  accentLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: DESIGN_TOKENS.accentLineSubtle,
  },
  accentRight: { right: 0 },
  accentLeft: { left: 0 },

  // ── Header ──────────────────────────────────────────────────────────────────
  headerSlot: {
    paddingTop: Platform.OS === 'ios' ? 56 : 32,
    paddingHorizontal: SPACING.xxl,
    paddingBottom: 0,
  },
  headerDivider: {
    height: 1,
    backgroundColor: DESIGN_TOKENS.borderSubtle,
    marginTop: SPACING.lg,
  },

  // ── Body ────────────────────────────────────────────────────────────────────
  body: { flex: 1 },
  bodyContent: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.xxl,  // breathing room between groups
  },

  // ── Group ────────────────────────────────────────────────────────────────────
  group: { gap: 0 },

  groupLabel: {
    ...TYPOGRAPHY.caption_bold,
    color: DESIGN_TOKENS.textSectionTitle,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.sm,
    textAlign: 'right',
  },

  // Full-width top and bottom borders that frame the group
  groupEdgeBorder: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DESIGN_TOKENS.whiteFadeSm,  // very subtle — lighter than whiteFadeXs
  },

  // ── Option row ───────────────────────────────────────────────────────────────
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.ssm + 2,  // 12px — generous tap target
    gap: SPACING.sm,
  },

  optionDisabled: { opacity: 0.35 },

  optionIconWrap: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  optionLabel: {
    ...TYPOGRAPHY.body,
    color: DESIGN_TOKENS.textHint,
    letterSpacing: 0.15,
    flexShrink: 1,
  },
  optionLabelDisabled: { color: DESIGN_TOKENS.textDisabled },
  optionDanger: {
    color: DESIGN_TOKENS.subNegativeDark,
    fontWeight: '500',
  },

  // Inset separator between items — barely perceptible
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DESIGN_TOKENS.whiteFadeXs,  // almost invisible
    marginHorizontal: SPACING.xxl,                 // indented from edges
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footerSlot: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  footerDivider: {
    height: 1,
    backgroundColor: DESIGN_TOKENS.borderSubtle,
    marginBottom: SPACING.lg,
  },
});

export default SidebarBuilder;