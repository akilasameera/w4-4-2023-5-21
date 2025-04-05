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

export default function FAQScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // FAQ data
  const faqs = [
    {
      question: "What is WhisperWall?",
      answer:
        "WhisperWall is a social platform where users can record, share, and discover voice messages expressing thoughts, stories, and emotions in a supportive community environment.",
    },
    {
      question: "How do I record a voice message?",
      answer:
        "To record a voice message, tap the microphone button at the bottom of the screen. You can then record your message, add mood tags, and share it with the community.",
    },
    {
      question: "Can I edit my recordings?",
      answer:
        "Yes, after recording a voice message, you can trim it, add effects, or re-record before posting it to your feed.",
    },
    {
      question: "What are mood tags?",
      answer:
        "Mood tags are emotional categories you can assign to your voice messages. They help others find content based on specific emotional states like happy, reflective, excited, etc.",
    },
    {
      question: "How do I find content I'm interested in?",
      answer:
        "You can browse the main feed or use the mood filter to discover content based on specific emotional states. You can also follow users whose content you enjoy.",
    },
    {
      question: "Is my data private?",
      answer:
        "WhisperWall takes your privacy seriously. You can control who sees your content through privacy settings. Please review our Privacy Policy for more details.",
    },
    {
      question: "How do I send private messages?",
      answer:
        "To send a private message, go to a user's profile and tap the message icon, or access your messages tab and start a new conversation.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, you can delete your account through the Settings page. Please note that this action is permanent and will remove all your content.",
    },
  ];

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
            Frequently Asked Questions
          </Text>
        </View>
      </View>

      <ScrollView
        className={`flex-1 px-4 py-4 ${theme === "dark" ? "" : "bg-[#f9fafb]"}`}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className={`text-base mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
        >
          Find answers to commonly asked questions about WhisperWall below.
        </Text>

        {/* FAQ Accordion */}
        <View className="space-y-4 mb-8">
          {faqs.map((faq, index) => (
            <View
              key={index}
              className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"}`}
            >
              <View className="p-4">
                <Text
                  className={`font-medium text-base ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                >
                  {faq.question}
                </Text>
                <Text
                  className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                >
                  {faq.answer}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contact Support Section */}
        <View
          className={`p-4 rounded-lg mb-8 ${theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"}`}
        >
          <Text
            className={`font-medium mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
          >
            Still have questions?
          </Text>
          <Text
            className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            If you couldn't find the answer you were looking for, please contact
            our support team.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/contact-support")}
            className="bg-purple-600 py-3 px-4 rounded-lg items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
