import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  PermissionsAndroid,
  Platform,
  NativeModules,
} from "react-native";
import * as Linking from "expo-linking";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function ContactCard({ contact, itemWidth }) {
  const avatarSize = itemWidth - 14; // Auto-scale to fill most of the column width
  const handleCall = async () => {
    const phone = contact.phone.replace(/\s+/g, "");

    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: "Phone Call Permission",
            message:
              "This app needs access to your phone to make calls directly.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          NativeModules.DirectCall.call(phone);
          return;
        }
      } catch (err) {
        console.warn("Failed to request CALL_PHONE permission", err);
      }
    }

    // Fallback to dialer if iOS, or permission denied
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <TouchableOpacity
      onPress={handleCall}
      activeOpacity={0.7}
      className="items-center mb-4"
    >
      {/* Square Avatar with Rounded Corners */}
      {contact.photo ? (
        <Image
          source={{ uri: contact.photo }}
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize * 0.2,
            borderWidth: 2,
            borderColor: "#6c5ce7",
          }}
        />
      ) : (
        <View
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize * 0.2,
            borderWidth: 2,
            borderColor: "#6c5ce7",
            backgroundColor: "#111128",
          }}
          className="items-center justify-center"
        >
          <Text
            className="text-accent-light font-bold"
            style={{ fontSize: avatarSize * 0.32 }}
          >
            {getInitials(contact.name)}
          </Text>
        </View>
      )}

      {/* Name */}
      <Text
        className="text-text-secondary text-xs font-semibold mt-1.5 text-center"
        numberOfLines={1}
        style={{ maxWidth: avatarSize + 10 }}
      >
        {contact.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function ContactGrid({ contacts, gridCols }) {
  const numCols = Math.max(2, parseInt(gridCols) || 3);
  const itemWidth = (SCREEN_WIDTH - 40) / numCols;

  if (contacts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-5xl mb-4 opacity-50">👥</Text>
        <Text className="text-text-secondary text-xl font-bold mb-2">
          No Contacts Yet
        </Text>
        <Text className="text-text-muted text-sm text-center">
          Tap the <Text className="font-bold text-accent-light">+</Text> button
          to add your first contact
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      numColumns={numCols}
      key={`grid-${numCols}`}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
      columnWrapperStyle={numCols > 1 ? { justifyContent: "flex-start" } : null}
      renderItem={({ item }) => {
        return (
          <View
            style={{ width: itemWidth, alignItems: "center", marginBottom: 12 }}
          >
            <ContactCard contact={item} itemWidth={itemWidth} />
          </View>
        );
      }}
    />
  );
}
