import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from '@/components/ios/SafeAreaView';
import { IOSCard } from '@/components/ios/IOSCard';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView className="bg-secondary/30">
        <div className="min-h-screen flex items-center justify-center p-4">
          <IOSCard className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </IOSCard>
        </div>
      </SafeAreaView>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;