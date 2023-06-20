const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route to create a new order
router.post('/createOrder', async (req, res) => {
    const { customerId, items, currency } = req.body;

    try {
        // Create a new payment intent for the order
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency,
            customer: customerId
        });

        // Here you would also store the order in your own database if needed

        res.status(201).json({ client_secret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Helper function to calculate order amount
function calculateOrderAmount(items) {
    // Dummy implementation to calculate order amount
    // In practice, you should retrieve prices from a database
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100;
}

module.exports = router;
