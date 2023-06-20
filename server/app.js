const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const requestProduct = require('../request_product_service/requestProduct');
const customerService = require('./services/customerService');
const orderService = require('./services/orderService');
const app = express();

// Replace with your MongoDB connection string
const dbUri = 'mongodb://localhost:27017';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('Connected to db');
    app.listen(5000);  // You can use any free port
  })
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(cors());

app.use('/api/products', productRoutes);
/* app.use('/api/orders', orderRoutes); */
app.use('/api/users', userRoutes);
app.use('/api/requestProduct', requestProduct);
app.use('/api/customers', customerService);
app.use('/api/orders', orderService);

module.exports = app;
