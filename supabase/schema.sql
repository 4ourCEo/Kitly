-- LaunchKit Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create kits table
CREATE TABLE IF NOT EXISTS kits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stripe_price_id TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  assets JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_kits table (junction table for user purchases)
CREATE TABLE IF NOT EXISTS user_kits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kit_id UUID NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, kit_id)
);

-- Enable Row Level Security
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_kits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for kits table
-- Everyone can read kits (public access for browsing)
CREATE POLICY "Anyone can view kits" ON kits
  FOR SELECT USING (true);

-- Only authenticated users with admin role can insert/update/delete kits
-- For now, we'll manage kits manually through Supabase dashboard
CREATE POLICY "Only admins can manage kits" ON kits
  FOR ALL USING (false);

-- RLS Policies for user_kits table
-- Users can only see their own purchased kits
CREATE POLICY "Users can view own kits" ON user_kits
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own kit purchases (handled by webhook)
CREATE POLICY "Users can insert own kit purchases" ON user_kits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kits_category ON kits(category);
CREATE INDEX IF NOT EXISTS idx_kits_created_at ON kits(created_at);
CREATE INDEX IF NOT EXISTS idx_user_kits_user_id ON user_kits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_kits_kit_id ON user_kits(kit_id);

-- Insert sample kits for development
INSERT INTO kits (name, description, price, stripe_price_id, category, assets, image_url) VALUES
(
  'SaaS Launch Kit',
  'Everything you need to launch your SaaS product successfully. Includes landing page templates, product hunt assets, email sequences, and a comprehensive launch strategy guide.',
  29.99,
  'price_saas_launch_kit',
  'SaaS Launch',
  '[
    {
      "id": "landing_page",
      "name": "Landing Page Template",
      "type": "template",
      "description": "High-converting landing page template with modern design",
      "content": {
        "html": "<html><!-- Landing page template --></html>",
        "css": "/* Styles for landing page */"
      }
    },
    {
      "id": "product_hunt_copy",
      "name": "Product Hunt Launch Copy",
      "type": "text",
      "description": "Proven copy templates for Product Hunt launch",
      "content": {
        "headline": "Launch your product with confidence",
        "description": "Templates and copy that convert"
      }
    },
    {
      "id": "social_graphics",
      "name": "Social Media Graphics",
      "type": "graphic",
      "description": "Eye-catching graphics for social media promotion",
      "content": {
        "templates": ["twitter_card.json", "linkedin_post.json", "instagram_story.json"]
      }
    }
  ]'::jsonb,
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop'
),
(
  'AI Thought Leadership Kit',
  'Establish yourself as an AI thought leader with professional templates, whitepapers, and content strategy guides.',
  39.99,
  'price_ai_thought_leadership_kit',
  'AI Thought Leadership',
  '[
    {
      "id": "whitepaper_template",
      "name": "AI Whitepaper Template",
      "type": "template",
      "description": "Professional whitepaper template for AI insights",
      "content": {
        "structure": "Executive Summary, Introduction, Analysis, Conclusions",
        "pages": 12
      }
    },
    {
      "id": "blog_framework",
      "name": "Blog Post Framework",
      "type": "text",
      "description": "Structured framework for AI blog posts",
      "content": {
        "outline": "Hook, Problem, Solution, Case Study, Call to Action",
        "word_count": "1500-2000 words"
      }
    },
    {
      "id": "case_study_template",
      "name": "Case Study Template",
      "type": "template",
      "description": "Professional case study template",
      "content": {
        "sections": ["Challenge", "Solution", "Results", "Learnings"]
      }
    }
  ]'::jsonb,
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop'
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for kits table
CREATE TRIGGER update_kits_updated_at BEFORE UPDATE ON kits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
