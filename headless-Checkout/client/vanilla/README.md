# inai Checkout

## Overview
This repository demonstrates how to integrate Inai’s Headless-checkout into your vanilla js project.

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
2. Navigate to  `/headless-checkout/client/vanilla/.env` file and update the following values (if file is not there then create one):
   - CLIENT_USERNAME=<client username>
   - CLIENT_PASSWORD=<client password>
   - COUNTRY=<country>
   - AMOUNT=<amount>
   - CURRENCY=<currency>
   - PORT=<port>
   - CUSTOMER=<customer id> //for exsisting customers
   - EMAIL=<email> // for new customers
3. Navigate to  `/headless-checkout/client/vanilla/backend` folder   
3. Run command `yarn install` at the root level of the project to install the dependencies.
4. Open the index.js file `headless-checkout/client/vanilla/backend/index.js`,  and run `yarn run server` to start the server.
5. Now navigate to `/headless-checkout/client/vanilla` and open `index.html` with the help of `http-server`   
6. Now you can experience inai's headless checkout in vanilla js

## FAQs
<TBA>

## Support
Inai ios sdk reference docs available [here](https://docs.inai.io/docs/ios-native-sdk).
If you found a bug or want to suggest a new [feature/use case/sample], please contact **[customer support](mailto:support@inai.io)**.
