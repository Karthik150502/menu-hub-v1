import { TYPOGRAPHY } from "@/constants/themes/font";
import { SPACING } from "@/constants/themes/spacing";
import { DESIGN_TOKENS } from "@/constants/themes/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownItem {
    key: string;
    label: string;
    icon?: string;
    danger?: boolean;
    onSelect: () => void;
}

export interface AppDropdownProps {
    dropdownItems: DropdownItem[];
    /** Label shown inside the trigger button */
    dropdownButtonLabel?: string;
    /** Ionicons name for the trigger button icon. Defaults to "options-outline" */
    dropdownButtonIcon?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Component ────────────────────────────────────────────────────────────────

const AppDropdown: React.FC<AppDropdownProps> = ({
    dropdownItems,
    dropdownButtonLabel,
    dropdownButtonIcon = 'options-outline',
}) => {
    const [open, setOpen] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const dropdownAnim = useRef(new Animated.Value(0)).current;
    const btnRef = useRef<View>(null);
    const [anchor, setAnchor] = useState({ x: 0, y: 0, width: 0 });

    const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.88, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
    const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

    const openDropdown = () => {
        btnRef.current?.measureInWindow((x, y, width, height) => {
            setAnchor({ x, y: y + height + 4, width });
            setOpen(true);
            dropdownAnim.setValue(0);
            Animated.timing(dropdownAnim, {
                toValue: 1,
                duration: 180,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        });
    };

    const closeDropdown = () => {
        Animated.timing(dropdownAnim, {
            toValue: 0,
            duration: 130,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
        }).start(() => setOpen(false));
    };

    // Close the dropdown first, then fire the item's onSelect after animation
    const handleSelect = (item: DropdownItem) => {
        closeDropdown()
        // Small delay so close animation plays before action
        setTimeout(() => {
            item.onSelect()
        }, 250);
    };

    const dropdownStyle = {
        opacity: dropdownAnim,
        transform: [
            {
                translateY: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-8, 0],
                }),
            },
            {
                scale: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                }),
            },
        ],
    };

    const hasLabel = !!dropdownButtonLabel;

    return (
        <>
            {/* ── Trigger button ── */}
            <Animated.View
                ref={btnRef as any}
                style={[
                    styles.triggerWrap,
                    hasLabel && styles.triggerWrapLabelled,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                <TouchableOpacity
                    onPress={open ? () => closeDropdown() : openDropdown}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    activeOpacity={1}
                    style={[styles.triggerBtn, hasLabel && styles.triggerBtnLabelled]}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                    <Ionicons
                        name={(open ? 'close' : dropdownButtonIcon) as any}
                        size={15}
                        color={DESIGN_TOKENS.titleText}
                    />
                    {/* Optional label beside the icon */}
                    {hasLabel && (
                        <Text style={styles.triggerLabel}>{dropdownButtonLabel}</Text>
                    )}
                </TouchableOpacity>
            </Animated.View>

            {/* ── Dropdown (Modal escapes card overflow:hidden) ── */}
            {open && (
                <Modal
                    transparent
                    animationType="none"
                    onRequestClose={() => closeDropdown()}
                >
                    {/* Backdrop — tap outside closes */}
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => closeDropdown()} />

                    <Animated.View
                        style={[
                            styles.dropdown,
                            dropdownStyle,
                            {
                                top: anchor.y,
                                right: SCREEN_WIDTH - anchor.x - anchor.width,
                            },
                        ]}
                    >
                        {dropdownItems.map((item, i) => (
                            <React.Fragment key={item.key}>
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => handleSelect(item)}
                                    activeOpacity={0.7}
                                >
                                    {/* Optional per-item icon */}
                                    {item.icon && (
                                        <Ionicons
                                            name={item.icon as any}
                                            size={15}
                                            color={item.danger ? DESIGN_TOKENS.subNegativeDark : DESIGN_TOKENS.titleText}
                                        />
                                    )}
                                    <Text style={[
                                        styles.dropdownLabel,
                                        item.danger && styles.dropdownLabelDanger,
                                    ]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>

                                {/* Divider — not after the last item */}
                                {i < dropdownItems.length - 1 && (
                                    <View style={styles.dropdownDivider} />
                                )}
                            </React.Fragment>
                        ))}
                    </Animated.View>
                </Modal>
            )}
        </>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    // Trigger — icon-only (default)
    triggerWrap: {
        position: 'absolute',
        top: 6,
        right: 6,
    },
    // Trigger — with label (not absolutely positioned, flows inline)
    triggerWrapLabelled: {
        position: 'relative',
        top: 0,
        right: 0,
    },

    triggerBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: DESIGN_TOKENS.settingsBtnBg,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.whiteFadeSm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Labelled trigger — pill shape
    triggerBtnLabelled: {
        width: 'auto',
        height: 'auto',
        borderRadius: 20,
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    triggerLabel: {
        color: DESIGN_TOKENS.titleText,
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.1,
    },

    // Dropdown panel
    dropdown: {
        position: 'absolute',
        minWidth: 160,
        backgroundColor: DESIGN_TOKENS.cardBg,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.cardBorder,
        shadowColor: DESIGN_TOKENS.primaryBlack,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.55,
        shadowRadius: 20,
        elevation: 20,
        overflow: 'hidden',
    },

    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
    },
    dropdownLabel: {
        color: DESIGN_TOKENS.textOnGhost,
        ...TYPOGRAPHY.body,
    },
    dropdownLabelDanger: {
        color: DESIGN_TOKENS.subNegativeDark,
    },
    dropdownDivider: {
        height: 1,
        backgroundColor: DESIGN_TOKENS.disabled,
        marginHorizontal: SPACING.md,
    },
});

export default AppDropdown;