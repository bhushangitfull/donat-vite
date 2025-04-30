import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from '@/components/admin/AdminLogin';
import Dashboard from '@/components/admin/Dashboard';
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

  // User is logged in and is an admin, show dashboard
  return <Dashboard />;
};

export default AdminPage;
