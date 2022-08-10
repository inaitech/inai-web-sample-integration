const express = require("express");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
dotenv.config({path: '../.env'});

const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT
const user_name=process.env.CLIENT_USERNAME;
const pass = process.env.CLIENT_PASSWORD;
const amount=process.env.AMOUNT;
const email=process.env.EMAIL;
const currency=process.env.CURRENCY;
const customer=process.env.CUSTOMER;
const base = Buffer.from(`${user_name}:${pass}`).toString('base64');

const create_order_url = 'https://api.inai.io/v1/orders';
app.post("/checkout", async (req, res) => {
    console.log('Creating order');
    try{
       const options = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${base}`
  },
  body: JSON.stringify({customer: {id: customer}, amount, currency})
};
        const response = await fetch(create_order_url, options);
        const response_data = await response.json();
        res.status(response.status).send(response_data);
    }catch(error){
        console.log(error);
        res.send(error);
    }
});

app.post("/create", async (req, res) => {
    console.log('Creating order for saving a payment method');
    try{
  const options = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${base}`
  },
  body: JSON.stringify({ customer: {external_id: customer},   amount: '1',
    currency: currency, capture_method: 'MANUAL'})
};
        const response = await fetch(create_order_url, options);
        const response_data = await response.json();
        res.status(response.status).send(response_data);
    }catch(error){
        console.log(error);
        res.send(error);
    }
});

app.get("/payment-method-options",async(req,res)=>{
  console.log('Fetching Payment Method options');
  const { order_id, country } = req.query;
  console.log(order_id);
  try{
    const options={
        method:"GET",
    headers: {
    Authorization: `Basic ${base}`
  },
    };
        const response = await fetch(`https://api.inai.io/v1/payment-method-options?order_id=${order_id}&country=${country}`, options);
        const response_data = await response.json();
        res.status(response.status).send(response_data);
    }catch(error){
        console.log(error);
        res.send(error);
    } 
});

app.get("/saved_payment-method-options",async(req,res)=>{
  console.log('Fetching Payment Method options');
  const { order_id, country } = req.query;
  console.log(order_id);
  try{
    const options={
        method:"GET",
    headers: {
    Authorization: `Basic ${base}`
  },
    };
        const response = await fetch(`https://api.inai.io/v1/payment-method-options?country=${country}&saved_payment_method=true&order_id=${order_id}`, options);
        const response_data = await response.json();
        res.status(response.status).send(response_data);
    }catch(error){
        console.log(error);
        res.send(error);
    } 
});

app.get("/saved",async(req,res)=>{
  console.log('Fetching saved Payment Method options');
  try{
    const options={
    method:"GET",
    headers: {
    Authorization: `Basic ${base}`
  },
    };
        const response = await fetch(`https://api.inai.io/v1/customers/${customer}/payment-methods`, options);
        const response_data = await response.json();
        res.status(response.status).send(response_data);
    }catch(error){
        console.log(error);
        res.send(error);
    } 
});

app.listen(PORT, function(){
    console.log(`listening on port ${PORT}`)
});