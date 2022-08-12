function saveApayment() {
  const url = "http://localhost:8080/create";
  const options = {
    method: "POST",
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      let order_id = (data.id);
      console.log(order_id)
      fetch(`http://localhost:8080/payment-method-options?order_id=${order_id}&country=USA`)
        .then((response) => response.json())
        .then((data) => {
          let paymentOptions = (data.payment_method_options);
          console.log(paymentOptions);
          // holds state of currently chosen payment
          // method option
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
          function validateField(value, validations) {
            if (value.length > 0) {
              // regex validation
              let didItPassRegexValidation;
              if (validations.pattern) {
                didItPassRegexValidation = new RegExp(validations.pattern).test(value)
              } else {
                didItPassRegexValidation = true;
              }
              if (!didItPassRegexValidation) return false;
              // min_length validation
              let didItPassMinLengthValidation;
              if (validations.min_length) {
                didItPassMinLengthValidation = value.length >= validations.min_length;
              } else {
                didItPassMinLengthValidation = true;
              }
              if (!didItPassMinLengthValidation) return false;
              // max_length validation
              let didItPassMaxLengthValidation;
              if (validations.max_length) {
                didItPassMaxLengthValidation = value.length <= validations.max_length;
              } else {
                return true;
              }
              return didItPassMaxLengthValidation ? true : false;
            }
            return true;
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

            // adds payment method option related
            // form fields to the DOM
            fields.forEach(field => {
              const fieldName = field.name;
              const fieldType = field.field_type;
              const validations = field.validations;
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
          });
          const checkoutBtn = createElement('button', 'checkout-cta');
          checkoutBtn.innerText = 'Add A Payment Method';
          document.getElementById('checkout-button-container').appendChild(checkoutBtn);

          // on click listener for checkout button
          checkoutBtn.onclick = () => {
            let inaiInstance = window.inai.create({
              token: "sbx_ci_7kCbmGnJBYmC4TwUz1FA3FsWPnRKQG3gzCX4R87VDTsS",
              orderId: order_id,
              countryCode: "USA",
            });
            const fieldsArray = []
            const paymentMethodFieldsContainer = document.querySelectorAll(`[data-rail-fields=${selectedPaymentMethodOption}]`)[0];
            const paymentInputs = paymentMethodFieldsContainer.getElementsByClassName('payment-input');
            for (paymentInput of paymentInputs) {
              const formInputDetails = {
                name: paymentInput.getAttribute("data-name"),
                value: paymentInput.value
              }

              fieldsArray.push(formInputDetails);


            }
            const save_card = {
              name: 'save_card',
              value: true
            }
            fieldsArray.push(save_card);
            const paymentDetails = {
              fields: fieldsArray
            }
            console.log(fieldsArray);

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
saveApayment();