import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GetCardInfo() {
    const create_order_url = 'http://localhost:5009/v1/orders';

    const [loading, setLoading] = useState(false);
    const [cardNumber, setCardNumber] = useState('');

    const navigate = useNavigate();

    async function getCardInfo() {
        try{
            setLoading(true);
            // create order // to create inai instance
            const order_response = await fetch(create_order_url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json', 
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    customer: {
                        email: 'test@gmail.com'
                    }
                })
            });
            const order_response_data = await order_response.json();
            setLoading(false);
            if (order_response.status !== 201) {
                // order creation unsuccessful!
                alert('order creation for creating new instance of inai checkout is unsuccessful!')
                return;
            }
            // create new instance of inai checkout
            const inaiInstance = window.inai.create({
                token: process.env.REACT_APP_CLIENT_USERNAME,
                orderId: order_response_data.id,
                countryCode: 'IND',
                redirectUrl: '',
                locale: ''
            });

            inaiInstance.getCardInfo(cardNumber)
            .then(response => {
                alert(JSON.stringify(response));
                navigate('/headless-checkout-options');
            })
            .catch(error => {
                alert(JSON.stringify(error));
            })

        } catch(err) {
            setLoading(false);
            alert(JSON.stringify(err));
        }
    }

    return (
        <div className="container">
            {!loading && (
            <div>
                <input type="text" placeholder="" className="input-entry" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                <div className="btn btn-1 btn-bg-color-1 border-radius-1 my-3" onClick={getCardInfo}>GET CARD INFO</div>
            </div>
            )}
            {loading && (
                <div className="container w-20 text-align-center">loading...</div>
            )}
        </div>
    );
}
