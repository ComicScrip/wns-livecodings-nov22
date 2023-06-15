# Build

## Android

### prebuild and run debug

```
npx expo run:android
```

### generate only release apk

eas build --profile preview --platform android --local

### Install locally generated APK to connected device by USB

(you may need to uninstall the app first if already installed) :

```sh
adb uninstall com.comicscrip.mobileclient
```

To install the app :

```sh
adb install build-<XXXXXXXXXX>.apk
```

### build release apk in CI

```sh
git add . && git commit -m "tmp" && git tag <version>
git push --tags
```
