
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";
import { Loader2 } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  // Handle authentication checking
  useEffect(() => {
    if (!isLoading) {
      console.log("Auth check complete, user:", user ? "logged in" : "not logged in");
      console.log("Current location:", location.pathname);
      
      if (requireAuth && !user) {
        console.log("Auth required but no user, redirecting to login");
        // Save the current path to redirect back after login
        navigate("/login", { 
          replace: true, 
          state: { from: location.pathname } 
        });
      } else if (user && location.pathname === "/") {
        // Redirect authenticated users from the root path to dashboard
        console.log("User is logged in and at root path, redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      } else {
        setAuthChecked(true);
      }
    }
  }, [isLoading, user, navigate, requireAuth, location.pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  // For pages that require auth, don't render until user is loaded and auth is checked
  if (requireAuth && !user) {
    console.log("Not rendering protected content, no user found");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Please log in...</span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {user && <AppSidebar />}
        <main className="flex-1">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
