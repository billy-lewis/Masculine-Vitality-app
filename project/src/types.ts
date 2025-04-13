export interface UserProfile {
  name: string;
  email: string;
  interests: string[];
  selectedInfluencers: string[];
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Influencer {
  id: string;
  name: string;
}

export interface InfluencerContent {
  id: string;
  influencer_id: string;
  bio: string;
  expertise: string[];
  social_links?: Record<string, string>;
}

export interface InfluencerBook {
  id: string;
  influencer_id: string;
  title: string;
  author: string;
  description?: string;
  link?: string;
}

export interface InfluencerQuote {
  id: string;
  influencer_id: string;
  quote: string;
  context?: string;
}