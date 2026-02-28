import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Text, Alert, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

import ContactGrid from "./src/components/ContactGrid";
import AddContactModal from "./src/components/AddContactModal";
import SettingsPanel from "./src/components/SettingsPanel";
import {
  loadContacts,
  saveContacts,
  loadGridCols,
  saveGridCols,
} from "./src/utils/storage";
import { checkForUpdates } from "./src/utils/UpdateManager";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [gridLayout, setGridLayout] = useState({
    cols: 3,
    rows: 3,
    label: "3×3",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load stored data on mount
  useEffect(() => {
    (async () => {
      const [c, g] = await Promise.all([loadContacts(), loadGridCols()]);
      setContacts(c);

      // Migrate old integer data if needed
      if (typeof g === "number") {
        const defaultLayout = {
          cols: g,
          label: g === 3 ? "3×3" : g === 4 ? "4×4" : `${g}×${g}`,
        };
        setGridLayout(defaultLayout);
      } else if (g && g.cols) {
        setGridLayout(g);
      }
    })();
  }, []);

  // Check for updates on mount
  useEffect(() => {
    checkForUpdates();
  }, []);

  // ---- Handlers ----
  const handleAddContact = useCallback(
    async (contact) => {
      // Normalize phone numbers for accurate comparison (strip non-digits)
      const cleanPhone = (phone) => (phone || "").replace(/\D/g, "");
      const newPhoneClean = cleanPhone(contact.phone);

      // Check if contact already exists
      const isDuplicate = contacts.some(
        (c) => cleanPhone(c.phone) === newPhoneClean && newPhoneClean !== "",
      );

      if (isDuplicate) {
        Alert.alert(
          "Duplicate Contact",
          `${contact.name} is already in your grid!`,
        );
        return;
      }

      const updated = [...contacts, contact];
      setContacts(updated);
      await saveContacts(updated);
    },
    [contacts],
  );

  const handleDeleteContact = useCallback(
    (contact) => {
      Alert.alert(
        "Delete Contact",
        `Remove "${contact.name}" from your contacts?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              const updated = contacts.filter((c) => c.id !== contact.id);
              setContacts(updated);
              await saveContacts(updated);
            },
          },
        ],
      );
    },
    [contacts],
  );

  const handleGridChange = useCallback(async (layout) => {
    setGridLayout(layout);
    await saveGridCols(layout);
  }, []);

  const handleClearAll = useCallback(async () => {
    setContacts([]);
    await saveContacts([]);
  }, []);

  return (
    <View className="flex-1 bg-dark-primary">
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />

      {/* Settings Gear - Top Right */}
      <SafeAreaView edges={["top"]} className="absolute top-0 right-0 z-50">
        <TouchableOpacity
          onPress={() => setShowSettings(true)}
          className="m-3 w-11 h-11 rounded-full border border-white/10 bg-white/5 items-center justify-center"
          activeOpacity={0.7}
        >
          <Text className="text-text-muted text-lg">⚙️</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Contact Grid */}
      <SafeAreaView edges={["top"]} className="flex-1 pt-14">
        <ContactGrid
          contacts={contacts}
          gridCols={gridLayout.cols}
          onLongPressContact={handleDeleteContact}
        />
      </SafeAreaView>

      {/* FAB - Add Contact */}
      <TouchableOpacity
        onPress={() => setShowAddModal(true)}
        className="absolute bottom-8 right-6 w-14 h-14 rounded-full bg-accent items-center justify-center z-50"
        activeOpacity={0.8}
        style={{
          shadowColor: "#6c5ce7",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Text className="text-white text-3xl font-light leading-none">+</Text>
      </TouchableOpacity>

      {/* Add Contact Modal */}
      <AddContactModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddContact}
      />

      {/* Settings Panel */}
      <SettingsPanel
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        gridCols={gridLayout}
        onGridChange={handleGridChange}
        onClearAll={handleClearAll}
      />
    </View>
  );
}
