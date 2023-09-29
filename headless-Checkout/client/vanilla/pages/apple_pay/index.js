// This file demonstrates working of apple pay with inai headless integration
// It is connected to dev inai checkout sdk
// 1. Get payment method options
// 2. Get apple pay session payload with inai's execute interface by via `getApplePaySessionPayload` action
// 3. Create apple pay session instance
// 4. Begin apple pay session
// 5. Within `session.onvalidatemerchant`, call inai's execute interface and `validateMerchant` as action
// 6. Once user authorizes payment, invoke makePayment with apple pay response object

const updateResponse = (status, response) => {
  const responseContainer = document.getElementById('response-container')
  responseContainer.innerHTML = `
    <div style="padding: 16px">
    <div>Response Status: ${status}</div>
    <div>Response: ${JSON.stringify(response)}</div>
    </div>
  `
};

let inaiInstance;
let paymentMethodOptions;

const onApplePayButtonClicked = async () => {
  inaiInstance.execute({action: 'getApplePaySessionPayload', paymentMethodOptions})
    .then(({response: sessionPayload}) => {
      const session = new ApplePaySession(3, sessionPayload);
      session.onvalidatemerchant = () => {
        inaiInstance.execute({action: 'validateMerchant'})
          .then(({response: validationResponse}) => {
            session.completeMerchantValidation(validationResponse);
          })
          .catch((error) => {
            session.abort();
            console.log("Error in validating merchant", error);
            updateResponse("Error", error)
          });
      };

      session.onpaymentauthorized = async event => {
        inaiInstance.makePayment('apple_pay', {apple_pay: event})
          .then((response) => {
            const result = {
                "status": ApplePaySession.STATUS_SUCCESS
            };
            session.completePayment(result);
            updateResponse("Success", response);
          })
          .catch((error) => {
            const result = {
                "status": ApplePaySession.STATUS_FAILURE
            };
            session.completePayment(result);
            console.log(error);
            updateResponse("Error", error);
          });
      };

      session.oncancel = () => {
        updateResponse("Error", "Payment Session Cancelled");
      };

      session.begin();
    })
    .catch((error) => {
      updateResponse("Error", error);
    });
};

const processApplePayCheckout = () => {
  const amount = "1"
  const currency = "USD"
  const country = "USA";
  const externalId = "1"
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      amount,
      currency,
      country, 
      customer: {
        external_id: externalId
      }
    })
  };

  fetch(`${serverUrl}/v1/orders`, options)
  .then((response) => response.json())
  .then((data) => {
    let orderId = (data.id);
    fetch(`${serverUrl}/v1/payment-method-options?order_id=${orderId}&country=${country}`)
      .then((response) => response.json())
      .then((paymentData) => {
        inaiInstance = window.inai.create({
          token: token,
          orderId: orderId,
          countryCode: country
        });
        paymentMethodOptions = paymentData;
      })
      .catch((err) => console.error(err));
  })
};
