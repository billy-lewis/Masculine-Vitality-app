import React, { useState, useRef, useEffect } from 'react';
import { influencers } from '../data/influencers';
import { topics } from '../data/topics';
import type { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    interests: [],
    selectedInfluencers: [],
  });

  useEffect(() => {
    if ([2].includes(step) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const handleEmailSubmit = async () => {
    try {
      setIsLoading(true);
      console.log('Starting email submission...');
      
      // Clean and validate email
      const cleanEmail = profile.email.trim().toLowerCase();
      
      // Basic email validation
      if (!cleanEmail.match(/^[^@]+@[^@]+\.[^@]+$/)) {
        throw new Error('Please enter a valid email address');
      }

      // Create user with cleaned email
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: crypto.randomUUID(),
        options: {
          emailRedirectTo: import.meta.env.PROD 
            ? 'https://your-netlify-domain.netlify.app'
            : window.location.origin,
          data: {
            name: profile.name
          }
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (!data.user) {
        console.error('No user returned from signup');
        throw new Error('Failed to create account');
      }

      console.log('User created:', data.user.id);
      setUserId(data.user.id);

      // Save initial profile data with just name and email
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: data.user.id,
            name: profile.name,
            email: cleanEmail
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      console.log('Initial profile created successfully');
      setStep(prev => prev + 1);
    } catch (error: any) {
      console.error('Full error details:', error);
      if (error.message.includes('already registered')) {
        alert('This email is already registered. Please use a different email address.');
      } else if (error.message.includes('valid')) {
        alert('Please enter a valid email address (e.g., name@example.com)');
      } else {
        alert('There was an error creating your profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfluencerSelect = (id: string) => {
    setProfile(prev => ({
      ...prev,
      selectedInfluencers: prev.selectedInfluencers.includes(id)
        ? prev.selectedInfluencers.filter(i => i !== id)
        : [...prev.selectedInfluencers, id]
    }));
  };

  const handleTopicSelect = (id: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      
      if (!userId) {
        console.error('No user ID found');
        return;
      }

      // Update only the interests and influencers
      const { error } = await supabase
        .from('user_profiles')
        .update({
          interests: profile.interests,
          selected_influencers: profile.selectedInfluencers
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating preferences:', error);
        throw error;
      }
      
      onComplete(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('There was an error saving your preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const slides = [
    // Welcome
    <div key="welcome" className="space-y-6 text-center max-w-xl mx-auto">
      <h1 className="text-4xl font-bold">Welcome to Your Personal Growth Journey</h1>
      <p className="text-off-white/80">Let's create a personalized experience just for you.</p>
      <button
        onClick={() => setStep(prev => prev + 1)}
        className="px-8 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors font-semibold"
      >
        Get Started
      </button>
    </div>,

    // Name
    <div key="name" className="space-y-6 text-center max-w-xl mx-auto">
      <h2 className="text-3xl font-bold">What's your name?</h2>
      <input
        ref={inputRef}
        type="text"
        value={profile.name}
        onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
        onKeyPress={e => {
          if (e.key === 'Enter' && profile.name) {
            setStep(prev => prev + 1);
          }
        }}
        placeholder="Enter your name"
        className="w-full rounded-lg border border-off-white/20 bg-background/50 p-3 text-off-white placeholder-off-white/50 focus:border-primary focus:ring-1 focus:ring-primary text-center text-xl"
      />
      <button
        onClick={() => setStep(prev => prev + 1)}
        disabled={!profile.name}
        className="px-8 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors font-semibold"
      >
        Continue
      </button>
    </div>,

    // Email
    <div key="email" className="space-y-6 text-center max-w-xl mx-auto">
      <h2 className="text-3xl font-bold">What's your email?</h2>
      <input
        ref={inputRef}
        type="email"
        value={profile.email}
        onChange={e => {
          const value = e.target.value.trim().toLowerCase();
          setProfile(prev => ({ ...prev, email: value }));
        }}
        onKeyPress={e => {
          if (e.key === 'Enter' && profile.email.includes('@') && profile.email.includes('.')) {
            handleEmailSubmit();
          }
        }}
        placeholder="name@example.com"
        className="w-full rounded-lg border border-off-white/20 bg-background/50 p-3 text-off-white placeholder-off-white/50 focus:border-primary focus:ring-1 focus:ring-primary text-center text-xl"
      />
      <button
        onClick={handleEmailSubmit}
        disabled={!profile.email || isLoading}
        className={`px-8 py-3 bg-primary text-background rounded-lg transition-colors font-semibold
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
      >
        {isLoading ? 'Creating Account...' : 'Continue'}
      </button>
    </div>,

    // Inspirations
    <div key="inspirations" className="space-y-6 text-center max-w-xl mx-auto">
      <h2 className="text-3xl font-bold">Who inspires you?</h2>
      <p className="text-off-white/80">Select the voices that resonate with you</p>
      <div className="flex flex-wrap justify-center gap-3">
        {influencers.map(influencer => (
          <button
            key={influencer.id}
            onClick={() => handleInfluencerSelect(influencer.id)}
            className={`px-6 py-2 rounded-full transition-all ${
              profile.selectedInfluencers.includes(influencer.id)
                ? 'bg-primary text-background'
                : 'border border-off-white/20 text-off-white hover:border-primary'
            }`}
          >
            {influencer.name}
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep(prev => prev + 1)}
        disabled={profile.selectedInfluencers.length === 0}
        className="px-8 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors font-semibold"
      >
        Continue
      </button>
    </div>,

    // Interests
    <div key="interests" className="space-y-6 text-center max-w-xl mx-auto">
      <h2 className="text-3xl font-bold">What interests you?</h2>
      <p className="text-off-white/80">Choose topics you'd like to explore</p>
      <div className="flex flex-wrap justify-center gap-3">
        {topics.map(topic => (
          <button
            key={topic.id}
            onClick={() => handleTopicSelect(topic.id)}
            className={`px-6 py-2 rounded-full transition-all ${
              profile.interests.includes(topic.id)
                ? 'bg-primary text-background'
                : 'border border-off-white/20 text-off-white hover:border-primary'
            }`}
          >
            {topic.name}
          </button>
        ))}
      </div>
      <button
        onClick={handleComplete}
        disabled={profile.interests.length === 0 || isLoading}
        className={`px-8 py-3 bg-primary text-background rounded-lg transition-colors font-semibold
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
      >
        {isLoading ? 'Saving Preferences...' : 'Start My Journey'}
      </button>
    </div>
  ];

  return (
    <div className="min-h-screen bg-background text-off-white flex items-center justify-center">
      <div className="w-full max-w-4xl p-6">
        {slides[step]}
      </div>
    </div>
  );
}