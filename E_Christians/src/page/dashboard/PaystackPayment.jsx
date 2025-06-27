import { useState } from 'react';
import { PaystackButton } from 'react-paystack';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PaystackPayment = ({ leader, amount, onSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    metadata: {
      leaderId: leader._id,
      userId: localStorage.getItem('userId'),
    },
  };

  const handleSuccess = async (reference) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/profile/payment/verify`,
        { reference: reference.reference, leaderId: leader._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Payment successful! Redirecting to chat...');
      onSuccess();
      navigate(`/chat/${leader._id}`);
    } catch (err) {
      toast.error('Payment verification failed');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Pay to Chat with {leader.title}</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-md"
          >
            Cancel
          </button>
          <PaystackButton
            {...config}
            text="Pay ₦5000"
            className="bg-green-500 text-white py-2 px-4 rounded-md"
            onSuccess={handleSuccess}
            onClose={() => toast.error('Payment cancelled')}
          />
        </div>
      </div>
    </div>
  );
};

export default PaystackPayment;