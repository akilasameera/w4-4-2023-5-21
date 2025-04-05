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

export default function CookiePolicyScreen() {
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
            Cookie Policy
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
              This Cookie Policy explains how WhisperWall uses cookies and
              similar technologies to recognize you when you visit our mobile
              application and website. It explains what these technologies are
              and why we use them, as well as your rights to control our use of
              them.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              2. What Are Cookies?
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. Cookies are widely used by
              website owners to make their websites work, or to work more
              efficiently, as well as to provide reporting information. In
              mobile applications, similar technologies such as device
              identifiers and tracking pixels are used for the same purposes.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              3. Why Do We Use Cookies?
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-2`}
            >
              We use cookies for several reasons:
            </Text>
            <View className="ml-4 space-y-2">
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Essential cookies: These are necessary for the operation of
                our platform. They include cookies that enable you to log into
                secure areas.
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Analytical/performance cookies: These allow us to recognize
                and count the number of visitors and see how visitors move
                around our platform.
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Functionality cookies: These are used to recognize you when
                you return to our platform. They enable us to personalize our
                content for you.
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Targeting cookies: These record your visit to our platform,
                the pages you have visited, and the links you have followed.
              </Text>
            </View>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              4. Types of Cookies We Use
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-2`}
            >
              The specific types of cookies and similar technologies we use
              include:
            </Text>
            <View className="ml-4 space-y-2">
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Session cookies: These temporary cookies expire when you close
                your browser or app.
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Persistent cookies: These remain on your device until you
                erase them or they expire.
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • First-party cookies: These are set by WhisperWall directly.
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Third-party cookies: These are set by our partners and service
                providers.
              </Text>
            </View>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              5. How to Control Cookies
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-2`}
            >
              You have the right to decide whether to accept or reject cookies.
              You can set or amend your web browser controls to accept or refuse
              cookies. For mobile applications, you can manage your privacy
              settings through your device settings.
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              Please note that if you choose to reject cookies, you may not be
              able to use the full functionality of our platform.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              6. Updates to This Cookie Policy
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              We may update this Cookie Policy from time to time to reflect
              changes in technology, regulation, or our business practices. Any
              changes will become effective when we post the revised policy. We
              encourage you to review this policy periodically.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              7. Contact Us
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              If you have any questions about our use of cookies, please contact
              us at privacy@whisperwall.com.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
