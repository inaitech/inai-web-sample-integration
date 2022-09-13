# inai Checkout

## Overview
This repository demonstrates how to integrate Inai’s web dropin-checkout sdk into your vanilla JS project.

## Features
### Dropin Checkout
- Make a payment with variety of payment method options
    - File : [/inai-web-sample-integration/dropin-checkout/client/vanilla/pages/checkout.html](https://github.com/inaitech/inai-web-sample-integration/blob/main/dropin-checkout/client/vanilla/pages/checkout.html)

## Prerequisites
- To begin, you will require the inai client username and client password values. Instructions to get these can be found [here](https://docs.inai.io/docs/getting-started)
- Make sure the following steps are completed in the merchant dashboard,
  - [Adding a Provider](https://docs.inai.io/docs/adding-a-payment-processor)
  - [Adding Payment Methods](https://docs.inai.io/docs/adding-a-payment-method)
  - [Customizing Checkout](https://docs.inai.io/docs/customizing-your-checkout)

### Minimum Requirements
http-server

## Setup
To setup the inai sample app in vanilla JS, follow the steps below,
1. `git clone git@github.com:inaitech/inai-web-sample-integration.git`
2. Navigate to `dropin-checkout/server/node` folder and follow the steps mentioned in the README.md to start the server
3. Open [/inai-web-sample-integration/dropin-checkout/client/vanilla/pages/checkout.html](https://github.com/inaitech/inai-web-sample-integration/blob/main/dropin-checkout/client/vanilla/pages/checkout.html) file and update the values of `amount`, `currency`, `external_id` and `token`.
4. Serve [index.html](/inai-web-sample-integration/dropin-checkout/client/vanilla/index.html) with http-server.

## FAQs
<TBA>

## Support
inai web sdk reference docs available [here](https://docs.inai.io/docs/self-checkout-with-inai).
If you find a bug or want to suggest a new [feature/use case/sample], please contact **[customer support](mailto:support@inai.io)**.
