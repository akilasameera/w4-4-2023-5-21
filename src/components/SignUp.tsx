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
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";
import { signUp } from "../services/auth";
import CountrySelect from "./common/CountrySelect";

interface SignUpProps {
  onSignInPress?: () => void;
}

const SignUp = ({ onSignInPress }: SignUpProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("United States");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    country?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      country?: string;
    } = {};
    let isValid = true;

    if (!username) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!country) {
      newErrors.country = "Please select your country";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log("Signing up with:", { email, username, country });
      const response = await signUp({ email, password, username, country });

      if (response.success) {
        Alert.alert(
          "Sign Up Successful",
          "Your account has been created successfully. Please check your email for verification.",
          [{ text: "OK", onPress: () => router.replace("/") }],
        );
      } else {
        Alert.alert(
          "Sign Up Failed",
          response.error || "Please check your information and try again.",
        );
      }
    } catch (error) {
      console.error("Error during signup:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                Create your account
              </Text>
            </View>

            {/* Sign Up Form */}
            <View className="space-y-4">
              <View>
                <Text
                  className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  Username
                </Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <User
                      size={18}
                      color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                    />
                  </View>
                  <TextInput
                    className={`w-full ${theme === "dark" ? "bg-[#202024] text-white" : "bg-white text-gray-900"} rounded-xl py-3 pl-10 pr-4 ${errors.username ? "border border-red-500" : theme === "dark" ? "border border-gray-800" : "border border-gray-300"}`}
                    placeholder="Choose a username"
                    placeholderTextColor={
                      theme === "dark" ? "#9ca3af" : "#6b7280"
                    }
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>
                {errors.username && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.username}
                  </Text>
                )}
              </View>

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
                    placeholder="Create a password"
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

              <View>
                <Text
                  className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  Confirm Password
                </Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Lock
                      size={18}
                      color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                    />
                  </View>
                  <TextInput
                    className={`w-full ${theme === "dark" ? "bg-[#202024] text-white" : "bg-white text-gray-900"} rounded-xl py-3 pl-10 pr-12 ${errors.confirmPassword ? "border border-red-500" : theme === "dark" ? "border border-gray-800" : "border border-gray-300"}`}
                    placeholder="Confirm your password"
                    placeholderTextColor={
                      theme === "dark" ? "#9ca3af" : "#6b7280"
                    }
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-3 z-10"
                    onPress={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
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
              </View>

              <View>
                <CountrySelect
                  value={country}
                  onValueChange={setCountry}
                  error={errors.country}
                  label="Country"
                  placeholder="Select your country"
                />
              </View>

              {errors.confirmPassword && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            <TouchableOpacity
              className={`w-full bg-purple-500 rounded-xl py-3.5 items-center mt-4 ${loading ? "opacity-70" : ""}`}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            <View className="mt-4">
              <Text
                className={`text-xs text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                By signing up, you agree to our{" "}
                <Text className="text-purple-500">Terms of Service</Text> and{" "}
                <Text className="text-purple-500">Privacy Policy</Text>
              </Text>
            </View>
          </View>
          {/* Sign In Link */}
          <View className="mt-6 mb-4 items-center">
            <Text
              className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Already have an account?{" "}
              <Text
                className="text-purple-500 font-medium"
                onPress={onSignInPress}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
