// This file demonstrates working of google pay with inai headless integration
// It is connected to dev inai checkout sdk. Flow is as follows,
// 1. Get payment method options
// 2. Init Google Pay and conditionally render Google Pay button based on `canMakePayments` value
// 3. Launch Google Pay when user clicks on Google Pay button
// 4. Invoke makePayment with google pay response object

const token = "<token>";
const serverUrl = "http://localhost:5999";

const updateResponse = (status, response) => {
  const responseContainer = document.getElementById('response-container')
  responseContainer.innerHTML = `
    <div style="padding: 16px">
    <div>Response Status: ${status}</div>
    <pre>Response: ${JSON.stringify(response, undefined, 2)}</pre>
    </div>
  `
};

const onGooglePaymentButtonClicked = (inaiInstance, googlePayRequestData) => {
  document.getElementById('response-container').textContent = '';
  inaiInstance.execute({
    action: 'launchGooglePay',
    googlePayRequestData,
  })
  .then(({response}) => {
      inaiInstance.makePayment('google_pay', {
        "google_pay": response,
      }).then(res => {
        console.log(res);
        updateResponse("SUCCESS", res);
      }).catch(err => {
        console.error(err)
        updateResponse("ERROR", err);
      })
  })
  .catch((err) => {
    console.error(err)
    updateResponse("ERROR", err.response);
  })
};

const processGpayCheckout = () => {
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
        const inaiInstance = window.inai.create({
          token: token,
          orderId: orderId,
          countryCode: country
        });
        inaiInstance.execute({
          action: 'initGooglePay',
          paymentMethodOptions: paymentData
        }).then(({response}) => {
          const { paymentsClient, canMakePayments } = response;
          if(canMakePayments) {
            const button = paymentsClient.createButton({onClick: () => onGooglePaymentButtonClicked(inaiInstance, response)}); 
            document.getElementById("button-container").appendChild(button);
          } else {
            updateResponse("ERROR", "Google Pay not supported");
          }
        }).catch((err) => {
          updateResponse("ERROR", err.response);
        })
      })
      .catch((err) => console.error(err));
  })
};

processGpayCheckout();
