import { Routes, Route } from 'react-router-dom';

// pages
import PaymentMethodOptions from './PaymentMethodOptions';

export default function PayWithSavedPaymentMethod() {
    return (
        <div>
            <Routes>
                <Route path='/payment-method-options' element={<PaymentMethodOptions />} />
            </Routes>
        </div>
    );
}
