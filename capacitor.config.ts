import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d3eaaa3903054fc380354855fa6a699a',
  appName: 'Daily Hope',
  webDir: 'dist',
  server: {
    url: 'https://d3eaaa39-0305-4fc3-8035-4855fa6a699a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#2950b8',
      showSpinner: false,
    },
  },
};

export default config;
