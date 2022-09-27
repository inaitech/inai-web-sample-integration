import {
  amount,
  backendUrl,
  country,
  currency,
  customerId,
  failureRedirect,
  successRedirect
} from "./constants";

const headers = {
  'Content-Type': 'application/json'
};

const createOrder = () => {
  const url = `${backendUrl}/v1/orders`;

  const data = {
    amount: amount,
    country: country,
    currency: currency,
    customer: {
      id: customerId,
    },
    additional_info: {
      success_redirect: successRedirect,
      failure_redirect: failureRedirect
    }
  }
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers,
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  })
    .then(res => res.json())
};

export {
  createOrder,
}
