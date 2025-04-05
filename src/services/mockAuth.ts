import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock user data structure
interface MockUser {
  id: string;
  email: string;
  user_metadata?: {
    username: string;
    country?: string;
  };
}

// Mock storage keys
const STORAGE_KEYS = {
  USER: "whisperwall:user",
  SESSION: "whisperwall:session",
};

// Mock users database (for demo purposes)
const mockUsers: Record<string, MockUser> = {};

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
  data?: any;
}

// Helper to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Sign up a new user
export const signUp = async (
  credentials: SignUpCredentials,
): Promise<AuthResponse> => {
  try {
    const { email, password, username } = credentials;

    // Validate inputs
    if (!email || !password || !username) {
      return {
        success: false,
        error: "Email, password, and username are required",
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }

    // Password validation (at least 8 characters)
    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      };
    }

    // Check if user already exists
    const existingUserKey = Object.keys(mockUsers).find(
      (key) => mockUsers[key].email === email,
    );

    if (existingUserKey) {
      return { success: false, error: "User with this email already exists" };
    }

    // Create a new user
    const userId = generateId();
    const newUser: MockUser = {
      id: userId,
      email,
      user_metadata: {
        username,
        country: credentials.country || "United States",
      },
    };

    // Store user in our mock database
    mockUsers[userId] = newUser;

    // Store password separately (in a real app, you'd hash this)
    await AsyncStorage.setItem(
      `${STORAGE_KEYS.USER}:${userId}:password`,
      password,
    );

    // Create a session
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, userId);

    return {
      success: true,
      data: {
        user: newUser,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Sign in an existing user
export const signIn = async (
  credentials: SignInCredentials,
): Promise<AuthResponse> => {
  try {
    const { email, password } = credentials;

    // Validate inputs
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    // Find user by email
    const userKey = Object.keys(mockUsers).find(
      (key) => mockUsers[key].email === email,
    );

    if (!userKey) {
      // For demo purposes, let's create the user if they don't exist
      // In a real app, you'd return an error
      const userId = generateId();
      const newUser: MockUser = {
        id: userId,
        email,
        user_metadata: {
          username: email.split("@")[0],
        },
      };
      mockUsers[userId] = newUser;
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.USER}:${userId}:password`,
        password,
      );

      // Create a session
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION, userId);

      return {
        success: true,
        data: {
          user: newUser,
        },
      };
    }

    // Check password
    const storedPassword = await AsyncStorage.getItem(
      `${STORAGE_KEYS.USER}:${userKey}:password`,
    );
    if (storedPassword !== password) {
      return { success: false, error: "Invalid password" };
    }

    // Create a session
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify(mockUsers[userKey]),
    );
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, userKey);

    return {
      success: true,
      data: {
        user: mockUsers[userKey],
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Sign out the current user
export const signOut = async (): Promise<AuthResponse> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get the current session
export const getSession = async () => {
  try {
    const sessionId = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
    if (!sessionId) return null;

    return { user: mockUsers[sessionId] };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

// Get the current user
export const getCurrentUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return null;

    return JSON.parse(userJson);
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
};
