import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mastergrowbot.ai',
  appName: 'MasterGrowbot AI',
  webDir: 'dist',
  server: {
    url: 'https://4a890707-41df-4980-a668-0e1ebdbeae5f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#2D5A27',
      showSpinner: false
    }
  }
};

export default config;