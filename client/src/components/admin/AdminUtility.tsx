import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { setAdminStatus } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

/**
 * This is a utility component to help set admin privileges for users
 * It's intended for initial setup or for admin users to grant access to others
 */
const AdminUtility = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGrantAdmin = async () => {
    if (!uid) {
      toast({
        title: "Error",
        description: "Please enter a user ID.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await setAdminStatus(uid, true);
      toast({
        title: "Success",
        description: `Admin access granted to user ID: ${uid}`,
      });
      setUid('');
    } catch (error) {
      console.error("Error granting admin access:", error);
      toast({
        title: "Error",
        description: "Failed to grant admin access. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelfAdmin = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to grant yourself admin access.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await setAdminStatus(user.uid, true);
      toast({
        title: "Success",
        description: "Admin access granted to your account. Please reload the page.",
      });
    } catch (error) {
      console.error("Error granting self admin access:", error);
      toast({
        title: "Error",
        description: "Failed to grant admin access. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Admin Utility</CardTitle>
          </div>
          <CardDescription>
            Use this utility to grant admin privileges to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user && (
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium mb-2">Your User Information:</p>
                <p className="text-xs mb-1">User ID: {user.uid}</p>
                <p className="text-xs mb-1">Email: {user.email}</p>
                <p className="text-xs mb-3">Display Name: {user.displayName}</p>
                <Button
                  onClick={handleSelfAdmin}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Processing..." : "Grant Admin Access to Myself"}
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">Grant Admin Access to Another User:</p>
              <Input
                placeholder="Enter user ID"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleGrantAdmin}
              disabled={loading || !uid}
              className="w-full"
            >
              {loading ? "Processing..." : "Grant Admin Access"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUtility;