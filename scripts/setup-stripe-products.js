const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Kit products to create in Stripe
const kits = [
  {
    name: 'SaaS Launch Kit',
    description: 'Everything you need to launch your SaaS product successfully. Includes landing page templates, product hunt assets, email sequences, and a comprehensive launch strategy guide.',
    price: 2999, // $29.99 in cents
    priceId: 'price_saas_launch_kit'
  },
  {
    name: 'AI Thought Leadership Kit',
    description: 'Establish yourself as an AI thought leader with professional templates, whitepapers, and content strategy guides.',
    price: 3999, // $39.99 in cents
    priceId: 'price_ai_thought_leadership_kit'
  }
]

async function setupStripeProducts() {
  console.log('Setting up Stripe products...')
  
  try {
    for (const kit of kits) {
      console.log(`Creating product: ${kit.name}`)
      
      // Create product
      const product = await stripe.products.create({
        name: kit.name,
        description: kit.description,
      })
      
      console.log(`✓ Product created: ${product.id}`)
      
      // Create price
      const price = await stripe.prices.create({
        unit_amount: kit.price,
        currency: 'usd',
        product: product.id,
      })
      
      console.log(`✓ Price created: ${price.id}`)
      console.log(`  Expected price ID in DB: ${kit.priceId}`)
      console.log(`  Actual Stripe price ID: ${price.id}`)
      console.log('---')
    }
    
    console.log('✅ All Stripe products created successfully!')
    console.log('⚠️  Remember to update your database with the actual Stripe price IDs shown above')
    
  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error.message)
  }
}

// Run the setup
setupStripeProducts()
