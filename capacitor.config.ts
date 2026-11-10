import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sidequest.tracker',
  appName: 'Side Quest',
  webDir: 'www',
  // Load the live GitHub Pages site so normal UI updates do not need a new APK.
  server: {
    url: 'https://squishypigs22.github.io/Side-Quest/',
    cleartext: false
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
