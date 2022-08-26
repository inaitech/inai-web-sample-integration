# inai Checkout

## Overview
This repository demonstrates how to integrate Inai’s web dropin-checkout sdk into your vanilla JS project.

## Features
### Dropin Checkout
- Make a payment with variety of payment method options
    - Folder : /inai-web-sample-integration/dropin-checkout/client/vanilla

## Prerequisites
- To begin, you will require the inai merchant dashboard credentials, client username and client password values. Instructions to get these can be found [here](https://docs.inai.io/docs/getting-started)
- Make sure the following steps are completed in the merchant dashboard,
  - [Adding a Provider](https://docs.inai.io/docs/adding-a-payment-processor)
  - [Adding Payment Methods](https://docs.inai.io/docs/adding-a-payment-method)
  - [Customizing Checkout](https://docs.inai.io/docs/customizing-your-checkout)

### Minimum Requirements
IDE, NodeJs & yarn

## Setup
To setup the inai sample app for <platform>, follow the steps below,
1. `git clone https://github.com/inaitech/inai-web-sample-integration.git`
2. cd `/inai-web-sample-integration/dropin-checkout/server/node` and if .env file is not present, then create it with below mentioned variables and their corresponding values:
    - client_username=<inai-merchant-dashboard-credential-username>
    - client_password=<inai-merchant-dashboard-credential-password>
    - amount=100
    - currency=INR
3. Run commands`yarn install` to install dependencies & then `yarn start` to the start the server.
4. Navigate to `/inai-web-sample-integration/dropin-checkout/client/vanilla/pages/checkout.html` and update the value of external_id and token.
5. Navigate to `/inai-web-sample-integration/dropin-checkout/client/vanilla/index.html` and Go Live to run your frontend server.

## FAQs
<TBA>

## Support
Inai web sdk reference docs available [here](https://docs.inai.io/docs/headless-checkout).
If you found a bug or want to suggest a new [feature/use case/sample], please contact **[customer support](mailto:support@inai.io)**.
