import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { Globe, ChevronDown, Search, X } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { getCountryFlag, getCountryList } from "../../utils/countryFlags";

interface CountrySelectProps {
  value: string;
  onValueChange: (country: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onValueChange,
  label = "Country",
  placeholder = "Select your country",
  error,
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const countries = getCountryList();

  const filteredCountries = searchQuery
    ? countries.filter((country) =>
        country.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : countries;

  const handleSelect = (country: string) => {
    onValueChange(country);
    setModalVisible(false);
    setSearchQuery("");
  };

  return (
    <View>
      {label && (
        <Text
          className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className={`w-full ${theme === "dark" ? "bg-[#202024] text-white" : "bg-white text-gray-900"} rounded-xl py-3 px-4 flex-row items-center justify-between ${error ? "border border-red-500" : theme === "dark" ? "border border-gray-800" : "border border-gray-300"}`}
      >
        <View className="flex-row items-center">
          <Globe
            size={18}
            color={theme === "dark" ? "#9ca3af" : "#6b7280"}
            className="mr-2"
          />
          <Text
            className={`${theme === "dark" ? "text-white" : "text-gray-900"} ${!value ? "text-gray-500" : ""}`}
          >
            {value ? `${getCountryFlag(value)} ${value}` : placeholder}
          </Text>
        </View>
        <ChevronDown
          size={18}
          color={theme === "dark" ? "#9ca3af" : "#6b7280"}
        />
      </TouchableOpacity>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={styles.modalOverlay}
          className={`${theme === "dark" ? "bg-black/50" : "bg-black/30"}`}
        >
          <View
            style={styles.modalContent}
            className={`${theme === "dark" ? "bg-[#111112]" : "bg-white"} rounded-t-3xl`}
          >
            <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
              <Text
                className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Select Country
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery("");
                }}
              >
                <X size={24} color={theme === "dark" ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>
            </View>

            <View className="p-4">
              <View
                className={`flex-row items-center px-3 py-2 rounded-lg ${theme === "dark" ? "bg-[#202024]" : "bg-gray-100"}`}
              >
                <Search
                  size={18}
                  color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                />
                <TextInput
                  className={`flex-1 ml-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  placeholder="Search countries"
                  placeholderTextColor={
                    theme === "dark" ? "#9ca3af" : "#6b7280"
                  }
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <X
                      size={16}
                      color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`px-4 py-3 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"} ${value === item ? (theme === "dark" ? "bg-[#202024]" : "bg-gray-100") : ""}`}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {getCountryFlag(item)} {item}
                  </Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: SCREEN_HEIGHT * 0.6 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

import { Dimensions } from "react-native";

const SCREEN_HEIGHT =
  Platform.OS === "web"
    ? (typeof window !== "undefined" && window.innerHeight) || 800
    : Dimensions.get("window").height;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
});

export default CountrySelect;
