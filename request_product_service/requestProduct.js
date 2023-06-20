// requestProduct.js
const express = require('express');
const mongoose = require('mongoose');
const Product = require('../server/model/Product'); // Adjusted the path to correctly point to your Product model

const router = express.Router();

router.post('/', async (req, res) => {
    console.log("Entered the route handler");
  const { productList } = req.body;
/*   req.body.products.forEach(async (requestedProduct) => {
    let productInDatabase = await Product.findOne({ _id: requestedProduct.productId });
    if (!productInDatabase || productInDatabase.stock < requestedProduct.quantity) {
      return res.status(400).json({ message: `Product ${requestedProduct.productId} not available or not enough stock` });
    }
  */  
 if (!productList || productList.length === 0) {
    return res.status(400).json({ message: 'Product list is missing or empty' });
  }
  try {
    const products = await Product.find({ '_id': { $in: productList.map(product => product.id) } });

    const updatedProducts = products.map(product => {
      const requestProduct = productList.find(request => String(request.id) === String(product._id));
      // Log requestProduct to check its value
        console.log("requestProduct:", requestProduct);
      if (requestProduct) {
        if (requestProduct.quantity > product.stock) {
         throw new Error(`Insufficient stock for product ${product._id}`);
        }
         // Log before updating the stock
        console.log("Stock before:", product.stock);
        product.stock -= Number(requestProduct.quantity);
        } else {
            throw new Error(`Product ${product._id} not found in request`);
        }
        return product;
        });

    await Promise.all(updatedProducts.map(product => product.save()));

    res.json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
