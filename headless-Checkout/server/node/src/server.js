const express = require('express');
const fetch = require('node-fetch');

// urls
const baseUrl = "https://api.inai.io/v1";
const ordersUrl = `${baseUrl}/orders`;
let paymentMethodOptionsUrl = `${baseUrl}/payment-method-options`;

// express app
const app = express();

// port
let port = 5999;

// cors
const cors = require('cors');

// dotenv
require('dotenv').config();

// global middlewares
app.use(cors());
app.use(express.json());

// create an order
app.post('/v1/orders', async (req, res) => {
  try {
    const token = Buffer.from(`${process.env.client_username}:${process.env.client_password}`).toString('base64');
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`
      },
      body: JSON.stringify(req.body)
    };

    const response = await fetch(ordersUrl, options);
    const responseData = await response.json();
    if (responseData.message || response.status !== 201) {
      return res.status(400).json(responseData);
    }
    res.status(response.status).json(responseData);
  } catch (error) {
    res.status(400).json(error);
  }
});

// get payment method options
app.get('/v1/payment-method-options', async (req, res) => {
  try {
    const { country, saved_payment_method = false, order_id } = req.query;

    const query = `?country=${country}&saved_payment_method=${saved_payment_method}&order_id=${order_id}`;

    const token = Buffer.from(`${process.env.client_username}:${process.env.client_password}`).toString('base64');
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${token}`,
      }
    };
    const response = await fetch(`${paymentMethodOptionsUrl}${query}`, options);
    const responseData = await response.json();
    if (responseData.message || response.status !== 200) {
      return res.status(400).json(responseData);
    }
    res.status(response.status).json(responseData);
  } catch (error) {
    res.status(400).json(error);
  }
});

// get Customer Payment methods
app.get('/v1/customers/:customerId/payment-methods', async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const customersUrl = `${baseUrl}/customers/${customerId}/payment-methods`;

    const token = Buffer.from(`${process.env.client_username}:${process.env.client_password}`).toString('base64');
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${token}`,
      }
    };

    const response = await fetch(customersUrl, options);
    const responseData = await response.json();

    if (responseData.message || response.status !== 200) {
      return res.status(400).json(responseData);
    }
    res.status(response.status).json(responseData);
  } catch (error) {
    res.status(400).json(error);
  }
});

// listening to port
app.listen(port, () => console.log('listening to port', port));