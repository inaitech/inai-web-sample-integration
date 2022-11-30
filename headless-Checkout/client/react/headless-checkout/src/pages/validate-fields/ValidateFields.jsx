import { Routes, Route } from 'react-router-dom';
import PaymentMethodOptions from './PaymentMethodOptions';

export default function ValidateFields() {
    return (
        <Routes>
            <Route path='/payment-methods' element={<PaymentMethodOptions />} />
        </Routes>
    );
}
