import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaystackPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');
  const role = searchParams.get('role'); // Optional, for frontend validation

  useEffect(() => {
    const initializePayment = async () => {
      if (!email) {
        navigate('/signup');
        return;
      }

      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/paystack/pay`, {
          email,
        });
        if (response.data.authorization_url) {
          window.location.href = response.data.authorization_url; // Redirect to Paystack
        }
      } catch (error) {
        console.error('Payment initialization error:', error);
        navigate('/signup');
      }
    };

    initializePayment();
  }, [email, navigate]);

  return <div>Redirecting to Paystack...</div>; // Placeholder while redirecting
};

export default PaystackPayment;