# inai Checkout

## Overview
This repository demonstrates how to integrate inai’s Drop-in Checkout into your React JS project.

## Features
### Dropin Checkout
- Make a payment with variety of payment method options
    - File : [inai-web-sample-integration/dropin-checkout/client/react/inai-drop-in/](https://github.com/inaitech/inai-web-sample-integration/tree/main/dropin-checkout/client/react/inai-drop-in)

## Prerequisites
- To begin, you will require the client username and client password values. Instructions to get these can be found [here](https://docs.inai.io/docs/getting-started)
- Make sure the following steps are completed in the merchant dashboard,
  - [Adding a Provider](https://docs.inai.io/docs/adding-a-payment-processor)
  - [Adding Payment Methods](https://docs.inai.io/docs/adding-a-payment-method)
  - [Customizing Checkout](https://docs.inai.io/docs/customizing-your-checkout)

### Minimum Requirements
http-server

## Setup
To setup the inai sample app in React JS, follow the steps below,
1. Clone [inai-web-sample-integration](https://github.com/inaitech/inai-web-sample-integration) repo
`git clone git@github.com:inaitech/inai-web-sample-integration.git`
2. Navigate to [dropin-checkout/server/node](https://github.com/inaitech/inai-web-sample-integration/tree/main/dropin-checkout/server/node) folder and follow the steps mentioned in the README.md to start the server
3. Run `yarn install` to install all the dev-dependencies.
4. Serve this backend server using the command `http-server`.
5. Open [Dropin checkout](https://github.com/inaitech/inai-web-sample-integration/tree/main/dropin-checkout/client/react/inai-drop-in) file.
6. Run `yarn install` to install all the dev-dependencies.
7. In the .env, update the following environment variables:-
- REACT_APP_INAI_TOKEN = 'inai-token'
- REACT_APP_COUNTRY = 'USA'
- REACT_APP_AMOUNT = 1000
- REACT_APP_CURRENCY = 'USD'

|         **variables**           |                    **description**                            |
|---------------------------------|---------------------------------------------------------------|
| REACT_APP_INAI_TOKEN            | client username under **Settings > Credentials** in dashboard |
| REACT_APP_AMOUNT                | amount of the order                                           |
| REACT_APP_CURRENCY              | currency of the order (ISO 3 digit currency code)             |
| REACT_APP_CUSTOMER_EXTERNAL_ID  | merchant's identifier of customer                             |
| REACT_APP_COUNTRY               | customer's location (ISO 3 digit country code)                |

8. Serve this client server using the command `yarn start`.

## FAQs
<TBA>

## Support
inai web sdk reference docs available [here](https://docs.inai.io/docs/self-checkout-with-inai).
If you find a bug or want to suggest a new [feature/use case/sample], please contact **[customer support](mailto:support@inai.io)**.
