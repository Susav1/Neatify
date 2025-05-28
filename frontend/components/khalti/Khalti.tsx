'use client';

import type React from 'react';
import { useState } from 'react';
import axios from 'axios';

interface KhaltiProps {
  payment: number;
  serviceId?: string;
  bookingData?: {
    serviceId: string;
    date: string;
    time: string;
    location: string;
  };
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

const Khalti: React.FC<KhaltiProps> = ({
  payment,
  serviceId,
  bookingData,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const initiatePayment = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/payment/initiate',
        {
          amount: payment,
          return_url: `${window.location.origin}/lists`,
          purchase_order_id: `order_${Date.now()}`,
          purchase_order_name: 'Cleaning Service',
          service_id: serviceId,
          booking_data: bookingData,
        },
        {
          headers: {
            Authorization: 'Key 68cd2f53bf2045e5b2707dd70d2e8ac7',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
        onPaymentSuccess?.();
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      const errorMessage =
        error.response?.data?.message || 'Payment initiation failed. Please try again.';
      onPaymentError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
      <button
        style={{
          backgroundColor: '#5C2D91',
          padding: '15px 40px',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '8px',
          opacity: isLoading ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
          fontSize: '16px',
          minWidth: '200px',
        }}
        onClick={initiatePayment}
        disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Pay with Khalti'}
      </button>
    </div>
  );
};

export default Khalti;
