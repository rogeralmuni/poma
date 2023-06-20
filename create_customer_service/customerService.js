const express = require('express');
const Customer = require('../server/model/Customer');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Route to get customer list
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to create a new customer
router.post('/new', async (req, res) => {
  try {
    const { name, email, address } = req.body;

    // Check if a customer with the same email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'A customer with this email already exists' });
    }

    // Create a customer in Stripe
    const stripeCustomer = await stripe.customers.create({
      name,
      email,
      address: {
        line1: address
      }
    });

    // Create a customer in your system
    const customer = new Customer({
      name,
      email,
      address,
      stripeCustomerId: stripeCustomer.id // Store Stripe Customer ID
    });

    await customer.save();
    
    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error });
  }
});

// Add more routes for managing customers (e.g., update, delete, get) if necessary

module.exports = router;
