import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SavePaymentMethod() {
    const backendHost = 'http://localhost:5999';
    // An ISO 3166-1 alpha-3 country code
    const country = "<country_code>";
    // merchant's representation of a customer
    const externalId = "<external_id>";
    // The amount of money, either a whole number or a number with up to 3 decimal places.
    const amount = "<amount>";
    // An ISO 4217 alpha currency code.
    const currency = "<currency_code>";
    // set capture_method to MANUAL while creating order for saving the payment method without charging
    const captureMethod = 'MANUAL';

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
    const shouldRenderPaymentMethodOptions = !error && !loading && paymentMethodOptions.length;
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({});
    const [orderId, setOrderId] = useState('');

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
                        external_id: externalId
                    }, 
                    capture_method: captureMethod
                })
            });
            const orderResponseData = await orderResponse.json();
            if (orderResponse.status !== 201) {
                // order creation unsuccessful!
                setLoading(false);
                setError(JSON.stringify(orderResponseData));
                return;
            }
            setOrderId(orderResponseData.id);

            // order creation successful // get payment method options
            const paymentMethodOptionsUrl = `${backendHost}/v1/payment-method-options?country=${country}&order_id=${orderResponseData.id}`;
            const paymentMethodOptionsResponse = await fetch(paymentMethodOptionsUrl);
            const paymentMethodOptionsResponseData = await paymentMethodOptionsResponse.json();
            if (paymentMethodOptionsResponse.status !== 200) {
                setLoading(false);
                setError(JSON.stringify(paymentMethodOptionsResponseData));
                return;
            }

            // now render payment method options
            setLoading(false);
            setPaymentMethodOptions([...paymentMethodOptionsResponseData.payment_method_options]);
        } catch(err) {
            setLoading(false);
            setError(JSON.stringify(err));
        }
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

    function save() {
        const paymentMethodOption = selectedPaymentMethod;
        const formattedPaymentDetails = {
            fields: []
        };
        let currentIndex = 0;
        for(let key in paymentDetails){
            formattedPaymentDetails.fields[currentIndex] = {
                name: key,
                value: paymentDetails[key].value
            }
            currentIndex++;
        }
        if (paymentMethodOption === 'card') {
            formattedPaymentDetails.fields.push({name: 'save_card',value: true});
        }
        // create new instance of inai checkout
        const inaiInstance = window.inai.create({
            token: process.env.REACT_APP_CLIENT_USERNAME,
            orderId: orderId,
            countryCode: country
        });

        // invoke payment
        inaiInstance.makePayment(paymentMethodOption, formattedPaymentDetails)
        .then((data) => {
            alert(JSON.stringify(data));
            navigate('/headless-checkout-options');
        })
        .catch((err) => {
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
            {shouldRenderPaymentMethodOptions ? (
                <div className="container w-20 flex flex-column gap-10">
                    {
                        paymentMethodOptions.map((option, i) => (
                            <div className="flex flex-column gap-10">
                                <div key={`payment-method-${i}`} id={option.rail_code} className="btn btn-1" onClick={() => {
                                    if (selectedPaymentMethod === option.rail_code) {
                                        setSelectedPaymentMethod(null);
                                        setPaymentDetails({});
                                    } else {
                                        setSelectedPaymentMethod(option.rail_code);
                                        // create new payment details as per payment method fields
                                        const newPaymentDetails = createInitialPaymentDetails(option.form_fields);
                                        setPaymentDetails({...newPaymentDetails}); // update as per newly selected payment method
                                    }
                                }} >
                                    {option.rail_code}
                                </div>
                                {(selectedPaymentMethod === option.rail_code) ? (option.form_fields.length && (
                                    <div className="flex flex-column gap-10 my-15">
                                        {option.form_fields.map((field, index) => (
                                            <div key={`field-${index}`} className="field flex flex-column gap-5">
                                                <label htmlFor={field.name}>
                                                    <span className="font-weight-bold">{field.label}</span>
                                                    {field.required ? (<span className="required-field-char">*</span>) : ''}
                                                </label>
                                                <input type={(field.field_type === 'textfield') ? 'text' : field.field_type} id={field.name} placeholder={field.placeholder} className={`input-entry ${!paymentDetails[field.name].value.length || paymentDetails[field.name].isValidated ? '' : 'invalid-entry'}`} value={paymentDetails[field.name].value} onChange={(e) => handleChange(e, field)} />
                                            </div>
                                        ))}
                                    </div>
                                )) || (
                                    <div className="text-align-center my-15">No fields to display!</div>
                                ) : null}
                            </div>
                        ))
                    }
                    <div className="btn btn-1 btn-bg-color-1 border-radius-1 my-3" onClick={save}>SAVE</div>
                </div>
            ) : null}
        </div>
    );
}
