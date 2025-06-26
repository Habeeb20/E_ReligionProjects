import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function PaymentSuccess() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const reference = query.get("reference");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!reference) {
      setPaymentStatus("error: No reference provided");
      return;
    }

    const verifyPayment = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/payment/paystack/verify?reference=${encodeURIComponent(reference)}`
        );
        if (data?.data?.status) {
          setPaymentStatus(data.data.status);
          if (data.data.status === "success" && data.data.redirectUrl) {
            
            window.location.href = data.data.redirectUrl; // Remove setTimeout for immediate redirect
          }
        } else {
          setPaymentStatus("error: Invalid response from server");
        }
      } catch (error) {
        console.error("Payment verification failed", error);
        if (error.response) {
          setPaymentStatus(`error: ${error.response.data.message || "Verification failed"}`);
        } else if (error.request) {
          setPaymentStatus("error: Network error, please try again later");
        } else {
          setPaymentStatus("error: An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div role="region" aria-labelledby="payment-status-heading">
      <h2 id="payment-status-heading">Payment Status</h2>
      {isLoading ? (
        <p aria-live="polite">Verifying payment...</p>
      ) : paymentStatus.startsWith("error") ? (
        <p style={{ color: "red" }} aria-live="assertive">
          {paymentStatus.replace("error: ", "")}
        </p>
      ) : paymentStatus === "success" ? (
        <p style={{ color: "green" }} aria-live="polite">
          Payment verified successfully! Redirecting...
        </p>
      ) : paymentStatus === "failed" ? (
        <p style={{ color: "red" }} aria-live="assertive">
          Payment verification failed.
        </p>
      ) : (
        <p aria-live="polite">{paymentStatus || "No status available"}</p>
      )}
    </div>
  );
}

export default PaymentSuccess;