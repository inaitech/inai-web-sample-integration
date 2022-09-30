const serverUrl = "http://localhost:5999";
const token = "<token>";
const country = "<country>";
const externalId = "<externalId>";
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

function payment() {
  const payment_container = document.getElementById("payment-methods-container");
  const checkout_container = document.getElementById("checkout-button-container");
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
        external_id: externalId
      }
    })
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      let orderId = (data.id);
      fetch(`${serverUrl}/v1/payment-method-options?country=${country}&order_id=${orderId}`)
        .then((response) => response.json())
        .then((paymentdata) => {
          payment_container.classList.remove('hide');
          checkout_container.classList.remove('hide');
          let paymentOptions = (paymentdata.payment_method_options);
          // holds state of currently chosen payment method option
          let selectedPaymentMethodOption = null;
          // toggle method that toggles the payment method fields 
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
          const validateField = (value, validations) => {
            if (value.length > 0) {
              // regex validation
              let isValidFormat = true;
              if (validations.pattern) {
                isValidFormat = new RegExp(validations.pattern).test(value)
              }

              // min_length validation
              let isValidMinLength = true;
              if (validations.min_length) {
                isValidMinLength = value.length >= validations.min_length;
              }

              // max_length validation
              let isValidMaxLength = true;
              if (validations.max_length) {
                isValidMaxLength = value.length <= validations.max_length;
              }
              return isValidFormat && isValidMinLength && isValidMaxLength;
            }
            return true;
          }

          paymentOptions.forEach(option => {
            const rail = option.rail_code;
            const fields = option.form_fields;
            const railContainer = createElement('div', rail);
            const railButton = createElement('button', `${rail}-button`);
            railButton.classList.add('payment-method-button')
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
            // adds payment method options
            fields.forEach(field => {
              const validations = field.validations;
              const fieldName = field.name;
              const fieldType = field.field_type;
              const isRequired = field.required;

              const labelField = createElement('label', fieldName);
              const labelText = createElement('span');
              labelText.innerText = field.label;
              const fieldInput = createElement('input', fieldName);
              fieldInput.classList.add(`${rail}_${fieldName}`);
              fieldInput.oninput = (event) => {
                const input_box = document.getElementsByClassName(`${rail}_${fieldName}`)[0];
                if (!(validateField(event.target.value, validations))) {
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

              // if field is a required field,
              // adds styles for adding asterisk
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

          // renders payment method options and the associated fields

          const checkoutBtn = createElement('button', 'checkout-cta');
          checkoutBtn.innerText = 'Validate Fields';
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
                value: paymentInput.value
              }
              fieldsArray.push(formInputDetails)
            }
            const paymentDetails = {
              fields: fieldsArray
            }
            // method to invoke payment with a payment method option
            // value and the associated payment field input details
            inaiInstance.validateFields(selectedPaymentMethodOption, paymentDetails)
              .then((res) => {
                alert(JSON.stringify(res))
              }).catch((error) => {
                alert(JSON.stringify(error))
              });
          }
        });
    });
}
payment();



