import { ViewStyle } from "react-native";


// ─── Types ────────────────────────────────────────────────────────────────────
export interface SidebarOption {
    key: string;
    label: string;
    icon?: React.ReactNode;
    /** Navigate to this route when pressed (expo-router path). */
    href?: string;
    /** Called when pressed. If href is also set, called after navigation. */
    onPress?: () => void;
    disabled?: boolean;
    danger?: boolean;
    /**
     * Skip the sidebar's own close-on-press behavior — use when the press
     * itself only opens something layered on top (e.g. a confirmation
     * dialog) and the sidebar should stay visible underneath it. The
     * option's `onPress` is then responsible for closing the sidebar itself,
     * if/when that's the right outcome.
     */
    keepOpen?: boolean;
}

export interface SidebarOptionGroup {
    groupLabel?: string;
    options: SidebarOption[];
}

export interface SidebarProps {
    /** Whether the sidebar is currently visible */
    visible: boolean;
    /** Called when the sidebar should close (backdrop tap, back button) */
    onClose: () => void;

    /** Optional header rendered at the top of the sidebar */
    header?: React.ReactNode;

    /** Optional footer rendered at the bottom of the sidebar */
    footer?: React.ReactNode;

    /**
     * Option groups to render in the body of the sidebar.
     * Groups are separated by a subtle divider; each group can have an optional label.
     */
    optionGroups?: SidebarOptionGroup[];

    /** Which side the sidebar slides in from */
    side?: 'left' | 'right';

    /** Override the sidebar background color */
    backgroundColor?: string;

    /** Override the overlay/backdrop opacity (0–1) */
    overlayOpacity?: number;

    /** Extra style applied to the sidebar container */
    containerStyle?: ViewStyle;
}

