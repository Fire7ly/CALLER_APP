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
  const [tempCols, setTempCols] = React.useState(gridCols?.cols || 3);
  const [tempRows, setTempRows] = React.useState(gridCols?.rows || 3);

  React.useEffect(() => {
    setTempCols(gridCols?.cols || 3);
    setTempRows(gridCols?.rows || 3);
  }, [gridCols, visible]);

  const handleApplyGrid = () => {
    onGridChange({
      cols: tempCols,
      rows: tempRows,
      label: `${tempCols}×${tempRows}`,
    });
  };

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

          {/* Custom Grid Controls */}
          <View className="mb-8">
            <Text className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-4">
              Grid Layout
            </Text>

            {/* Columns Stepper */}
            <View className="flex-row items-center justify-between mb-4 bg-white/5 rounded-xl p-3 border border-white/5">
              <Text className="text-text-muted font-bold ml-2">Columns</Text>
              <View className="flex-row items-center gap-4">
                <TouchableOpacity
                  onPress={() => setTempCols((c) => Math.max(1, c - 1))}
                  className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"
                >
                  <Text className="text-white text-lg font-bold leading-none">
                    -
                  </Text>
                </TouchableOpacity>
                <Text className="text-accent-light font-bold text-lg w-4 text-center">
                  {tempCols}
                </Text>
                <TouchableOpacity
                  onPress={() => setTempCols((c) => Math.min(8, c + 1))}
                  className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"
                >
                  <Text className="text-white text-lg font-bold leading-none">
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rows Stepper */}
            <View className="flex-row items-center justify-between mb-4 bg-white/5 rounded-xl p-3 border border-white/5">
              <Text className="text-text-muted font-bold ml-2">Rows</Text>
              <View className="flex-row items-center gap-4">
                <TouchableOpacity
                  onPress={() => setTempRows((r) => Math.max(1, r - 1))}
                  className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"
                >
                  <Text className="text-white text-lg font-bold leading-none">
                    -
                  </Text>
                </TouchableOpacity>
                <Text className="text-accent-light font-bold text-lg w-4 text-center">
                  {tempRows}
                </Text>
                <TouchableOpacity
                  onPress={() => setTempRows((r) => Math.min(12, r + 1))}
                  className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"
                >
                  <Text className="text-white text-lg font-bold leading-none">
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Apply Button */}
            {(tempCols !== gridCols?.cols || tempRows !== gridCols?.rows) && (
              <TouchableOpacity
                onPress={handleApplyGrid}
                className="py-3 mt-2 rounded-xl bg-accent items-center"
              >
                <Text className="text-white font-bold">Apply Changes</Text>
              </TouchableOpacity>
            )}
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
