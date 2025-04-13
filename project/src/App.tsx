import React, { useState, useEffect } from 'react';
import { OnboardingFlow } from './components/OnboardingFlow';
import { ChatInterface } from './components/ChatInterface';
import type { UserProfile } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          setUserProfile({
            name: profile.name,
            age: profile.age,
            occupation: profile.occupation,
            interests: profile.interests,
            selectedInfluencers: profile.selected_influencers
          });
        }
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-off-white">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!userProfile ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : (
        <ChatInterface userProfile={userProfile} />
      )}
    </div>
  );
}

export default App;