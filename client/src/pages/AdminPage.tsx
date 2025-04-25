import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from '@/components/admin/AdminLogin';
import Dashboard from '@/components/admin/Dashboard';
import AdminUtility from '@/components/admin/AdminUtility';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminPageProps {
  section?: string;
}

const AdminPage = ({ section }: AdminPageProps) => {
  const { user, loading, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    // Set page title
    document.title = 'Admin | Hope Foundation';
    
    // If auth state is determined and user is logged in, check admin status
    if (!loading && user) {
      // Admin status is already checked in the AuthContext
      setCheckingAdmin(false);
    } else if (!loading && !user) {
      // Not logged in, just show login screen
      setCheckingAdmin(false);
    }
  }, [user, loading, isAdmin]);

  // Redirect to dashboard if section is specified but user is not logged in
  useEffect(() => {
    if (!loading && section && !user) {
      setLocation('/admin');
    }
  }, [loading, section, user, setLocation]);

  // If we're loading auth state or checking admin status, show loading
  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Skeleton className="h-12 w-3/4 mb-6 rounded" />
          <Skeleton className="h-6 w-full mb-4 rounded" />
          <Skeleton className="h-6 w-5/6 mb-8 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, show login screen
  if (!user) {
    return <AdminLogin />;
  }

  // If logged in but not admin, show unauthorized message with admin utility
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-xl w-full">
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="info">Access Information</TabsTrigger>
              <TabsTrigger value="utility">Admin Setup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
              <p className="text-gray-600 mb-6">
                Your account doesn't have administrative privileges. Please contact the system administrator if you believe this is an error.
              </p>
              <div className="text-left bg-gray-50 p-4 rounded mb-6 text-xs text-gray-600">
                <p className="font-semibold mb-2">User information:</p>
                <p>User ID: {user.uid}</p>
                <p>Email: {user.email}</p>
                <p>Display Name: {user.displayName}</p>
                <p className="mt-2">Note: The administrator needs to add you to the admin list for you to access this section.</p>
              </div>
              <div className="flex justify-between">
                <button 
                  onClick={() => setLocation('/')}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Back to Home
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                  Retry Access
                </button>
              </div>
            </TabsContent>
            
            <TabsContent value="utility">
              <p className="text-sm text-gray-600 mb-4">
                If you are the first user of the system or need to grant yourself admin access, you can use this utility.
              </p>
              <AdminUtility />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // User is logged in and is an admin, show dashboard
  return <Dashboard />;
};

export default AdminPage;
