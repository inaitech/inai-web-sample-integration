const serverUrl = "http://localhost:5999";
const token = "<token>";
const country = "<country>";
const customerId = "<customerId>";
const currency = "<currency>";
const amount = "<amount>";

// utility to create a HTML DOM element
const createElement = (tag, id) => {
  const elem = document.createElement(tag);
  if (!!id) {
    elem.id = id;
  }
  return elem;
};

function DisplaysavedPaymentMethods() {
  fetch(`${serverUrl}/v1/customers/${customerId}/payment-methods`)
    .then((response) => response.json())
    .then((data) => {
      let savedMethods = (data.payment_methods)
      savedMethods.forEach(option => {
        let main_div = document.createElement("div");
        main_div.classList.add('payment-method-button');
        let card_type = document.createElement("div");
        let lastd = document.createElement("div");
        lastd.textContent = "-";
        card_type.textContent = option.card.brand;
        let last_four = document.createElement("div");
        last_four.textContent = option.card.last_4;
        const card_img = document.createElement("img");
        card_img.src = `../assets/images/${option.type}.svg`;
        main_div.append(card_img, card_type, lastd, last_four)

        let saved_methods = document.getElementById("saved_methods");
        saved_methods.append(main_div);
        main_div.onclick = () => {
          let paymentId = option.id;
          savedPayment(paymentId);
          saved_methods.classList.add('hide')
          const payment_container = document.getElementById("payment-methods-container");
          payment_container.classList.remove('hide');
        }
      })
      function savedPayment(paymentId) {
        const url = `${serverUrl}/v1/orders`;
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            amount,
            currency,
            customer: {
              id: customerId
            }
          })
        };
        fetch(url, options)
          .then((response) => response.json())
          .then((data) => {
            let orderId = (data.id);
            fetch(`${serverUrl}/v1/payment-method-options?country=${country}&saved_payment_method=true&order_id=${orderId}`)
              .then((response) => response.json())
              .then((paymentData) => {
                let paymentOptions = (paymentData.payment_method_options);
                // holds state of currently chosen payment
                let selectedPaymentMethodOption = null;

                // toggle method that toggles the payment method fields when 
                const togglePaymentMethodFormFields = (fieldsContainer) => {
                  fieldsContainer.style.height = fieldsContainer.style.height === 'auto' ? '0px' : 'auto';
                  fieldsContainer.style.overflow = fieldsContainer.style.overflow === 'auto' ? 'hidden' : 'auto';
                }
                // resets previously chosen payment method's selection state
                const resetPaymentMethodSelection = () => {
                  const selectedPaymentMethods = document.getElementsByClassName('selected');
                  for (let selectedPaymentMethod of selectedPaymentMethods) {
                    selectedPaymentMethod.classList.remove('selected');
                  }
                  const selectedFieldContainers = document.getElementsByClassName('toggle-transition');
                  for (let selectedFieldContainer of selectedFieldContainers) {
                    selectedFieldContainer.style.height = '0px';
                    selectedFieldContainer.style.overflow = 'hidden';
                  }
                }
                // input field on change listener to get card
                // info based on card number
                const inputChangeListener = (fieldName, event) => {
                  const cardNumber = event.target.value;
                  if (fieldName !== 'number') {
                    return
                  }
                  // method to get card details
                  inaiInstance.getCardInfo(cardNumber)
                    .then(cardDetails => {
                      console.log(cardDetails);
                    })
                    .catch(error => {
                      console.error(error);
                    })
                }

                paymentOptions.forEach(option => {
                  const rail = option.rail_code;
                  const fields = option.form_fields;
                  const railContainer = createElement('div', rail);
                  const railButton = createElement('button', `${rail}-payment`);
                  railButton.classList.add('payment-method-button');
                  const logoElem = createElement('span');
                  logoElem.innerText = rail;
                  railButton.appendChild(logoElem)
                  railContainer.appendChild(railButton);

                  const fieldsContainer = createElement('div', `${rail}-fields-container`);
                  fieldsContainer.setAttribute('data-rail-fields', rail)
                  fieldsContainer.classList.add('toggle-transition')
                  railButton.onclick = () => {
                    resetPaymentMethodSelection()
                    selectedPaymentMethodOption = rail;
                    railButton.classList.add('selected');
                    togglePaymentMethodFormFields(fieldsContainer);
                  }

                  // adds payment method option related form fields to the DOM
                  fields.forEach(field => {
                    const fieldName = field.name;
                    const validations = field.validations;
                    const fieldType = field.field_type;
                    const isRequired = field.required;

                    const labelField = createElement('label', fieldName);
                    const labelText = createElement('span');
                    labelText.innerText = field.label;
                    const fieldInput = createElement('input', fieldName);
                    fieldInput.classList.add(`${rail}_${fieldName}`);
                    fieldInput.oninput = (event) => {
                      const input_box = document.getElementsByClassName(`${rail}_${fieldName}`)[0];
                      if (!validateField(event.target.value, validations)) {
                        input_box.classList.add('invalid');
                        input_box.classList.remove('valid');
                      }
                      else {
                        input_box.classList.add('valid');
                        input_box.classList.remove('invalid');
                      }
                      if (fieldName === "expiry") {
                        if (String(event.target.value).length === 2) {
                          event.target.value += "/"
                        }
                      }
                    }
                    fieldInput.onchange = (event) => {
                      inputChangeListener(fieldName, event)
                    }
                    fieldInput.required = isRequired;
                    fieldInput.placeholder = field.placeholder;
                    fieldInput.classList.add('payment-input');
                    fieldInput.setAttribute('data-name', fieldName);

                    if (isRequired) {
                      labelText.classList.add('required')
                    }

                    if (fieldType === "textfield") {
                      labelField.appendChild(labelText);
                      labelField.appendChild(fieldInput);
                      fieldsContainer.appendChild(labelField);
                    } else if (fieldType === "checkbox") {
                      fieldInput.type = "checkbox";
                      labelField.appendChild(fieldInput);
                      labelField.appendChild(labelText);
                      fieldsContainer.appendChild(labelField);
                    }
                  });
                  railContainer.appendChild(fieldsContainer);
                  document.getElementById('payment-methods-container').appendChild(railContainer);
                })

                const checkoutBtn = createElement('button', 'checkout-cta');
                checkoutBtn.innerText = 'Checkout';
                document.getElementById('payment-methods-container').appendChild(checkoutBtn);

                // on click listener for checkout button
                checkoutBtn.onclick = () => {
                  let inaiInstance = window.inai.create({
                    token: token,
                    orderId: orderId,
                    countryCode: country,
                  });
                  const fieldsArray = []
                  const paymentMethodFieldsContainer = document.querySelectorAll(`[data-rail-fields=${selectedPaymentMethodOption}]`)[0];
                  const paymentInputs = paymentMethodFieldsContainer.getElementsByClassName('payment-input');
                  for (let paymentInput of paymentInputs) {
                    const formInputDetails = {
                      name: paymentInput.getAttribute("data-name"),
                      value: isCheckbox ? paymentInput.checked : paymentInput.value
                    }
                    fieldsArray.push(formInputDetails)
                  }
                  const paymentDetails = {
                    fields: fieldsArray,
                    "paymentMethodId": paymentId
                  }
                  // method to invoke payment with a payment method option
                  // value and the associated payment field input details
                  inaiInstance.makePayment(selectedPaymentMethodOption, paymentDetails)
                    .then((res) => {
                      alert(JSON.stringify(res))
                    }).catch((error) => {
                      alert(JSON.stringify(error))
                    });
                }
              });
          });
      }
    });
}
DisplaysavedPaymentMethods();
