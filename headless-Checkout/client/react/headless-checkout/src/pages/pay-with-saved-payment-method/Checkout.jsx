import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientUserName, backendHost, country, externalId, amount, currency } from "../../helpers/constants";

export default function Checkout() {
    const savedPaymentMethod = true;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [paymentMethodOptionsObj, setPaymentMethodOptionsObj] = useState({});
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({});
    const [orderId, setOrderId] = useState('');
    const [customerSavedPaymentMethods, setCustomerSavedPaymentMethods] = useState([]);
    const shouldRendercustomerSavedPaymentMethods = !error && !loading && customerSavedPaymentMethods.length;

    const getPaymentMethods = async () => {
        try{
            // create order
            const orderResponse = await fetch(`${backendHost}/v1/orders`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json', 
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    amount, 
                    currency,
                    customer: {
                        external_id: externalId // merchant's representation of a customer
                    }
                })
            });
            const orderResponseData = await orderResponse.json();
            setLoading(false);
            if (orderResponse.status !== 201) {
                // order creation unsuccessful!
                setError(JSON.stringify(orderResponseData));
                return;
            }
            setOrderId(orderResponseData.id);

            // order creation successful // now get customer's saved payment methods and render them 
            const customerSavedPaymentMethodsUrl = `${backendHost}/v1/customers/${orderResponseData.customer_id}/payment-methods`;
            const customerSavedPaymentMethodsRes = await fetch(customerSavedPaymentMethodsUrl);
            const customerSavedPaymentMethodsResData = await customerSavedPaymentMethodsRes.json();
            setCustomerSavedPaymentMethods(customerSavedPaymentMethodsResData.payment_methods);

            // get payment method options with saved_payment_method set to true (to display fields to be filled by customer when any saved payment method option is selected for payment)
            const paymentMethodOptionsUrl = `${backendHost}/v1/payment-method-options?country=${country}&saved_payment_method=${savedPaymentMethod}&order_id=${orderResponseData.id}`;
            const paymentMethodOptionsResponse = await fetch(paymentMethodOptionsUrl);
            const paymentMethodOptionsResponseData = await paymentMethodOptionsResponse.json();
            setLoading(false);
            if (paymentMethodOptionsResponse.status !== 200) {
                setError(JSON.stringify(paymentMethodOptionsResponseData));
                return;
            }

            // update states
            setPaymentMethodOptionsObj(createPaymentMethodOptionsObj(paymentMethodOptionsResponseData.payment_method_options));
        } catch(err) {
            setError(err.message);
        }
    }

    const createPaymentMethodOptionsObj = (paymentMethodOptions) => {
        const obj = {};
        for (let option of paymentMethodOptions) {
            obj[option.rail_code] = option;
        }
        return obj;
    }

    function createInitialPaymentDetails(fields) {
        const newPaymentDetails = {};
        for(let field of fields){
            newPaymentDetails[field.name] = {
                value: '',
                isValidated: false
            }
        }
        return newPaymentDetails;
    }

    function validateField(value, validations) {
        if(value.length > 0){
            // regex validation
            let didItPassRegexValidation;
            if(validations.pattern){
                didItPassRegexValidation = new RegExp(validations.pattern).test(value)
            } else {
                didItPassRegexValidation = true;
            }
            if(!didItPassRegexValidation) return false;

            // min_length validation
            let didItPassMinLengthValidation;
            if(validations.min_length){
                didItPassMinLengthValidation = value.length >= validations.min_length;
            } else {
                didItPassMinLengthValidation = true;
            }
            if(!didItPassMinLengthValidation) return false;

            // max_length validation
            let didItPassMaxLengthValidation;
            if(validations.max_length){
                didItPassMaxLengthValidation = value.length <= validations.max_length;
            } else {
                return true;
            }
            return didItPassMaxLengthValidation ? true : false;
        }
        return true;
    }

    function handleChange(e, field) {
        if(e.target.id === 'save_card')
        {
            setPaymentDetails({...paymentDetails, [e.target.id] : {value: e.target.checked}});
        } else {
            let fieldAfterValueUpdate;
            let inputEntry = e.target.value;
            if(e.target.id === 'expiry' && !inputEntry.includes('/') && inputEntry.length === 2 && e.nativeEvent.data) {
                fieldAfterValueUpdate = {...paymentDetails[e.target.id], value: `${e.target.value}/`};
            } else {
                fieldAfterValueUpdate = {...paymentDetails[e.target.id], value: e.target.value};
            }

            const fieldAfterValidation = {...fieldAfterValueUpdate, isValidated: validateField(fieldAfterValueUpdate.value, field.validations)}

            setPaymentDetails({...paymentDetails, [e.target.id]: fieldAfterValidation});
        }
    }

    function handleCheckout() {
        const paymentMethodOption = selectedPaymentMethod || 'card';
        const formattedPaymentDetails = {
            fields: [],
            paymentMethodId: selectedPaymentMethodId
        };
        let currentIndex = 0;
        for(let key in paymentDetails){
            formattedPaymentDetails.fields[currentIndex] = {
                name: key,
                value: paymentDetails[key].value
            }
            currentIndex++;
        }

        
        // create new instance of inai checkout
        const inaiInstance = window.inai.create({
            token: clientUserName,
            orderId: orderId,
            countryCode: country,
            redirectUrl: '',
            locale: ''
        });

        // invoke payment
        inaiInstance.makePayment(paymentMethodOption, formattedPaymentDetails)
        .then(data => {
            alert(JSON.stringify(data));
            navigate('/headless-checkout-options');
        })
        .catch(err => {
            alert(JSON.stringify(err));
        })
    }

    useEffect(() => {
        getPaymentMethods();
    }, []);

    return (
        <div>
            <div className="font-weight-bold text-align-center mt-4">Payment Options</div>
            {loading ? (
                <div className="container w-20 text-align-center">loading...</div>
            ) : null}
            {error ? (
                <div className="container w-20 text-align-center">{error}</div>
            ) : null}
            {shouldRendercustomerSavedPaymentMethods ? (
                <div className="container w-20 flex flex-column gap-10">
                    {
                        customerSavedPaymentMethods.map((paymentMethod, i) => (
                            <div className="flex flex-column gap-10">
                                <div key={`payment-method-${i}`} id={paymentMethod.id} className="btn btn-1" onClick={() => {
                                    if (selectedPaymentMethodId === paymentMethod.id) {
                                        setSelectedPaymentMethod(null);
                                        setSelectedPaymentMethodId(null);
                                        setPaymentDetails({});
                                    } else {
                                        setSelectedPaymentMethod(paymentMethod.type);
                                        setSelectedPaymentMethodId(paymentMethod.id);
                                        // create new payment details as per selected saved payment method
                                        const newPaymentDetails = createInitialPaymentDetails(paymentMethodOptionsObj[paymentMethod.type].form_fields);
                                        // updates as per newly selected payment method option
                                        setPaymentDetails({...newPaymentDetails});
                                    }
                                }} >
                                    {`${paymentMethod.type} ${paymentMethod[paymentMethod.type].brand} ${paymentMethod[paymentMethod.type].last_4}`}
                                </div>
                                {(selectedPaymentMethodId === paymentMethod.id) && paymentMethodOptionsObj[paymentMethod.type].form_fields.length ? (
                                    <div className="flex flex-column gap-10 my-15">
                                        {paymentMethodOptionsObj[paymentMethod.type].form_fields.map((field, index) => (
                                            <div key={`field-${index}`} className="field flex flex-column gap-5">
                                                <label htmlFor={field.name}>
                                                    <span className="font-weight-bold">{field.label}</span>
                                                    {field.required ? (<span className="required-field-char">*</span>) : ''}
                                                </label>
                                                <input type={(field.field_type === 'textfield') ? 'text' : field.field_type} id={field.name} placeholder={field.placeholder} className={`input-entry ${!paymentDetails[field.name].value.length || paymentDetails[field.name].isValidated ? '' : 'invalid-entry'}`} value={paymentDetails[field.name].value} onChange={(e) => handleChange(e, field)} />
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                                {((selectedPaymentMethodId === paymentMethod.id) && !paymentMethodOptionsObj[paymentMethod.type].form_fields.length) ? (
                                    <div className="text-align-center my-15">No fields to display!</div>
                                ) : null}
                            </div>
                        ))
                    }
                    <div className="btn btn-1 btn-bg-color-1 border-radius-1 my-3" onClick={handleCheckout}>CHECKOUT</div>
                </div>
            ) : null}
        </div>
    );
}
