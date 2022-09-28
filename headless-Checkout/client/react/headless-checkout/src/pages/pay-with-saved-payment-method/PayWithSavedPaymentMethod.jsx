import { Routes, Route } from 'react-router-dom';

// pages
import Checkout from './Checkout';

export default function PayWithSavedPaymentMethod() {
    return (
        <div>
            <Routes>
                <Route path='/checkout' element={<Checkout />} />
            </Routes>
        </div>
    );
}
