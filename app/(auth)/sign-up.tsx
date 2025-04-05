import React from "react";
import { useRouter } from "expo-router";
import SignUp from "../../src/components/SignUp";

export default function SignUpScreen() {
  const router = useRouter();

  const handleSignInPress = () => {
    router.push("/sign-in");
  };

  return <SignUp onSignInPress={handleSignInPress} />;
}
