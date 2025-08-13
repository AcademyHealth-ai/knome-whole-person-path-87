import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a97379e496a1241fea9bafbc36edce731',
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