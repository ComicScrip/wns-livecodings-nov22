# Build

## Android

### prebuild and run debug

```
npx expo run:android
```

### generate only release apk

eas build --profile preview --platform android --local

### build release apk in CI

```sh
git add . && git commit -m "tmp" && git tag <version>
git push --tags
```
