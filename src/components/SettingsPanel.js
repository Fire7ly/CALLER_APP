import React from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import Slider from "@react-native-community/slider";

export default function SettingsPanel({
  visible,
  onClose,
  gridCols,
  onGridChange,
  avatarSize,
  onAvatarSizeChange,
  onClearAll,
}) {
  const gridOptions = [
    { cols: 3, label: "3×3" },
    { cols: 4, label: "4×3", rows: 3 },
    { cols: 4, label: "4×4", rows: 4 },
  ];

  const handleClearAll = () => {
    Alert.alert("Clear All Contacts", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: () => {
          onClearAll();
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/50"
      >
        <TouchableOpacity
          activeOpacity={1}
          className="absolute right-0 top-0 bottom-0 w-[300px] bg-dark-secondary border-l border-white/10 p-6 pt-12"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-7 pb-4 border-b border-white/10">
            <Text className="text-accent-light text-lg font-bold">
              ⚙️ Settings
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-white/5 items-center justify-center"
            >
              <Text className="text-text-muted text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Grid Layout */}
          <View className="mb-6">
            <Text className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-3">
              Grid Layout
            </Text>
            <View className="flex-row gap-2">
              {gridOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.label}
                  onPress={() => onGridChange(opt.cols)}
                  className={`flex-1 py-2.5 rounded-xl border items-center ${
                    gridCols === opt.cols
                      ? "border-accent bg-accent/20"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      gridCols === opt.cols
                        ? "text-accent-light"
                        : "text-text-muted"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Avatar Size */}
          <View className="mb-6">
            <Text className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-3">
              Avatar Size
            </Text>
            <View className="flex-row items-center gap-3">
              <Slider
                style={{ flex: 1, height: 40 }}
                minimumValue={50}
                maximumValue={120}
                step={5}
                value={avatarSize}
                onValueChange={onAvatarSizeChange}
                minimumTrackTintColor="#6c5ce7"
                maximumTrackTintColor="rgba(255,255,255,0.1)"
                thumbTintColor="#a29bfe"
              />
              <Text className="text-accent-light text-xs font-bold w-10 text-right">
                {avatarSize}px
              </Text>
            </View>
          </View>

          {/* Clear All */}
          <TouchableOpacity
            onPress={handleClearAll}
            className="py-3 rounded-xl border border-danger/30 items-center"
          >
            <Text className="text-danger font-bold text-sm">
              Clear All Contacts
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
