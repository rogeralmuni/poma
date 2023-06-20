const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route to create a new customer
router.post('/createCustomer', async (req, res) => {
    const { email, name } = req.body;
    
    try {
        // Check if customer already exists
        const existingCustomers = await stripe.customers.list({ email });
        if (existingCustomers.data.length > 0) {
            return res.status(400).json({ message: 'Customer already exists' });
        }

        // Create customer in Stripe
        const customer = await stripe.customers.create({
            email,
            name
        });

        // Here you would also store the customer in your own database if needed
        
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
