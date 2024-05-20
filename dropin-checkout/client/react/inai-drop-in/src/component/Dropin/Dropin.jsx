import React from 'react';
import { useNavigate } from 'react-router-dom';

const DropIn = () => {
  const navigate = useNavigate();

  const redirectToProductsPage = () => {
    navigate('/product');
  }
  return (
    <div
      className='dropin'
      onClick={redirectToProductsPage}
      >
        Dropin Checkout
    </div>
  );
};

export default DropIn;
