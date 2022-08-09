import { Routes, Route } from 'react-router-dom';
// importing pages
import Product from './Product';
import PaymentMethodOptions from './PaymentMethodOptions';
export default function MakePayment() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Product />} />
                <Route path='/payment-method-options' element={<PaymentMethodOptions />} />
            </Routes>
        </div>
    );
}
