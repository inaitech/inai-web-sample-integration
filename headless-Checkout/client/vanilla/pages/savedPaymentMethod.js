//local-server url and token
//replace this url with your local-server url
const server = "http://localhost:8080";
//replace token with client id
const token = "sbx_ci_7kCbmGnJBYmC4TwUz1FA3FsWPnRKQG3gzCX4R87VDTsS";
const country = "USA";

function DisplaysavedPaymentMethods() {
  fetch(`${server}/saved`)
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
        const url = `${server}/checkout`;
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        };
        fetch(url, options)
          .then((response) => response.json())
          .then((res_data) => {
            let order_id = (res_data.id);
            fetch(`${server}/saved_payment-method-options?country=${country}&saved_payment_method=true&order_id=${order_id}`)
              .then((response) => response.json())
              .then((pay_data) => {
                let paymentOptions = (pay_data.payment_method_options);
                // holds state of currently chosen payment
                let selectedPaymentMethodOption = null;
                // utility to create a HTML DOM element
                const createElement = (tag, id) => {
                  const elem = document.createElement(tag);
                  if (!!id) {
                    elem.id = id;
                  }
                  return elem;
                };
                // toggle method that toggles the payment method fields when 
                // a payment method option button is clicked
                const togglePaymentMethodFormFields = (fieldsContainer) => {
                  fieldsContainer.style.height = fieldsContainer.style.height === 'auto' ? '0px' : 'auto';
                  fieldsContainer.style.overflow = fieldsContainer.style.overflow === 'auto' ? 'hidden' : 'auto';
                }
                // resets previously chosen payment method's selection state
                const resetPaymentMethodSelection = () => {
                  const selectedPaymentMethods = document.getElementsByClassName('selected');
                  for (selectedPaymentMethod of selectedPaymentMethods) {
                    selectedPaymentMethod.classList.remove('selected');
                  }
                  const selectedFieldContainers = document.getElementsByClassName('toggle-transition');
                  for (selectedFieldContainer of selectedFieldContainers) {
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
                  const railButton = createElement('button', `${rail}-button`);
                  railButton.classList.add('payment-method-button')
                  const logoElem = createElement('img', `${rail}-logo`)
                  logoElem.src = `../assets/images/${rail}.svg`;
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
                    const fieldName = field.name;
                    const fieldType = field.field_type;
                    const isRequired = field.required;
                    const labelField = createElement('label', fieldName);
                    const labelText = createElement('span');
                    labelText.innerText = field.label;
                    const fieldInput = createElement('input', fieldName);
                    fieldInput.oninput = (event) => {
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
                checkoutBtn.innerText = 'Checkout';
                document.getElementById('checkout-button-container').appendChild(checkoutBtn);

                // on click listener for checkout button
                checkoutBtn.onclick = () => {
                  let inaiInstance = window.inai.create({
                    token: token,
                    orderId: order_id,
                    countryCode: country,
                  });
                  const fieldsArray = []
                  const paymentMethodFieldsContainer = document.querySelectorAll(`[data-rail-fields=${selectedPaymentMethodOption}]`)[0];
                  const paymentInputs = paymentMethodFieldsContainer.getElementsByClassName('payment-input');
                  for (paymentInput of paymentInputs) {
                    const formInputDetails = {
                      name: paymentInput.getAttribute("data-name"),
                      value: paymentInput.value
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
