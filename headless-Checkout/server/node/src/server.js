const express = require('express');
const fetch = require('node-fetch');

// urls
let base_url = 'https://api.inai.io/v1';
let create_order_url = `${base_url}/orders`;
let payment_method_options_url = `${base_url}/payment-method-options`;

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

// CRUD operations
// create an order
app.post('/v1/orders', async (req, res) => {
    try{
        const token = Buffer.from(`${process.env.client_username}:${process.env.client_password}`).toString('base64');
        req.body = {...req.body, amount: process.env.amount, currency: process.env.currency};
        const options = {
            method: 'POST',
            headers: {
                  Accept: 'application/json', 
                  'Content-Type': 'application/json',
                  Authorization: `Basic ${token}`
              },
            body : JSON.stringify(req.body)
          };
          const response = await fetch(create_order_url, options);
          const response_data = await response.json();
          if (response_data.message || response.status !== 201) {
            return res.status(400).json(response_data);
          }
          res.status(response.status).json(response_data);
    }catch(error){
        res.status(400).json(error);
    }
})

// get payment method options
app.get('/v1/payment-method-options', async (req, res) => {
    try{
        const { country, saved_payment_method, order_id } = req.query;
        const query = `?country=${country}&saved_payment_method=${saved_payment_method}&order_id=${order_id}`;
        let url = payment_method_options_url;
        url += query;
    
        const token = Buffer.from(`${process.env.client_username}:${process.env.client_password}`).toString('base64');
        const options = {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${token}`,
          }
        };
    
        const response = await fetch(url, options);
        const response_data = await response.json();
        if (response_data.message || response.status !== 200) {
          return res.status(400).json(response_data);
        }
        res.status(response.status).json(response_data);
      } catch (error) {
        res.status(400).json(error);
      }
})

// get customer's saved payment methods
app.get('/v1/customers/:customer_id/payment-methods', async (req, res) => {
  try{
    const { customer_id } = req.params;
    let customer_saved_payment_methods_url = `${base_url}/customers/${customer_id}/payment-methods`;
    const token = Buffer.from(`${process.env.client_username}:${process.env.client_password}`).toString('base64');
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${token}`,
      }
    };
    const response = await fetch(customer_saved_payment_methods_url, options);
    const response_data = await response.json();
    if(response.status !== 200){
      return res.status(response.status).json(response_data);
    }
    res.status(response.status).json(response_data);
  } catch (err) {
    res.status(400).json(err);
  }
})







// listening to port
app.listen(port, () => console.log('listening to port', port));
