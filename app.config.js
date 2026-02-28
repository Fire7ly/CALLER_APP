const { version } = require("./package.json");

module.exports = {
  expo: {
    name: "Caller App",
    slug: "caller-app",
    version: version,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#0a0a1a",
    },
    android: {
      package: "com.caller.app",
      permissions: ["CALL_PHONE", "READ_CONTACTS"],
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#0a0a1a",
      },
    },
    plugins: ["expo-asset", "expo-font"],
  },
};
