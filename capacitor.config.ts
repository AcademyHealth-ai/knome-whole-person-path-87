import { CapacitorConfig } from '@capacitor/cli';

const isDev = process.env.NODE_ENV !== 'production';

const config: CapacitorConfig = {
  appId: 'app.lovable.97379e496a1241fea9bafbc36edce731',
  appName: 'knome-whole-person-path',
  webDir: 'dist',
  server: isDev
    ? {
        url: 'https://97379e49-6a12-41fe-a9ba-fbc36edce731.lovableproject.com?forceHideBadge=true',
        cleartext: true
      }
    : undefined,
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    preferredContentMode: 'mobile',
    backgroundColor: '#000000'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 300,
      backgroundColor: '#000000',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark'
    }
  }
};

export default config;