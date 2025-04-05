import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  User,
  Lock,
  Trash2,
  Globe,
  Bell,
  HelpCircle,
  FileText,
  AlertCircle,
  ChevronRight,
  LogOut,
} from "lucide-react-native";
import BottomNavigation from "../components/BottomNavigation";
import { useTheme } from "../src/contexts/ThemeContext";
import CountrySelect from "../src/components/common/CountrySelect";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const { theme } = useTheme();
  const [selectedCountry, setSelectedCountry] = useState("United States");

  // Load saved country on mount and make it the default for the entire site
  useEffect(() => {
    const loadSavedCountry = async () => {
      try {
        const savedCountry = await AsyncStorage.getItem("selectedCountry");
        if (savedCountry && savedCountry !== "All") {
          setSelectedCountry(savedCountry);
          // Set as default for the entire site by storing in AsyncStorage
          await AsyncStorage.setItem("defaultCountry", savedCountry);
          await AsyncStorage.setItem("selectedCountry", savedCountry);
          console.log(`Default country set to ${savedCountry} for entire site`);
        }
      } catch (error) {
        console.error("Error loading saved country:", error);
      }
    };

    loadSavedCountry();
  }, []);

  // Toggle states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    useState(false);

  // Mock user data
  const userData = {
    name: "Sarah Chen",
    username: "@sarahchen",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
  };

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-[#111112]" : "bg-[#f9fafb]"}`}
      style={{ paddingTop: Platform.OS === "android" ? 40 : 0 }}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#111112" : "#f9fafb]"}
      />

      {/* Header */}
      <View
        className={`${theme === "dark" ? "bg-[#111112]/90 border-gray-800" : "bg-[#f9fafb]/90 border-gray-200"} px-4 py-3 border-b`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
            ></TouchableOpacity>
            <Text
              className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              Settings & Support
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className={`flex-1 ${theme === "dark" ? "" : "bg-[#f9fafb]"}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {/* Account Settings */}
        <View className="pt-4 px-4">
          <Text
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}
          >
            Account Settings
          </Text>
          <View
            className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl overflow-hidden mb-6 shadow-lg`}
            style={{
              transform: [{ scale: 1.0 }],
              shadowColor: theme === "dark" ? "#8b5cf6" : "#a78bfa",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              className={`p-4 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
              activeOpacity={0.7}
              onPress={() => router.push("/edit-profile")}
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(32, 32, 36, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Image
                    source={{ uri: userData.avatar }}
                    className="w-12 h-12 rounded-full"
                  />
                  <View>
                    <Text
                      className={`font-medium ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                    >
                      Edit Profile
                    </Text>
                    <Text
                      className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Change name, bio, profile picture
                    </Text>
                  </View>
                </View>
                <ChevronRight
                  size={20}
                  color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-full p-4 flex-row items-center justify-between border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
              activeOpacity={0.7}
              onPress={() => router.push("/change-password")}
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(32, 32, 36, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-10 h-10 ${theme === "dark" ? "bg-[#2a2a2e]" : "bg-[#f3f4f6]"} rounded-full items-center justify-center`}
                  style={{
                    shadowColor: "#8b5cf6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 3,
                  }}
                >
                  <Lock size={18} color="#8b5cf6" />
                </View>
                <Text
                  className={`${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                >
                  Change Password
                </Text>
              </View>
              <ChevronRight
                size={20}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-full p-4 flex-row items-center justify-between border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert(
                  "Delete Account",
                  "Are you sure you want to delete your account? This action cannot be undone.",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          // In a real app, you would call an API to delete the account
                          Alert.alert("Account deleted successfully");
                          // After successful deletion, sign out and redirect to sign-in
                          const { signOut } = await import(
                            "../src/services/auth"
                          );
                          await signOut();
                          router.replace("/sign-in");
                        } catch (error) {
                          console.error("Error deleting account:", error);
                          Alert.alert(
                            "Failed to delete account. Please try again.",
                          );
                        }
                      },
                    },
                  ],
                );
              }}
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(32, 32, 36, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 bg-red-500/20 rounded-full items-center justify-center"
                  style={{
                    shadowColor: "#ef4444",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 3,
                  }}
                >
                  <Trash2 size={18} color="#ef4444" />
                </View>
                <Text className="text-red-500">Delete Account</Text>
              </View>
              <ChevronRight size={20} color="#ef4444" />
            </TouchableOpacity>

            <View className={`p-4`}>
              <Text
                className={`font-medium mb-3 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                Select Country
              </Text>
              <CountrySelect
                value={selectedCountry}
                onValueChange={(country) => {
                  if (country) {
                    setSelectedCountry(country);
                    // Save selected country to AsyncStorage as both selected and default
                    Promise.all([
                      AsyncStorage.setItem("selectedCountry", country),
                      AsyncStorage.setItem("defaultCountry", country),
                    ]).catch((error) =>
                      console.error("Error saving country:", error),
                    );
                    // In a real app, you would update the user's profile here
                    console.log(
                      `Country updated to ${country} and set as default for entire site`,
                    );
                  }
                }}
                label="Country"
                placeholder="Select your country"
              />
            </View>
          </View>
        </View>

        {/* Privacy & Security */}
        <View className="px-4">
          <Text
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}
          >
            Privacy & Security
          </Text>
          <View
            className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl mb-6 shadow-lg`}
            style={{
              transform: [{ scale: 1.0 }],
              shadowColor: theme === "dark" ? "#8b5cf6" : "#a78bfa",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View className="p-4 space-y-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text
                  className={`${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                >
                  Account Visibility
                </Text>
                <View
                  className={`${theme === "dark" ? "bg-[#2a2a2e]" : "bg-[#f3f4f6]"} rounded-lg px-3 py-1.5`}
                  style={{
                    shadowColor: theme === "dark" ? "#8b5cf6" : "#a78bfa",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <Text
                    className={`text-sm ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                  >
                    Public
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between mb-4">
                <Text
                  className={`${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                >
                  Two-Factor Authentication
                </Text>
                <Switch
                  trackColor={{
                    false: theme === "dark" ? "#2a2a2e" : "#d1d5db",
                    true: "#8b5cf6",
                  }}
                  thumbColor={"#ffffff"}
                  ios_backgroundColor={theme === "dark" ? "#2a2a2e" : "#d1d5db"}
                  onValueChange={setTwoFactorEnabled}
                  value={twoFactorEnabled}
                />
              </View>

              <TouchableOpacity
                className="flex-row items-center justify-between"
                activeOpacity={0.7}
                onPress={() => router.push("/data-sharing")}
                style={{
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(32, 32, 36, 0.9)"
                      : "rgba(255, 255, 255, 0.9)",
                }}
              >
                <Text
                  className={`${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                >
                  Data Sharing
                </Text>
                <ChevronRight
                  size={20}
                  color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View className="px-4">
          <Text
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}
          >
            Notifications
          </Text>
          <View
            className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl mb-6 shadow-lg`}
            style={{
              transform: [{ scale: 1.0 }],
              shadowColor: theme === "dark" ? "#8b5cf6" : "#a78bfa",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View className="p-4 space-y-4">
              <View className="flex-row items-center justify-between">
                <Text
                  className={`${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                >
                  Push Notifications
                </Text>
                <Switch
                  trackColor={{
                    false: theme === "dark" ? "#2a2a2e" : "#d1d5db",
                    true: "#8b5cf6",
                  }}
                  thumbColor={"#ffffff"}
                  ios_backgroundColor={theme === "dark" ? "#2a2a2e" : "#d1d5db"}
                  onValueChange={setPushNotificationsEnabled}
                  value={pushNotificationsEnabled}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <Text
                  className={`${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                >
                  Email Notifications
                </Text>
                <Switch
                  trackColor={{
                    false: theme === "dark" ? "#2a2a2e" : "#d1d5db",
                    true: "#8b5cf6",
                  }}
                  thumbColor={"#ffffff"}
                  ios_backgroundColor={theme === "dark" ? "#2a2a2e" : "#d1d5db"}
                  onValueChange={setEmailNotificationsEnabled}
                  value={emailNotificationsEnabled}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Help Center */}
        <View className="px-4">
          <Text
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}
          >
            Help Center
          </Text>
          <View
            className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl mb-6 shadow-lg`}
            style={{
              transform: [{ scale: 1.0 }],
              shadowColor: theme === "dark" ? "#8b5cf6" : "#a78bfa",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              className={`w-full p-4 flex-row items-center justify-between border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
              activeOpacity={0.7}
              onPress={() => router.push("/faq")}
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(32, 32, 36, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            >
              <Text
                className={`${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                FAQ
              </Text>
              <ChevronRight
                size={20}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-full p-4 flex-row items-center justify-between border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
              activeOpacity={0.7}
              onPress={() => router.push("/contact-support")}
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(32, 32, 36, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            >
              <Text
                className={`${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                Contact Support
              </Text>
              <ChevronRight
                size={20}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full p-4 flex-row items-center justify-between"
              activeOpacity={0.7}
              onPress={() => router.push("/report-problem")}
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(32, 32, 36, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            >
              <Text
                className={`${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                Report a Problem
              </Text>
              <ChevronRight
                size={20}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal */}
        <View className="px-4">
          <Text
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}
          >
            Legal
          </Text>
          <View
            className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl mb-6 shadow-lg`}
            style={{
              transform: [{ scale: 1.0 }],
              shadowColor: theme === "dark" ? "#8b5cf6" : "#a78bfa",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              className={`w-full p-4 flex-row items-center justify-between border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
              activeOpacity={0.7}
              onPress={() => router.push("/privacy-policy")}
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(32, 32, 36, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            >
              <Text
                className={`${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                Privacy Policy
              </Text>
              <ChevronRight
                size={20}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-full p-4 flex-row items-center justify-between border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
              activeOpacity={0.7}
              onPress={() => router.push("/terms-of-service")}
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(32, 32, 36, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            >
              <Text
                className={`${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                Terms of Service
              </Text>
              <ChevronRight
                size={20}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full p-4 flex-row items-center justify-between"
              activeOpacity={0.7}
              onPress={() => router.push("/cookie-policy")}
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(32, 32, 36, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            >
              <Text
                className={`${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                Cookie Policy
              </Text>
              <ChevronRight
                size={20}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-4 mb-8">
          <TouchableOpacity
            className={`w-full flex-row items-center justify-center gap-2 ${theme === "dark" ? "bg-[#202024]" : "bg-gray-100"} p-3.5 rounded-xl`}
            onPress={async () => {
              try {
                const { signOut } = await import("../src/services/auth");
                const response = await signOut();
                if (response.success) {
                  router.replace("/sign-in");
                } else {
                  Alert.alert(`Logout failed: ${response.error}`);
                }
              } catch (error) {
                console.error("Error during logout:", error);
                Alert.alert("An error occurred during logout");
              }
            }}
            activeOpacity={0.7}
          >
            <LogOut size={18} color="#ef4444" />
            <Text className="text-red-500 font-medium">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={(tab) => setActiveTab(tab)}
      />
    </SafeAreaView>
  );
}
