import { Link } from "react-router-dom";

export default function HeadlessCheckout() {
    return (
        <div className="container">
            <Link to='/headless-checkout-options' className="btn-1">HEADLESS CHECKOUT</Link>
        </div>
    );
}