import { Dumbbell, Brain, Heart, Briefcase, Users, Book } from 'lucide-react';

export const topics = [
  {
    id: 'fitness',
    name: 'Fitness & Exercise',
    icon: Dumbbell
  },
  {
    id: 'mental-health',
    name: 'Mental Health & Psychology',
    icon: Brain
  },
  {
    id: 'relationships',
    name: 'Relationships & Dating',
    icon: Heart
  },
  {
    id: 'career',
    name: 'Career Development',
    icon: Briefcase
  },
  {
    id: 'leadership',
    name: 'Leadership & Influence',
    icon: Users
  },
  {
    id: 'personal-growth',
    name: 'Personal Development',
    icon: Book
  }
] as const;