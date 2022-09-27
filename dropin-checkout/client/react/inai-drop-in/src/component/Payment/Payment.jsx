import React, { useEffect } from "react";
import { country, failureRedirect, successRedirect } from "../../helpers/constants";
import { createOrder } from "../../helpers/utils";

const Payment = () => {
  useEffect(() => {
    createOrder()
      .then(res => {
        const { id: orderId } = res;
        const config = {
          containerId: "inai-widget",
          token: process.env.REACT_APP_INAI_PAYMENT_TOKEN,
          orderId,
          ctaText: "Pay Now",
          countryCode: country
        }
        console.log('config = ', config);
        window.inai.initialize(config)
          .then(res => {
            window.location.replace(successRedirect);
          })
          .catch(err => {
            window.location.replace(failureRedirect);
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

export default Payment;
