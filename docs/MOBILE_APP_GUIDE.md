# SafeCity Mobile App — Architecture & Deployment Guide

This guide details how **SafeCity** is packaged and operated as a fully working mobile application for Android and iOS devices.

SafeCity uses a high-performance **dual mobile architecture**:
1. **Native Android App (Capacitor)**: A true native Android Studio Gradle project that compiles into an installable `.apk` or `.aab` for Google Play Store with direct access to hardware GPS, camera, haptics, wake lock, and native splash screens.
2. **Progressive Web App (PWA)**: A zero-friction mobile web application that users can install directly from Chrome or Safari to their home screen with a single tap, with offline caching and standalone display.

---

## 1. Native Android Application (Capacitor)

The native Android project is located in `android/`.

### Native Features Configured
- **Application ID:** `org.safecity.app`
- **App Name:** `SafeCity`
- **Custom Launcher Icons:** Multi-density adaptive icons (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`) generated from the official SafeCity plum shield (`#2A132C` / `#B83A5D`).
- **Hardware Permissions (`android/app/src/main/AndroidManifest.xml`):**
  - `ACCESS_FINE_LOCATION` & `ACCESS_COARSE_LOCATION`: High-precision GPS for live routing, Safe Corridor navigation, and Walk With Me companion.
  - `ACCESS_BACKGROUND_LOCATION`: Continuous safety tracking during escort sessions.
  - `VIBRATE`: Haptic feedback on SOS button triggers, safe haven arrival, and danger alerts.
  - `CAMERA`: Direct photo capture for incident report evidence.
  - `WAKE_LOCK`: Keeps the phone display active while an escort session or emergency countdown is running.
  - `usesCleartextTraffic="true"`: Enables local development testing against local backend servers.
- **Splash Screen & Status Bar:** Configured to match SafeCity's deep plum `#2A132C` and `#1C0D1E` theme with dark icons.

### Building & Running the Native Android App

#### Option A: Using Android Studio (Recommended)
1. Run the npm command from the project root:
   ```bash
   npm run mobile:open
   ```
   *(Or manually open the `android/` folder inside Android Studio).*
2. Wait for Android Studio to index and sync Gradle.
3. Connect a physical Android phone via USB (with Developer Mode & USB Debugging enabled) or start an Android Virtual Device (AVD).
4. Click **Run 'app'** (`Shift + F10`) or click the green Play button.
5. To build a standalone APK without running:
   - Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - The compiled debug APK will be located at:
     `android/app/build/outputs/apk/debug/app-debug.apk`

#### Option B: Using Command Line (Gradle)
```bash
cd android
./gradlew assembleDebug
```
The output APK is generated at `android/app/build/outputs/apk/debug/app-debug.apk`. You can install it on any connected device via:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 2. Progressive Web App (PWA) — Instant Mobile Install

The PWA setup enables instant installation without needing Android Studio or app store approval.

### PWA Features Configured
- **Web App Manifest (`manifest.json`):**
  - Configures full-screen standalone mode (`"display": "standalone"`).
  - Matches the SafeCity brand palette (Theme: `#2A132C`, Background: `#1C0D1E`).
  - High-resolution SVG and PNG icons (`192x192` and `512x512` maskable).
- **Service Worker (`service-worker.js`):**
  - Pre-caches core application shell (`index.html`, icons, manifest).
  - Network-first caching with graceful offline fallbacks for intermittent cell connectivity.
  - Live backend API requests (`/api/...`) bypass cache to guarantee real-time incident reporting synchronization.
- **In-App Mobile Install Banner:**
  - Integrated into the mobile navigation drawer.
  - Automatically captures the browser's `beforeinstallprompt` event.
  - Tapping **Install** triggers the native Android/Chrome app installation prompt.

---

## 3. Synchronizing Changes Between Web & Mobile

Whenever you edit `index.html` or update assets, run:
```bash
npm run mobile:sync
```
This single command automatically:
1. Runs `scripts/sync-assets.js` to mirror `index.html`, `manifest.json`, `service-worker.js`, and `icons/` across `frontend/`, `backend/`, and `backend/public/`.
2. Runs `npx cap sync android` to copy the latest code directly into `android/app/src/main/assets/public/` for the native app build.
