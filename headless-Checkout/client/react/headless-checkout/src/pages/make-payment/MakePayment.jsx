import { Routes, Route } from 'react-router-dom';
// importing pages
import Product from './Product';
import Checkout from './Checkout';
export default function MakePayment() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Product />} />
                <Route path='/checkout' element={<Checkout />} />
            </Routes>
        </div>
    );
}
