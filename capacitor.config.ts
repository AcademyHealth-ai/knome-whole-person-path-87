import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'YOUR_ACTUAL_BUNDLE_ID_HERE',  // Must match Apple Developer Console
  appName: 'knome-whole-person-path',
  webDir: 'dist',
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