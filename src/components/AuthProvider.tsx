'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { loadUserFromStorage } from '@/redux/authSlice';
import LoadingSpinner from './LoadingSpinner';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Load user from localStorage on mount
    dispatch(loadUserFromStorage());
    setIsHydrated(true);
  }, [dispatch]);

  // Show loading while hydrating auth state
  if (!isHydrated) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return <>{children}</>;
}
