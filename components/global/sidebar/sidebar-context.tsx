import React, { createContext, useCallback, useContext, useState } from 'react';

interface SidebarContextValue {
    isOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openSidebar = useCallback(() => setIsOpen(true), []);
    const closeSidebar = useCallback(() => setIsOpen(false), []);
    const toggleSidebar = useCallback(() => setIsOpen((v) => !v), []);

    return (
        <SidebarContext.Provider value={{ isOpen, openSidebar, closeSidebar, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error('useSidebar must be used inside <SidebarProvider>');
    return ctx;
}