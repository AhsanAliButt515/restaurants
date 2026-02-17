# Restaurants App - Setup & Run Guide

## Prerequisites

### Required Versions
- **Node.js**: 18.x or higher (recommended 20.x LTS)
- **npm**: 9.x or higher
- **Expo CLI**: 6.x or higher
- **Android Studio**: Latest (for Android development)
- **Xcode**: Latest (for iOS development - macOS only)

### Environment Setup
1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Install Expo CLI: `npm install -g @expo/cli`
3. Install Expo Go app on your mobile device (for testing)

## Quick Start

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd restaurants
npm install
```

### 2. Environment Configuration
Create `.env` file in project root:
```env
BASE_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Run Development Server
```bash
npx expo start
```

### 4. Test on Device
- **Android**: Scan QR code with Expo Go app
- **iOS**: Scan QR code with Camera app (iOS 13+)
- **Web**: Open `http://localhost:8081` in browser

## Platform-Specific Setup

### Android Development
1. Install Android Studio
2. Create Android Virtual Device (AVD)
3. Start emulator: `npx expo start --android`
4. Or connect physical device via USB with USB debugging enabled

### iOS Development (macOS only)
1. Install Xcode from App Store
2. Install iOS Simulator
3. Run: `npx expo start --ios`
4. Or connect physical iPhone via cable

## Common Issues & Solutions

### Status Bar Not Visible
If status bar icons don't appear:
1. Restart emulator/device completely
2. Check emulator settings: Extended controls → Display → Enable status bar
3. Run: `adb shell settings put global policy_control null`
4. Test on physical device

### Metro Bundle Issues
```bash
# Clear cache
npx expo start -c

# Reset node_modules
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
# For Android
npx expo build:android

# For iOS
npx expo build:ios
```

## Project Structure
```
src/
├── api/           # API endpoints and React Query hooks
├── components/     # Reusable UI components
├── navigation/     # Navigation configuration
├── screens/        # App screens
└── storage/        # Local storage utilities

app/
├── _layout.tsx    # Root layout with providers
└── (tabs)/        # Tab navigation
```

## Deployment

### Development Build
```bash
# Android APK
npx expo build:android --type apk

# iOS IPA
npx expo build:ios --type archive
```

### App Store Submission
1. Create EAS account: `npx expo register`
2. Configure build profiles in `eas.json`
3. Submit: `npx expo submit`

## Support
For issues:
1. Check [Expo documentation](https://docs.expo.dev/)
2. Verify environment variables in `.env`
3. Ensure all dependencies are installed
4. Test on physical device if emulator fails

## Version Information
- React Native: 0.74.x (via Expo SDK 50+)
- Expo SDK: 50.x
- React: 18.x
- TypeScript: 5.x