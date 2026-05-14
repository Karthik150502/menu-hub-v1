// ─── Asset module declarations ────────────────────────────────────────────────
// Tells TypeScript how to type static asset imports so it stops warning
// on lines like: import Logo from '../../assets/images/logo.png'
//
// Expo's Metro bundler handles the actual resolution at build time.
// These declarations just give TypeScript a type to attach to the import.

declare module '*.png' {
    const value: import('react-native').ImageSourcePropType;
    export default value;
}

declare module '*.jpg' {
    const value: import('react-native').ImageSourcePropType;
    export default value;
}

declare module '*.jpeg' {
    const value: import('react-native').ImageSourcePropType;
    export default value;
}

declare module '*.gif' {
    const value: import('react-native').ImageSourcePropType;
    export default value;
}

declare module '*.webp' {
    const value: import('react-native').ImageSourcePropType;
    export default value;
}

// declare module '*.svg' {
//     import React from 'react';
//     import { SvgProps } from 'react-native-svg';
//     const content: React.FC<SvgProps>;
//     export default content;
// }