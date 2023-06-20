const express = require('express');
const axios = require('axios');
const { Customer } = require('../server/model/customer');
const { Product } = require('../server//model/product');
require('dotenv').config();

const app = express();

app.use(express.json());

const getGPTResponse = async (emailBody) => {
    try {
        // Define the API endpoint
        const endpoint = 'https://api.openai.com/v1/engines/davinci/completions';

        // Define the prompt for GPT-3, which in this case is the emailBody
        const prompt = emailBody;

        // Define the payload
        const payload = {
            prompt: prompt,
            max_tokens: 100, // You can adjust this
            n: 1
        };

        // Define the headers, including the API key
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Make sure to set OPENAI_API_KEY in your .env file
        };

        // Make the POST request to OpenAI's GPT-3 API
        const response = await axios.post(endpoint, payload, { headers: headers });

        // Extract the response from GPT-3
        const gptResponse = response.data.choices[0].text;

        // Parse the GPT response into JSON
        const parsedResponse = JSON.parse(gptResponse);

        // Return the parsed response
        return parsedResponse;

    } catch (error) {
        console.error('Error fetching GPT-3 response:', error);
        return null;
    }
};

const getCustomerIdByEmail = async (email) => {
  // Find the customer in the database using the email address
  const customer = await Customer.findOne({ email });
  return customer ? customer._id : null;
};

const areProductsValid = async (products) => {
  // Check if all product IDs exist in the database
  for (let product of products) {
    const foundProduct = await Product.findById(product.id);
    if (!foundProduct) {
      return false;
    }
  }
  return true;
};

app.post('/processEmail', async (req, res) => {
  try {
    const { email, emailBody } = req.body;
    
    // Get the GPT response
    const gptResponse = await getGPTResponse(emailBody);

    // Extract the order data
    const orderData = gptResponse; // or extract further if needed

    // Get customer ID from email
    const customerId = await getCustomerIdByEmail(email);

    // If customer not found, return an error
    if (!customerId) {
      return res.status(400).json({ message: 'Customer not found' });
    }

    // Check if products are valid
    if (!await areProductsValid(orderData.products)) {
      return res.status(400).json({ message: 'Invalid products in the order' });
    }

    // Construct the order object
    const order = {
      customer: customerId,
      products: orderData.products,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod,
      // Add any other necessary fields
    };

    // Use Order Service to create the order
    const orderServiceResponse = await axios.post('http://localhost:3000/api/orders/new', order);

    // Return the response from the Order Service
    res.status(201).json(orderServiceResponse.data);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error processing email', error });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Email Processing Service is running on port ${port}`);
});
