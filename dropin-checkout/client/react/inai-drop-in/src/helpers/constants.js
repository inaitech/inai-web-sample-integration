const backendUrl = process.env.REACT_APP_BACKEND_URL;
const customerId = process.env.REACT_APP_CUSTOMER_ID;
const country = process.env.REACT_APP_COUNTRY;
const amount = process.env.REACT_APP_AMOUNT;
const successRedirect = process.env.REACT_APP_SUCCESS_REDIRECT;
const failureRedirect = process.env.REACT_APP_FAILURE_REDIRECT;
const currency = process.env.REACT_APP_CURRENCY;

export {
  backendUrl,
  customerId,
  country,
  amount,
  currency,
  successRedirect,
  failureRedirect
};
