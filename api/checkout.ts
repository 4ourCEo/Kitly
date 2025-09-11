import { createClient } from '@supabase/supabase-js'

// This is a Vercel serverless function for handling Stripe checkout
export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { kit_id, user_id } = req.body

    if (!kit_id || !user_id) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Initialize Supabase client with service role key for server-side operations
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get kit details from database
    const { data: kit, error: kitError } = await supabase
      .from('kits')
      .select('*')
      .eq('id', kit_id)
      .single()

    if (kitError || !kit) {
      return res.status(404).json({ error: 'Kit not found' })
    }

    // Initialize Stripe (you'll need to install stripe package)
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: kit.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
      metadata: {
        kit_id: kit_id,
        user_id: user_id,
      },
    })

    res.status(200).json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
