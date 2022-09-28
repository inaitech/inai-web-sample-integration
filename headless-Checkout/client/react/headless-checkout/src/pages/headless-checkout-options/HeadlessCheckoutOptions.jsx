import { Link } from "react-router-dom";

export default function HeadlessCheckoutOptions() {
    return (
        <div className="container flex flex-column gap-20">
            <Link to='/make-payment' className="btn btn-1">MAKE PAYMENT</Link>
            <Link to='/save-payment-method' className="btn btn-1">SAVE A PAYMENT METHOD</Link>
            <Link to='/pay-with-saved-payment-method/checkout' className="btn btn-1">PAY WITH SAVED PAYMENT METHOD</Link>
            <Link to='/validate-fields' className="btn btn-1">VALIDATE FIELDS</Link>
            <Link to='/get-card-info' className="btn btn-1">GET CARD INFO</Link>
        </div>
    );
}
