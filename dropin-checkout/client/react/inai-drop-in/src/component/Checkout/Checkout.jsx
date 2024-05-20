import React, { useEffect } from "react";
import { country, token } from "../../helpers/constants";
import { createOrder } from "../../helpers/utils";

const Checkout = () => {
  useEffect(() => {
    createOrder()
      .then(res => {
        const { id: orderId } = res;
        const config = {
          containerId: "inai-widget",
          token: token,
          orderId,
          ctaText: "Pay Now",
          countryCode: country
        }
        window.inai.initialize(config)
          .then(res => {
            // payment success handler
            console.log(`Transaction ID = ${res.transaction_id}`);
          })
          .catch(err => {
            // payment failure handler
            console.log('Inai Payment failed = ', err);
          })
      })
  }, []);

  return (
    <div className="inai-widget-container">
      <div id="inai-widget"></div>
    </div>
  );
};

export default Checkout;
