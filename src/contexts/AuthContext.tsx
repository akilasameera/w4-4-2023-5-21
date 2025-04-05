import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import * as AuthService from "../services/auth";

interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    username: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
});

// This hook can be used to access the user info.
export function useAuth() {
  return useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: User | null, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page if not authenticated and not in auth group
      router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect to the home page if authenticated and in auth group
      router.replace("/");
    }
  }, [user, isLoading, segments, router]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useProtectedRoute(user, isLoading);

  useEffect(() => {
    // Check if the user is authenticated on initial load
    const loadUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email || "",
            username: currentUser.user_metadata?.username,
          });
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await AuthService.signIn({ email, password });

      if (response.success && response.data?.user) {
        // Get the actual user data from the response
        const userData = response.data.user;

        setUser({
          id: userData.id,
          email: userData.email || "",
          username: userData.user_metadata?.username || email.split("@")[0],
        });

        // Store additional user info in AsyncStorage if needed
        try {
          const userDisplayName = userData.user_metadata?.name || "Your Name";
          await AsyncStorage.setItem("userDisplayName", userDisplayName);
        } catch (storageError) {
          console.error("Error storing user display name:", storageError);
        }

        return { success: true };
      }

      return { success: false, error: response.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const response = await AuthService.signUp({ email, password, username });

      if (response.success && response.data?.user) {
        setUser({
          id: response.data.user.id,
          email: response.data.user.email || "",
          username,
        });

        // Force navigation to home page after successful sign up
        router.replace("/");
        return { success: true };
      }

      return { success: false, error: response.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
