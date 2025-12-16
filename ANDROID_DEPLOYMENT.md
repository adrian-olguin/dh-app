# Android Deployment Guide

This guide will help you deploy the Daily Hope app as a native Android application using Capacitor for the Google Play Store.

## Prerequisites

- **Android Studio** installed ([download here](https://developer.android.com/studio))
- **Java JDK 17+** (usually bundled with Android Studio)
- **Node.js and npm** installed
- **Google Play Developer Account** ($25 one-time fee, [sign up here](https://play.google.com/console/signup))

## Current Configuration

The Android project has been configured with:
- **Package ID**: `com.purposedriveconnection.dailyhopebeta`
- **App Name**: Daily Hope Beta
- **Min SDK**: 23 (Android 6.0 - covers 99%+ of devices)
- **Target SDK**: 35 (Android 15 - current requirement for Google Play)

## Step 1: Open in Android Studio

```bash
npx cap open android
```

This opens the `android/` folder in Android Studio. Wait for Gradle sync to complete (may take a few minutes on first open).

## Step 2: Configure Signing for Release

### Create a Keystore (First Time Only)

1. In Android Studio, go to **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle** (recommended for Play Store)
3. Click **Create new...** to create a new keystore
4. Fill in the details:
   - **Key store path**: Choose a secure location OUTSIDE your project (e.g., `~/keystores/dailyhope.jks`)
   - **Password**: Create a strong password (save this securely!)
   - **Key alias**: `dailyhope`
   - **Key password**: Can be same as keystore password
   - **Validity**: 25+ years recommended
   - **Certificate info**: Fill in your organization details

⚠️ **IMPORTANT**: Back up your keystore file and passwords! You cannot update your app without them.

### Configure Gradle for Signing (Optional - for CI/CD)

Create `android/keystore.properties` (add to .gitignore!):

```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=dailyhope
storeFile=/path/to/your/keystore.jks
```

## Step 3: Update App Icons

Replace the default Capacitor icons with your Daily Hope icons:

### Required Icon Sizes

| Folder | Size | Purpose |
|--------|------|---------|
| `mipmap-mdpi` | 48x48 | Medium density |
| `mipmap-hdpi` | 72x72 | High density |
| `mipmap-xhdpi` | 96x96 | Extra-high density |
| `mipmap-xxhdpi` | 144x144 | Extra-extra-high density |
| `mipmap-xxxhdpi` | 192x192 | Extra-extra-extra-high density |

### Adaptive Icons (Android 8+)

For modern Android devices, you'll need:
- `ic_launcher_foreground.png` - The icon foreground (with transparency)
- `ic_launcher_background.xml` or `.png` - The background

You can use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html) to generate all required sizes.

### Using Capacitor Assets (Recommended)

```bash
npx capacitor-assets generate --android
```

This uses your `assets/icon.png` to generate all Android icon sizes automatically.

## Step 4: Configure Splash Screen

Edit `android/app/src/main/res/values/styles.xml` to customize the splash:

```xml
<style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
    <item name="android:background">@drawable/splash</item>
</style>
```

The splash screen color is already set in `capacitor.config.ts`:

```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: '#2950b8',
    showSpinner: false,
  },
},
```

## Step 5: Test on Emulator or Device

### Using an Emulator

1. In Android Studio, go to **Tools → Device Manager**
2. Click **Create Device**
3. Select a phone (e.g., Pixel 7)
4. Download and select a system image (API 34 recommended)
5. Click **Finish**, then click the ▶️ play button to start

### Using a Physical Device

1. Enable **Developer Options** on your Android device:
   - Go to **Settings → About Phone**
   - Tap **Build Number** 7 times
2. Enable **USB Debugging** in Developer Options
3. Connect your device via USB
4. Accept the debugging prompt on your device
5. Your device should appear in Android Studio's device dropdown

### Run the App

Click the green ▶️ **Run** button in Android Studio, or:

```bash
npx cap run android
```

## Step 6: Build for Release

### Option A: Android App Bundle (Recommended for Play Store)

1. In Android Studio: **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Choose your keystore
4. Select **release** build variant
5. Click **Finish**

The `.aab` file will be in `android/app/release/`

### Option B: APK (For direct distribution)

1. In Android Studio: **Build → Generate Signed Bundle / APK**
2. Select **APK**
3. Choose your keystore
4. Select **release** build variant
5. Click **Finish**

## Step 7: Google Play Store Submission

### Required Assets

| Asset | Dimensions | Notes |
|-------|------------|-------|
| App Icon | 512x512 PNG | High-res icon for Play Store listing |
| Feature Graphic | 1024x500 PNG/JPG | Displayed at top of store listing |
| Screenshots | Various | At least 2 phone screenshots required |
| Privacy Policy | URL | Required for apps that access user data |

### Play Console Setup

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in app details:
   - App name: Daily Hope
   - Default language: English
   - App or game: App
   - Free or paid: Free
4. Complete the **Dashboard** checklist:
   - App access (if app requires login)
   - Ads declaration
   - Content rating questionnaire
   - Target audience
   - News apps (if applicable)
   - COVID-19 apps (if applicable)
   - Data safety form
   - Government apps (if applicable)

### Upload Your App

1. Go to **Release → Production** (or Testing tracks for beta)
2. Click **Create new release**
3. Upload your `.aab` file
4. Add release notes
5. Click **Review release**
6. Click **Start rollout to Production**

### Testing Tracks (Recommended)

Before going to Production, use testing tracks:

- **Internal testing**: Up to 100 testers, instant availability
- **Closed testing**: Invite-only, good for beta
- **Open testing**: Public opt-in beta

## Updating the App

When you make changes to your code:

```bash
# 1. Pull latest changes (if using git)
git pull

# 2. Install dependencies (if changed)
npm install

# 3. Build the web app
npm run build

# 4. Sync to Android
npx cap sync android

# 5. Open in Android Studio
npx cap open android

# 6. Build and test
```

### Version Bumping

Before each release, update version in `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        versionCode 2          // Increment this for each release
        versionName "1.0.1"    // User-visible version
    }
}
```

## Troubleshooting

### Gradle Sync Failed

1. Click **File → Invalidate Caches / Restart**
2. Or try: **File → Sync Project with Gradle Files**
3. Check your internet connection (Gradle needs to download dependencies)

### App Crashes on Launch

1. Check **Logcat** in Android Studio (View → Tool Windows → Logcat)
2. Filter by your app package: `com.purposedriveconnection.dailyhopebeta`
3. Look for exceptions in red

### White Screen on Launch

1. Ensure `npm run build` completed successfully
2. Run `npx cap sync android` again
3. Check that `dist/` folder contains `index.html`

### API Calls Fail

1. Check that internet permission is in AndroidManifest.xml (already added)
2. For HTTP (non-HTTPS) APIs, you may need to allow cleartext:

```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

### Build Fails with Memory Error

Add to `android/gradle.properties`:

```properties
org.gradle.jvmargs=-Xmx4096m
```

## Security Checklist

Before releasing:

- [ ] Keystore is backed up securely (NOT in version control)
- [ ] ProGuard/R8 minification is enabled (default in release builds)
- [ ] No sensitive data in logs
- [ ] HTTPS used for all API calls
- [ ] API keys are not hardcoded (use environment variables)

## Google Play Requirements

### Current Requirements (2024-2025)

- **Target SDK 35** (Android 15) - ✅ Already configured
- **64-bit support** - ✅ Capacitor provides this
- **App Bundle format** - Use `.aab` not `.apk`
- **Data Safety form** - Required in Play Console
- **Content rating** - Complete questionnaire in Play Console

### App Review

Google typically reviews apps within 1-7 days. First submissions may take longer.

Common rejection reasons:
- Missing privacy policy
- Incomplete data safety form
- Misleading app description
- Copyright/trademark issues
- Policy violations in content

## Resources

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android Developer Guides](https://developer.android.com/guide)
- [Material Design Guidelines](https://material.io/design)
- [Play Store Policies](https://play.google.com/about/developer-content-policy/)

## Quick Reference Commands

```bash
# Build web app
npm run build

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on connected device
npx cap run android

# Generate app icons
npx capacitor-assets generate --android
```
