# inai Checkout

## Overview
This repository demonstrates how to integrate inai's Headless Checkout into your vanilla js project.

## Features
### Headless Checkout
- Make a payment with variety of payment methods
    - File : [headless-checkout/client/vanilla/pages/make-payment.html](https://github.com/inaitech/inai-web-sample-integration/blob/main/headless-Checkout/client/vanilla/pages/make-payment.html)
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
- Make sure the following steps are completed in the merchant dashboard,
  - [Adding a Provider](https://docs.inai.io/docs/adding-a-payment-processor)
  - [Adding Payment Methods](https://docs.inai.io/docs/adding-a-payment-method)
  - [Customizing Checkout](https://docs.inai.io/docs/customizing-your-checkout)


## Setup
To setup the inai sample app for vanilla js, follow the steps below,
1. Clone [inai-web-sample-integration](https://github.com/inaitech/inai-web-sample-integration) repo
`git clone git@github.com:inaitech/inai-web-sample-integration.git`
2. Navigate to [headless-Checkout/server/node](https://github.com/inaitech/inai-web-sample-integration/tree/main/headless-Checkout/server/node) folder and follow the steps mentioned in the README.md to start the server
3. Open [makePayment.js](https://github.com/inaitech/inai-web-sample-integration/blob/main/headless-Checkout/client/vanilla/pages/makePayment.js) located under `pages`
4. Make sure `serverUrl` points to the server running locally
5. Update the values of `token`, `country`, `externalId`, `amount` and `currency`.

| **variables** | **description**                                               |
|---------------|---------------------------------------------------------------|
| _token_       | client username under **Settings > Credentials** in dashboard |
| _country_     | country of checkout                                           |
| _externalId_  | merchant's identifier of customer                             |
| _amount_      | amount of the order                                           |
| _currency_    | currency of the order                                         |

6. Serve [index.html](https://github.com/inaitech/inai-web-sample-integration/blob/main/headless-Checkout/client/vanilla/index.html) with http-server.

## FAQs
<TBA>

## Support
Inai Headless Checkout SDK reference docs available [here](https://docs.inai.io/docs/headless-checkout).
If you find a bug or want to suggest a new [feature/use case/sample], please contact **[customer support](mailto:support@inai.io)**.
