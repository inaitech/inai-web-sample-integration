
## Overview
This repository demonstrates how to integrate Inai’s web headless checkout sdk into your project.

## Features
### Headless Checkout
- Make a payment with variety of payment method options & also option of saving payment method as you pay
    - Folder : inai-web-sample-integration\headless-Checkout\client\react\headless-checkout\src\pages\make-payment
- Save a payment method
    - Folder : inai-web-sample-integration\headless-Checkout\client\react\headless-checkout\src\pages\save-payment-method
- Pay with a saved payment method
    - Folder : inai-web-sample-integration\headless-Checkout\client\react\headless-checkout\src\pages\pay-with-saved-payment-method
- Validate payment method details or fields
    - Folder : inai-web-sample-integration\headless-Checkout\client\react\headless-checkout\src\pages\validate-fields
- Get card information
    - Folder : inai-web-sample-integration\headless-Checkout\client\react\headless-checkout\src\pages\get-card-info
## Prerequisites
- To begin, you will require the inai merchant dashboard credentials, client username and client password values. Instructions to get these can be found [here](https://docs.inai.io/docs/getting-started)
- Make sure the following steps are completed in the merchant dashboard,
  - [Adding a Provider](https://docs.inai.io/docs/adding-a-payment-processor)
  - [Adding Payment Methods](https://docs.inai.io/docs/adding-a-payment-method)
  - [Customizing Checkout](https://docs.inai.io/docs/customizing-your-checkout)

### Minimum Requirements
NodeJS, npm & yarn

## Setup
To setup the inai sample app for <platform>, follow the steps below,
1. `git clone https://github.com/inaitech/inai-web-sample-integration.git`
2. cd `inai-web-sample-integration\headless-Checkout\server\node` and update the .env file variables run the server by running commands `yarn start`.
3. Navigate to `inai-web-sample-integration\headless-Checkout\client\react\headless-checkout` and create a .env file with the following variables and update its values :
   - REACT_APP_CLIENT_USERNAME   // inai merchant's credential username
   - REACT_APP_EXTERNAL_ID   // merchant's representation of customer
4. cd `inai-web-sample-integration\headless-Checkout\client\react\headless-checkout` and run commands `yarn install` and then `yarn start`.

## FAQs
<TBA>

## Support
Inai web sdk reference docs available [here](https://docs.inai.io/docs/headless-checkout).
If you found a bug or want to suggest a new [feature/use case/sample], please contact **[customer support](mailto:support@inai.io)**.
