import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import type { Message, UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { getInfluencerContent, getInfluencerBooks, getInfluencerQuotes } from '../lib/influencerData';

interface ChatInterfaceProps {
  userProfile: UserProfile;
}

export function ChatInterface({ userProfile }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "What can I help you with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
      }
    });

    if (userId) {
      supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .then(({ data, error }) => {
          if (!error && data) {
            setMessages(prev => [
              prev[0],
              ...data.map(msg => ({
                id: msg.id,
                content: msg.content,
                sender: msg.sender,
                timestamp: new Date(msg.created_at)
              }))
            ]);
          }
        });
    }
  }, [userId]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !userId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      await supabase.from('messages').insert([
        {
          content: input,
          sender: 'user',
          user_profile_id: userId
        }
      ]);

      // Process the message to check for influencer-related queries
      const message = input.toLowerCase();
      let botResponse = "I understand your question. Based on your interests and inspirations, here's my perspective...";

      // Check if the message is asking about an influencer
      for (const influencerId of userProfile.selectedInfluencers) {
        if (message.includes(influencerId.toLowerCase())) {
          try {
            const [content, books, quotes] = await Promise.all([
              getInfluencerContent(influencerId),
              getInfluencerBooks(influencerId),
              getInfluencerQuotes(influencerId)
            ]);

            botResponse = `Here's what I know about ${content.bio}\n\nRecommended Books:\n${
              books.map(book => `- ${book.title} by ${book.author}`).join('\n')
            }\n\nNotable Quote:\n"${quotes[0]?.quote}"`;
          } catch (error) {
            console.error('Error fetching influencer data:', error);
          }
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      await supabase.from('messages').insert([
        {
          content: botResponse,
          sender: 'bot',
          user_profile_id: userId
        }
      ]);

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error storing message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl rounded-lg p-4 ${
                message.sender === 'user'
                  ? 'bg-primary text-background'
                  : 'bg-background border border-off-white/20 text-off-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-off-white/20 bg-background p-4">
        <div className="max-w-4xl mx-auto flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-off-white/20 bg-background/50 p-3 text-off-white placeholder-off-white/50 focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            className="rounded-lg bg-primary p-3 text-background hover:bg-primary/90"
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}