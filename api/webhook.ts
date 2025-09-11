import { createClient } from '@supabase/supabase-js'

// This is a Vercel serverless function for handling Stripe webhooks
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Initialize Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    
    // Get the raw body for signature verification
    const sig = req.headers['stripe-signature']
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return res.status(400).json({ error: 'Webhook signature verification failed' })
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      // Extract metadata
      const { kit_id, user_id } = session.metadata

      if (!kit_id || !user_id) {
        console.error('Missing metadata in webhook:', session.metadata)
        return res.status(400).json({ error: 'Missing metadata' })
      }

      // Initialize Supabase client with service role key
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // Add the kit to user's purchased kits
      const { data, error } = await supabase
        .from('user_kits')
        .insert({
          user_id: user_id,
          kit_id: kit_id,
        })
        .select()

      if (error) {
        console.error('Error adding kit to user:', error)
        return res.status(500).json({ error: 'Failed to process purchase' })
      }

      console.log('Successfully processed purchase:', data)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
