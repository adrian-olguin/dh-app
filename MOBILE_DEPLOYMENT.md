# iOS Mobile Deployment Guide

This guide will help you deploy the Daily Hope app as a native iOS application using Capacitor.

## Prerequisites

- macOS with Xcode installed (required for iOS development)
- Node.js and npm installed
- Your own GitHub repository (export this project from Lovable)
- Apple Developer Account (for App Store deployment)

## Step 1: Export and Clone Project

1. In Lovable, click the GitHub button in the top right
2. Export your project to your own GitHub repository
3. Clone the repository to your local machine:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all dependencies including Capacitor which has already been added to the project.

## Step 3: Configure Environment Variables

The app is already configured to use environment variables. Before building for production:

1. Create a `.env.production` file:
   ```bash
   cp .env .env.production
   ```

2. Update the Supabase URLs in `.env.production` to point to your production backend if different from development.

## Step 4: Build the Project

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Step 5: Initialize Capacitor (First Time Only)

Capacitor is already configured in `capacitor.config.ts`. To add the iOS platform:

```bash
npx cap add ios
```

This creates an `ios` folder with your Xcode project.

## Step 6: Update Capacitor Configuration

Edit `capacitor.config.ts` and remove or comment out the `server` section for production:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d3eaaa3903054fc380354855fa6a699a',
  appName: 'Daily Hope',
  webDir: 'dist',
  // Remove or comment out server section for production
  // server: {
  //   url: 'https://...',
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
```

## Step 7: Sync Changes to Native Project

After any code changes or before building for iOS:

```bash
npm run build
npx cap sync ios
```

This copies your web assets and updates native dependencies.

## Step 8: Open in Xcode

```bash
npx cap open ios
```

This opens your project in Xcode.

## Step 9: Configure iOS Project in Xcode

1. **Update Bundle Identifier**: In Xcode, select your project → Targets → App → General, and change the Bundle Identifier to your own (e.g., `com.yourcompany.dailyhope`)

2. **Update App Name**: Change the Display Name to "Daily Hope" or your preferred name

3. **Configure Signing**: Select your development team and signing certificate under "Signing & Capabilities"

4. **Update App Icons**: Replace the placeholder icons in Assets.xcassets with your app icons

5. **Configure Splash Screen**: The splash screen color is already set in `capacitor.config.ts`

## Step 10: Test on Simulator or Device

1. In Xcode, select a simulator or connected device from the device selector
2. Click the Play button (▶) to build and run

## Step 11: Production Build for App Store

1. **Set Build Configuration**: In Xcode, select "Product" → "Scheme" → "Edit Scheme", and set Build Configuration to "Release"

2. **Archive**: Select "Product" → "Archive"

3. **Validate**: Once archived, click "Validate App" to check for issues

4. **Distribute**: Click "Distribute App" and follow the prompts to upload to App Store Connect

## Mobile Optimizations Already Implemented

✅ Touch-friendly buttons with `touch-manipulation` CSS
✅ Active states instead of hover-only interactions  
✅ Safe browser API guards for WKWebView compatibility
✅ 390×844 screen optimization (iPhone 12/13/14 Pro)
✅ Bottom navigation positioned for safe area
✅ Responsive layout for all screen sizes
✅ Environment variables for backend URLs
✅ PWA capabilities for offline functionality

## Testing Checklist

Before submitting to the App Store, test:

- [ ] All navigation and bottom tabs work
- [ ] Video and audio playback functions correctly
- [ ] Push notifications (if enabled)
- [ ] Donations and Stripe checkout flow
- [ ] Authentication (sign up/sign in)
- [ ] Offline mode and cached content
- [ ] Dark mode and light mode switching
- [ ] All languages (English, Spanish, Portuguese, French)
- [ ] Share functionality works with native share sheet
- [ ] Deep linking (if applicable)

## Updating the App

When you make changes to your code:

1. Git pull the latest changes
2. Run `npm install` (if dependencies changed)
3. Run `npm run build`
4. Run `npx cap sync ios`
5. Open in Xcode and test/rebuild

## Development with Live Reload

For development, you can use the server URL in `capacitor.config.ts` to test changes in real-time on a device:

1. Uncomment the `server` section in `capacitor.config.ts`
2. Update the URL to your Lovable preview URL
3. Run `npx cap sync ios`
4. Build and run in Xcode
5. Changes in Lovable will reflect immediately in your iOS app

## Troubleshooting

### App crashes on launch
- Check console logs in Xcode
- Ensure `npm run build` completed successfully
- Verify `capacitor.config.ts` is properly configured

### White screen on launch
- Run `npx cap sync ios` again
- Check that `webDir: 'dist'` matches your build output folder
- Verify index.html exists in the dist folder

### API calls fail
- Check environment variables are correctly set
- Verify CORS is configured on your backend
- Check network requests in Safari Web Inspector

### Keyboard issues
- Capacitor automatically handles keyboard visibility
- Use `SafeArea` insets for proper bottom spacing

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Development Guide](https://capacitorjs.com/docs/ios)
- [App Store Submission Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Lovable Documentation](https://docs.lovable.dev/)

## Need Help?

- Check the [Lovable Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
- Review [Capacitor Forums](https://forum.ionicframework.com/c/capacitor/42)
- Consult [Apple Developer Forums](https://developer.apple.com/forums/)
