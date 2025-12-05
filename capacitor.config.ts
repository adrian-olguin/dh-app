import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // NEW bundle ID for the *beta* app:
  appId: 'com.purposedriveconnection.dailyhopebeta',
  appName: 'Daily Hope Beta',
  webDir: 'dist',
  // Comment out the server block so it uses the bundled app, not the hosted Lovable URL
  // server: {
  //   url: 'https://d3eaaa39-0305-4fc3-8035-4855fa6a699a.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#2950b8',
      showSpinner: false,
    },
  },
};

export default config;
