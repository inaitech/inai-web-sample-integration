import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction-id');
  return (
    <>
      <div className='icon-container'>
        <div className='icon-cover success-icon-cover'>
          <i className="fas fa-check fa-4x"></i>
        </div>
      </div>
      <div className='payent-success-text'>
        Payment Successful
      </div>
      <div className='transaction-details'>
        {transactionId && <div>Transaction Id: {transactionId}</div>}
      </div>
      <div className='order-greeting'>
        Thank you for your order.
      </div>
    </>
  );
};

export default SuccessPage;
