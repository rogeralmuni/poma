const mongoose = require('mongoose');
const Product = require('./model/Product');

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = [
  {
    name: 'Product 1',
    description: 'Description 1',
    price: 10,
    stock: 15,
  },
  {
    name: 'Product 2',
    description: 'Description 2',
    price: 20,
    stock: 20,
  },
  {
    name: 'Product 3',
    description: 'Description 3',
    price: 30,
    stock: 5,
  },
  {
    name: 'Product 4',
    description: 'Description 4',
    price: 40,
    stock: 0,
  },
  {
    name: 'Product 5',
    description: 'Description 5',
    price: 50,
    stock: 25,
  },
  //...add more products as needed
];

Product.insertMany(products)
  .then(() => {
    console.log('Data Seeded');
    mongoose.connection.close();
  })
  .catch((error) => console.log(error));
