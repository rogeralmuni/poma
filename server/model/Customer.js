const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  stripeCustomerId: { // New field for Stripe Customer ID
    type: String,
    required: false
  }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
