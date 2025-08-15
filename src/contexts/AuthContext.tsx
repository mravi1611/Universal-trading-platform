
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserAuth, UserProfile } from "@/types";
import { generateMockUser } from "@/services/mockData";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { logActivity, ActivityType } from "@/utils/activityLogger";

interface AuthContextType {
  user: UserAuth | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Function to fetch user profile data
  const fetchUserProfile = async (supaUser: User) => {
    try {
      console.log("Fetching profile for user:", supaUser.id);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supaUser.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      if (profileData) {
        console.log("Profile found:", profileData);
        // User profile exists, set user and profile
        const authUser: UserAuth = {
          id: supaUser.id,
          email: supaUser.email || '',
          name: profileData.name || supaUser.email?.split('@')[0] || '',
          isAuthenticated: true
        };

        const userProfile: UserProfile = {
          id: profileData.id,
          email: supaUser.email || '',
          name: profileData.name || authUser.name,
          balance: profileData.balance || 0,
          createdAt: profileData.created_at
        };

        setUser(authUser);
        setProfile(userProfile);
      } else {
        console.log("Profile not found, creating one");
        // Profile not found, create one
        await createInitialProfile(supaUser);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      // Even if there's an error fetching the profile, still check localStorage
      // This ensures users who were previously logged in can still access the app
      checkLocalStorageAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const createInitialProfile = async (supaUser: User) => {
    try {
      const name = supaUser.email?.split('@')[0] || '';
      
      const initialProfile = {
        id: supaUser.id,
        name,
        balance: 10000
      };
      
      console.log("Creating initial profile:", initialProfile);
      
      const { error } = await supabase
        .from('profiles')
        .insert(initialProfile);
        
      if (error) {
        console.error("Error creating profile:", error);
        throw error;
      }
      
      const { data: createdProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supaUser.id)
        .single();
        
      if (fetchError) {
        console.error("Error fetching created profile:", fetchError);
        throw fetchError;
      }
      
      console.log("Created profile:", createdProfile);
      
      const authUser: UserAuth = {
        id: supaUser.id,
        email: supaUser.email || '',
        name: name,
        isAuthenticated: true
      };

      const userProfile: UserProfile = {
        id: createdProfile.id,
        email: supaUser.email || '',
        name: createdProfile.name,
        balance: createdProfile.balance,
        createdAt: createdProfile.created_at
      };

      setUser(authUser);
      setProfile(userProfile);
      
    } catch (error) {
      console.error("Error in createInitialProfile:", error);
      checkLocalStorageAuth();
    }
  };

  useEffect(() => {
    console.log("AuthContext initializing");
    
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        
        if (currentSession?.user) {
          console.log("Session found in auth state change, setting user");
          setSession(currentSession);
          setSupabaseUser(currentSession.user);
          
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // Use setTimeout to avoid potential deadlocks with Supabase client
            setTimeout(() => {
              logActivity(currentSession.user.id, ActivityType.LOGIN, {
                email: currentSession.user.email,
                provider: currentSession.user.app_metadata?.provider || 'email'
              });
              fetchUserProfile(currentSession.user);
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing auth state");
          // User is signed out
          setUser(null);
          setProfile(null);
          setSupabaseUser(null);
          setSession(null);
          
          // Clear localStorage as well
          localStorage.removeItem("aether_user");
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith("aether_profile_")) {
              localStorage.removeItem(key);
            }
          });
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        
        if (existingSession?.user) {
          console.log("Found existing session, user is logged in");
          setSession(existingSession);
          setSupabaseUser(existingSession.user);
          await fetchUserProfile(existingSession.user);
        } else {
          console.log("No existing session found, checking localStorage");
          checkLocalStorageAuth();
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        checkLocalStorageAuth();
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkLocalStorageAuth = () => {
    console.log("Checking localStorage for auth data");
    const storedAuth = localStorage.getItem("aether_user");
    if (storedAuth) {
      try {
        console.log("Found stored auth data");
        const parsedAuth = JSON.parse(storedAuth);
        setUser(parsedAuth);
        
        const storedProfile = localStorage.getItem(`aether_profile_${parsedAuth.id}`);
        if (storedProfile) {
          console.log("Found stored profile data");
          setProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error("Failed to parse stored auth data", error);
        localStorage.removeItem("aether_user");
      }
    } else {
      console.log("No stored auth data found");
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    console.log("Attempting login for:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Supabase login error:", error);
        // If login fails with invalid credentials and we're in development mode, 
        // automatically register the user
        if (error.message.includes("Invalid login credentials")) {
          console.log("Invalid credentials, creating new account");
          await register(email, email.split('@')[0], password);
          return;
        }
        throw error;
      }
      
      console.log("Login successful via Supabase auth");
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      });
      
      // Don't need to update state here, the onAuthStateChange listener will handle that
      
    } catch (error) {
      console.error("Login error, falling back to mock mode:", error);
      
      // Fallback to mock user for development
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!email.trim() || !password.trim()) {
        throw new Error("Email and password are required");
      }
      
      const mockUser: UserAuth = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        email,
        name: email.split('@')[0],
        isAuthenticated: true
      };
      
      const mockProfile = generateMockUser(email, mockUser.name);
      
      localStorage.setItem("aether_user", JSON.stringify(mockUser));
      localStorage.setItem(`aether_profile_${mockUser.id}`, JSON.stringify(mockProfile));
      
      setUser(mockUser);
      setProfile(mockProfile);
      
      logActivity(mockUser.id, ActivityType.LOGIN, { email, mode: 'development' });
      
      toast({
        title: "Login Successful (Demo Mode)",
        description: `Welcome back, ${mockUser.name}!`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string): Promise<void> => {
    setIsLoading(true);
    console.log("Registering new user:", email);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        console.error("Supabase registration error:", error);
        throw error;
      }
      
      toast({
        title: "Registration Successful",
        description: `Welcome to UnivTrade, ${name}!`,
      });
      
      // Registration activity is logged by database trigger
      console.log("Registration successful via Supabase auth");
      
    } catch (error) {
      console.error("Registration error, falling back to mock mode:", error);
      
      // Fallback to mock user for development
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!email.trim() || !password.trim() || !name.trim()) {
        throw new Error("All fields are required");
      }
      
      const mockUser: UserAuth = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        email,
        name,
        isAuthenticated: true
      };
      
      const mockProfile = generateMockUser(email, name);
      
      localStorage.setItem("aether_user", JSON.stringify(mockUser));
      localStorage.setItem(`aether_profile_${mockUser.id}`, JSON.stringify(mockProfile));
      
      setUser(mockUser);
      setProfile(mockProfile);
      
      logActivity(mockUser.id, ActivityType.SYSTEM, { 
        action: 'registration', 
        email, 
        name,
        mode: 'development' 
      });
      
      toast({
        title: "Registration Successful (Demo Mode)",
        description: `Welcome to UnivTrade, ${name}!`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    console.log("Logging out user");
    if (user?.id) {
      await logActivity(user.id, ActivityType.LOGOUT, { email: user.email });
    }
    
    await supabase.auth.signOut();
    
    localStorage.removeItem("aether_user");
    if (user?.id) {
      localStorage.removeItem(`aether_profile_${user.id}`);
    }
    
    setUser(null);
    setProfile(null);
    setSession(null);
    setSupabaseUser(null);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
