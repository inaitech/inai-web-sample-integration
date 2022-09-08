# inai Checkout

## Overview
This repository demonstrates how to integrate Inai's Headless-checkout into your vanilla js project.

## Features
### Headless Checkout
- Make a payment with variety of payment methods
    - File : headless-checkout/client/vanilla/pages/makePayment.html
- Save a payment method
    - File : headless-checkout/client/vanilla/pages/savePayment.html
- Pay with a saved payment method
    - File : headless-checkout/client/vanilla/pages/savedPaymentMethod.html
- Validate Fields
    - File : headless-checkout/client/vanilla/pages/validateFields.html
- Get card Info
    - File : headless-checkout/client/vanilla/pages/getCardInfo.html    

## Prerequisites
- To begin, you will require the client username and client password values. Instructions to get this can be found [here](https://docs.inai.io/docs/getting-started)
- You need to install "http-server" to run the html files locally
    - Following are the steps to setup http-server
        1. Have Node.js installed in your system.
        2. In CMD, run the command npm install http-server -g
        3. Navigate to the specific path of your file folder in CMD and run the command http-server
        4. Go to your browserand type the server url to run the files 
- Make sure the following steps are completed in the merchant dashboard,
  - [Adding a Provider](https://docs.inai.io/docs/adding-a-payment-processor)
  - [Adding Payment Methods](https://docs.inai.io/docs/adding-a-payment-method)
  - [Customizing Checkout](https://docs.inai.io/docs/customizing-your-checkout)


## Setup
To setup the inai sample app for vanilla js, follow the steps below,
1. `git clone https://github.com/inaitech/inai-web-sample-integration`
2. Navigate to  `/headless-checkout/server/node` folder and follow the steps mentioned in the README.md to start the server
3. Open `makePayment.js` located under pages `pages`
4. Make sure `serverUrl` is points to the server running locally
5. Update `token` with the `client_username` value added in the `.env` for server
6. Update `country` with the your country of checkout
7. Update `externalCustomerId` with your customer identifier
8. Update `amount` for the order 
9. Update `currency` for the order 
10. Now navigate to `/headless-checkout/client/vanilla` and run a http-server of your choice to serve the client application

## FAQs
<TBA>

## Support
Inai ios sdk reference docs available [here](https://docs.inai.io/docs/headless-checkout).
If you found a bug or want to suggest a new [feature/use case/sample], please contact **[customer support](mailto:support@inai.io)**.