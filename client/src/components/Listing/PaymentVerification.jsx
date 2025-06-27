import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PaymentVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const reference = query.get('reference');
  const trxref = query.get('trxref'); // Paystack may use trxref instead of reference

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference && !trxref) {
        toast.error('No payment reference found.');
        navigate('/leader-dashboard');
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/profile/verify-payment`,
          { reference: reference || trxref, status: 'success' }, // Adjust based on Paystack response
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        if (response.data.status) {
          toast.success('Payment verified successfully!');
          navigate('/leaderdashboard');
        } else {
          toast.error('Payment verification failed.');
          navigate('/leaderdashboard');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast.error('An error occurred during payment verification.');
        navigate('/leader-dashboard');
      }
    };

    verifyPayment();
  }, [reference, trxref, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Verifying Payment...</h2>
        <p className="text-gray-600 mt-2">Please wait while we process your payment.</p>
      </div>
    </div>
  );
};

export default PaymentVerification;