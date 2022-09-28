import React from 'react';
import { useSearchParams } from 'react-router-dom';

const FailurePage = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction-id');
  return (
    <>
      <div className='icon-container'>
        <div className='icon-cover failure-icon-cover'>
          <i className="fas fa-times fa-4x"></i>
        </div>
      </div>
      <div className='payment-failure-text'>
        Payment Failed
      </div>
      <div className='transaction-details'>
        {transactionId && <div>Transaction Id: {transactionId}</div>}
      </div>
      <div className='order-greeting'>
        We are unable to process your payment. Please try again or choose another way to pay.
      </div>
    </>
  );
};

export default FailurePage;
