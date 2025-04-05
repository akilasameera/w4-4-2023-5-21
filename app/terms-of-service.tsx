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

export default function TermsOfServiceScreen() {
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
            Terms of Service
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
              1. Acceptance of Terms
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              By accessing or using WhisperWall, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do
              not use our service.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              2. Description of Service
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              WhisperWall is a social platform where users can record, share,
              and discover voice messages. We provide users with the ability to
              create profiles, share voice content, and interact with other
              users' content.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              3. User Accounts
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-2`}
            >
              To use certain features of our service, you must create an
              account. When creating your account, you agree to provide accurate
              and complete information. You are responsible for:
            </Text>
            <View className="ml-4 space-y-2">
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Maintaining the security of your account
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • All activities that occur under your account
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Notifying us immediately of any unauthorized use
              </Text>
            </View>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              4. User Content
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-2`}
            >
              You retain ownership of the content you create and share on
              WhisperWall. By posting content, you grant us a non-exclusive,
              transferable, sub-licensable, royalty-free, worldwide license to
              use, modify, publicly display, and distribute such content on our
              platform.
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-2`}
            >
              You agree not to post content that:
            </Text>
            <View className="ml-4 space-y-2">
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Is illegal, harmful, threatening, abusive, or harassing
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Infringes on the intellectual property rights of others
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Contains sexually explicit material or promotes violence
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Contains personal information of others without their consent
              </Text>
            </View>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              5. Prohibited Activities
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-2`}
            >
              You agree not to engage in any of the following prohibited
              activities:
            </Text>
            <View className="ml-4 space-y-2">
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Using the service for any illegal purpose
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Attempting to interfere with or compromise the system
                integrity
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Collecting user information without consent
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Creating multiple accounts for abusive purposes
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                • Using the service to spread violence, harassment, or distort
                someone's image
              </Text>
            </View>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              6. User Responsibility for Personal Information
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              If you choose to share your personal information with other users
              through our service, you do so at your own risk. WhisperWall
              cannot take any responsibility for your own actions regarding the
              sharing of personal information. We strongly advise against
              sharing sensitive personal details such as financial information,
              exact home address, or government identification numbers with
              other users.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              7. Termination
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              We reserve the right to suspend or terminate your account and
              access to our service at our sole discretion, without notice, for
              conduct that we believe violates these Terms of Service or is
              harmful to other users, us, or third parties, or for any other
              reason.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              8. Disclaimer of Warranties
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              Our service is provided "as is" without warranties of any kind,
              either express or implied. We do not guarantee that our service
              will always be safe, secure, or error-free, or that it will
              function without disruptions, delays, or imperfections.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              9. Changes to Terms
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              We may modify these Terms of Service at any time. We will notify
              you of any changes by posting the new terms on our platform. Your
              continued use of the service after such modifications constitutes
              your acceptance of the revised terms.
            </Text>
          </View>

          <View>
            <Text
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              10. Contact Information
            </Text>
            <Text
              className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              If you have any questions about these Terms of Service, please
              contact us at legal@whisperwall.com.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
