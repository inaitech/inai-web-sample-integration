import React from 'react';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const navigate = useNavigate();

  const handlePayment = () => {
    navigate('/checkout');
  }
  return (
    <div id="container">
      <div className="imgcontainer">
        <div>
          <img className="inai"
            src="https://www.eu-startups.com/wp-content/uploads/2021/07/60e43aeeffbbc939cdfd9603_inai_logo_horizontal_black-p-500.png"
            alt="inai-logo" 
          />
        </div>
        <div>
          <img className="tshirt"
            src="https://cdn.shopify.com/s/files/1/0901/0334/products/05440_main_510x.progressive.jpg?v=1637074700"
            alt="man-united jersey"
          />
        </div>
      </div>
      <h3>Manchester United Shirt Home Kit 2021/22</h3>
      <h4>A SUPPORTER JERSEY MADE WITH RECYCLED MATERIALS</h4>
      <p>Turned up or pressed down, the humble polo collar has played a starring role in many of Manchester United's
        biggest moments. Making a comeback on this adidas football jersey, it joins a shield-style badge and engineered
        pinstripe graphic to produce an eye-catching look. Moisture-absorbing AEROREADY and mesh panels make it a
        comfortable choice for passionate supporters.</p>
      <p>Made with 100% recycled materials, this product represents just one of our solutions to help end plastic waste.
      </p>
      <button
        id="btn"
        onClick={handlePayment}
      >
        BUY NOW
      </button>
    </div>
  )
};

export default Product;
