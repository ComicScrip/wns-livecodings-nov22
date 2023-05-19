import "dotenv/config";

module.exports = {
  expo: {
    name: "mobile-client-nov22",
    slug: "mobile-client-nov22",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.comicscrip.mobileappnov22",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      REACT_APP_GRAPHQL_API_URL: process.env.REACT_APP_GRAPHQL_API_URL,
      eas: {
        projectId: "738f36d1-96c0-4d18-8c6e-c71aa1c21cdc",
      },
    },
    jsEngine: "jsc",
  },
};
