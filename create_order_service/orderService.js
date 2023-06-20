const express = require('express');
const Order = require('../server/model/Order');
const Customer = require('../server/model/Customer'); // Import the Customer model
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Route to get order list
const router = express.Router();
router.get('/', async (req, res) => {
  try {
      const orders = await Order.find();
      res.json(orders);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
// Route to create a new order
router.post('/new', async (req, res) => {
  try {
    const { stripeCustomerId, products, totalAmount, paymentMethod } = req.body;
    // Find the customer in your database using stripeCustomerId
    console.log('looking for customer:'); // Log the order before saving it
    const customer = await Customer.findOne({ stripeCustomerId: stripeCustomerId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    console.log('Customer Foud:'); // Log the order before saving it
    let status = 'pending';
    let paymentIntentId = null;
    let receiptUrl = null;

    if (paymentMethod === 'card') {
      // Handle Stripe payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'usd',
        customer: stripeCustomerId,
      });

      paymentIntentId = paymentIntent.id;
      receiptUrl = paymentIntent.charges.data[0].receipt_url;
      status = 'paid';

    } else if (paymentMethod === 'invoice') {
      // Handle invoice payments (e.g., generate an invoice)
      // Add the products as invoice items
      console.log('Create invoice items'); // Log the create invoice
      for (let product of products) {
        await stripe.invoiceItems.create({
          customer: stripeCustomerId,
          amount: product.price * product.quantity,
          currency: 'usd',
          description: product.description
        });
      }
      console.log('Create the invoice'); // Log the create invoice
      
      const calculatedTotalAmount = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

      // Create the invoice
      
      const invoice = await stripe.invoices.create({
        customer: stripeCustomerId,
        collection_method: 'send_invoice', // the invoice will be sent to the customer's email
        days_until_due: 30 // the invoice will be due in 30 days
      });
      /* console.log('Invoice created:', invoice);  */
      console.log('closing invoice and create order'); 
      const order = new Order({
        stripeCustomerId,
        customer: customer._id, // Set customer reference from your database
        products,
        totalAmount: calculatedTotalAmount,
        status: 'pending',
        paymentMethod,
        invoiceId: invoice.id,
      });
      console.log('saving order'); 
      await order.save();
      res.status(201).json({ message: 'Order created successfully' });
    } else if (paymentMethod === 'bankTransfer') {
      // Use Stripe's support for ACH bank transfers (this example is simplified)
      const paymentIntent = await stripe.paymentIntents.create({
        payment_method_types: ['ach_credit_transfer'],
        amount: totalAmount,
        currency: 'usd',
        customer: stripeCustomerId,
        transfer_data: {
          destination: '<your_stripe_bank_account_id>',
        },
      });
      console.log('new order:'); // Log the order before saving it
      const order = new Order({
        stripeCustomerId,
        customer: customer._id, // Set customer reference from your database
        products,
        totalAmount,
        status: 'pending',
        paymentMethod,
      });

      await order.save();
      res.status(201).json({ message: 'Order created successfully', order });


    }

      /* console.log('Payment intent created:', paymentIntent); // Log the payment intent */ 
      console.log('Closing'); 
      /* const order = new Order({
        stripeCustomerId: stripeCustomerId,
        customer: '64882b5df29a813aacc9f238',
        products,
        totalAmount,
        status: 'pending',
        paymentMethod,
        invoiceId: invoice.id,
      }); */

      /* await order.save();

      console.log('Order saved successfully.'); // Log success message
      
    res.status(201).json({ message: 'Order created successfully', order }) */;

  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// Add more routes for managing orders (e.g., update, delete, get) if necessary

module.exports = router;
