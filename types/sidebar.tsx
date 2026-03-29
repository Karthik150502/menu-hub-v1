import { ViewStyle } from "react-native";


// ─── Types ────────────────────────────────────────────────────────────────────
export interface SidebarOption {
    key: string;
    label: string;
    icon?: React.ReactNode;
    onPress: () => void;
    disabled?: boolean;
    danger?: boolean;
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

