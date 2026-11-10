import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sidequest.tracker',
  appName: 'Side Quest',
  webDir: 'www',
  android: {
    allowMixedContent: false
  }
};

export default config;
