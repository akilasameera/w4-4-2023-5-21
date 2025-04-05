import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";
import { signIn } from "../services/auth";

interface SignInProps {
  onSignUpPress?: () => void;
}

const SignIn = ({ onSignUpPress }: SignInProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await signIn({ email, password });

      if (response.success) {
        // Navigate to home screen
        router.replace("/");
      } else {
        Alert.alert(
          "Sign In Failed",
          response.error || "Please check your credentials and try again.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-[#111112]" : "bg-[#f9fafb]"}`}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#111112" : "#f9fafb"}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 py-12 justify-center">
            {/* Logo and App Name */}
            <View className="items-center mb-10">
              <View className="w-16 h-16 bg-purple-500 rounded-full items-center justify-center mb-4">
                <Text className="text-white text-3xl font-bold">W</Text>
              </View>
              <Text
                className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                WhisperWall
              </Text>
              <Text
                className={`text-sm mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                Share your voice, find your community
              </Text>
            </View>

            {/* Sign In Form */}
            <View className="space-y-6">
              <View>
                <Text
                  className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  Email
                </Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Mail
                      size={18}
                      color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                    />
                  </View>
                  <TextInput
                    className={`w-full ${theme === "dark" ? "bg-[#202024] text-white" : "bg-white text-gray-900"} rounded-xl py-3 pl-10 pr-4 ${errors.email ? "border border-red-500" : theme === "dark" ? "border border-gray-800" : "border border-gray-300"}`}
                    placeholder="Enter your email"
                    placeholderTextColor={
                      theme === "dark" ? "#9ca3af" : "#6b7280"
                    }
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {errors.email && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </Text>
                )}
              </View>

              <View>
                <Text
                  className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  Password
                </Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Lock
                      size={18}
                      color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                    />
                  </View>
                  <TextInput
                    className={`w-full ${theme === "dark" ? "bg-[#202024] text-white" : "bg-white text-gray-900"} rounded-xl py-3 pl-10 pr-12 ${errors.password ? "border border-red-500" : theme === "dark" ? "border border-gray-800" : "border border-gray-300"}`}
                    placeholder="Enter your password"
                    placeholderTextColor={
                      theme === "dark" ? "#9ca3af" : "#6b7280"
                    }
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-3 z-10"
                    onPress={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                        color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                      />
                    ) : (
                      <Eye
                        size={18}
                        color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </Text>
                )}
              </View>

              <TouchableOpacity>
                <Text className="text-right text-purple-500 text-sm font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`w-full bg-purple-500 rounded-xl py-3.5 items-center ${loading ? "opacity-70" : ""}`}
                onPress={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white font-semibold text-base">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row items-center justify-center mt-6">
                <View className="flex-1 h-[1px] bg-gray-700" />
                <Text
                  className={`mx-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  or continue with
                </Text>
                <View className="flex-1 h-[1px] bg-gray-700" />
              </View>

              <View className="flex-row space-x-4">
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-300"}`}
                >
                  <Text
                    className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-medium`}
                  >
                    Google
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-300"}`}
                >
                  <Text
                    className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-medium`}
                  >
                    Apple
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Link */}
            <View className="mt-8 items-center">
              <Text
                className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                Don't have an account?{" "}
                <Text
                  className="text-purple-500 font-medium"
                  onPress={onSignUpPress}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
