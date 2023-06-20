// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const requestProduct = require('../request_product_service/requestProduct');
const customerService = require('../create_customer_service/customerService');
const orderService = require('../create_order_service/orderService');
// Import your routes
const productRoutes = require('./routes/productRoutes');
/* const userRoutes = require('./routes/userRoutes'); */
/* const orderRoutes = require('./routes/orderRoutes');
 */
/* const customerRouter = require('./routes/customerRouter');
const orderRouter = require('./routes/orderRouter');  */


app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON body parsing
app.use('/api/requestProduct', requestProduct);
app.use('/api/customers', customerService);
app.use('/api/orders', orderService);

// Connect to the MongoDB database at mongodb://localhost:27017
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connected successfully");
});



// Use your routes
app.use('/api/products', productRoutes);
/* app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes); */
/* app.use('/api/customers', customerRouter);
app.use('/api/orders', orderRouter); */
app.post('/api/import', async (req, res) => {
  const { url, consumerKey, consumerSecret } = req.body;
  try {
      const response = await axios.post('http://localhost:3001/import', {
          url,
          consumer_key: consumerKey,
          consumer_secret: consumerSecret,
      });
      res.status(200).json(response.data);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});