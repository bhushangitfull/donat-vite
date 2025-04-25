import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { 
  auth, 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  resetPassword, 
  checkAdminStatus 
} from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<User>;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  loginWithGoogle: async () => {
    throw new Error("AuthContext not initialized");
  },
  loginWithEmail: async () => {
    throw new Error("AuthContext not initialized");
  },
  registerWithEmail: async () => {
    throw new Error("AuthContext not initialized");
  },
  resetPassword: async () => {
    throw new Error("AuthContext not initialized");
  },
  logout: async () => {
    throw new Error("AuthContext not initialized");
  },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // Check admin status if user is logged in
      if (currentUser) {
        try {
          const adminStatus = await checkAdminStatus(currentUser.uid);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAdmin(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleLoginWithEmail = async (email: string, password: string) => {
    try {
      const user = await loginWithEmail(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      return user;
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Failed to sign in. Please check your credentials.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleRegisterWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const user = await registerWithEmail(email, password, displayName);
      toast({
        title: "Account created",
        description: "Your account has been successfully created.",
      });
      return user;
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address.";
      }
      
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword(email);
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      let errorMessage = "Failed to send password reset email. Please try again.";
      
      if (error.code === 'auth/user-not-found') {
        // For security reasons, we don't want to reveal that the user doesn't exist
        // So we still show a success message
        toast({
          title: "Password reset email sent",
          description: "If an account exists with this email, you will receive instructions to reset your password.",
        });
        return; // Return early to prevent the error toast
      }
      
      toast({
        title: "Password Reset Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    loginWithGoogle,
    loginWithEmail: handleLoginWithEmail,
    registerWithEmail: handleRegisterWithEmail,
    resetPassword: handleResetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
