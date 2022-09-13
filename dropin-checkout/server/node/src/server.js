const express = require('express');
const fetch = require('node-fetch');

// urls
let base_url = 'https://api.inai.io/v1';
let create_order_url = `${base_url}/orders`;

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
    try{
        const token = Buffer.from(`${process.env.client_username}:${process.env.client_password}`).toString('base64');
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






// listening to port
app.listen(port, () => console.log('listening to port', port));
