import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "../src/contexts/ThemeContext";

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-[#111112]" : "bg-[#f9fafb]"}`}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#111112" : "#f9fafb]"}
      />

      {/* Header */}
      <View
        className={`${theme === "dark" ? "bg-[#111112]/90 border-gray-800" : "bg-[#f9fafb]/90 border-gray-200"} px-4 py-3 border-b`}
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            className="mr-3"
          >
            <ArrowLeft
              size={24}
              color={theme === "dark" ? "#ffffff" : "#111827"}
            />
          </TouchableOpacity>
          <Text
            className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
          >
            Privacy Policy
          </Text>
        </View>
      </View>

      <ScrollView
        className={`flex-1 px-4 py-4 ${theme === "dark" ? "" : "bg-[#f9fafb]"}`}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className={`text-sm text-right mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          Last Updated: June 1, 2024
        </Text>

        <View className="space-y-6 mb-8">
          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              1. Introduction
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              Welcome to WhisperWall. We respect your privacy and are committed
              to protecting your personal data. This Privacy Policy explains how
              we collect, use, and safeguard your information when you use our
              service.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              2. Information We Collect
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-2`}
            >
              We collect several types of information from and about users of
              our platform, including:
            </Text>
            <View className="ml-4 space-y-2">
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Personal identifiers such as name, email address, and username
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Profile information including your bio, profile picture, and
                location
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Voice recordings that you choose to share on the platform
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Usage data including how you interact with our service
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Device information such as IP address, browser type, and
                operating system
              </Text>
            </View>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              3. How We Use Your Information
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-2`}
            >
              We use the information we collect to:
            </Text>
            <View className="ml-4 space-y-2">
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Provide, maintain, and improve our services
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Process and complete transactions
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Send you technical notices, updates, and support messages
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Respond to your comments and questions
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Personalize your experience
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Monitor and analyze trends and usage
              </Text>
            </View>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              4. Sharing Your Information
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              We may share your personal information with third parties only in
              the ways described in this privacy policy, including service
              providers who assist us in operating our platform, when required
              by law, or with your consent.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              5. Your Rights and Choices
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              You have certain rights regarding your personal information,
              including the right to access, correct, or delete your personal
              information. You can update your account information at any time
              through your account settings.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              6. Data Security
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              We have implemented measures to secure your personal information
              from accidental loss and unauthorized access, use, alteration, and
              disclosure. However, no method of transmission over the Internet
              is 100% secure.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              7. Changes to Our Privacy Policy
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              We may update our privacy policy from time to time. We will notify
              you of any changes by posting the new privacy policy on this page
              and updating the "Last Updated" date.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              8. Contact Us
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              If you have any questions about this Privacy Policy, please
              contact us at privacy@whisperwall.com.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
