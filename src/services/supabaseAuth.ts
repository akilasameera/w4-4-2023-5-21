import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// Create a custom storage object that works in both web and native environments
const customStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      // For server-side rendering or environments without window
      if (typeof localStorage === "undefined") {
        return null;
      }
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Error getting item from storage:", error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("Error setting item in storage:", error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Error removing item from storage:", error);
    }
  },
};

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface SignUpCredentials {
  email: string;
  password: string;
  username: string;
  country?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any;
  session?: any;
}

// Sign up a new user
export const signUp = async (
  credentials: SignUpCredentials,
): Promise<AuthResponse> => {
  try {
    console.log("Signing up with Supabase:", credentials.email);

    // Create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          username: credentials.username,
          country: credentials.country,
        },
      },
    });

    if (error) {
      console.error("Supabase signup error:", error.message);
      return { success: false, error: error.message };
    }

    // Create a profile record in the profiles table
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          username: credentials.username,
          email: credentials.email,
          country: credentials.country,
          created_at: new Date().toISOString(),
        },
      ]);

      if (profileError) {
        console.error("Profile creation error:", profileError.message);
        // We don't return an error here because the auth user was created successfully
        // In a production app, you might want to delete the auth user if profile creation fails
      }
    }

    return { success: true, user: data.user, session: data.session };
  } catch (error: any) {
    console.error("Unexpected error during signup:", error.message);
    return { success: false, error: error.message };
  }
};

// Sign in an existing user
export const signIn = async (
  credentials: SignInCredentials,
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Sign out the current user
export const signOut = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get the current session
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data.session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

// Get the current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw error;
    }
    return data.user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getSession();
  return session !== null;
};

export default {
  signUp,
  signIn,
  signOut,
  getSession,
  getCurrentUser,
  isAuthenticated,
  supabase,
};
