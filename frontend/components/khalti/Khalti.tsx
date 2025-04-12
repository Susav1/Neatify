import React, { useState } from 'react';
import axios from 'axios';

interface KhaltiProps {
  payment: number;
}

const Khalti: React.FC<KhaltiProps> = ({ payment }) => {
  const [isLoading, setIsLoading] = useState(false);

  const initiatePayment = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/payment/initiate',
        {
          amount: payment,
          return_url: `${window.location.origin}/lists`,
        },
        {
          headers: {
            Authorization: '3006711466c34d3c93b168bbbfe05eb7',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initiation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button
        style={{
          backgroundColor: '#27AE60',
          padding: '15px 40px',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '5px',
          opacity: isLoading ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
        }}
        onClick={initiatePayment}
        disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Book Now'}
      </button>
    </div>
  );
};

export default Khalti;
