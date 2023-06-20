const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  stripeCustomerId: {
    type: String,
    required: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  products: [
    {
      // Your product schema (e.g. productId, quantity, etc.)
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  invoiceId: String,
  paymentIntentId: String,
  receiptUrl: String
});

module.exports = mongoose.model('Order', orderSchema);
