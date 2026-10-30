'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Attendee, UserRole } from '../types';
import { AuthService } from '../services/authService';
import { Storage } from '../services/storage';

interface AuthContextType {
  currentUser: Attendee | null;
  role: UserRole;
  demoAccounts: Attendee[];
  switchRole: (role: UserRole) => void;
  switchUser: (id: string) => void;
  refresh: () => void;
  resetAllData: () => void;
  isOrganizer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Attendee | null>(null);
  const [demoAccounts, setDemoAccounts] = useState<Attendee[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadUserState = useCallback(() => {
    try {
      const user = AuthService.getActiveUser();
      setCurrentUser(user);
      setDemoAccounts(AuthService.getDemoAccounts());
    } catch (e) {
      console.error('Failed to load active user', e);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadUserState();

    const handleStorageUpdate = () => {
      loadUserState();
    };

    window.addEventListener('ccc-storage-updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('ccc-storage-updated', handleStorageUpdate);
    };
  }, [loadUserState]);

  const switchRole = (role: UserRole) => {
    const user = AuthService.switchRole(role);
    setCurrentUser(user);
  };

  const switchUser = (id: string) => {
    const user = AuthService.setActiveUser(id);
    setCurrentUser(user);
  };

  const resetAllData = () => {
    Storage.resetAll();
    loadUserState();
  };

  const value: AuthContextType = {
    currentUser,
    role: currentUser ? currentUser.role : 'founder',
    demoAccounts,
    switchRole,
    switchUser,
    refresh: loadUserState,
    resetAllData,
    isOrganizer: currentUser?.role === 'organizer',
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#080E18] text-[#F5F3EF]" />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
