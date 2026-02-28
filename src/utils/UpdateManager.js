import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";

const GITHUB_USER = "Fire7ly";
const GITHUB_REPO = "CALLER_APP";
const CURRENT_VERSION = Constants.expoConfig.version;

export const checkForUpdates = async (manual = false) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases/latest`,
    );
    const data = await response.json();

    if (data.tag_name) {
      const latestVersion = data.tag_name.replace("v", "");

      if (isNewerVersion(latestVersion, CURRENT_VERSION)) {
        const apkAsset = data.assets.find((asset) =>
          asset.name.endsWith(".apk"),
        );
        if (apkAsset) {
          showUpdatePrompt(latestVersion, apkAsset.browser_download_url);
        }
      } else if (manual) {
        Alert.alert("No Updates", "You are on the latest version.");
      }
    }
  } catch (error) {
    console.error("Update check failed:", error);
  }
};

const isNewerVersion = (latest, current) => {
  const l = latest.split(".").map(Number);
  const c = current.split(".").map(Number);
  for (let i = 0; i < Math.max(l.length, c.length); i++) {
    if ((l[i] || 0) > (c[i] || 0)) return true;
    if ((l[i] || 0) < (c[i] || 0)) return false;
  }
  return false;
};

const showUpdatePrompt = (version, downloadUrl) => {
  Alert.alert(
    "Update Available",
    `A new version (${version}) is available. Would you like to download and install it?`,
    [
      { text: "Later", style: "cancel" },
      { text: "Update Now", onPress: () => handleDownload(downloadUrl) },
    ],
  );
};

const handleDownload = async (url) => {
  try {
    const fileUri = `${FileSystem.cacheDirectory}update.apk`;

    // Ensure old file is gone
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
    }

    const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
    const { uri } = await downloadResumable.downloadAsync();

    if (Platform.OS === "android") {
      await installApk(uri);
    }
  } catch (error) {
    Alert.alert("Download Failed", "Could not download the update.");
  }
};

const installApk = async (uri) => {
  try {
    const contentUri = await FileSystem.getContentUriAsync(uri);
    await Linking.openURL(contentUri);
  } catch (error) {
    Alert.alert(
      "Installation Failed",
      "Please allow the app to install apps from unknown sources in Settings.",
    );
  }
};
