import { supabase } from './supabase';
import type { InfluencerContent, InfluencerBook, InfluencerQuote } from '../types';

export async function getInfluencerContent(influencerId: string) {
  const { data, error } = await supabase
    .from('influencer_content')
    .select('*')
    .eq('influencer_id', influencerId)
    .single();

  if (error) throw error;
  return data as InfluencerContent;
}

export async function getInfluencerBooks(influencerId: string) {
  const { data, error } = await supabase
    .from('influencer_books')
    .select('*')
    .eq('influencer_id', influencerId);

  if (error) throw error;
  return data as InfluencerBook[];
}

export async function getInfluencerQuotes(influencerId: string) {
  const { data, error } = await supabase
    .from('influencer_quotes')
    .select('*')
    .eq('influencer_id', influencerId);

  if (error) throw error;
  return data as InfluencerQuote[];
}