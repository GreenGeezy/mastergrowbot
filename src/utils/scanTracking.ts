// Local storage utilities for managing scan count and user preferences
export const STORAGE_KEYS = {
  SCAN_COUNT: 'mastergrowbot_scan_count',
  LAST_SCAN_DATE: 'mastergrowbot_last_scan_date',
  PREMIUM_STATUS: 'mastergrowbot_premium_status',
  TUTORIAL_COMPLETED: 'plant-health-tutorial-completed',
  USER_PREFERENCES: 'mastergrowbot_user_preferences'
} as const;

export const FREE_SCAN_LIMIT = 5;

export interface ScanData {
  count: number;
  lastScanDate: string;
  isPremium: boolean;
}

export const getScanData = (): ScanData => {
  try {
    const count = parseInt(localStorage.getItem(STORAGE_KEYS.SCAN_COUNT) || '0', 10);
    const lastScanDate = localStorage.getItem(STORAGE_KEYS.LAST_SCAN_DATE) || new Date().toISOString();
    const isPremium = localStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS) === 'true';
    
    return { count, lastScanDate, isPremium };
  } catch (error) {
    console.error('Error reading scan data from localStorage:', error);
    return { count: 0, lastScanDate: new Date().toISOString(), isPremium: false };
  }
};

export const incrementScanCount = (): ScanData => {
  try {
    const currentData = getScanData();
    const newCount = currentData.count + 1;
    const newDate = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEYS.SCAN_COUNT, newCount.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_SCAN_DATE, newDate);
    
    return { ...currentData, count: newCount, lastScanDate: newDate };
  } catch (error) {
    console.error('Error incrementing scan count:', error);
    return getScanData();
  }
};

export const setPremiumStatus = (isPremium: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, isPremium.toString());
  } catch (error) {
    console.error('Error setting premium status:', error);
  }
};

export const resetScanCount = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SCAN_COUNT);
    localStorage.removeItem(STORAGE_KEYS.LAST_SCAN_DATE);
  } catch (error) {
    console.error('Error resetting scan count:', error);
  }
};

export const canUserScan = (): { canScan: boolean; scansRemaining: number; isPremium: boolean } => {
  const { count, isPremium } = getScanData();
  
  if (isPremium) {
    return { canScan: true, scansRemaining: -1, isPremium: true }; // -1 indicates unlimited
  }
  
  const scansRemaining = Math.max(0, FREE_SCAN_LIMIT - count);
  return { 
    canScan: scansRemaining > 0, 
    scansRemaining, 
    isPremium: false 
  };
};

export const shouldShowUpgradePrompt = (): boolean => {
  const { count, isPremium } = getScanData();
  return !isPremium && count >= FREE_SCAN_LIMIT;
};

export const getScansRemaining = (): number => {
  const { count, isPremium } = getScanData();
  
  if (isPremium) return -1; // Unlimited
  return Math.max(0, FREE_SCAN_LIMIT - count);
};

// Hook for managing scan state
import { useState, useEffect } from 'react';

export const useScanTracking = () => {
  const [scanData, setScanData] = useState<ScanData>(() => getScanData());
  
  const refreshScanData = () => {
    setScanData(getScanData());
  };
  
  const incrementScans = () => {
    const newData = incrementScanCount();
    setScanData(newData);
    return newData;
  };
  
  const updatePremiumStatus = (isPremium: boolean) => {
    setPremiumStatus(isPremium);
    setScanData(prev => ({ ...prev, isPremium }));
  };
  
  useEffect(() => {
    refreshScanData();
  }, []);
  
  return {
    scanData,
    refreshScanData,
    incrementScans,
    updatePremiumStatus,
    canScan: canUserScan(),
    shouldShowUpgrade: shouldShowUpgradePrompt(),
    scansRemaining: getScansRemaining()
  };
};