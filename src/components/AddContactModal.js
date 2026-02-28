import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Contacts from "expo-contacts";
import { generateId } from "../utils/storage";

export default function AddContactModal({ visible, onClose, onSave }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [contactsList, setContactsList] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const pickContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      try {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
        });

        if (data.length > 0) {
          // Sort contacts alphabetically
          const sorted = data.sort((a, b) =>
            (a.name || "").localeCompare(b.name || ""),
          );
          setContactsList(sorted);
          setShowPicker(true);
        } else {
          Alert.alert("No Contacts", "Your phone book seems to be empty.");
        }
      } catch (err) {
        console.warn("Failed to get contacts", err);
        Alert.alert("Error", "Could not fetch contacts.");
      }
    } else {
      Alert.alert(
        "Permission required",
        "Please allow contacts access to use this feature.",
      );
    }
  };

  const selectContact = (contact) => {
    setName(contact.name || "");

    // Attempt to get the first valid mobile/phone number
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      setPhone(contact.phoneNumbers[0].number);
    }

    // Attempt to get picture
    if (contact.imageAvailable && contact.image && contact.image.uri) {
      setPhoto(contact.image.uri);
    }

    setShowPicker(false);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter a name");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Required", "Please enter a phone number");
      return;
    }

    // Basic mobile number validation (at least 10 digits after cleaning)
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid 10-digit mobile number.",
      );
      return;
    }

    onSave({
      id: generateId(),
      name: name.trim(),
      phone: phone.trim(),
      photo,
    });

    setName("");
    setPhone("");
    setPhoto(null);
    setShowPicker(false);
    onClose();
  };

  const handleClose = () => {
    setName("");
    setPhone("");
    setPhoto(null);
    setShowPicker(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center bg-black/60 px-5"
      >
        <View
          className="w-full max-w-[380px] bg-dark-secondary rounded-2xl p-6 border border-white/10"
          style={{ maxHeight: "90%" }}
        >
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {showPicker ? (
              <View style={{ height: 450, width: "100%" }}>
                <Text className="text-accent-light text-lg font-bold text-center mb-5">
                  Select a Contact
                </Text>
                <FlatList
                  data={contactsList}
                  keyExtractor={(item, index) =>
                    item.id ? item.id.toString() : index.toString()
                  }
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="p-3 border-b border-white/5 flex-row items-center"
                      onPress={() => selectContact(item)}
                    >
                      <View className="w-10 h-10 rounded-full bg-accent/20 items-center justify-center mr-3 overflow-hidden">
                        {item.imageAvailable && item.image && item.image.uri ? (
                          <Image
                            source={{ uri: item.image.uri }}
                            className="w-full h-full"
                          />
                        ) : (
                          <Text className="text-accent font-bold text-lg">
                            {(item.name ? item.name[0] : "?").toUpperCase()}
                          </Text>
                        )}
                      </View>
                      <View>
                        <Text className="text-white font-semibold">
                          {item.name || "Unknown Contact"}
                        </Text>
                        {item.phoneNumbers && item.phoneNumbers[0] && (
                          <Text className="text-text-muted text-xs mt-1">
                            {item.phoneNumbers[0].number}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  className="mt-4 py-3 rounded-xl border border-white/10 bg-white/5 items-center"
                >
                  <Text className="text-text-secondary font-bold">
                    Back to Add Contact
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Title */}
                <Text className="text-accent-light text-lg font-bold text-center mb-5">
                  Add Contact
                </Text>

                {/* Photo Picker */}
                <TouchableOpacity
                  onPress={pickImage}
                  className="items-center mb-5"
                >
                  {photo ? (
                    <Image
                      source={{ uri: photo }}
                      className="w-24 h-24 rounded-2xl border-2 border-accent"
                    />
                  ) : (
                    <View className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/10 items-center justify-center">
                      <Text className="text-3xl mb-1">📷</Text>
                      <Text className="text-text-muted text-[10px] font-semibold uppercase tracking-wider">
                        Add Photo
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Pick Contact Button */}
                <TouchableOpacity
                  onPress={pickContact}
                  className="w-full bg-white/10 p-3 rounded-xl mb-5 items-center flex-row justify-center border border-white/5"
                >
                  <Text className="text-xl mr-2">📇</Text>
                  <Text className="text-white font-semibold">
                    Pick from Contacts
                  </Text>
                </TouchableOpacity>

                {/* Name Input */}
                <Text className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1.5">
                  Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter name"
                  placeholderTextColor="#6b6b8a"
                  className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-text-primary text-base mb-4"
                />

                {/* Phone Input */}
                <Text className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1.5">
                  Phone Number
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+1 234 567 8900"
                  placeholderTextColor="#6b6b8a"
                  keyboardType="phone-pad"
                  className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-text-primary text-base mb-5"
                />

                {/* Buttons */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={handleClose}
                    className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 items-center"
                  >
                    <Text className="text-text-secondary font-bold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSave}
                    className="flex-1 py-3 rounded-xl bg-accent items-center"
                    style={{
                      shadowColor: "#6c5ce7",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <Text className="text-white font-bold">Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
