import {Routes, Route} from 'react-router-dom';

// pages
import HeadlessCheckout from '../pages/headless-checkout/HeadlessCheckout';
import HeadlessCheckoutOptions from '../pages/headless-checkout-options/HeadlessCheckoutOptions';
import MakePayment from '../pages/make-payment/MakePayment';
import SavePaymentMethod from '../pages/save-payment-method/SavePaymentMethod';
import PayWithSavedPaymentMethod from '../pages/pay-with-saved-payment-method/PayWithSavedPaymentMethod';
import ValidateFields from '../pages/validate-fields/ValidateFields';
import GetCardInfo from '../pages/get-card-info/GetCardInfo';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<HeadlessCheckout />} />
            <Route path='/headless-checkout-options' element={<HeadlessCheckoutOptions />} />
            <Route path='/make-payment/*' element={<MakePayment />} />
            <Route path='/save-payment-method/*' element={<SavePaymentMethod />} />
            <Route path='/pay-with-saved-payment-method/*' element={<PayWithSavedPaymentMethod />} />
            <Route path='/validate-fields/*' element={<ValidateFields />} />
            <Route path='/get-card-info' element={<GetCardInfo />} />
        </Routes>
    );
}
