import React from "react";
import { useRouter } from "expo-router";
import SignIn from "../../src/components/SignIn";

export default function SignInScreen() {
  const router = useRouter();

  const handleSignUpPress = () => {
    router.push("/sign-up");
  };

  return <SignIn onSignUpPress={handleSignUpPress} />;
}
