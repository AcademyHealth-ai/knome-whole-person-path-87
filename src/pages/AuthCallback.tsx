import React from 'react';
import { SafeAreaView } from '@/components/ios/SafeAreaView';
import { IOSCard } from '@/components/ios/IOSCard';
import { Helmet } from 'react-helmet-async';
import { useCanonical } from '@/hooks/useCanonical';

const AuthCallback: React.FC = () => {
  const canonicalUrl = useCanonical();
  return (
    <SafeAreaView className="bg-secondary/30">
      <Helmet>
        <title>Auth Callback – Knome</title>
        <meta name="description" content="Completing authentication. You will be redirected shortly." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4">
        <IOSCard className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Completing sign in...</p>
        </IOSCard>
      </div>
    </SafeAreaView>
  );
};

export default AuthCallback;
