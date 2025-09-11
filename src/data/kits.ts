// Mock data for local development before Supabase integration
// This will be replaced by data from Supabase in the actual app

export interface KitAsset {
  id: string
  name: string
  type: 'text' | 'graphic' | 'template'
  description: string
  content?: any
}

export interface Kit {
  id: string
  name: string
  description: string
  price: number
  stripe_price_id: string
  category: string
  assets: KitAsset[]
  image_url?: string
  created_at: string
  updated_at: string
}

// Mock data for development
export const mockKits: Kit[] = [
  {
    id: '1',
    name: 'SaaS Launch Kit',
    description: 'Everything you need to launch your SaaS product successfully. Includes landing page templates, product hunt assets, email sequences, and a comprehensive launch strategy guide.',
    price: 29.99,
    stripe_price_id: 'price_saas_launch_kit',
    category: 'SaaS Launch',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assets: [
      {
        id: 'landing_page',
        name: 'Landing Page Template',
        type: 'template',
        description: 'High-converting landing page template with modern design'
      },
      {
        id: 'product_hunt_copy',
        name: 'Product Hunt Launch Copy',
        type: 'text',
        description: 'Proven copy templates for Product Hunt launch'
      },
      {
        id: 'social_graphics',
        name: 'Social Media Graphics',
        type: 'graphic',
        description: 'Eye-catching graphics for social media promotion'
      }
    ]
  },
  {
    id: '2',
    name: 'AI Thought Leadership Kit',
    description: 'Establish yourself as an AI thought leader with professional templates, whitepapers, and content strategy guides.',
    price: 39.99,
    stripe_price_id: 'price_ai_thought_leadership_kit',
    category: 'AI Thought Leadership',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assets: [
      {
        id: 'whitepaper_template',
        name: 'AI Whitepaper Template',
        type: 'template',
        description: 'Professional whitepaper template for AI insights'
      },
      {
        id: 'blog_framework',
        name: 'Blog Post Framework',
        type: 'text',
        description: 'Structured framework for AI blog posts'
      },
      {
        id: 'case_study_template',
        name: 'Case Study Template',
        type: 'template',
        description: 'Professional case study template'
      }
    ]
  }
]
