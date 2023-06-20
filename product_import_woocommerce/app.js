const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json()); // Enable JSON body for incoming requests

app.post('/import', async (req, res) => {
  const { consumer_key, consumer_secret, store_url } = req.body;

  try {
    const response = await axios.get(`${store_url}/wp-json/wc/v3/products`, {
      params: {
        consumer_key: consumer_key,
        consumer_secret: consumer_secret,
      },
    });
  
    const products = response.data;
    // Import products into your database here

    res.json({ success: true, message: 'Products imported successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to import products' });
  }
});

app.listen(3001, () => {
  console.log('Product import service listening on port 3001');
});
