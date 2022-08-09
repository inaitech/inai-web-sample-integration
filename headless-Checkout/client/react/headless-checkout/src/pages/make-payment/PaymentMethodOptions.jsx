import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentMethodOptions() {
    const create_order_url = 'http://localhost:5009/v1/order';
    let payment_method_options_url = 'http://localhost:5009/v1/payment-method-options';

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
            const order_response = await fetch(create_order_url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json', 
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    customer: {
                        email: 'test2@gmail.com'
                    }
                })
            });
            const order_response_data = await order_response.json();
            if (order_response.status !== 201) {
                // order creation unsuccessful!
                setLoading(false);
                setError(order_response_data.message);
                return;
            }
            setOrderId(order_response_data.id);

            // get payment method options // order creation successful
            const new_payment_method_options_url = payment_method_options_url + `?country=IND&saved_payment_method=false&order_id=${order_response_data.id}`;
            const payment_method_options_response = await fetch(new_payment_method_options_url);
            const payment_method_options_response_data = await payment_method_options_response.json();
            if (payment_method_options_response.status !== 200) {
                setLoading(false);
                setError(payment_method_options_response_data);
                return;
            }

            // now render payment method options
            setLoading(false);
            setPaymentMethodOptions([...payment_method_options_response_data.payment_method_options]);
        } catch(err) {
            setError(err.message);
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
        // implementation for validation left
        return true;
    }

    function handleChange(e, field) {
        if(e.target.id === 'save_card')
        {
            setPaymentDetails({...paymentDetails, [e.target.id] : {value: e.target.checked}});
        } else {
            const fieldAfterValueUpdate = {...paymentDetails[e.target.id], value: e.target.value};
            const fieldAfterValidation = {...fieldAfterValueUpdate, isValidated: validateField(fieldAfterValueUpdate.value, field.validations)}
            setPaymentDetails({...paymentDetails, [e.target.id]: fieldAfterValidation});
        }
    }

    function handleCheckout() {
        const paymentMethodOption = selectedPaymentMethod;
        const formattedPaymentDetails = {
            fields: []
        };
        let current_index = 0;
        for(let key in paymentDetails){
            formattedPaymentDetails.fields[current_index] = {
                name: key,
                value: paymentDetails[key].value
            }
            current_index++;
        }
        
        // create new instance of inai checkout
        const inaiInstance = window.inai.create({
            token: process.env.REACT_APP_CLIENT_USERNAME,
            orderId: orderId,
            countryCode: 'IND',
            redirectUrl: '',
            locale: ''
        });

        // invoke payment
        inaiInstance.makePayment(paymentMethodOption, formattedPaymentDetails)
        .then(data => {
            alert(`message: ${data.message}`, `transaction_id: ${data.transaction_id}`);
            navigate('/headless-checkout-options');
        })
        .catch(err => {
            console.log(err);
            alert(`message: ${err.message}`);
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
                                {(selectedPaymentMethod === option.rail_code) && option.form_fields.length ? (
                                    <div className="flex flex-column gap-10 my-15">
                                        {option.form_fields.map((field, index) => (
                                            <div key={`field-${index}`} className="field flex flex-column gap-5">
                                                <label htmlFor={field.name}>
                                                    <span className="font-weight-bold">{field.label}</span>
                                                    {field.required ? (<span className="required-field-char">*</span>) : ''}
                                                </label>
                                                <input type={(field.field_type === 'textfield') ? 'text' : field.field_type} id={field.name} placeholder={field.placeholder} className="input-entry" onChange={(e) => handleChange(e, field)} />
                                            </div>
                                        ))}
                                        {(option.rail_code === 'card') && (
                                            <div className="field flex align-items-center gap-5">
                                                <input type="checkbox" id='save_card' onChange={handleChange} />
                                                <label htmlFor="save_card">Save card</label>
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        ))
                    }
                    <div className="btn btn-1 border-radius-1 my-3" onClick={handleCheckout}>CHECKOUT</div>
                </div>
            ) : null}
        </div>
    );
}
