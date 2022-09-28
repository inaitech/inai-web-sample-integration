import {
  amount,
  backendUrl,
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
    currency: currency,
    customer: {
      external_id: customerId,
    },
    additional_info: {
      success_redirect: successRedirect,
      failure_redirect: failureRedirect
    }
  }
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })
    .then(res => res.json())
};

export {
  createOrder,
}
